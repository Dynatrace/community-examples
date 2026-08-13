# Atlassian Rovo Dev Security Agent

A security agent configuration for [Atlassian Rovo Dev](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) that integrates Dynatrace runtime security verification with Jira ticket management.

## Contents

| File | Description |
|------|-------------|
| `dynatrace-security-agent.md` | Agent instructions for security finding verification and Jira integration |
| `create-jira-tickets-for-rva-critical-vulnerabilities.yaml` | Dynatrace Workflow template that triggers Jira ticket creation for critical RVA vulnerabilities |

## What this agent does

- **Verifies security findings** against Dynatrace runtime context (RVA, RAP, Smartscape)
- **Creates Jira tickets** for confirmed vulnerabilities with remediation guidance
- **Closes/deprioritizes tickets** for findings not affecting production

## Setup

### 1. Configure MCP servers in Rovo Dev

Add the Dynatrace and Atlassian MCP servers to your Rovo Dev configuration (`~/.rovodev/mcp.json`):

```json
{
  "mcpServers": {
    "dynatrace": {
      "type": "http",
      "url": "https://<DYNATRACE_TENANT>/platform-reserved/mcp-gateway/v0.1/servers/dynatrace-mcp/mcp",
      "headers": {
        "Authorization": "Bearer <DYNATRACE_PLATFORM_TOKEN>"
      }
    },
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/sse"
    }
  }
}
```

### 2. Use the agent instructions

You can use the agent in two ways:

**Option A: Project-level subagent (recommended for teams)**  
Place `dynatrace-security-agent.md` in your repository's `.rovodev/subagents/` directory. This makes it available to all team members working on that project.

**Option B: User-level subagent**  
Copy `dynatrace-security-agent.md` to `~/.rovodev/subagents/` to make it available across all your projects.

Then invoke it with `/subagents` or let Rovo Dev delegate to it automatically based on the task.

### 3. (Optional) Deploy the Dynatrace Workflow

Import `create-jira-tickets-for-rva-critical-vulnerabilities.yaml` into Dynatrace as a workflow template to automatically trigger Jira ticket creation when critical vulnerabilities are detected.

## Documentation

- [Use subagents in Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-subagents-in-rovo-dev-cli/)
- [Rovo Dev and MCP](https://support.atlassian.com/rovo/docs/rovo-dev-and-model-context-protocol-mcp/)
- [Connect to an MCP server in Rovo Dev CLI](https://support.atlassian.com/rovo/docs/connect-to-an-mcp-server-in-rovo-dev-cli/)
- [Atlassian Rovo MCP Server](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/use-atlassian-rovo-mcp-server/)
- [Dynatrace Runtime Vulnerability Analytics](https://docs.dynatrace.com/docs/shortlink/vulnerability-analytics)
