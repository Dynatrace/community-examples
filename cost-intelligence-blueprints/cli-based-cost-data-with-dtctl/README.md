---
title: Extract usage data via CLI with dtctl
category: Blueprints
type: Blueprint
tags: [cost-intelligence, dps, budget-alerting, cli, dtctl]
capabilities: [DQL, CLI]
last_updated: 2026-08-20
---

# CLI-based cost data with dtctl

Fetches DPS usage data from your tenant and outputs it in your preferred format (JSON, CSV, or others).

## What it does

1. Connects to your Dynatrace platform with one command
2. Executes a given DQL query directly from the terminal
3. Exports output in a given format

## The outcome you get
1. A file you can further use in your FinOps tools
2. A repeatable, scriptable way to pull usage data into your own systems

## Potential further iterations
1. Schedule the export as a cron job for automated periodic pulls
2. Pipe the output into a FinOps platform, data lake, or spreadsheet
3. Extend the DQL query to filter by cost center, capability, or environment
4. Chain multiple queries to produce a combined cost report

## Prerequisites

- [dtctl](https://github.com/dynatrace-oss/dtctl) installed
- A Dynatrace environment URL (e.g. `https://abc12345.apps.dynatrace.com`)

See [SETUP.md](SETUP.md) for step-by-step instructions.
