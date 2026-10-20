---
title: Workflow JavaScript Snippets
category: Workflows
type: Workflow
also_includes: []
tags: [javascript, sdk, kubernetes, synthetic, smartscape, snippets]
verticals: []
capabilities: [Dynatrace Automation, Kubernetes, Synthetic Monitoring, Smartscape]
last_updated: 2026-10-20
---

# Workflow JavaScript Snippets

Ready-to-paste code for the **Run JavaScript** action, for tasks that the built-in actions don't cover.

## What it does

| Snippet | What it does |
|---|---|
| [`get-k8s-connection-by-cluster-uid.js`](./get-k8s-connection-by-cluster-uid.js) | Finds the Kubernetes connection (`dynatrace.kubernetes.connector`) that matches the `k8s.cluster.uid` of the triggering event. Use the result as the *Connection* of Kubernetes Automation actions, so one workflow works across clusters. Needs the `settings:objects:read` scope. |
| [`trigger-synthetic-monitor.js`](./trigger-synthetic-monitor.js) | Runs a synthetic monitor on demand and returns the execution, for example to verify a fix after a remediation. |
| [`traverse-smartscape.js`](./traverse-smartscape.js) | Finds the service tagged with a value from the trigger event and returns its calling services from Smartscape, for example to notify upstream owners. |

## Screenshots

> **No screenshot available yet.** These are code snippets, not complete workflows. A screenshot of a snippet in a JavaScript task would help, so please add one in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- The permissions that each snippet's SDK calls need, for example `settings:objects:read` for settings, and the permissions to read entities and run synthetic monitors

## Setup

1. In your workflow, add a task and choose **Run JavaScript**.
2. Paste the snippet into the task.
3. Run the workflow and check the task result.

## Configuration

- `trigger-synthetic-monitor.js`: replace `HTTP_CHECK-XXXXXXXXXXXXXXXX` with your monitor ID.
- `traverse-smartscape.js`: expects a `tag.service` field on the trigger event.
- `get-k8s-connection-by-cluster-uid.js`: expects `k8s.cluster.uid` on the trigger event.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Kubernetes Stuck Pod Cleanup](../kubernetes-stuck-pod-cleanup/)
- [DQL Result Conditional Branches](../dql-result-conditional-branches/)
