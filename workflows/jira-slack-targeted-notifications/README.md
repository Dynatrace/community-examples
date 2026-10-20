---
title: Jira and Slack Targeted Notifications
category: Workflows
type: Workflow
also_includes: []
tags: [jira, slack, ownership, notifications, incident-management, logs]
verticals: []
capabilities: [Dynatrace Automation, Ownership, Grail, DQL, Logs]
last_updated: 2026-10-20
---

# Jira and Slack Targeted Notifications

Send each issue to the team that owns the affected entity, with the relevant logs attached, instead of one shared channel for everyone.

## What it does

When a matching Davis event arrives, the workflow fetches the related logs with DQL and looks up the owning team of the affected entity through Dynatrace ownership. It then creates a Jira issue and posts a Slack message, both targeted at that team and enriched with the log lines.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- [Jira for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/jira) and [Slack for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/slack), each with a connection
- [Ownership](https://docs.dynatrace.com/docs/deliver/ownership) teams assigned to your entities
- Logs in Grail for the entities you monitor

## Setup

1. Download [`jira-slack-targeted-notifications.workflow.json`](./jira-slack-targeted-notifications.workflow.json).
2. Import it in **Workflows** (upload the file) or with the [Automation API](../workflow-import-export-api/).
3. Select your Jira and Slack connections in the `create_jira_issue` and `send_message_to_dyn_channel` tasks.
4. Activate the trigger.

## Configuration

- **Trigger:** the event filter matches `CUSTOM_INFO` Davis events for one host (`HOST-XXXXXXXXXXX`). Replace it with the entities or event types you want to cover.
- **Jira:** set the project, issue type and fields in `create_jira_issue`.
- **Slack:** set the channel in `send_message_to_dyn_channel`, or map it from the ownership result.

## Notes & limitations

- The file is a JSON workflow export (API format).
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Email Entity Owner Notification](../email-entity-owner-notification/)
- [ServiceNow Incident Management](../servicenow-incident-management/)
