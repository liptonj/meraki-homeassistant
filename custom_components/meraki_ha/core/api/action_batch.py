"""Group configuration writes into Meraki action batches.

Writes that arrive close together (an automation turning off a dozen switch
ports, a scene changing several SSIDs) are sent as one synchronous action
batch per 20 actions instead of one request each. A write that arrives alone
is sent as a normal request, so single changes keep their usual behaviour.
"""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

from ...helpers.logging_helper import MerakiLoggers
from ..errors import MerakiConnectionError

if TYPE_CHECKING:
    from .client import MerakiAPIClient

_LOGGER = MerakiLoggers.API

# Meraki runs synchronous batches of at most 20 actions.
MAX_SYNC_ACTIONS = 20
DEFAULT_WINDOW = 0.5


@dataclass
class _QueuedAction:
    resource: str
    operation: str
    body: dict[str, Any]
    direct: Callable[[], Awaitable[Any]]
    future: asyncio.Future[Any] = field(repr=False)


class ActionBatchError(MerakiConnectionError):
    """An action batch was rejected or failed."""


class ActionBatchQueue:
    """Collects writes for a short window and sends them together."""

    def __init__(
        self,
        api_client: MerakiAPIClient,
        window: float = DEFAULT_WINDOW,
    ) -> None:
        """Initialize the queue."""
        self._api_client = api_client
        self._window = window
        self._pending: list[_QueuedAction] = []
        self._flush_task: asyncio.Task[None] | None = None

    async def submit(
        self,
        resource: str,
        operation: str,
        body: dict[str, Any],
        direct: Callable[[], Awaitable[Any]],
    ) -> Any:
        """
        Queue a write and wait for it to be applied.

        Args:
        ----
            resource: The action's resource path,
                e.g. "/devices/{serial}/switch/ports/1".
            operation: The action's operation, e.g. "update".
            body: The action's body.
            direct: Makes the equivalent single request, used when the write
                is alone in its window.

        Returns
        -------
            The direct request's result, or an empty dict when the write went
            out in a batch (batches do not return the updated resource).

        """
        loop = asyncio.get_running_loop()
        future: asyncio.Future[Any] = loop.create_future()
        self._pending.append(_QueuedAction(resource, operation, body, direct, future))
        if self._flush_task is None or self._flush_task.done():
            self._flush_task = loop.create_task(self._flush_after_window())
        return await future

    async def _flush_after_window(self) -> None:
        await asyncio.sleep(self._window)
        actions, self._pending = self._pending, []
        if len(actions) == 1:
            await self._run_direct(actions[0])
            return
        for start in range(0, len(actions), MAX_SYNC_ACTIONS):
            await self._run_batch(actions[start : start + MAX_SYNC_ACTIONS])

    @staticmethod
    async def _run_direct(action: _QueuedAction) -> None:
        try:
            result = await action.direct()
        except Exception as err:  # noqa: BLE001 - handed to the caller
            action.future.set_exception(err)
        else:
            action.future.set_result(result)

    async def _run_batch(self, chunk: list[_QueuedAction]) -> None:
        dashboard = self._api_client.dashboard
        if dashboard is None:
            for action in chunk:
                action.future.set_exception(
                    MerakiConnectionError("Meraki API client is not set up")
                )
            return
        payload = [
            {"resource": a.resource, "operation": a.operation, "body": a.body}
            for a in chunk
        ]
        try:
            response = await dashboard.organizations.createOrganizationActionBatch(
                self._api_client.organization_id,
                payload,
                confirmed=True,
                synchronous=True,
            )
        except Exception as err:  # noqa: BLE001 - handed to every caller
            for action in chunk:
                action.future.set_exception(err)
            return

        status = (response or {}).get("status") or {}
        if status.get("failed"):
            errors = "; ".join(str(e) for e in status.get("errors") or []) or "failed"
            error = ActionBatchError(f"Action batch failed: {errors}")
            for action in chunk:
                action.future.set_exception(error)
            return

        _LOGGER.debug("Applied %d writes in one action batch", len(chunk))
        for action in chunk:
            action.future.set_result({})


async def submit_write(
    api_client: Any,
    resource: str,
    operation: str,
    body: dict[str, Any],
    direct: Callable[[], Awaitable[Any]],
) -> Any:
    """Send a write through the client's batch queue, or directly without one."""
    queue = getattr(api_client, "action_batches", None)
    if isinstance(queue, ActionBatchQueue):
        return await queue.submit(resource, operation, body, direct)
    return await direct()
