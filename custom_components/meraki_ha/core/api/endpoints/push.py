"""Meraki Push API endpoints.

Wraps organization-level Push API and webhook HTTP server operations used to
subscribe Home Assistant as a receiver for event-driven topics.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from custom_components.meraki_ha.core.utils.api_utils import (
    handle_meraki_errors,
    validate_response,
)

from ....helpers.logging_helper import MerakiLoggers
from ..cache import async_timed_cache

if TYPE_CHECKING:
    from ..client import MerakiAPIClient


_LOGGER = MerakiLoggers.API


def _unwrap_items(response: Any) -> list[dict[str, Any]]:
    """Normalize list or ``{items: [...]}`` API responses into a list."""
    if isinstance(response, list):
        return [item for item in response if isinstance(item, dict)]
    if isinstance(response, dict):
        items = response.get("items")
        if isinstance(items, list):
            return [item for item in items if isinstance(item, dict)]
    return []


class PushApiEndpoints:
    """Organization Push API and org-level webhook HTTP server endpoints."""

    def __init__(self, api_client: MerakiAPIClient) -> None:
        """Initialize the endpoint.

        Parameters
        ----------
        api_client : MerakiAPIClient
            The Meraki API client.

        """
        self._api_client = api_client

    def _organizations_api(self) -> Any | None:
        """Return the SDK organizations API object, or None if unavailable."""
        if self._api_client.dashboard is None:
            return None
        return self._api_client.dashboard.organizations

    async def _call(
        self,
        sdk_method: str,
        **kwargs: Any,
    ) -> Any:
        """Call an organizations SDK method if present.

        Parameters
        ----------
        sdk_method : str
            Camel-case Meraki SDK method name.
        **kwargs : Any
            Keyword arguments passed to the SDK method (excluding organizationId).

        Returns
        -------
        Any
            The SDK response, or None if the dashboard/session is missing.

        """
        api = self._organizations_api()
        if api is None:
            return None
        method = getattr(api, sdk_method, None)
        if not callable(method):
            _LOGGER.error(
                "Meraki SDK is missing %s. Upgrade the meraki package to use Push API.",
                sdk_method,
            )
            return None
        return await method(
            organizationId=self._api_client.organization_id,
            **kwargs,
        )

    @handle_meraki_errors
    @async_timed_cache(timeout=60)
    async def get_push_topics(self) -> list[dict[str, Any]]:
        """List Push API topics available to this organization.

        Returns
        -------
        list[dict[str, Any]]
            Topic objects with ``topicId`` (and optional description).

        """
        response = await self._call("getOrganizationApiPushTopics")
        validated = validate_response(response)
        topics = _unwrap_items(validated)
        if not topics and isinstance(validated, dict):
            _LOGGER.debug("get_push_topics returned no items: %s", validated)
        return topics

    @handle_meraki_errors
    async def get_http_servers(self) -> list[dict[str, Any]]:
        """List organization webhook HTTP servers.

        Returns
        -------
        list[dict[str, Any]]
            HTTP server objects.

        """
        response = await self._call("getOrganizationWebhooksHttpServers")
        return _unwrap_items(validate_response(response))

    @handle_meraki_errors
    async def create_http_server(
        self,
        name: str,
        url: str,
        shared_secret: str,
        payload_template_id: str,
    ) -> dict[str, Any]:
        """Create an organization webhook HTTP server for Push API.

        Parameters
        ----------
        name : str
            Display name for the HTTP server.
        url : str
            Public HTTPS webhook URL.
        shared_secret : str
            Shared secret included in POSTs.
        payload_template_id : str
            Payload template ID (``wpt_00008`` for Push API).

        Returns
        -------
        dict[str, Any]
            Created HTTP server object.

        """
        response = await self._call(
            "createOrganizationWebhooksHttpServer",
            name=name,
            url=url,
            sharedSecret=shared_secret,
            payloadTemplate={"id": payload_template_id},
        )
        validated = validate_response(response)
        return validated if isinstance(validated, dict) else {}

    @handle_meraki_errors
    async def delete_http_server(self, http_server_id: str) -> None:
        """Delete an organization webhook HTTP server.

        Parameters
        ----------
        http_server_id : str
            HTTP server ID to delete.

        """
        await self._call(
            "deleteOrganizationWebhooksHttpServer",
            httpServerId=http_server_id,
        )

    @handle_meraki_errors
    async def get_receiver_profiles(self) -> list[dict[str, Any]]:
        """List Push API receiver profiles.

        Returns
        -------
        list[dict[str, Any]]
            Receiver profile objects.

        """
        response = await self._call("getOrganizationApiPushReceiversProfiles")
        return _unwrap_items(validate_response(response))

    @handle_meraki_errors
    async def create_receiver_profile(
        self,
        iname: str,
        name: str,
        http_server_id: str,
        description: str = "",
    ) -> dict[str, Any]:
        """Create a Push API receiver profile wrapping an HTTP server.

        Parameters
        ----------
        iname : str
            Immutable name for the receiver profile.
        name : str
            Display name.
        http_server_id : str
            Organization HTTP server ID.
        description : str
            Optional description.

        Returns
        -------
        dict[str, Any]
            Created receiver profile.

        """
        response = await self._call(
            "createOrganizationApiPushReceiversProfile",
            iname=iname,
            name=name,
            description=description,
            receiver={"id": http_server_id},
        )
        validated = validate_response(response)
        return validated if isinstance(validated, dict) else {}

    @handle_meraki_errors
    async def delete_receiver_profile(self, receiver_iname: str) -> None:
        """Delete a Push API receiver profile.

        Parameters
        ----------
        receiver_iname : str
            Immutable name of the receiver profile.

        """
        await self._call(
            "deleteOrganizationApiPushReceiversProfile",
            receiverProfileIname=receiver_iname,
        )

    @handle_meraki_errors
    async def get_push_profiles(self) -> list[dict[str, Any]]:
        """List Push API profiles (topic subscriptions).

        Returns
        -------
        list[dict[str, Any]]
            Push profile objects.

        """
        response = await self._call("getOrganizationApiPushProfiles")
        return _unwrap_items(validate_response(response))

    @handle_meraki_errors
    async def create_push_profile(
        self,
        iname: str,
        name: str,
        topic_id: str,
        receiver_iname: str,
        description: str = "",
    ) -> dict[str, Any]:
        """Create a Push API profile that subscribes a topic to a receiver.

        This is the "create topic" step: Meraki topics already exist; a push
        profile is the subscription that starts delivery.

        Parameters
        ----------
        iname : str
            Immutable name for the push profile.
        name : str
            Display name.
        topic_id : str
            Topic ID from ``get_push_topics``.
        receiver_iname : str
            Immutable name of the receiver profile.
        description : str
            Optional description.

        Returns
        -------
        dict[str, Any]
            Created push profile.

        """
        response = await self._call(
            "createOrganizationApiPushProfile",
            iname=iname,
            name=name,
            description=description,
            topic={"id": topic_id},
            receiver={"iname": receiver_iname},
        )
        validated = validate_response(response)
        return validated if isinstance(validated, dict) else {}

    @handle_meraki_errors
    async def delete_push_profile(self, push_profile_iname: str) -> None:
        """Delete a Push API profile (unsubscribe from a topic).

        Parameters
        ----------
        push_profile_iname : str
            Immutable name of the push profile.

        """
        await self._call(
            "deleteOrganizationApiPushProfile",
            pushProfileIname=push_profile_iname,
        )
