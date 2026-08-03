# Workflow Setup

Deploy the Dynatrace Automation workflows for scheduled daily cost ingestion and monthly email reporting.

Before continuing, complete the [OAuth client setup](../README.md#prerequisite-oauth-client) in the root README.

---

## 1. OAuth Token
This approaches authenticate against the Account Management API using OAuth 2.0 client credentials. Create this once before following either setup guide.

**Where:** `account.dynatrace.com` - Identity & access management - OAuth clients - Create client

**Required scope:**

| Scope | Purpose |
|---|---|
| `account-uac-read` | Read subscriptions and cost-per-environment data |

**Note your values after creation:**
- **Client ID** - format `dt0s02.XXXXXXXX`
- **Client Secret** - format `dt0s02.XXXXXXXX.LONG_SECRET_STRING`
- **Account UUID** - visible in the URL: `account.dynatrace.com/accounts/{account-uuid}/...`


## 2. Credential Vault

The workflows retrieve the OAuth credentials at runtime from the Credential Vault - no hardcoded secrets in the workflow code.

**Where:** Your Dynatrace environment - Credential vault -  Add new credential

| Field | Value |
|---|---|
| Type | Username & password |
| Name | `DPS Budget Tracker OAuth` |
| Username | Your Account UUID (e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) |
| Password | Your full Client Secret (e.g. `dt0s02.XXXXXXXX.LONG_SECRET_STRING`) |

The name must match exactly - the workflow searches for `"DPS Budget Tracker OAuth"` by name. The Client ID is derived automatically from the secret, so you only need to store the secret.

No ingest token is required. The workflows use the built-in `businessEventsClient` from the Dynatrace Automation SDK, which handles biz event ingestion automatically.

---

## 2. Import Workflows

Two workflow templates are provided in `templates/`:

| File | Purpose | Schedule |
|---|---|---|
| `daily-cost-events-ingest-workflow.json` | Ingests yesterday's costs as biz events (4 chained steps) | Daily, e.g. 02:00 UTC |

**Import steps:**

1. Dynatrace - Automation - Workflows - Upload
2. Select the `.workflow.json` file
3. After import, run once manually to confirm all steps pass.
4. Use queries below in a notebook to see data, Adjust month to your current month.
5. If succeeded, open the workflow and adjust the trigger schedule. Set schedule to once per day starting the next day.

**Daily ingestion workflow - step chain:**

```
fetching_costs -> aggregate_data -> send_biz_events
```

Each step depends strictly on the previous one completing successfully.

---

## 3. Data Available

The daily ingestion workflow writes four event types to biz events (`bizevents` table in DQL), each produced once per day.
All event types are part of `event.provider == "dps.budget.tracker"`

### `dps.cost.daily.capability`

One event per capability per day (costs summed across all environments for that day).

| Field | Example | Description |
|---|---|---|
| `event.type` | `dps.cost.daily.capability` | Event type |
| `event.provider` | `dps.budget.tracker` | Fixed identifier |
| `costDate` | `2026-07-19` | The day the cost applies to (yesterday at run time) |
| `month` | `2026-07` | Year-month for monthly rollups |
| `capabilityKey` | `FULLSTACK_MONITORING` | Capability identifier |
| `capabilityName` | `Full-Stack Monitoring` | Human-readable name |
| `value` | `1240.5` | Cost in account currency |
| `currencyCode` | `USD` | Currency |

### `dps.cost.daily.environment`

One event per environment per day (costs summed across all capabilities for that day).

| Field | Example | Description |
|---|---|---|
| `event.type` | `dps.cost.daily.environment` | Event type |
| `event.provider` | `dps.budget.tracker` | Fixed identifier |
| `costDate` | `2026-07-19` | The day the cost applies to |
| `month` | `2026-07` | Year-month for monthly rollups |
| `environmentId` | `abc12345` | Dynatrace environment ID |
| `value` | `3171.73` | Cost in account currency |
| `currencyCode` | `USD` | Currency |

### `dps.cost.daily.environment.capability`

One event per environment per capability per day - the most granular breakdown available.

| Field | Example | Description |
|---|---|---|
| `event.type` | `dps.cost.daily.environment.capability` | Event type |
| `event.provider` | `dps.budget.tracker` | Fixed identifier |
| `costDate` | `2026-07-19` | The day the cost applies to |
| `month` | `2026-07` | Year-month for monthly rollups |
| `environmentId` | `abc12345` | Dynatrace environment ID |
| `capabilityKey` | `FULLSTACK_MONITORING` | Capability identifier |
| `capabilityName` | `Full-Stack Monitoring` | Human-readable name |
| `value` | `820.10` | Cost in account currency |
| `currencyCode` | `USD` | Currency |

### `dps.cost.daily.total`

One event per day with the overall cost across all capabilities and environments.

| Field | Example | Description |
|---|---|---|
| `event.type` | `dps.cost.daily.total` | Event type |
| `event.provider` | `dps.budget.tracker` | Fixed identifier |
| `costDate` | `2026-07-19` | The day the cost applies to |
| `month` | `2026-07` | Year-month for monthly rollups |
| `value` | `4412.28` | Total cost for the day in account currency |
| `currencyCode` | `USD` | Currency |

### Example DQL queries

**Monthly total by capability:**
```dql
fetch bizevents
| filter event.type == "dps.cost.daily.capability" and month == "2026-07"
| summarize total = sum(value), by: {capabilityName}
| sort total desc
```

**Monthly total by environment:**
```dql
fetch bizevents
| filter event.type == "dps.cost.daily.environment" and month == "2026-07"
| summarize total = sum(value), by: {environmentId}
| sort total desc
```

**Cost per capability per environment (most granular):**
```dql
fetch bizevents
| filter event.type == "dps.cost.daily.environment.capability" and month == "2026-07"
| summarize total = sum(value), by: {environmentId, capabilityName}
| sort total desc
```

**Daily spend trend:**
```dql
fetch bizevents
| filter event.type == "dps.cost.daily.total"
| fields costDate, value, currencyCode
| sort costDate asc
```
