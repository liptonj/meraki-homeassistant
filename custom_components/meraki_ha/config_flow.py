"""Config flow for the Meraki Home Assistant integration."""

from __future__ import annotations

from collections.abc import Mapping
from logging import Logger
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    SOURCE_REAUTH,
    ConfigEntry,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import config_entry_oauth2_flow, selector

from .authentication import async_list_organizations
from .const import (
    CONF_ENABLED_NETWORKS,
    CONF_INTEGRATION_TITLE,
    CONF_MERAKI_API_KEY,
    CONF_MERAKI_ORG_ID,
    DOMAIN,
    OAUTH_SCOPES,
)
from .core.api.client import MerakiAPIClient
from .helpers.logging_helper import MerakiLoggers
from .options_flow import MerakiOptionsFlowHandler
from .schemas import SCHEMA_NETWORK_SELECTION

_LOGGER = MerakiLoggers.MAIN


class MerakiConfigFlow(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Handle an OAuth2 config flow for Meraki."""

    DOMAIN = DOMAIN
    VERSION = 2
    CONNECTION_CLASS = "cloud_poll"

    def __init__(self) -> None:
        """Initialize the config flow."""
        super().__init__()
        self.data: dict[str, Any] = {}
        self.options: dict[str, Any] = {}
        self._organizations: list[dict[str, Any]] = []

    @property
    def logger(self) -> Logger:
        """Return logger."""
        return _LOGGER

    @property
    def extra_authorize_data(self) -> dict[str, str]:
        """Extra data that needs to be appended to the authorize url."""
        return {"scope": " ".join(OAUTH_SCOPES)}

    async def async_oauth_create_entry(self, data: dict[str, Any]) -> ConfigFlowResult:
        """Continue setup after tokens are stored on the flow."""
        self.data.update(data)
        token = data.get("token", {})
        access_token = token.get("access_token")
        if not isinstance(access_token, str) or not access_token:
            return self.async_abort(reason="oauth_error")

        try:
            self._organizations = await async_list_organizations(
                self.hass, access_token
            )
        except Exception:
            _LOGGER.exception("Failed to list Meraki organizations after OAuth")
            return self.async_abort(reason="cannot_connect")

        if not self._organizations:
            return self.async_abort(reason="no_organizations")

        if self.source == SOURCE_REAUTH:
            return await self._async_finish_reauth()

        if len(self._organizations) == 1:
            org = self._organizations[0]
            org_id = str(org.get("id", ""))
            if not org_id:
                return self.async_abort(reason="no_organizations")
            return await self._async_store_org_and_continue(
                org_id, org.get("name", org_id)
            )

        return await self.async_step_pick_org()

    async def _async_finish_reauth(self) -> ConfigFlowResult:
        """Apply new tokens to the existing config entry."""
        reauth_entry = self._get_reauth_entry()
        org_id = str(reauth_entry.data.get(CONF_MERAKI_ORG_ID, ""))
        matching = next(
            (org for org in self._organizations if str(org.get("id")) == org_id),
            None,
        )
        if matching is None:
            return self.async_abort(reason="org_mismatch")

        updated_data = {
            **reauth_entry.data,
            **self.data,
            CONF_MERAKI_ORG_ID: org_id,
            "org_name": matching.get("name", reauth_entry.title),
        }
        updated_data.pop(CONF_MERAKI_API_KEY, None)
        return self.async_update_reload_and_abort(reauth_entry, data=updated_data)

    async def _async_store_org_and_continue(
        self, org_id: str, org_name: str
    ) -> ConfigFlowResult:
        """Set unique ID and continue to network selection."""
        await self.async_set_unique_id(org_id)
        self._abort_if_unique_id_configured()
        self.data[CONF_MERAKI_ORG_ID] = org_id
        self.data["org_name"] = org_name
        return await self.async_step_init()

    async def async_step_pick_org(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Let the user pick a Meraki organization."""
        if user_input is not None:
            org_id = str(user_input[CONF_MERAKI_ORG_ID])
            org_name = next(
                (
                    str(org.get("name", org_id))
                    for org in self._organizations
                    if str(org.get("id")) == org_id
                ),
                org_id,
            )
            return await self._async_store_org_and_continue(org_id, org_name)

        options = [
            selector.SelectOptionDict(
                value=str(org.get("id", "")),
                label=str(org.get("name", org.get("id", "Unknown"))),
            )
            for org in self._organizations
            if org.get("id")
        ]
        return self.async_show_form(
            step_id="pick_org",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_MERAKI_ORG_ID): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=options)
                    )
                }
            ),
        )

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the general settings step."""
        if user_input is not None:
            self.options.update(user_input)
            return self.async_create_entry(
                title=self.data.get("org_name", CONF_INTEGRATION_TITLE),
                data=self.data,
                options=self.options,
            )

        network_options: list[dict[str, str]] = []
        access_token = self.data.get("token", {}).get("access_token")
        org_id = self.data.get(CONF_MERAKI_ORG_ID)
        if access_token and org_id:
            api_client = MerakiAPIClient(
                hass=self.hass,
                api_key=access_token,
                org_id=org_id,
            )
            try:
                await api_client.async_setup()
                networks = await api_client.organization.get_organization_networks()
                if isinstance(networks, list):
                    network_options = [
                        {
                            "label": network.get("name", network.get("id", "Unknown")),
                            "value": network.get("id", ""),
                        }
                        for network in networks
                        if network.get("id")
                    ]
            except Exception as err:
                _LOGGER.warning(
                    "Failed to fetch networks for config flow: %s",
                    err,
                )
            finally:
                await api_client.async_close()

        schema_with_defaults = self._populate_schema_defaults(
            SCHEMA_NETWORK_SELECTION,
            self.options,
            network_options,
        )

        return self.async_show_form(
            step_id="init",
            data_schema=schema_with_defaults,
        )

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Perform reauth when the OAuth token is invalid or missing."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm reauthentication with Cisco Meraki."""
        if user_input is None:
            reauth_entry = self._get_reauth_entry()
            return self.async_show_form(
                step_id="reauth_confirm",
                description_placeholders={
                    "organization": str(
                        reauth_entry.data.get(
                            "org_name", reauth_entry.data.get(CONF_MERAKI_ORG_ID, "")
                        )
                    )
                },
            )
        return await self.async_step_user()

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Get the options flow for this handler."""
        return MerakiOptionsFlowHandler()

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a reconfiguration flow."""
        entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
        if not entry:
            return self.async_abort(reason="unknown_entry")

        if user_input is not None:
            new_options = {**entry.options, **user_input}
            self.hass.config_entries.async_update_entry(entry, options=new_options)
            await self.hass.config_entries.async_reload(entry.entry_id)
            return self.async_abort(reason="reconfigure_successful")

        network_options = []
        if (
            DOMAIN in self.hass.data
            and entry.entry_id in self.hass.data[DOMAIN]
            and "coordinator" in self.hass.data[DOMAIN][entry.entry_id]
        ):
            coordinator = self.hass.data[DOMAIN][entry.entry_id]["coordinator"]
            if coordinator.data and coordinator.data.get("networks"):
                network_options = [
                    {"label": network["name"], "value": network["id"]}
                    for network in coordinator.data["networks"]
                ]

        schema_with_defaults = self._populate_schema_defaults(
            SCHEMA_NETWORK_SELECTION, entry.options, network_options
        )

        return self.async_show_form(
            step_id="reconfigure", data_schema=schema_with_defaults
        )

    def _populate_schema_defaults(
        self,
        schema: vol.Schema,
        defaults: Mapping[str, Any],
        network_options: list[dict[str, str]] | None = None,
    ) -> vol.Schema:
        """Populate a schema with default values from a dictionary."""
        new_schema_keys = {}
        if network_options is None:
            network_options = []

        defaults_dict = dict(defaults)

        for key, value in schema.schema.items():
            key_name = key.schema
            target_key = key

            if key_name in defaults_dict:
                target_key = type(key)(key.schema, default=defaults_dict[key.schema])

            if key_name == CONF_ENABLED_NETWORKS and isinstance(
                value, selector.SelectSelector
            ):
                current_values = defaults_dict.get(CONF_ENABLED_NETWORKS, [])
                existing_option_values = {opt["value"] for opt in network_options}

                combined_options = list(network_options)
                for val in current_values:
                    if val not in existing_option_values:
                        combined_options.append({"label": val, "value": val})

                new_config = value.config.copy()
                new_config["options"] = [
                    selector.SelectOptionDict(label=opt["label"], value=opt["value"])
                    for opt in combined_options
                ]
                value = selector.SelectSelector(new_config)

            new_schema_keys[target_key] = value
        return vol.Schema(new_schema_keys)
