---
title: Ownership Team Import
category: Workflows
type: Workflow
also_includes: []
tags: [ownership, teams, entra-id, azure, servicenow, settings]
verticals: []
capabilities: [Dynatrace Automation, Ownership, Settings]
last_updated: 2026-10-20
---

# Ownership Team Import

Keep Dynatrace ownership teams in sync with the team data you already maintain elsewhere, instead of creating them by hand.

## What it does

Three workflows import [ownership teams](https://docs.dynatrace.com/docs/manage/ownership/ownership-teams#import-teams) into Dynatrace with the `import_teams` action:

- **From Microsoft Entra ID** (`import-teams-from-entra-id.workflow-template.yaml`) gets groups with [Azure for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/microsoft-entra-id) and imports them as teams. It runs every 720 minutes.
- **From ServiceNow** (`import-teams-from-servicenow.workflow-template.yaml`) gets groups with [ServiceNow for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/service-now) and imports them as teams. It runs every 720 minutes.
- **From a custom source** (`import-teams-from-custom-source.workflow-template.yaml`) downloads a team file in a custom format, maps it to the `builtin:ownership.config` [settings schema](https://docs.dynatrace.com/docs/dynatrace-api/environment-api/settings/schemas/get-schema), and imports the teams. It runs on demand. [`example-teams.json`](./example-teams.json) is the sample input.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows and the Ownership app
- Depending on the source: an Azure for Workflows connection with Entra ID group read access, or a ServiceNow for Workflows connection
- For the custom source: the host of your team file in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/). For the sample file that's `raw.githubusercontent.com`.

## Setup

1. Download the workflow template for your source.
2. In **Workflows**, choose **Upload**, select the file and assign the connection.
3. Run it once manually, check the imported teams in **Settings > Ownership > Teams**, then keep the schedule active.

## Configuration

- **Custom source:** the workflow downloads `example-teams.json` from this folder on GitHub. Point the URL in `fetch_teams_from_external_source` to your own file and adapt the mapping logic to your format.
- **Entra ID / ServiceNow:** filter which groups to import in the `get_groups_1` task.
- **Schedule:** change the 720-minute interval if you need a different sync frequency.

## Notes & limitations

- See the documentation for the [`import_teams` action](https://docs.dynatrace.com/docs/manage/ownership/ownership-app#import-teams).
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository. The custom-source URL now points to this repository.
