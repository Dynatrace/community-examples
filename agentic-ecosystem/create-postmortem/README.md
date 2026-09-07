---
title: Create Postmortem
category: Agentic
type: Agent
also_includes: []
tags: [agentic-ai, workflow, postmortem, incident-management, notebooks, davis-problems, email]
verticals: []
capabilities: [Dynatrace Automation, Agentic AI, Grail, DQL, Davis Problems, Notebooks, Email]
last_updated: 2026-08-21
---

# Create Postmortem

Stop starting the postmortem from a blank page three days late. This workflow finds yesterday's most costly resolved incident, drafts the postmortem, and builds a Dynatrace Notebook with the narrative plus supporting charts — every morning, automatically.

## What it does

Daily, this workflow queries `dt.davis.problems` for the most costly incidents resolved in the last three days and how often the same problem signature has occurred in the last 30 days, then hands both result sets to an agentic AI prompt task that drafts the postmortem: timeline, impact, a likely root cause with a stated confidence level, and owner-tagged corrective actions. It also renders a verdict on whether the incident was a one-off or the latest instance of a chronic pattern.

The draft, a problem link, and supporting charts are assembled into a Dynatrace Notebook, and only the notebook link is emailed out — not the full text — so the recipient opens the notebook to review and edit it in place.

[Watch it run](https://video.dynatrace.com/watch/kJcCZ9mEAwfiaVdL2oxnFt)

> Questions or issues with this example? Open a [GitHub issue](../../issues) or ask in **#help-community-examples** on Slack.

## Screenshots

> ⚠️ **No screenshot available yet.** None of the source material for this example (announcement deck, workflow export) included one. Import the workflow, let it run once, and add a screenshot of the resulting Notebook here before this is fully STANDARDS-compliant.

## Prerequisites

- Dynatrace tenant with Davis problems being generated (any monitored environment)
- Apps: `dynatrace.automations` (Workflows), `dynatrace.davis.workflow.actions` (Agentic AI prompt action), `dynatrace.email`
- An email connection configured for the `dynatrace.email:send-email` action
- Notebooks app available in the tenant (for the generated postmortem document)

## Setup

1. Download `create-postmortem.workflow-template.yaml`.
2. In your Dynatrace environment, open **Workflows** → **Create workflow** → **Upload YAML** (or the `...` menu → **Import**) and select the file.
3. Open the `mail_link` task and set the actual **to** recipients (the template ships with empty `to`/`cc`/`bcc`).
4. Review the schedule (`30 6 * * *`, daily 06:30 Europe/Vienna) and adjust the cron/timezone if needed.
5. Enable the workflow.

## Configuration

- **Recipients:** set in the `mail_link` task's `to`/`cc`/`bcc` fields.
- **Schedule:** the `trigger.schedule` block — default is daily, 06:30, `Europe/Vienna`.
- **"Most costly" definition and lookback:** the `worst_incident` task's DQL defines the incident-selection window (last three days) and what "costly" means for ranking — adjust if your team wants a different window or a different cost measure.
- **Chronic-pattern check:** the `prior_occurrences` task's 30-day lookback decides the one-off-vs-chronic verdict — tune this window to match your environment's incident cadence.
- **Postmortem structure and confidence language:** the `draft` task's prompt controls the postmortem's sections, tone, and how confidence in the root cause is expressed — edit to match your team's postmortem template.
- **Notebook layout:** the `create_notebook` task assembles the narrative, problem link, and supporting charts — adjust if you want additional panels or a different layout.

## Notes & limitations

- Depends on `dynatrace.davis.workflow.actions` (Agentic AI prompt action), which may require your tenant to have Davis CoPilot / Agentic AI features enabled.
- The draft is generated automatically but is not a substitute for a human review pass — treat it as a first draft, particularly the stated root-cause confidence level.
- Only runs against incidents that have already resolved; it does not draft anything for problems still open.

## Related solutions

- [agentic-weekly-operations-report/](../agentic-weekly-operations-report/) — same agentic-report pattern, applied to a week-over-week operations summary
- [chronic-problem-pattern-advisor/](../chronic-problem-pattern-advisor/) — 30-day chronic problem review with FIX/TUNE/SUPPRESS recommendations
