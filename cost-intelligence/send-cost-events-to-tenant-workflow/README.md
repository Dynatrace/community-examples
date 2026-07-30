# Send Cost Events to Tenant

A Dynatrace Automation workflow that fetches yesterday's DPS costs from the Account Management API and ingests them as business events into your Dynatrace tenant - enabling cost trend analysis, dashboards, and alerting via DQL.

## What it does

1. Authenticates against the Account Management API using OAuth 2.0
2. Fetches the previous day's costs broken down by environment and capability
3. Aggregates costs by capability (summed across all environments) and by environment (summed across all capabilities)
4. Ingests three business event types into the `bizevents` table - one per capability, one per environment, one daily total

**Workflow step chain:**

```
fetching_costs -> aggregate_data -> send_biz_events
```

## Prerequisites

- An OAuth client with `account-uac-read` scope
- A Credential Vault entry named `DPS Budget Tracker OAuth`

See [SETUP.md](SETUP.md) for step-by-step instructions.

## Events written

| Event type | Granularity | Key fields |
|---|---|---|
| `dps.cost.daily.capability` | One per capability per day | `capabilityKey`, `capabilityName`, `value` |
| `dps.cost.daily.environment` | One per environment per day | `environmentId`, `value` |
| `dps.cost.daily.environment.capability` | One per environment per capability per day | `environmentId`, `capabilityKey`, `capabilityName`, `value` |
| `dps.cost.daily.total` | One per day | `value` |

All events include `costDate` (e.g. `2026-07-19`), `month` (e.g. `2026-07`), and `currencyCode`.

## Example DQL

```dql
fetch bizevents
| filter event.type == "dps.cost.daily.total"
| fields costDate, value, currencyCode
| sort costDate asc
```
