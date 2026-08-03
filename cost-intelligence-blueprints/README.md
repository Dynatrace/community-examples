# 💰 Cost Intelligence Blueprints

End-to-end solutions for DPS cost visibility, budget alerting, and cost optimization — combining the Account Management API, Dynatrace Automation workflows, and business events ingested into Grail.

Each blueprint is self-contained in its own subfolder with a README explaining what it does and a SETUP.md with step-by-step instructions.

## Blueprints

| Blueprint | What it does |
|---|---|
| [`send-cost-events-to-tenant-workflow/`](./send-cost-events-to-tenant-workflow/) | Daily workflow that ingests yesterday's DPS costs as business events into Grail for trend analysis, dashboards, and alerting |
| [`email-monthly-budgets-workflow/`](./email-monthly-budgets-workflow/) | Monthly workflow that sends a cost summary email when spend crosses a configurable budget threshold |
| [`example-script-for-cost-api-data/`](./example-script-for-cost-api-data/) | Local Python script for on-demand cost exploration — prints a summary, checks budget, optionally sends business events to your tenant, and includes an example dashboard template |

## Prerequisites shared across blueprints

All blueprints authenticate against the Account Management API using OAuth 2.0 client credentials. You will need:

- An OAuth client with `account-uac-read` scope, created at `account.dynatrace.com`
- Your **Account UUID** (visible in the Account Management URL)

Each blueprint's SETUP.md covers the full setup for that specific blueprint.

**Before contributing:** follow the [repository standards](../STANDARDS.md) and the [quality bar](../CONTRIBUTING.md).
