"""Manages Meraki Push API receiver and topic profile registration."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from meraki.exceptions import AsyncAPIError

from ..const import (
    CONF_PUSH_API_AUTO_REGISTER,
    CONF_PUSH_API_TOPICS,
    CONF_WEBHOOK_EXTERNAL_URL,
    CONF_WEBHOOK_SHARED_SECRET,
    DEFAULT_PUSH_API_AUTO_REGISTER,
    DEFAULT_PUSH_API_TOPICS,
    PUSH_API_PAYLOAD_TEMPLATE_ID,
    PUSH_API_TOPIC_LABELS,
)
from ..core.errors import MerakiConnectionError
from ..helpers.logging_helper import MerakiLoggers
from ..webhook import get_webhook_url

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

    from ..core.api import MerakiAPIClient


_LOGGER = MerakiLoggers.ALERTS


def push_iname(entry_id: str, suffix: str) -> str:
    """Build a durable Push API iname from a config entry id.

    Parameters
    ----------
    entry_id : str
        Home Assistant config entry ID.
    suffix : str
        Short role suffix (e.g. ``receiver``, ``avail``).

    Returns
    -------
    str
        Immutable name using only lowercase alphanumeric characters and
        underscores.

    """
    safe = "".join(ch for ch in entry_id if ch.isalnum()).lower()[:16]
    return f"ha_{safe}_{suffix}"


def topic_profile_iname(entry_id: str, topic_id: str) -> str:
    """Build a durable iname for a topic subscription profile.

    Parameters
    ----------
    entry_id : str
        Home Assistant config entry ID.
    topic_id : str
        Meraki Push API topic ID.

    Returns
    -------
    str
        Immutable push-profile name.

    """
    topic_suffix = "".join(ch for ch in topic_id if ch.isalnum()).lower()[:32]
    return push_iname(entry_id, topic_suffix)


def _extract_topic_id(topic: dict[str, Any]) -> str | None:
    """Return a topic ID from a list-topics item."""
    topic_id = topic.get("topicId") or topic.get("id")
    if isinstance(topic_id, str) and topic_id:
        return topic_id
    nested = topic.get("topic")
    if isinstance(nested, dict):
        nested_id = nested.get("id") or nested.get("topicId")
        if isinstance(nested_id, str) and nested_id:
            return nested_id
    return None


class PushApiManager:
    """Creates the Push API HTTP server, receiver, and topic subscriptions."""

    def __init__(
        self,
        hass: HomeAssistant,
        api_client: MerakiAPIClient,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the Push API manager.

        Parameters
        ----------
        hass : HomeAssistant
            Home Assistant instance.
        api_client : MerakiAPIClient
            Meraki API client.
        config_entry : ConfigEntry
            Integration config entry.

        """
        self.hass = hass
        self.api = api_client
        self.entry = config_entry
        self._http_server_id: str | None = None
        self._receiver_iname: str | None = None
        self._push_profile_inames: list[str] = []
        self._available_topics: list[str] = []
        self._subscribed_topics: list[str] = []
        self._skipped_topics: list[str] = []
        self._registration_errors: list[str] = []
        self._last_message_received: datetime | None = None
        self._message_count: int = 0

    @property
    def is_auto_register_enabled(self) -> bool:
        """Return True if Dashboard auto-registration is enabled."""
        return self.entry.options.get(
            CONF_PUSH_API_AUTO_REGISTER, DEFAULT_PUSH_API_AUTO_REGISTER
        )

    @property
    def webhook_id(self) -> str:
        """Return the Home Assistant webhook ID used for Push API."""
        return f"{self.entry.entry_id}_push"

    @property
    def status(self) -> dict[str, Any]:
        """Return registration and health status for UI/diagnostics."""
        if self._registration_errors:
            return {
                "status": "error",
                "message": (
                    f"Push API registration errors: {len(self._registration_errors)}"
                ),
                "errors": list(self._registration_errors),
                "available_topics": list(self._available_topics),
                "subscribed_topics": list(self._subscribed_topics),
                "skipped_topics": list(self._skipped_topics),
            }

        if not self._subscribed_topics:
            return {
                "status": "not_registered",
                "message": "Push API topics are not subscribed",
                "available_topics": list(self._available_topics),
                "subscribed_topics": [],
                "skipped_topics": list(self._skipped_topics),
            }

        age_seconds = None
        if self._last_message_received:
            age_seconds = (datetime.now() - self._last_message_received).total_seconds()

        if age_seconds is not None and age_seconds < 900:
            message = (
                f"Push API active ({self._message_count} messages, "
                f"{len(self._subscribed_topics)} topics)"
            )
            health = "active"
        else:
            message = (
                f"Push API registered ({len(self._subscribed_topics)} topics). "
                "Waiting for heartbeat (every 5 minutes)."
            )
            health = "registered"

        return {
            "status": health,
            "message": message,
            "http_server_id": self._http_server_id,
            "receiver_iname": self._receiver_iname,
            "available_topics": list(self._available_topics),
            "subscribed_topics": list(self._subscribed_topics),
            "skipped_topics": list(self._skipped_topics),
            "messages_received": self._message_count,
            "last_received": (
                self._last_message_received.isoformat()
                if self._last_message_received
                else None
            ),
        }

    def mark_message_received(self) -> None:
        """Record that a Push API message or heartbeat was received."""
        self._last_message_received = datetime.now()
        self._message_count += 1

    def _requested_topics(self) -> list[str]:
        """Return topic IDs the user wants created."""
        topics = self.entry.options.get(CONF_PUSH_API_TOPICS, DEFAULT_PUSH_API_TOPICS)
        if isinstance(topics, list) and topics:
            return [str(topic) for topic in topics]
        return list(DEFAULT_PUSH_API_TOPICS)

    def _get_secret(self) -> str:
        """Return the shared secret used for webhook verification."""
        secret = self.entry.options.get(CONF_WEBHOOK_SHARED_SECRET)
        if not secret:
            secret = self.entry.data.get("secret")
        return str(secret) if secret else ""

    def _get_webhook_url(self) -> str:
        """Return the public HTTPS URL Meraki should POST to."""
        custom_url = self.entry.options.get(CONF_WEBHOOK_EXTERNAL_URL)
        return get_webhook_url(self.hass, self.webhook_id, custom_url or None)

    async def async_register(self) -> bool:
        """Create HTTP server, receiver profile, and topic profiles.

        Returns
        -------
        bool
            True if at least one topic profile is in place (or auto-register
            is disabled).

        """
        if not self.is_auto_register_enabled:
            _LOGGER.info("Push API auto-registration is disabled")
            return True

        self._registration_errors = []
        self._subscribed_topics = []
        self._skipped_topics = []

        try:
            webhook_url = self._get_webhook_url()
        except MerakiConnectionError as err:
            self._registration_errors.append(str(err))
            _LOGGER.error("Cannot determine Push API webhook URL: %s", err)
            return False

        secret = self._get_secret()
        if not secret:
            msg = "Push API requires a shared secret"
            self._registration_errors.append(msg)
            _LOGGER.error(msg)
            return False

        try:
            available = await self.api.push.get_push_topics()
            self._available_topics = [
                topic_id
                for topic in available
                if (topic_id := _extract_topic_id(topic))
            ]
            _LOGGER.info(
                "Push API topics available for this org: %s",
                self._available_topics,
            )
        except Exception as err:  # noqa: BLE001
            msg = f"Failed to list Push API topics: {err}"
            self._registration_errors.append(msg)
            _LOGGER.error(msg)
            return False

        if not self._available_topics:
            msg = (
                "No Push API topics are available. The organization may not be "
                "enrolled in the Push API beta."
            )
            self._registration_errors.append(msg)
            _LOGGER.warning(msg)
            return False

        try:
            http_server_id = await self._ensure_http_server(webhook_url, secret)
            if not http_server_id:
                self._registration_errors.append(
                    "Failed to create Push API HTTP server"
                )
                return False
            self._http_server_id = http_server_id

            receiver_iname = await self._ensure_receiver_profile(http_server_id)
            if not receiver_iname:
                self._registration_errors.append(
                    "Failed to create Push API receiver profile"
                )
                return False
            self._receiver_iname = receiver_iname

            await self._ensure_topic_profiles(receiver_iname)
        except AsyncAPIError as err:
            error_str = str(err)
            if "403" in error_str or "Forbidden" in error_str:
                msg = (
                    "Read-only API key: cannot auto-create Push API topics. "
                    "Grant organization admin access or configure manually."
                )
            else:
                msg = f"Push API registration failed: {err}"
            self._registration_errors.append(msg)
            _LOGGER.error(msg)
            return False
        except Exception as err:  # noqa: BLE001
            msg = f"Unexpected Push API registration error: {err}"
            self._registration_errors.append(msg)
            _LOGGER.error(msg)
            return False

        if not self._subscribed_topics:
            msg = (
                "No Push API topic profiles were created. Requested topics may "
                "not be available to this organization."
            )
            self._registration_errors.append(msg)
            _LOGGER.warning(
                "%s requested=%s available=%s skipped=%s",
                msg,
                self._requested_topics(),
                self._available_topics,
                self._skipped_topics,
            )
            return False

        _LOGGER.info(
            "Push API registered: receiver=%s topics=%s",
            self._receiver_iname,
            self._subscribed_topics,
        )
        return True

    async def async_unregister(self) -> None:
        """Remove topic profiles, receiver, and HTTP server created by HA."""
        for iname in list(self._push_profile_inames):
            try:
                await self.api.push.delete_push_profile(iname)
                _LOGGER.info("Deleted Push API profile %s", iname)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Failed to delete Push API profile %s: %s", iname, err)

        if self._receiver_iname:
            try:
                await self.api.push.delete_receiver_profile(self._receiver_iname)
                _LOGGER.info("Deleted Push API receiver %s", self._receiver_iname)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning(
                    "Failed to delete Push API receiver %s: %s",
                    self._receiver_iname,
                    err,
                )

        if self._http_server_id:
            try:
                await self.api.push.delete_http_server(self._http_server_id)
                _LOGGER.info("Deleted Push API HTTP server %s", self._http_server_id)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning(
                    "Failed to delete Push API HTTP server %s: %s",
                    self._http_server_id,
                    err,
                )

        self._http_server_id = None
        self._receiver_iname = None
        self._push_profile_inames = []
        self._subscribed_topics = []

    async def _ensure_http_server(self, webhook_url: str, secret: str) -> str | None:
        """Create or reuse the org HTTP server used as the Push receiver."""
        name = f"Home Assistant Push API - {self.entry.entry_id[:8]}"
        existing_servers = await self.api.push.get_http_servers()
        for server in existing_servers:
            if server.get("name") != name:
                continue
            server_id = server.get("id")
            if server.get("url") == webhook_url and isinstance(server_id, str):
                _LOGGER.debug("Reusing Push API HTTP server %s", server_id)
                return server_id
            if isinstance(server_id, str):
                await self.api.push.delete_http_server(server_id)
                _LOGGER.info("Replaced outdated Push API HTTP server %s", server_id)

        created = await self.api.push.create_http_server(
            name=name,
            url=webhook_url,
            shared_secret=secret,
            payload_template_id=PUSH_API_PAYLOAD_TEMPLATE_ID,
        )
        server_id = created.get("id")
        if isinstance(server_id, str) and server_id:
            _LOGGER.info("Created Push API HTTP server %s", server_id)
            return server_id
        return None

    async def _ensure_receiver_profile(self, http_server_id: str) -> str | None:
        """Create or reuse the Push receiver profile for this HA instance."""
        iname = push_iname(self.entry.entry_id, "receiver")
        existing = await self.api.push.get_receiver_profiles()
        for profile in existing:
            if profile.get("iname") != iname:
                continue
            _LOGGER.debug("Reusing Push API receiver profile %s", iname)
            return iname

        created = await self.api.push.create_receiver_profile(
            iname=iname,
            name=f"Home Assistant Push Receiver ({self.entry.entry_id[:8]})",
            http_server_id=http_server_id,
            description="Home Assistant Meraki integration Push API receiver",
        )
        created_iname = created.get("iname")
        if isinstance(created_iname, str) and created_iname:
            _LOGGER.info("Created Push API receiver profile %s", created_iname)
            return created_iname
        if created:
            _LOGGER.info("Created Push API receiver profile %s", iname)
            return iname
        return None

    async def _ensure_topic_profiles(self, receiver_iname: str) -> None:
        """Create push profiles for each requested topic that is available."""
        existing_profiles = await self.api.push.get_push_profiles()
        existing_by_iname = {
            profile.get("iname"): profile for profile in existing_profiles
        }

        requested = self._requested_topics()
        available = set(self._available_topics)

        for topic_id in requested:
            if topic_id not in available:
                self._skipped_topics.append(topic_id)
                _LOGGER.warning(
                    "Push API topic %s is not available to this organization",
                    topic_id,
                )
                continue

            iname = topic_profile_iname(self.entry.entry_id, topic_id)
            if iname in existing_by_iname:
                self._push_profile_inames.append(iname)
                self._subscribed_topics.append(topic_id)
                _LOGGER.debug("Push API topic %s already subscribed", topic_id)
                continue

            label = PUSH_API_TOPIC_LABELS.get(topic_id, topic_id)
            created = await self.api.push.create_push_profile(
                iname=iname,
                name=f"Home Assistant {label}",
                topic_id=topic_id,
                receiver_iname=receiver_iname,
                description=f"Home Assistant subscription for {topic_id}",
            )
            if created:
                self._push_profile_inames.append(iname)
                self._subscribed_topics.append(topic_id)
                _LOGGER.info("Created Push API topic profile %s (%s)", iname, topic_id)
            else:
                _LOGGER.error(
                    "Failed to create Push API topic profile for %s", topic_id
                )
