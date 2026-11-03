---
title: Sample Trace Explorer
category: Apps
type: App
also_includes: []
tags: [template, community-app]
capabilities: [AppEngine, Grail]
author: Your Name
contact: "@your.name (Slack)"
last_updated: 2026-11-03
---

# Sample Trace Explorer

Starter for a Dynatrace Community App: official `dt-app` project structure plus a shared community header.
Use all of it, or only the header (see "Use only what you need").

## Getting started

1. Copy the template: `npx degit Dynatrace/community-examples/templates/community-app my-app`, then create your own GitHub repo for your app.
2. Adapt names and repo link in one go:
   `npm run rename -- "My Tool" my.team.my.tool https://github.com/<org>/<repo>`
3. Set your environment URL locally in `app.config.json` (`https://{your-environment-id}.apps.dynatrace.com`). Do not commit a real tenant URL.
4. Requires Node.js 24. Run `npm install`, then `npm start` (opens the app against your environment).
5. Optional before a PR: `npm run check`.
6. Deploy to your own environment with `npm run deploy`.
7. To distribute to other environments via the Hub, email **community-apps@dynatrace.com** (app name, account name, tenant ID).

## Use only what you need

| Piece | What it is | Needed? |
|-------|-----------|---------|
| `CommunityHeader` + `community.config.ts` | "By Community" chip, help menu with Documentation, Report issue, About notice | Yes. Copy into any app: see `ADD-TO-EXISTING-APP.md` |
| `CHECKLIST.md` | Must / think-about list | Short read |
| `scripts/check-repo.mjs` (+ CI) | Any app: scopes with reasons, secrets / tenant URLs. If the header is present: header guarantees, repoUrl | Optional |
| Rest of the template | Official `dt-app` layout, sample pages, lint, tests | Optional |

Help menu: What's new, **Documentation**, **Report issue** (the app's GitHub issues), **About this app** (not-officially-supported notice).

## What it does

Replace this section: the problem your app solves, who it is for, and the value (2-4 sentences).

## Documentation

Link your docs here. This is the target of the **Documentation** entry in the help menu (`documentationUrl`). Describe what users need to configure for their environment (no hard-coded IDs or URLs).

## Privacy

Does the app process or store personal data? What, why, and for how long. If none, say so.

## Project layout

```
app.config.json            app id, name, scopes (+ reasons)
ui/main.tsx                entry (AppRoot + router)
ui/app/App.tsx             layout + routes
ui/app/community.config.ts repoUrl -> Report issue target
ui/app/components/CommunityHeader.tsx   shared header
ui/app/pages/              Home, Data (DQL example with empty state)
scripts/                   check-repo.mjs, rename-app.mjs
.github/                   CI workflow, issue + PR templates
```

## Notes

- **Community chip:** Strato's logo can show a release-phase chip next to the app name, but only for preview / new / early access / deprecated. The header reuses that chip and overrides its label to "By Community" through a react-intl message (`COMMUNITY_CHIP_OVERRIDE_ID` in `CommunityHeader.tsx`). A test fails if a Strato update changes the message id. A native Strato option for community apps would replace this workaround.
- **What's new** uses the platform default (it calls the Hub via an intent), so it works once the app is deployed through the Hub.
- Verified so far: `npm install`, `check:repo`, `lint`, `test` and `build` pass on Node 24 (Windows), and the app runs with `npm start` against a real environment.
- `npm audit` reports findings in transitive dependencies. Review them before publishing; don't use `npm audit fix --force` blindly.
- Community-built, not officially supported by Dynatrace.
