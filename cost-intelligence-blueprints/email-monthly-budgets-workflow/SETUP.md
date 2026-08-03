# Workflow Setup

Deploy the `Email_Monthly_Cost_Status` Dynatrace Automation workflow to receive a monthly email summary of your DPS costs against a configured budget.

---

## 1. OAuth Client

This workflow authenticates against the Account Management API using OAuth 2.0 client credentials.

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

## 2. Credential Vault

The workflow retrieves OAuth credentials at runtime from the Credential Vault - no hardcoded secrets in the workflow code.

**Where:** Your Dynatrace environment - Automation - Credentials - New credential

| Field | Value |
|---|---|
| Type | Username & password |
| Name | `DPS Budget Tracker OAuth` |
| Username | Your Account UUID (e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) |
| Password | Your full Client Secret (e.g. `dt0s02.XXXXXXXX.LONG_SECRET_STRING`) |

The name must match exactly - the workflow searches for `"DPS Budget Tracker OAuth"` by name.

---

## 3. Configure the Workflow

Adjust these values in `email-monthly-cost-status.workflow.json` before importing:

**In the `check_budget` step (top of the script):**

| Constant | Default | Description |
|---|---|---|
| `MONTHLY_BUDGET` | `50000` | Your monthly cost cap in account currency |

**In the `send_summary_email` step:**

| Field | Default | Description |
|---|---|---|
| `to` | `your-email@example.com` | Recipient address(es) |
| Condition | `budgetPct >= 80` | Adjust the threshold percentage directly in the step condition |

---

## 4. Import and Schedule

1. Dynatrace - Automation - Workflows - Upload
2. Select `email-monthly-cost-status.workflow.json`
3. Set the trigger - recommended: 1st of each month, e.g. 08:00 UTC
4. Run once manually to confirm all steps pass

**Workflow step chain:**

```
get_monthly_cost_data_overview -> check_budget -> send_summary_email
```

The `send_summary_email` step runs only when its condition is met (default: `budgetPct >= 80`). If month-to-date spend is below that threshold, the workflow completes silently without sending an email.
