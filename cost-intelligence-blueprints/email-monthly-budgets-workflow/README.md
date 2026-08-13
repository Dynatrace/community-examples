---
title: Email Monthly Cost Status
category: Blueprints
type: Blueprint
tags: [cost-intelligence, dps, budget-alerting, email, account-management-api]
capabilities: [Automation Workflows, Account Management API]
last_updated: 2026-08-03
---

# Email Monthly Cost Status

A Dynatrace Automation workflow that fetches month-to-date DPS costs from the Account Management API and sends a formatted email summary when spend reaches a configurable percentage of your monthly budget.

## What it does

1. Fetches current month costs from the Account Management API, broken down by environment and capability
2. Calculates spend as a percentage of your configured `MONTHLY_BUDGET`
3. Sends an email with a cost breakdown when the budget threshold condition is met

The email step is conditional - the threshold percentage is configured directly on the workflow step condition, not in the script. If month-to-date spend is below the threshold, the workflow completes without sending anything.

## The outcome you get
1. With cost data as part of the workflow, you can set up alerting tailored to your needs.
2. You can set multiple budget limits and distribute them across your organization.

## Potential further iterations
1. You can adjust budget, %, multi-alerting
2. You can adjust timeframe to extend beyond current month
3. You could break down the alerting further to capability or tenant level 
4. You could integrate the alerting into your preferred system for communication 
5. You could create tickets automatically

## Prerequisites

- An OAuth client with `account-uac-read` scope
- A Credential Vault entry named `DPS Budget Tracker OAuth`
- The `dynatrace.email` connector enabled in your environment

See [SETUP.md](SETUP.md) for step-by-step instructions.

## Email content

The email includes:

- Costs Total for the given month
- Cost breakdown by environment
- [Optional] - adjustable email text - Cost breakdown by capability

**Subject line example:** `DPS Cost Summary 2026-07 — 41,200.00 USD`
