---
title: Kubernetes Misconfiguration Agent Trigger
category: Workflows
type: Workflow
also_includes: []
tags: [security, kubernetes, misconfigurations, compliance, sub-workflows, agentic-ai]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Kubernetes, Grail, DQL]
last_updated: 2026-10-20
---

# Kubernetes Misconfiguration Agent Trigger

Hand every critical Kubernetes workload misconfiguration to a remediation agent automatically, instead of working through compliance findings by hand.

## What it does

Every three hours, the workflow uses DQL to get the critical and high Kubernetes workload misconfiguration findings from the last three hours, optionally limited to one cluster. For each finding, it starts a sub-workflow (a "Kubernetes Operations Agent") and passes it:

- the Kubernetes object;
- the number of occurrences;
- the object type;
- the finding title;
- the compliance control.

That sub-workflow then suggests or applies fixes.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- Security posture management / compliance findings for Kubernetes in Grail
- A sub-workflow that processes one finding, for example an agentic AI workflow that suggests Kubernetes fixes. **It isn't included here.**

## Setup

1. Download [`trigger-kubernetes-operations-agent.workflow-template.yaml`](./trigger-kubernetes-operations-agent.workflow-template.yaml) and upload it in **Workflows**.
2. In `suggest_k8s_fixes`, select the sub-workflow that should handle each finding (`workflowId`).
3. Run it once manually, then activate the schedule. It's inactive by default.

## Configuration

- **Workflow inputs:**
  - `scope`: limits the query to a field and value, for example `k8s.cluster.name` = your cluster.
  - `interval`: defaults to 3 hours.
  - `severity`: defaults to `CRITICAL` and `HIGH`.
- **Schedule:** every 180 minutes, timezone `Europe/Vienna`. Change it to your timezone.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Kubernetes Threat Detection](../kubernetes-threat-detection/)
