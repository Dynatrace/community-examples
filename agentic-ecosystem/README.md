# ✨ Agentic Ecosystem
Agent definitions and configurations on how to integrate Dynatrace with  third-party agent ecosystems and CI/CD platforms. Each solution is its own subfolder with a README, screenshot(s), and the agent/workflow files.

> Looking for agents and prompts that run natively on Dynatrace (Assist, Claude Code + dtctl, MCP, API) instead? See [`agents-and-prompts/`](../agents-and-prompts).


## Solutions
| Solution | What it does |
|---|---|
|[atlassian-rovo-dev-security-agent](./atlassian-rovo-dev-security-agent/) | Rovo Dev agent that turns Dynatrace critical vulnerability findings into triaged Jira tickets |
|[github-custom-agent](./github-custom-agent/) | Custom GitHub Copilot agent configuration for Dynatrace-aware code assistance |
|[github-dependabot-alert-triaging](./github-dependabot-alert-triaging/) | GitHub Actions workflows that verify Dependabot alerts against Dynatrace runtime data and assign triaged issues to Copilot |
|[kiro-cli-security-agent](./kiro-cli-security-agent/) | Kiro CLI agent that triages AWS Security Hub findings using Dynatrace security context |
|[kiro-power](./kiro-power/) | Kiro agent power-up that adds Dynatrace observability context to Kiro's coding workflows |

**Before contributing:** follow the [repository standards](../STANDARDS.md) and the [quality bar](../CONTRIBUTING.md), and start from the [README template](../templates/EXAMPLE-README-template.md).

