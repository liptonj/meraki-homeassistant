"""Helper script to get your Meraki config entry ID for services.

Run this in the Home Assistant Developer Tools → Template editor:
"""

# Find your Meraki config entry ID
TEMPLATE = """
{% set meraki_entries = integration_entities('meraki_ha') | map('device_id') | unique | list %}
{% if meraki_entries | length > 0 %}
  {% set devices = states | selectattr('entity_id', 'in', integration_entities('meraki_ha')) | map(attribute='entity_id') | list %}
  {% if devices | length > 0 %}
    {% set first_entity = devices[0] %}
    {% set device_id = device_id(first_entity) %}
    {% set config_entries = config_entry_id(device_id) %}

🔑 Your Meraki Config Entry ID:
{{ config_entries }}

Use this ID to call services like:
- meraki_ha.create_editable_dashboard
- meraki_ha.regenerate_dashboard

Example service call in YAML:
```yaml
service: meraki_ha.create_editable_dashboard
data:
  config_entry_id: "{{ config_entries }}"
  dashboard_id: "meraki_main"
```
  {% endif %}
{% else %}
  ❌ No Meraki integration found. Make sure the integration is set up.
{% endif %}
"""

print("Copy and paste this into Developer Tools → Template:")
print()
print(TEMPLATE)
