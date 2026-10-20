---
title: VM Right-Sizing Workflows
category: Workflows
type: Workflow
also_includes: []
tags: [azure, right-sizing, cost-optimization, jira, slack, approval]
verticals: []
capabilities: [Dynatrace Automation, Grail, DQL, Infrastructure Monitoring]
last_updated: 2026-10-20
---

# VM Right-Sizing Workflows

Detect over- and under-sized Azure VMs, get a human approval in Jira, then resize them automatically.

## What it does

This solution has two workflows that work together through Jira:

1. **Host Resize - Calculate & Ticket** (`host-resize-calculate-and-ticket.workflow.json`)
   - Uses DQL to find Azure hosts whose CPU usage is above 90% or below 15%.
   - Opens a Jira ticket that lists those hosts and moves it to *Pending*.
   - Notifies a Slack channel.
2. **Host Resize - Event Triggered** (`host-resize-event-triggered.workflow.json`)
   - Reacts to the approval event that a Jira automation sends back to Dynatrace.
   - Reads the hosts from the ticket and gets an Azure bearer token.
   - Calls the Azure Compute API to upsize or downsize each VM, then closes the Jira ticket.

These are the plain workflow exports for direct import. A Monaco version of the same use case that also deploys the Jira and Slack connections lives in [VM Right-Sizing (Configuration as Code)](../../configuration-as-code/VM-RIght-Sizing/). That README also explains the Jira automation setup in detail.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows, and Azure VMs monitored by OneAgent. The hosts need Azure subscription and resource group metadata.
- [Jira for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/jira) and [Slack for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/slack) connections
- An Azure app registration (service principal) with permission to resize the VMs
- `login.microsoftonline.com` and `management.azure.com` in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/)
- A Jira automation that sends an event to Dynatrace when the ticket is approved

## Setup

1. Import both JSON files in **Workflows** (upload) or with the [Automation API](../workflow-import-export-api/).
2. In each Jira and Slack task, select your connections. The connection IDs were removed from the export.
3. In Jira, create the approval automation. When an issue moves from *Open* to *Pending*, approve it (or let a team approve it), then send a web request to `https://<your-environment-id>.apps.dynatrace.com/api/v2/events/ingest` with a `CUSTOM_INFO` event. That event carries the issue key, URL, ID and description, as shown in the [Configuration as Code README](../../configuration-as-code/VM-RIght-Sizing/).
4. Set the event trigger of **Host Resize - Event Triggered** to match that event.

## Configuration

- **Azure credentials:** in `obtain_bearer_token`, replace `<azure-tenant-id>`, `<azure-client-id>` and `<azure-client-secret>`. Store the secret in the Dynatrace credential vault instead of plain text in the workflow.
- **Thresholds:** the 90% / 15% CPU limits in the `get_cpu` query.
- **Jira project, issue type and transitions** in the Jira tasks.

## Notes & limitations

- The workflows change the size of production VMs. Keep the human approval step.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository. Hard-coded credentials and connection IDs were replaced with placeholders.
- Background: [Dynatrace Tips & Tricks episode](https://youtu.be/dGWlnd1lNGQ).

## Related solutions

- [VM Right-Sizing (Configuration as Code)](../../configuration-as-code/VM-RIght-Sizing/)
