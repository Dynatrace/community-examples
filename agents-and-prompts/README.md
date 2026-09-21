# 🧠 Agents & Prompts

Templates and best practices for building agents that run natively on Dynatrace, plus ready-to-use prompts for concrete operations and FinOps use cases — usable directly in **Dynatrace Assist**, or externally via **Claude Code + dtctl**, **MCP**, or the **API**.

Each solution is self-contained in its own subfolder with a README explaining what it does, the files needed to import or run it, and (where relevant) sample output.

> Looking for agent integrations with third-party ecosystems instead (GitHub Copilot, Atlassian Rovo Dev, Kiro CLI)? See [`agentic-ecosystem/`](../agentic-ecosystem).

## Solutions

| Solution | What it does | Runs via |
|---|---|---|
| [`agentic-weekly-operations-report/`](./agentic-weekly-operations-report/) | Weekly workflow that compares this week's Davis problems against the week before and reports only what changed — not a fixed metrics template | Workflow + Agentic AI prompt task |
| [`chronic-problem-pattern-advisor/`](./chronic-problem-pattern-advisor/) | Ranks 30 days of chronic problem signatures by accumulated downtime and recommends FIX / TUNE / SUPPRESS for each, with the evidence needed to confirm the cause | Workflow + Agentic AI prompt task |
| [`cloud-cost-optimization-review/`](./cloud-cost-optimization-review/) | Analyses a tenant's Cloud Native Connection data for AWS/Azure idle resources and Kubernetes over-provisioning, and produces a customer-ready HTML savings report | Claude Code (dtctl) or Dynatrace Assist |
| [`create-postmortem/`](./create-postmortem/) | Finds yesterday's most costly resolved incident, drafts a postmortem with root-cause confidence and corrective actions, and builds a Dynatrace Notebook from it | Workflow + Agentic AI prompt task |

## Prerequisites shared across solutions

- The workflow-based solutions depend on `dynatrace.davis.workflow.actions` (Agentic AI prompt action) and may require Davis CoPilot / Agentic AI features enabled on your tenant.
- The `cloud-cost-optimization-review` prompts require the [Cloud Native Connection](https://docs.dynatrace.com/docs/shortlink/cloud-native-connection) and either `dtctl` + Claude Code, or access to Dynatrace Assist.

Each solution's own README covers full setup and configuration for that specific use case.

**Before contributing:** follow the [repository standards](../STANDARDS.md) and the [quality bar](../CONTRIBUTING.md), and start from the [README template](../templates/EXAMPLE-README-template.md).