---
title: ntfy.sh Push Notifications
category: Workflows
type: Workflow
also_includes: []
tags: [ntfy, push-notifications, http, notifications, getting-started]
verticals: []
capabilities: [Dynatrace Automation]
last_updated: 2026-10-20
---

# ntfy.sh Push Notifications

Send a push notification to your phone or desktop from any workflow, using a single HTTP request to [ntfy.sh](https://ntfy.sh).

## What it does

The template has one HTTP request task that posts a message to an ntfy.sh topic. Anyone subscribed to that topic in the ntfy app or web client receives the message as a push notification. Copy the task into your own workflows to notify on problems, deployments or workflow results.

## Screenshots

> **No screenshot available yet.** For screenshots, see the [ntfy.sh tile in Dynatrace Hub](https://www.dynatrace.com/hub/detail/ntfysh-push-notifications).

## Prerequisites

- Dynatrace SaaS with Workflows
- `ntfy.sh` (or your self-hosted ntfy server) in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/)
- The ntfy app, subscribed to your topic

## Setup

1. Download [`ntfy-push-notification.workflow-template.yaml`](./ntfy-push-notification.workflow-template.yaml) and upload it in **Workflows**.
2. Replace `YourTopicHere` in the URL with your topic name.
3. Choose **Run**. The message arrives on every subscribed device.

## Configuration

- **Topic URL:** `https://ntfy.sh/<your-topic>`. Topic names on the public server act like passwords, so choose one that's hard to guess.
- **Payload:** replace `Hi...` with your message, for example with Jinja expressions such as `{{ event()["event.name"] }}`.
- Add a trigger (a Davis problem, an event or a schedule) for automatic notifications.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.
