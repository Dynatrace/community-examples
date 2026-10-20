---
title: External Security Findings Notifications
category: Workflows
type: Workflow
also_includes: []
tags: [security, vulnerabilities, third-party, qualys, container-security, jira, slack, email]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Grail, DQL]
last_updated: 2026-10-20
---

# External Security Findings Notifications

Turn vulnerability findings from third-party scanners into Jira tickets, Slack messages or emails, and focus on the ones that actually affect hosts Dynatrace monitors.

## What it does

These workflows act on vulnerability findings that third-party tools ingest into Dynatrace:

| Workflow | What it does | Trigger |
|---|---|---|
| `create-jira-ticket-for-verified-host-vulnerabilities` | Jira ticket for critical and high findings on hosts that Dynatrace confirms it monitors. Skips findings that already have a ticket | Per finding event |
| `jira-tickets-for-critical-vulnerabilities` | Jira ticket for new critical findings, grouped by object | Daily 08:00 |
| `jira-tickets-for-critical-container-vulnerabilities` | Jira ticket for new critical container vulnerability findings | Daily 08:00 |
| `slack-notifications-for-critical-vulnerabilities` | Slack message for new critical findings, grouped by object | Daily 08:00 |
| `slack-notifications-for-critical-container-vulnerabilities` | Slack message for new critical container vulnerability findings | Daily 08:00 |
| `email-for-critical-security-findings` | Email for new critical findings, grouped by object | Daily 08:00 |

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- Vulnerability findings from a third-party tool in the `security.events` table. The verified-host example uses Qualys data.
- A connection for Jira or Slack for Workflows, or Email for Workflows

## Setup

1. Download the workflow template(s) you need.
2. In **Workflows**, choose **Upload**, select the file and assign the connection.
3. Run it once manually, then activate the trigger.

## Configuration

- **Jira project and issue type, Slack channel, and email recipients.**
- **Severity and time window** in the DQL queries.
- `create-jira-ticket-for-verified-host-vulnerabilities` contains an example finding (Qualys, with a placeholder host ID) used as sample data. Replace the provider filter if you use another scanner.

## Notes & limitations

- **The five daily-schedule workflows are no longer maintained.** Since the Grail security table was introduced, up-to-date artifacts ship in the product through new integrations. These samples are kept for reference and may become outdated. See the [migration guide](https://docs.dynatrace.com/docs/secure/threat-observability/migration).
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Critical Vulnerability Notifications and Tickets](../vulnerability-notifications/), for vulnerabilities detected by Dynatrace itself
