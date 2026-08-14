# Audit Logs Viewer — Dynatrace App

View, search, and quickly filter **audit logs** across your Dynatrace environment — both modern platform audit logs (via Grail) and classic API-based audit logs — in a single unified interface.

---

## ✨ Features

- **Unified audit log view**: combines Grail-based platform audit logs and legacy environment API audit logs in one place.
- **Filter bar**: filter by timeframe, user, event type, category, and more.
- **User enrichment**: resolves user IDs to human-readable names and emails via the IAM service.
- **Bucket-aware**: reads from the correct Grail storage buckets automatically.

---

## 🚀 Install the app on the Dynatrace platform

*Audit Logs Viewer is available as a Dynatrace app to all customers upon request.*

1. *Audit Logs Viewer* is delivered via a [Hub subscription](https://docs.dynatrace.com/docs/shortlink/hub#add-subscription). Email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with your account name and tenant ID, as described [here](https://github.com/Dynatrace/community-examples/blob/main/dynatrace-apps/README.md).
2. We'll process your request and send instructions for subscribing to the channel and installing the app.
3. After installation, open **Hub**, search for **Audit Logs Viewer**, and install it.

### Required scopes

The user installing and running the app needs the following permissions granted:

| Scope | Purpose |
|---|---|
| `storage:logs:read` | Access Grail log storage |
| `storage:buckets:read` | Access Grail buckets |
| `storage:system:read` | Read system tables for audit logs |
| `environment-api:audit-logs:read` | Read classic audit logs from the environment API |
| `iam:users:read` | Resolve user names and emails from IAM |
| `app-engine:apps:run` | Run the app |
| `app-engine:functions:run` | Run serverless functions |

---

## 🖥️ Using the App

1. Open **Audit Logs Viewer** from the Dynatrace Hub or app launcher.
2. Use the **filter bar** at the top to narrow results by timeframe, user, event type, or category.
3. Results from both Grail and the classic audit log API are merged and displayed in the table.
4. Click any row to expand full event details.

---

## 🔗 Source

- **GitHub**: [dynatrace-apps/community.audit.logs](https://github.com/dynatrace-apps/community.audit.logs)
- **App ID**: `community.audit.logs`
