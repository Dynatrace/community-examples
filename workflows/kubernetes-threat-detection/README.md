---
title: Kubernetes Threat Detection
category: Workflows
type: Workflow
also_includes: []
tags: [security, kubernetes, threat-detection, service-accounts, slack, ms-teams, email, ownership, sub-workflows]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Kubernetes, Grail, DQL, Ownership]
last_updated: 2026-10-20
---

# Kubernetes Threat Detection

Detect suspicious activity in your clusters with DQL and alert the owners of the affected workloads immediately.

## What it does

- **Service account unauthorized access** (`service-account-unauthorized-access.workflow-template.yaml`) runs every 10 minutes. It uses DQL to find potentially compromised Kubernetes service accounts, filters them against an allow-list, and writes the results as detection findings to `security.events`. It's part of a [documented use case](https://dt-url.net/en230wg) and a starting point for other threat vectors: change the query, look up owners, or add response actions such as deleting pods.
- **Critical finding instant notification** (`critical-finding-instant-notification.workflow-template.yaml`) fires on every new high or critical Kubernetes detection finding. It finds the owners of the affected components and starts the notification sender.
- **Notification sender** (`notification-sender-sub-workflow.workflow-template.yaml`) is a sub-workflow that sends the finding details by email, Slack and/or Microsoft Teams, based on the input object it receives.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- Kubernetes audit logs in Grail, for service account detection (see the [use case documentation](https://dt-url.net/en230wg))
- Permission for the workflow to ingest into `security.events`
- Slack, Microsoft Teams and/or Email for Workflows, for notifications
- [Ownership](https://docs.dynatrace.com/docs/deliver/ownership) teams on your Kubernetes workloads

## Setup

1. In **Workflows**, choose **Upload** and import `notification-sender-sub-workflow.workflow-template.yaml` first. Assign the notification connections.
2. Import `critical-finding-instant-notification.workflow-template.yaml` and replace `<sub-workflow-id>` in `trigger_notification_sender` with the sender's ID.
3. Import `service-account-unauthorized-access.workflow-template.yaml`.
4. Run each one manually once, then activate the triggers.

## Configuration

- **Allow-list** of expected service accounts in `apply_allowlist`.
- **Detection query and interval** in `execute_query`.
- **Channels and recipients** in the notification sender.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository. An environment-specific sub-workflow ID was replaced with the `<sub-workflow-id>` placeholder.

## Related solutions

- [Kubernetes Misconfiguration Agent Trigger](../kubernetes-misconfiguration-agent-trigger/)
- [Kubernetes Stuck Pod Cleanup](../kubernetes-stuck-pod-cleanup/)
