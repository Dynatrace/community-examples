---
title: Email Entity Owner Notification
category: Workflows
type: Workflow
also_includes: []
tags: [email, ownership, notifications, logs]
verticals: []
capabilities: [Dynatrace Automation, Ownership, Grail, DQL, Logs]
last_updated: 2026-10-20
---

# Email Entity Owner Notification

Email the owners of an affected entity, with recent log lines, as soon as an event hits it.

## What it does

When a matching event arrives, the workflow fetches the related logs with DQL, looks up the entity's owners through Dynatrace ownership, and sends them an email that includes the log lines. It's a minimal starting point for owner-targeted email notifications.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- [Email for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/email) (the workflow actor needs `email:emails:send`)
- [Ownership](https://docs.dynatrace.com/docs/deliver/ownership) teams with email contacts assigned to your entities

## Setup

1. Download [`email-entity-owner-notification.workflow-template.yaml`](./email-entity-owner-notification.workflow-template.yaml).
2. In **Workflows**, choose **Upload** and select the file.
3. Adjust the trigger (see Configuration) and activate the workflow.

## Configuration

- **Trigger:** the event filter matches one placeholder host (`HOST-XXXXXXXXXXXXXXXX`). Replace it with your own filter. Also check the field name: the template uses `affected_entitiy.id`, which you will probably want to change to a field your events have, for example `dt.entity.host` or `affected_entity_ids`.
- **Environment URL:** replace `https://<your-environment-id>.apps.dynatrace.com`.
- **Email content:** subject and body in `send_email`.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Jira and Slack Targeted Notifications](../jira-slack-targeted-notifications/)
