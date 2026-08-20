---
title: Extract usage data via CLI with dtctl
category: Blueprints
type: Blueprint
tags: [cost-intelligence, dps, budget-alerting, cli, dtctl]
capabilities: [DQL, CLI]
last_updated: 2026-08-20
---

# CLI based cost data with dtctl

Fetches DPS usage data from the tenant and output its in a format preferred (json, csv or other)

## What it does

1. Connect your Dynatrace platform with on command
2. Executes a given DQL right out of the terminal
3. Exports output directly in a given format

## The outcome you get
1. A file you can further use in your FinOps Tools
2. A way to automate usage data in your own system.

## Prerequisites

- 

See [SETUP.md](SETUP.md) for step-by-step instructions.
