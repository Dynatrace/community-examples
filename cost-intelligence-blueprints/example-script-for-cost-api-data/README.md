# Python Script - Cost Data from Account Management API

A local Python script that fetches DPS cost data from the Dynatrace Account Management API, prints a structured summary to the terminal, and optionally sends business events to your Dynatrace tenant for trend analysis and alerting.

## What it does

1. Authenticates against the Account Management API using OAuth 2.0 client credentials
2. Resolves your subscription automatically (or uses a pinned UUID from `.env`)
3. Fetches cost-per-environment data for the current month (up to yesterday)
4. Aggregates totals by capability and by environment
5. Checks spend against your configured `DT_MONTHLY_BUDGET` if set
6. Sends business events to your Dynatrace tenant if `DT_ENVIRONMENT_URL` and `DT_INGEST_TOKEN` are set
7. Saves raw API responses and the aggregated summary as JSON files in `results/` (see `example-results/` for sample output)

## The outcome you get

1. On-demand cost visibility without waiting for the monthly billing email
2. A local JSON baseline you can diff over time or load into any reporting tool
3. Business events in Grail you can query, dashboard, and alert on - same event schema as the daily ingestion workflow

## Potential further iterations

1. Schedule the script (cron, task scheduler) to run daily and build a trend database
2. Add Slack or Teams notifications when budget thresholds are crossed
3. Extend the event schema with custom tags like team, cost centre, or project
4. Filter to specific environments or capabilities using the available API parameters
5. Use the JSON output as input to a charting or BI tool

## Prerequisites

- Python 3.10 or later
- An OAuth client with `account-uac-read` scope on your Dynatrace account
- (Optional) A Dynatrace API token with `bizevents.ingest` scope to send events to your tenant

See [SETUP.md](SETUP.md) for step-by-step instructions.

## Events written (optional)

When `DT_ENVIRONMENT_URL` and `DT_INGEST_TOKEN` are set, the script sends three event types:

| Event type | Granularity | Key fields |
|---|---|---|
| `dps.cost.monthly.capability` | One per capability | `capabilityName`, `value` |
| `dps.cost.monthly.environment` | One per environment | `environmentId`, `value` |
| `dps.cost.monthly.environment.capability` | One per environment per capability | `environmentId`, `capabilityName`, `value` |
| `dps.cost.monthly.budget` | One overall budget status | `total`, `budgetLimit`, `budgetStatus`, `budgetPct` |

All events include `month` (e.g. `2026-07`) and `currencyCode`.
