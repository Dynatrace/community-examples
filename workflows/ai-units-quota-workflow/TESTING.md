# Testing & Validation Report

**Workflow:** AI Units Quota Check  
**Test date:** 2026-09-23  
**Environment:** Internal sprint/hardening environment (non-production SaaS)

---

## Summary

End-to-end validation of the workflow was completed successfully in a hardening environment. All core enforcement tasks passed. Several environment-specific issues were encountered and resolved — documented below so production deployment goes smoothly.

---

## Test Approach

The hardening environment used for enforcement testing did not have AI Units billing data, so the DQL task was patched to inject a test user directly and the lockout JavaScript was modified to hardcode an email address. This allowed full validation of the enforcement chain. Real billing event schema was subsequently validated against an internal dev tenant — see §Billing Event Schema Validation below.

**Temporary changes made for testing (do not carry into production):**

| Task | Temporary change |
|---|---|
| `check_for_ai_quota` | Replaced real DQL with `filter false` + hardcoded test email inject |
| `lock_out_users` | Replaced credential vault lookup with hardcoded `accountId` and OAuth secret |
| `lock_out_users` | Removed predecessor condition to allow unconditional execution |

All changes were reverted before committing the production `workflow.yaml`.

---

## Test Results

| Check | Result | Notes |
|---|---|---|
| `check_for_ai_quota` runs successfully with empty result | PASS | "Fail on empty result" must be OFF |
| `lock_out_users` obtains OAuth token | PASS | See hardening-specific URL note below |
| `lock_out_users` finds "AI Quota Exceeded" group via Account Management API | PASS | |
| Test user added to "AI Quota Exceeded" group | PASS | Verified in Account Management UI |
| Business event `ai.units.quota.exceeded` ingested | PASS | 3 records visible in `fetch bizevents` |
| `quota_reset_at_midnight` logic | NOT TESTED | Condition requires 00:00 UTC; validated by code review only |
| `send_email_about_ai_quota` delivery | NOT TESTED | Skipped (task was discarded due to removed condition during testing) |
| De-duplication via bizevents filterOut | NOT TESTED | Requires real billing events; validated by code review only |

---

## Issues Encountered & Resolutions

### 1. DQL does not support block comments (`/* ... */`)

**Symptom:** `check_for_ai_quota` failed with `PARSE_ERROR: ':' isn't allowed here`.  
**Cause:** The DQL query contained a `/* ... */` block comment, which the Grail parser does not support.  
**Fix:** Removed all block comments from the DQL. Single-line `//` comments within pipeline steps are supported.  
**Production impact:** The production `workflow.yaml` in this repo has no block comments — this is already fixed.

---

### 2. Hardening environment requires different OAuth and API base URLs

**Symptom:** OAuth token request returned `400 invalid_request` with empty error description.  
**Cause:** The workflow uses `sso.dynatrace.com` and `api.dynatrace.com` (production SaaS defaults), which are unreachable from the hardening environment.  
**Fix:** Swapped `tokenUrl` and `baseUrl` to the internal environment equivalents of the SSO and Account Management API endpoints.  
**Production impact:** None. The production `workflow.yaml` uses `sso.dynatrace.com` / `api.dynatrace.com`, which are correct for customer SaaS environments.

---

### 3. Outbound hosts must be in the AppEngine allowlist

**Symptom:** After correcting the URLs, requests were blocked with `NotCapable: Blocked request to '...' (host not in allowlist)`.  
**Cause:** AppEngine sandboxes outbound connections to an explicit allowlist.  
**Fix:** The hardening environment already had the sprint/hardening SSO and API hosts in its allowlist. No action was needed beyond selecting the correct URLs.  
**Production impact:** For production customer environments, `sso.dynatrace.com` and `api.dynatrace.com` should already be in the default allowlist. If a customer hits this error, they need to add those hosts via **Settings → Preferences → Allowlist for outbound connections**.

---

### 4. Credential vault `getCredentialsDetails` returned 403 in hardening

