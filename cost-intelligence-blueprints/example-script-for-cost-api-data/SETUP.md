# Script Setup

Run the Python script locally for on-demand cost checks and exploration. Results are printed to the terminal and saved as JSON files in `results/`.

---

## 1. OAuth Client

The script authenticates against the Account Management API using OAuth 2.0 client credentials.

**Where:** `account.dynatrace.com` - Identity & access management - OAuth clients - Create client

**Required scope:**

| Scope | Purpose |
|---|---|
| `account-uac-read` | Read subscriptions and cost-per-environment data |

**Note your values after creation:**
- **Client ID** - format `dt0s02.XXXXXXXX`
- **Client Secret** - format `dt0s02.XXXXXXXX.LONG_SECRET_STRING`
- **Account UUID** - visible in the URL: `account.dynatrace.com/accounts/{account-uuid}/...`

---

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DT_CLIENT_ID` | Yes | OAuth client ID, format `dt0s02.XXXXXXXX` |
| `DT_CLIENT_SECRET` | Yes | OAuth client secret, format `dt0s02.XXXXXXXX.LONG_SECRET_STRING` |
| `DT_ACCOUNT_UUID` | Yes | Your account UUID from the Account Management URL |
| `DT_MONTHLY_BUDGET` | No | Monthly cost cap in account currency - enables budget check output |
| `DT_SUBSCRIPTION_UUID` | No | Pin a specific subscription UUID - auto-detected if you have only one |
| `DT_ENVIRONMENT_URL` | No | Your environment URL, e.g. `https://abc12345.live.dynatrace.com` - required to send biz events |
| `DT_INGEST_TOKEN` | No | API token with `bizevents.ingest` scope - required to send biz events |
| `DT_EVENT_BUCKET` | No | Route biz events to a specific storage bucket |

---

## 4. Run

```bash
python main.py
```

The script will:

1. Authenticate via OAuth and resolve your subscription
2. Fetch cost-per-environment data for the current month (up to yesterday)
3. Aggregate totals by capability and by environment
4. Print a summary to the terminal
5. Check against `DT_MONTHLY_BUDGET` if set
6. Send business events to your Dynatrace environment if `DT_ENVIRONMENT_URL` and `DT_INGEST_TOKEN` are set

---

## 5. Verify Results

If `DT_ENVIRONMENT_URL` and `DT_INGEST_TOKEN` are set, the script sends business events to your tenant. Use these DQL queries in Dynatrace Notebooks or the DQL editor to confirm the data arrived.

**See all events sent by this script:**
```dql
fetch bizevents
| filter event.provider == "dps.cost.current.month"
| fields event.type, month, currencyCode, timestamp
| sort timestamp desc
```

**Monthly totals by capability:**
```dql
fetch bizevents
| filter event.provider == "dps.cost.current.month"
  and event.type == "dps.cost.monthly.capability"
  and month == "2026-07"
| fields capabilityName, value, currencyCode
| sort value desc
```

**Monthly totals by environment:**
```dql
fetch bizevents
| filter event.provider == "dps.cost.current.month"
  and event.type == "dps.cost.monthly.environment"
  and month == "2026-07"
| fields environmentId, value, currencyCode
| sort value desc
```

**Capability breakdown per environment:**
```dql
fetch bizevents
| filter event.provider == "dps.cost.current.month"
  and event.type == "dps.cost.monthly.environment.capability"
  and month == "2026-07"
| fields environmentId, capabilityName, value, currencyCode
| sort value desc
```

**Budget status:**
```dql
fetch bizevents
| filter event.provider == "dps.cost.current.month"
  and event.type == "dps.cost.monthly.budget"
| fields month, total, budgetLimit, budgetStatus, budgetPct, currencyCode
| sort timestamp desc
```

Replace `2026-07` with the current year-month.

---

## 6. Output files

Raw API responses and the aggregated summary are saved to `results/` (gitignored - not committed):

| File | Contents |
|---|---|
| `subscriptions.json` | All active subscriptions on the account |
| `subscription_detail.json` | Full detail for the resolved subscription |
| `cost_per_environment.json` | Raw cost-per-environment API response |
| `monthly_summary.json` | Aggregated totals by capability and environment |

See `example-results/` for anonymized sample output showing the structure of each file.
