"""Tests for the action batch queue."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.meraki_ha.core.api.action_batch import (
    MAX_SYNC_ACTIONS,
    ActionBatchError,
    ActionBatchQueue,
    submit_write,
)


def _client(batch_response=None):
    client = MagicMock()
    client.organization_id = "org1"
    client.dashboard.organizations.createOrganizationActionBatch = AsyncMock(
        return_value=batch_response
        or {"status": {"completed": True, "failed": False, "errors": []}}
    )
    return client


def _port(queue, port, direct=None):
    return queue.submit(
        f"/devices/Q1/switch/ports/{port}",
        "update",
        {"enabled": False},
        direct or AsyncMock(return_value={"portId": str(port)}),
    )


async def test_single_write_goes_direct():
    """A write alone in its window uses the normal request."""
    client = _client()
    queue = ActionBatchQueue(client, window=0)
    direct = AsyncMock(return_value={"portId": "1"})

    result = await _port(queue, 1, direct)

    assert result == {"portId": "1"}
    direct.assert_awaited_once()
    client.dashboard.organizations.createOrganizationActionBatch.assert_not_awaited()


async def test_burst_goes_out_as_one_batch():
    """Writes in the same window become one synchronous batch."""
    client = _client()
    queue = ActionBatchQueue(client, window=0)

    results = await asyncio.gather(*(_port(queue, p) for p in range(1, 6)))

    assert results == [{}] * 5
    create = client.dashboard.organizations.createOrganizationActionBatch
    create.assert_awaited_once()
    args, kwargs = create.call_args
    assert args[0] == "org1"
    assert [a["resource"] for a in args[1]] == [
        f"/devices/Q1/switch/ports/{p}" for p in range(1, 6)
    ]
    assert kwargs == {"confirmed": True, "synchronous": True}


async def test_large_burst_is_split_into_sync_sized_batches():
    """Synchronous batches carry at most 20 actions."""
    client = _client()
    queue = ActionBatchQueue(client, window=0)

    await asyncio.gather(*(_port(queue, p) for p in range(MAX_SYNC_ACTIONS + 5)))

    create = client.dashboard.organizations.createOrganizationActionBatch
    assert create.await_count == 2
    assert len(create.call_args_list[0].args[1]) == MAX_SYNC_ACTIONS
    assert len(create.call_args_list[1].args[1]) == 5


async def test_failed_batch_raises_for_every_caller():
    """A failed batch reports its errors to each waiting write."""
    client = _client({"status": {"failed": True, "errors": ["port 99 invalid"]}})
    queue = ActionBatchQueue(client, window=0)

    results = await asyncio.gather(
        _port(queue, 1), _port(queue, 99), return_exceptions=True
    )

    assert all(isinstance(r, ActionBatchError) for r in results)
    assert "port 99 invalid" in str(results[0])


async def test_submit_write_without_queue_calls_direct():
    """Clients without a queue (e.g. test doubles) fall back to direct calls."""
    direct = AsyncMock(return_value={"ok": True})

    assert await submit_write(MagicMock(), "/x", "update", {}, direct) == {"ok": True}


async def test_direct_error_reaches_caller():
    """An error from the single request is raised to the caller."""
    queue = ActionBatchQueue(_client(), window=0)

    with pytest.raises(RuntimeError):
        await _port(queue, 1, AsyncMock(side_effect=RuntimeError("boom")))