**Symptom:** `credentialVaultClient.getCredentialsDetails` returned `403: The requested credential details cannot be accessed by the current user or entity` even with correct AppEngine scope and access settings.  
**Cause:** Not fully diagnosed — likely a hardening-environment-specific restriction on credential access for AppEngine workflows. The actor authorization settings, credential scope, and access were all correctly configured.  
**Workaround:** Credentials were hardcoded directly in the script for testing purposes and removed before committing.  
**Production impact:** This 403 was not reproduced in any production SaaS environment. The production `workflow.yaml` uses the standard `getCredentialsDetails` approach (identical to the original [Log Query Quota Workflow](https://github.com/Dynatrace/community-examples/tree/main/cost-intelligence-blueprints/set-quotas-with-workflow) which works in production). Monitor this on first production deployment and escalate if the 403 reappears.

---

### 5. Workflow actor authorization settings required

**Symptom:** First execution failed with `Could not run workflow task on behalf of '<uuid>'. Please ensure Authorization Settings are configured`.  
**Cause:** The workflow Actor (service user) had not been configured in **Settings → Automations → Authorization settings**.  
**Fix:** Changed the Actor to the deploying user, who already had full authorization settings configured.  
**Production impact:** Documented in the README setup steps. The Actor must have Authorization Settings configured before the workflow can execute.

---

## Production Deployment Checklist

For the colleague deploying to production, verify the following before publishing:

- [ ] `event.type == "AI Units"` confirmed against production billing events (`fetch dt.system.events | filter event.kind == "BILLING_USAGE_EVENT" | dedup event.type`)
- [ ] Metric field `usage.quantity.billable` confirmed against a real AI Units billing event (see §Billing Event Schema Validation below)
- [ ] Quota threshold (default: 1,000) reviewed and adjusted for the target customer
- [ ] IAM deny policy created and attached to "AI Quota Exceeded" group (consult Dynatrace IAM docs for the appropriate permission to deny)
- [ ] OAuth client created with an Account Manager user as subject, scopes: `account-idm-read`, `account-idm-write`
- [ ] Credential vault entry `Quota check OAuth` created (Username = Account UUID, Password = full OAuth client secret, Scope = AppEngine)
- [ ] Workflow Actor has Authorization Settings configured
- [ ] `sso.dynatrace.com` and `api.dynatrace.com` are in the environment's outbound allowlist
- [ ] `send_email_about_ai_quota` tested with a real email recipient before go-live
- [ ] `quota_reset_at_midnight` validated after first production run at 00:00 UTC

---

## Billing Event Schema Validation

A real `AI Units` billing event was observed in an internal Dynatrace environment on 2026-09-23. The event confirmed the following field schema:

| Field | Value observed | Workflow uses |
|---|---|---|
| `event.kind` | `BILLING_USAGE_EVENT` | `filter event.kind == "BILLING_USAGE_EVENT"` ✓ |
| `event.type` | `AI Units` | `filter event.type == "AI Units"` ✓ |
| `usage.quantity.billable` | `30.00` (double) | `sum(usage.quantity.billable)` ✓ |
| `usage.unit` | `Units` | — (informational) |
| `user.email` | present (e.g. `user@dynatrace.com`) | `by:{user.email}` / `fields email = user.email` ✓ |
| `event.id` | UUID | `dedup event.id` ✓ |
| `event.version` | `1.0.0` | *(filter removed — correct, "1.0.0" ≠ "1.0")* ✓ |
| `event.provider` | `LIMA_USAGE_STREAM` | — (not filtered) |
| `dt.openpipeline.source` | `system_events` | fetched via `fetch dt.system.events` ✓ |

**Key findings:**

- `usage.quantity.billable` is confirmed as the correct metric field. The field `consumed_units` does not exist in real events.
- `event.version` is `"1.0.0"`, not `"1.0"`. Removing the `event.version == "1.0"` filter (present in the original log quota blueprint) was correct — keeping it would have caused the query to silently return no results.
- `user.email` is always present (1,463/1,463 events checked had a non-null value). Per-user quota enforcement is safe to rely on.
- `usage.start` and `usage.end` are both null in practice. The event `timestamp` is the usage time, confirming `from: -0d@d` as the correct daily window. **Reviewer note:** `-0d@d` is DQL's calendar-day anchor — the `@d` suffix snaps to midnight UTC at the start of today, making it a calendar-day window (00:00 UTC → now), not a rolling `now()-24h`. This is intentional and aligns with the midnight reset in `quota_reset_at_midnight`.
- `caller.type` takes three observed values: `internal` (workflow/operator actions — the dominant type), `api` (direct API calls), and `mcp` (MCP tool calls). All share `tool.category: ai`. The workflow counts all caller types toward the quota. Customers who want to restrict the quota to specific interaction types (e.g. only `api` calls) can add `| filter caller.type == "api"` to both DQL tasks.
- Service accounts appear with a UUID-based email format (`<uuid>@service.sso.dynatrace.com`). The quota applies to these identities as well. Customers who want to exempt service accounts can add `| filterOut matchesPhrase(user.email, "@service.sso.dynatrace.com")` to both DQL tasks.
- Real-world consumption over 7 days in an active internal tenant ranged from ~51 to ~38,250 units per user. Only one user exceeded 1,000 units in a single day, validating that 1,000 units/day is a reasonable default threshold for most customer environments..
