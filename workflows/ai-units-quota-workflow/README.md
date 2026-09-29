# AI Units Quota Workflow

A Dynatrace Automation workflow that monitors per-user AI Units consumption and enforces daily quotas by restricting access to AI-powered features when a threshold is exceeded.

This blueprint is adapted from the [Log Query Quota Workflow](https://github.com/Dynatrace/community-examples/tree/main/cost-intelligence-blueprints/set-quotas-with-workflow) in the Dynatrace Community Examples repository.

---

## How It Works

The workflow runs every minute and executes two independent chains:

```
Every minute
    ├── check_for_ai_quota (DQL)            → users at 100%+ of quota, not yet locked out today
    │       ├── lock_out_users (JS)         → adds to "AI Quota Exceeded" group + logs bizevents
    │       │       └── send_admin_lockout_summary (Email) → admin summary of locked-out users
    │       └── send_email_about_ai_quota (Email) → notifies each locked-out user
    │
    └── check_for_quota_warning (DQL)       → users at 80–99% of quota, not yet warned today
            ├── send_quota_warning_email (Email) → warns each approaching-quota user
            └── log_quota_warning_events (JS)    → logs bizevents to prevent duplicate warnings

At 00:00 UTC
    └── quota_reset_at_midnight (JS)        → removes all users from "AI Quota Exceeded" group
```

**Enforcement flow:**

1. `check_for_ai_quota` queries `dt.system.events` billing data to identify users whose AI Units consumption in the past day exceeds the configured threshold (default: 1,000 units).
2. Users already notified today (tracked via a business event) are excluded, preventing duplicate enforcement.
3. Over-quota users are added to the **AI Quota Exceeded** IAM group, which has a deny policy attached to restrict AI feature access.
4. Each affected user receives an email showing their actual unit count. An admin summary email lists all newly locked-out users and their unit totals.
5. At midnight UTC, all users are removed from the group, resetting their access for the new day.

---

## Prerequisites

- Dynatrace platform with Account Management permissions
- `storage:events:write` permission for the workflow actor (to ingest business events)
- Email connector enabled in your Dynatrace environment
- Billing events data available in Grail (`dt.system.events`)

---

## Event Schema Reference

The following fields are confirmed from real `AI Units` billing events observed in a Dynatrace SaaS environment. The workflow is pre-configured for these field names and values — no schema verification is required before deploying.

| Field | Confirmed value | Notes |
|---|---|---|
| `event.kind` | `BILLING_USAGE_EVENT` | Filters the fetch to billing events only |
| `event.type` | `AI Units` | Exact string — case-sensitive |
| `usage.quantity.billable` | double (e.g. `30.0`) | Aggregated with `sum()` for the daily total; `consumed_units` does not exist |
| `user.email` | always present | Confirmed on 1,463/1,463 events sampled; safe to rely on for per-user enforcement |
| `event.id` | UUID string | Used with `dedup event.id` to prevent double-counting |
| `event.version` | `1.0.0` | Not filtered — a `"1.0"` filter would silently match nothing |
| `usage.start` / `usage.end` | null | The event `timestamp` is the usage time; `from: -0d@d` is the correct daily window |

**Caller context** (available for optional filtering — see Customization):

| Field | Observed values |
|---|---|
| `caller.type` | `internal` (workflow/operator actions), `api` (direct API calls), `mcp` (MCP tool calls) |
| `tool` | `operator`, `chat`, `nl2dql` |
| `tool.category` | `ai` |

---

## Setup (~15 minutes)

### 1. Create an IAM Deny Policy

In **Account Management → Policies**, create a policy that denies access to the AI features you want to restrict. Attach this policy at the **Account** scope.

The specific permissions to deny depend on which AI features your users consume (e.g. Davis CoPilot, AI analysis). Consult your Dynatrace IAM documentation for the relevant permission identifiers.

### 2. Create the "AI Quota Exceeded" Group

In **Account Management → Groups**, create a group named exactly:

```
AI Quota Exceeded
```

Attach the deny policy from Step 1 to this group at the Account scope.

### 3. Create a Service User

Create a dedicated service user (e.g. `ai-quota-check@your-domain.com`) and assign it only the permissions needed to run the quota-check DQL query. Note this user's email — you'll need it as the workflow Actor.

### 4. Create an OAuth Client

In **Account Management → OAuth Clients**, create a client with:

- **Subject**: an Account Manager user (not the service user)
- **Scopes**: `account-idm-read account-idm-write`

> **Important:** The subject user email must exactly match the email shown in Account Management — this may differ from the address you log in with (e.g. it may include a tenant suffix). Check **Account Management → Users** to confirm the exact email address before creating the client. If the subject email doesn't match a valid active user, the OAuth client will show as "Not available" and token requests will fail.

Note the **Client Secret** — it will be used in the next step.

### 5. Store Credentials in the Credential Vault

In your Dynatrace environment, go to **Settings → Credential Vault** and create a new credential:

| Field | Value |
|---|---|
| **Name** | `Quota check OAuth` |
| **Type** | Username & password |
| **Username** | Your Account ID (found in Account Management → Account Info) |
| **Password** | The OAuth Client Secret from Step 4 |
| **Scope** | AppEngine |

The name must be exactly `Quota check OAuth`.

### 6. Configure the Outbound Allowlist

The workflow makes outbound HTTPS calls to `sso.dynatrace.com` (OAuth token) and `api.dynatrace.com` (Account Management API). Verify both hosts are permitted:

1. In your Dynatrace environment, go to **Settings → Preferences → Allowlist for outbound connections**.
2. Confirm `sso.dynatrace.com` and `api.dynatrace.com` are present. If not, add them.

### 7. Import the Workflow

1. In your Dynatrace environment, go to **Automations**.
2. Click **Import workflow** and upload `workflow.yaml`.
3. Open the workflow settings and set the **Actor** to the service user created in Step 3.
4. Go to **Settings → Automations → Authorization settings** and confirm the Actor user has an entry there. If not, add the user and grant the required permissions — without this, the workflow runtime cannot act on the user's behalf and credential vault access will fail.
5. Save and run the workflow once manually to validate all steps.

> **Note on DQL customization:** If you modify the `check_for_ai_quota` DQL query, use only single-line `//` comments within pipeline steps. Block comments (`/* ... */`) are not supported by the Grail DQL parser and will cause a parse error.

---

## Customization

| What to change | Where |
|---|---|
| AI Units threshold (default: 1,000) | `check_for_ai_quota` task → `filter ai_units > 1000` **and** `check_for_quota_warning` task → `filter ai_units <= 1000` and `filter ai_units > 800`. Also update the threshold value in the warning email template. Keep all three in sync. |
| Warning threshold (default: 80%) | `check_for_quota_warning` task → `filter ai_units > 800`. Formula: `warning threshold = quota × 0.8`. If you change the quota, update this value proportionally (e.g. quota 2,000 → warning 1,600). |
| Admin notification email | `send_admin_lockout_summary` task → `to` field (replace `admin@example.com`) |
| Quota reset time (default: 00:00 UTC) | `quota_reset_at_midnight` task → condition `"00:00"` |
| User lockout email subject / body | `send_email_about_ai_quota` task → `subject` / `content` fields |
| Warning email subject / body | `send_quota_warning_email` task → `subject` / `content` fields |
| Restrict to specific users/teams | Add a `filter` on `user.email` in both DQL tasks |
| Restrict to a specific caller type | Add `\| filter caller.type == "api"` (or `"mcp"` / `"internal"`) in both DQL tasks. Observed values: `internal` (workflow/operator actions), `api` (direct API), `mcp` (MCP tool calls) |
| Exempt service accounts | Add `\| filterOut matchesPhrase(user.email, "@service.sso.dynatrace.com")` in both DQL tasks. Service accounts appear with a UUID-based email of this form |
| Change to weekly quota | Adjust the `from:` timeframe in both DQL tasks to `-7d@d` and update the reset task |

---

## Cost Considerations

This workflow is configured to run **every minute** (1,440 executions/day), which consumes Dynatrace Automation execution units on each run. Since AI Units billing data arrives with up to a **24-hour delay**, running every minute provides no enforcement advantage over a much lower frequency — the underlying data does not change within a single day.

**Recommendation:** Increase the schedule interval to reduce execution costs with no meaningful impact on enforcement behaviour:

| Interval | Executions/day | Notes |
|---|---|---|
| Every 1 minute | 1,440 | Default — no benefit over lower frequencies given billing data delay |
| Every 15 minutes | 96 | Good balance for near-real-time notification delivery |
| Every 30 minutes | 48 | Recommended for most deployments |
| Every 60 minutes | 24 | Sufficient given the 24-hour billing data lag |

To change the interval, edit the workflow trigger in **Automations → [workflow] → Settings → Schedule → Interval**.

---

## Known Limitations

- **Billing data delay**: Billing events for AI Units arrive with up to a 24-hour delay. The workflow enforces quotas based on the previous day's consumption.
- **Per-user attribution**: This workflow requires AI Units billing events to include a `user.email` field. If your environment reports AI Units at the environment or application level only, the quota cannot be enforced per user.
- **Duplicate business events**: If the workflow runs multiple times in a minute window when a user is first detected, a small number of duplicate `ai.units.quota.exceeded` business events may be written. This does not affect enforcement.
- **Manual override**: Administrators can unblock a user at any time by removing them from the **AI Quota Exceeded** group directly in Account Management.
- **Service accounts**: AI Units consumed by service accounts appear with a UUID-based email (`<uuid>@service.sso.dynatrace.com`). The workflow will attempt to lock these identities out via the IAM API; calls that fail are silently skipped (handled by `Promise.allSettled`), but the service account will be re-evaluated on every workflow run. To exempt service accounts entirely, add `| filterOut matchesPhrase(user.email, "@service.sso.dynatrace.com")` to both DQL tasks.
- **Calendar-day window, not rolling 24 hours**: The quota window is today's calendar day in UTC (`from: -0d@d`, midnight→now). A user who consumes 900 units at 11:55 PM and 200 more at 12:05 AM the next day will not be caught by the quota on either day. This is a deliberate simplification that keeps the reset logic straightforward.

---

## Related Resources

- [Log Query Quota Workflow](https://github.com/Dynatrace/community-examples/tree/main/cost-intelligence-blueprints/set-quotas-with-workflow) — the original blueprint this is adapted from
- [TESTING.md](TESTING.md) — internal validation report: full billing event schema, test results, and known environment-specific gotchas
- [Dynatrace Account Management API](https://developer.dynatrace.com/reference/api-reference/account-management/)
- [Dynatrace Automations documentation](https://developer.dynatrace.com/develop/automations/)
- [DQL billing events reference](https://developer.dynatrace.com/reference/system-events/)