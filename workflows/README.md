# 🔁 Workflows

Standalone [Dynatrace Automation](https://docs.dynatrace.com/docs/shortlink/automation-overview) workflows — solutions where the workflow itself is the whole point, not a supporting piece of a larger dashboard or blueprint.

**Before you add something here, check if it actually belongs elsewhere first.** A workflow that feeds a dashboard, powers a cost blueprint, or drives an agent should stay bundled with that primary artifact — see the [Also includes Workflows](#also-includes-workflows-primary-home-elsewhere) section below for examples already living that way. This folder is for workflows that stand on their own: nothing to import first, nothing else to view alongside them.

## What each example includes

- A **workflow export** (`workflow.json` or `workflow.yaml`) — the actual configuration, not just a description of it.
- A **contributor README** stating the trigger, required inputs/connections, and what the workflow does end-to-end.
- **Screenshot(s)** of the workflow and, where relevant, its output.

## How to use an example

Download the workflow file, open **Workflows** in your environment, and import it. See the [Workflows documentation](https://docs.dynatrace.com/docs/shortlink/automation-overview) if you run into issues. No environment yet? [Sign up](https://www.dynatrace.com/signup/playground/) and try the Dynatrace [playground](https://playground.apps.dynatrace.com/).

## Contributing

Follow the [repository standards](../STANDARDS.md) and the [quality bar](../CONTRIBUTING.md), and start from the [README template](../templates/EXAMPLE-README-template.md). **Dynatrace employees:** see the internal Community Examples & Solutions page for how to submit.

## Also includes Workflows (primary home elsewhere)

Solutions that contain a workflow but live in another folder, because their primary artifact is a dashboard, blueprint, or agent. The link points to each solution's real home.

- [Email Monthly Budgets Workflow](../cost-intelligence-blueprints/email-monthly-budgets-workflow/) — Cost Intelligence Blueprint + Workflow
- [Send Cost Events to Tenant Workflow](../cost-intelligence-blueprints/send-cost-events-to-tenant-workflow/) — Cost Intelligence Blueprint + Workflow
- [Set Quotas with Workflow](../cost-intelligence-blueprints/set-quotas-with-workflow/) — Cost Intelligence Blueprint + Workflow
- [CI/CD Pipeline Observability](../observability-blueprints/ci-cd-pipeline/) — Observability Blueprint + Workflow (Azure DevOps, GitLab, Jenkins variants)

*(See [STANDARDS.md §6](../STANDARDS.md#6-hybrid-solutions--cross-linking) for how cross-linking works.)*
