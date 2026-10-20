---
title: Vulnerable Products to Jira
category: Workflows
type: Workflow
also_includes: []
tags: [security, vulnerabilities, jira, release-monitoring, deduplication, ownership, sub-workflows]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Runtime Vulnerability Analytics, Grail, DQL, Ownership]
last_updated: 2026-10-20
---

# Vulnerable Products to Jira

One Jira ticket per vulnerability per product, not one per process, so teams get a de-duplicated backlog they can actually work through.

## What it does

The solution combines security events in Grail with release monitoring to group open vulnerabilities by product, and keeps them in sync with Jira:

- **AppSec Trigger** (`appsec-trigger.workflow-template.yaml`) runs every 30 minutes. It queries open vulnerabilities from `security.events` and starts the sub-workflow once per product and vulnerability.
- **AppSec Ticket Creation** (`appsec-ticket-creation-sub-workflow.workflow-template.yaml`) checks whether a Jira ticket already exists. If not, it finds the owner and creates the ticket with a tracking link back to Dynatrace.

This was demonstrated in the Automation Guild session on 27 May 2024 ([recordings](https://community.dynatrace.com/t5/Automation-Guild/All-Guild-Meetings-recordings-in-this-single-spot/td-p/243437)).

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows and Runtime Vulnerability Analytics
- Release monitoring (product and version information) for your processes
- [Jira for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/jira) with a connection
- [Ownership](https://docs.dynatrace.com/docs/deliver/ownership) teams on your entities

## Setup

1. In **Workflows**, choose **Upload** and import the sub-workflow `appsec-ticket-creation-sub-workflow.workflow-template.yaml` **first**. Assign the Jira connection.
2. Copy the new sub-workflow's ID.
3. Import `appsec-trigger.workflow-template.yaml` and replace `<sub-workflow-id>` with that ID.
4. Run the trigger once manually, then activate the schedule.

## Configuration

- **`<jira-base-url>`** in the sub-workflow: your Jira URL, so the tracking links in Dynatrace work.
- **`https://<link-to-your-internal-guide>`** in the ticket template: a page that explains how teams set the product tag, or remove the line.
- **Jira project, issue type and fields** in `create_jira_issue`.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Critical Vulnerability Notifications and Tickets](../vulnerability-notifications/)
