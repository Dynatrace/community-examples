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

## The outcome you get
1. With cost data in Grail - you can build Dashboards, Anomaly Alerts, Workflow 
2. You can customize to your need and can see breakdowns beyond whats available in Account Management
3. You can run cost analysis with DT Assist using thow business events

## Good to knows before you start
1. Data is stored in Grail - The workflow is setup to runs 1 / day 
2. Grail data can't be overwritten - this means that if the setup is not adjusted and the workflow runs more than 1 you would have double writting.
3. In case it happens you can adjust the naming of the event


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
