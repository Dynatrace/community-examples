---
title: Workflow Import and Export via API
category: Workflows
type: Workflow
also_includes: []
tags: [automation-api, import, export, github, backup, oauth]
verticals: []
capabilities: [Dynatrace Automation]
last_updated: 2026-10-20
---

# Workflow Import and Export via API

Back up, move or version your workflows with the Automation API, from the command line or from a workflow itself.

## What it does

- [`api-examples.txt`](./api-examples.txt): example `curl` calls for the Automation API: list all workflows, get one workflow, and create a workflow from JSON.
- [`export-all-workflows-to-github.workflow.json`](./export-all-workflows-to-github.workflow.json): a workflow that reads all workflow definitions and commits each one as a JSON file to a GitHub repository.
- [`import-workflows-from-github.workflow.json`](./import-workflows-from-github.workflow.json): a workflow that reads a workflow definition from a GitHub repository and creates it in your environment.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- For the API: an [OAuth client](https://developer.dynatrace.com/develop/access-platform-apis-from-outside/) with the scopes `automation:workflows:read`, `automation:workflows:write` and `automation:workflows:run`
- For the GitHub workflows: a GitHub repository and token, and `api.github.com` in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/)

## Setup

**API:**

1. Create the OAuth client and get a bearer token.
2. To browse the API, open the **API documentation** app from the Launcher and select the *Automation* definition. You can also download the OpenAPI file there.
3. Use the calls in `api-examples.txt`: `GET /platform/automation/v1/workflows` and `GET /platform/automation/v1/workflows/{id}` to export, `POST /platform/automation/v1/workflows` to import.

**Workflows:**

1. Import the JSON file through the API (or upload it in **Workflows**).
2. Fill in the GitHub details (see Configuration) and run it.

## Configuration

- Replace `<tenantid>` and `<YOURTOKEN>` in the `curl` examples.
- In both workflows, set `{user}`, `{repo}` and `{folderstructure}` in the GitHub URL and add your GitHub token to the `Authorization` header. Use the credential vault and don't store the token in plain text.

## Notes & limitations

- Other ways to move workflows: download or upload a template in the [Workflows app](https://docs.dynatrace.com/docs/shortlink/workflows-manage), or use [Configuration as Code (Monaco or Terraform)](https://docs.dynatrace.com/docs/shortlink/configuration-as-code). The formats aren't interchangeable: Monaco JSON contains escaping and uses its own YAML format for placeholders.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.
