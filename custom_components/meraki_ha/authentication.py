"""
Handles Meraki API authentication for the Meraki Home Assistant integration.

This module validates OAuth access tokens against the Meraki Dashboard API.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.exceptions import ConfigEntryAuthFailed
from meraki.exceptions import APIError, AsyncAPIError

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

from .core.api.client import MerakiAPIClient
from .core.errors import MerakiAuthenticationError, MerakiConnectionError
from .helpers.logging_helper import MerakiLoggers

_LOGGER = MerakiLoggers.MAIN


async def async_list_organizations(
    hass: HomeAssistant,
    access_token: str,
) -> list[dict[str, Any]]:
    """
    List organizations visible to an OAuth access token.

    Args:
    ----
        hass: The Home Assistant instance.
        access_token: Meraki OAuth access token.

    Returns
    -------
        A list of organization dictionaries.

    """
    client = MerakiAPIClient(
        hass=hass,
        api_key=access_token,
        org_id="",
    )
    await client.async_setup()
    try:
        organizations = await client.organization.get_organizations()
        if isinstance(organizations, list):
            return organizations
        return []
    finally:
        await client.async_close()


class MerakiAuthentication:
    """Validate a Bearer token against a Meraki organization."""

    def __init__(
        self, hass: HomeAssistant, access_token: str, organization_id: str
    ) -> None:
        """
        Initialize the Meraki Authentication class.

        Args:
        ----
            hass: The Home Assistant instance.
            access_token: The Meraki OAuth access token.
            organization_id: The Meraki Organization ID.

        """
        self.hass = hass
        self.access_token: str = access_token
        self.organization_id: str = organization_id

    async def validate_credentials(self) -> dict[str, Any]:
        """
        Validate Meraki OAuth credentials using the Meraki SDK.

        Returns
        -------
            A dictionary with "valid": True and "org_name": "Org Name".

        Raises
        ------
            ConfigEntryAuthFailed: If authentication fails.
            ValueError: If the organization ID is not found.
            MerakiConnectionError: If there is a connection error.

        """
        try:
            all_organizations = await async_list_organizations(
                self.hass, self.access_token
            )

            org_found = False
            fetched_org_name: str | None = None

            for org in all_organizations:
                if org.get("id") == self.organization_id:
                    org_found = True
                    fetched_org_name = org.get("name")
                    break

            if not org_found:
                _LOGGER.warning(
                    "Organization ID %s not found in accessible organizations.",
                    self.organization_id,
                )
                raise ValueError(
                    f"Org ID {self.organization_id} is not accessible with this token.",
                )

            _LOGGER.info(
                "OAuth token validated for Organization ID %s (Name: %s)",
                self.organization_id,
                fetched_org_name,
            )
            return {"valid": True, "org_name": fetched_org_name}

        except MerakiAuthenticationError as e:
            _LOGGER.error("Authentication failed: %s", e)
            raise ConfigEntryAuthFailed(f"Authentication failed: {e}") from e
        except MerakiConnectionError as e:
            _LOGGER.error("Connection error: %s", e)
            raise MerakiConnectionError(f"Connection error: {e}") from e
        except (APIError, AsyncAPIError) as e:
            status = getattr(e, "status", None)
            message = getattr(e, "message", str(e))
            if status == 401:
                raise ConfigEntryAuthFailed("Invalid OAuth token (HTTP 401)") from e
            if status == 403:
                raise ConfigEntryAuthFailed(
                    f"Token lacks permissions for org {self.organization_id}.",
                ) from e
            if status == 404:
                raise ConfigEntryAuthFailed(
                    f"Organization ID {self.organization_id} not found.",
                ) from e

            raise ConfigEntryAuthFailed(
                f"Meraki API error for org {self.organization_id}: {message}",
            ) from e
        except ValueError:
            raise
        except Exception as e:
            _LOGGER.error(
                "Unexpected error during validation for org %s: %s",
                self.organization_id,
                e,
            )
            raise ConfigEntryAuthFailed(
                f"Unexpected error for org {self.organization_id}: {e}",
            ) from e


async def validate_meraki_credentials(
    hass: HomeAssistant,
    api_key: str,
    organization_id: str,
) -> dict[str, Any]:
    """
    Validate Meraki OAuth credentials for an organization.

    Args:
    ----
        hass: The Home Assistant instance.
        api_key: The Meraki OAuth access token.
        organization_id: The Meraki Organization ID.

    Returns
    -------
        A dictionary with "valid": True and "org_name": "Organization Name".

    """
    auth = MerakiAuthentication(hass, api_key, organization_id)
    return await auth.validate_credentials()
