---
title: AlienVault Threat Intelligence Analysis
category: Workflows
type: Workflow
also_includes: []
tags: [security, threat-intelligence, alienvault, otx, indicators-of-compromise, sub-workflows]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Grail]
last_updated: 2026-10-20
---

# AlienVault Threat Intelligence Analysis

Check whether the threats in your AlienVault OTX feed show up in your environment.

## What it does

This parent workflow gets the threat pulses you subscribe to in [AlienVault OTX](https://otx.alienvault.com/). It passes each pulse, with its indicators of compromise, to a sub-workflow of your choice, which checks your Dynatrace data for those indicators to assess your exposure.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- An AlienVault OTX account and API key
- `otx.alienvault.com` in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/)
- A sub-workflow that analyzes one pulse, for example by searching logs and network data in Grail for its indicators. **It isn't included here.**

## Setup

1. Download [`alienvault-pulses-analysis.workflow-template.yaml`](./alienvault-pulses-analysis.workflow-template.yaml) and upload it in **Workflows**.
2. In `get-alienvault-pulses`, add your AlienVault API key, for example as an `X-OTX-API-KEY` header from the credential vault.
3. In `analyze-alert`, select the sub-workflow that processes each pulse.
4. Run it manually, or add a schedule trigger.

## Configuration

- **Concurrency:** set to 1 in `analyze-alert`. Raise it if your sub-workflow can run in parallel.

## Notes & limitations

- The workflow's built-in guide repeats these steps inside the Workflows app.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.
