# Dynatrace Platform Adoption

## Overview
The **Dynatrace Platform Adoption Dashboard** gives platform owners and administrators a real-time view of how their Dynatrace environment is actually being used — who's active, which apps and capabilities are gaining traction, and how adoption is trending over time.

All metrics are powered by Grail audit telemetry and exclude system accounts and internal services, so you see real human usage.

![Platform adoption overview](Screenshot%201.png)
![Platform apps and 3rd-generation adoption](Screenshot%202.png)

## 🎯 Purpose & audience
Built for platform owners, Dynatrace administrators, and Center-of-Excellence teams who want to:
- Drive and measure platform adoption across their organization
- Spot power users, at-risk users, and churn
- Track migration from Classic to 3rd-generation (Gen3) apps
- Report adoption progress to stakeholders

## 📊 What you'll see
- **Adoption KPIs** — Active Users, Stickiness (DAU/MAU), Total Sessions, Session Depth, and a Maturity Score
- **User lifecycle cohorts** — New, Active, At-Risk, and Churned, plus returning and dormant users
- **App-level usage** — top apps by page views, unique users, and sessions; a feature usage map; and read-vs-write balance per app
- **Gen3 adoption** — adoption rate and a Classic vs Gen3 vs Hybrid breakdown to identify migration candidates
- **Activity patterns** — daily, weekly, and hourly activity; human vs automation; and activity by source
- **DQL, data & automation** — query volume, data consumption, workflow execution health, and Davis Copilot / AI-agent usage
- **Davis AI narrative** — an auto-generated adoption report summarizing trends, top users, trending and fading apps, and recommended next steps for the last 30 days

## ✅ Prerequisites
- A Dynatrace (Gen3) environment with **Grail**
- The **Dashboards** app
- Permission to query audit telemetry (`dt.system.events`, `AUDIT_EVENT`)
- Default time range: last 30 days

## 🚀 How to import
1. Open the **Dashboards** app in your Dynatrace environment.
2. Use **Upload** to import `Dynatrace Platform Adoption.json`.
3. That's it — the dashboard reads your own environment's audit telemetry live. There are no hard-coded IDs or environment-specific settings, so it works out of the box.

## 🔗 Origin
Originally part of [dynatrace-oss/CustomerSuccess](https://github.com/dynatrace-oss/CustomerSuccess).

## 🗒️ Changelog
- **v1.2.0** — Current release.

---
> ℹ️ Community examples are not officially maintained by Dynatrace. Questions? Find us on Slack in **#help-community-examples**.
