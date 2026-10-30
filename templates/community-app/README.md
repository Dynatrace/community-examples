---
title: Sample Trace Explorer
category: Apps
type: App
also_includes: []
tags: [template, community-app]
capabilities: [AppEngine, Grail]
author: Your Name
contact: "@your.name (Slack)"
last_updated: 2026-10-30
---

# Sample Trace Explorer

Starter for a Dynatrace Community App: official `dt-app` project structure plus the shared community header, checks and CI.

> Start your own app from this folder:
> `npx degit Dynatrace/community-examples/templates/community-app my-app`
> (then create your own GitHub repo for it; your app's issues and code live there, not in `community-examples`).

## What it does

Replace this section: the problem your app solves, who it is for, and the value (2-4 sentences).

## Screenshots

Add at least one real screenshot: `![Overview](screenshot-01-overview.png)`

## Prerequisites

- Node.js 24 (App Toolkit requirement), npm
- A Dynatrace environment you can deploy to
- Permission scopes listed in `app.config.json` (each one is justified there)
- List any required Dynatrace apps, data sources or capabilities here

## Setup

1. Copy the template (see above) and create your own repo for your app.
2. Adapt names and repo link in one go:
   `npm run rename -- "My Tool" my.team.my.tool https://github.com/<org>/<repo>`
3. Set your environment URL locally in `app.config.json`
   (`https://{your-environment-id}.apps.dynatrace.com`). Do not commit a real tenant URL.
4. `npm install`, then `npm start` (opens the app against your environment).
5. Before every PR: `npm run check`.
6. Deploy to your own environment with `npm run deploy`.
7. To distribute to other environments via the Hub, email **community-apps@dynatrace.com** (app name, account name, tenant ID).

## Configuration

What users change for their environment (no hard-coded IDs or URLs). Document any settings here.

## Privacy

Does the app process or store personal data (PII)? What, why, and for how long. If none, say so.

## What the template gives you

| Area | What you get |
|------|--------------|
| Header | `CommunityHeader`: app name + tabs, **Community** chip with tooltip, help menu |
| Help menu | What's new, Get started, Documentation, Share feedback (in-product overlay), **Report issue** (GitHub issues), **About this app** (not-officially-supported notice) |
| Checks | `npm run check:repo` (naming, scopes, README, header guarantees, secrets and tenant URLs), ESLint (Strato imports, banned libraries, security rules, i18n warning), Vitest, CI on every PR |
| Docs | `CHECKLIST.md` (Must / Should), issue and PR templates |

```
app.config.json            app id, name, scopes (+ reasons)
ui/main.tsx                entry (AppRoot + router)
ui/app/App.tsx             layout + routes
ui/app/community.config.ts repoUrl -> Report issue target
ui/app/components/CommunityHeader.tsx   shared header (do not remove the community parts)
ui/app/pages/              Home, Data (DQL example with empty state)
scripts/                   check-repo.mjs, rename-app.mjs
.github/                   CI workflow, issue + PR templates
```

## Notes & limitations

- **Community chip position:** Strato's `AppHeader.Navigation` renders only the logo and tabs, so the chip sits in `AppHeader.ActionItems` (right side, next to the help menu), not next to the app name. Placing it beside the name needs a Strato change (for example a `community` release phase).
- **Share feedback** and **What's new** use the platform defaults (they call the Hub via intents), so they work once the app is deployed through the Hub.
- **Verified so far:** `npm install`, `npm run check:repo`, `npm run lint`, `npm test` (3 tests) and `npm run build` pass on Node 24 / Windows. `npm start` and `npm run deploy` still need a manual check against a real environment.
- `npm audit` reports vulnerabilities in transitive dependencies; review them (`npm audit`) before publishing. Do not use `npm audit fix --force` blindly.
- Community-built, not officially supported by Dynatrace.
- The default `repoUrl` points to `community-examples`; `npm run rename` sets it to your app's repo.
