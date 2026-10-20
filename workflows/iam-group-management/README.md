---
title: IAM Group Management
category: Workflows
type: Workflow
also_includes: []
tags: [iam, account-management, policies, permissions, groups, oauth]
verticals: []
capabilities: [Dynatrace Automation, Account Management, IAM]
last_updated: 2026-10-20
---

# IAM Group Management

Create a read-only user group with scoped policies in one workflow run, instead of clicking through Account Management for every team.

## What it does

The workflow calls the Dynatrace Account Management (IAM) API with an OAuth client. In one run it:

- creates a group;
- binds the default policies (`AppEngine - User`, `Extensions - User access`, `Hub Catalog Read`);
- binds parameterized policies that limit read access to one management zone, security context or host group;
- grants the environment-level permission *Manage support tickets*.

It binds the policies in both a non-production and a production environment.

The parameterized policies it binds:

```
ALLOW environment:roles:viewer WHERE environment:management-zone = "${bindParam:mz-name}";
ALLOW environment:roles:replay-sessions-with-masking WHERE environment:management-zone = "${bindParam:mz-name}";
ALLOW environment:roles:view-sensitive-request-data WHERE environment:management-zone = "${bindParam:mz-name}";
ALLOW environment:roles:view-security-problems WHERE environment:management-zone = "${bindParam:mz-name}";
ALLOW storage:buckets:read;
ALLOW storage:entities:read WHERE storage:dt.security_context = "${bindParam:mz-name}";
ALLOW storage:events:read WHERE storage:dt.host_group.id IN ("${bindParam:hg-name}");
ALLOW storage:bizevents:read WHERE storage:dt.host_group.id IN ("${bindParam:hg-name}");
ALLOW storage:metrics:read WHERE storage:dt.host_group.id IN ("${bindParam:hg-name}");
ALLOW storage:spans:read WHERE storage:dt.host_group.id IN ("${bindParam:hg-name}");
ALLOW storage:logs:read WHERE storage:dt.host_group.id IN ("${bindParam:hg-name}");
```

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- Account Management access to create an [OAuth client](https://docs.dynatrace.com/docs/manage/identity-access-management/access-tokens-and-oauth-clients/oauth-clients) with permission to manage groups and policies
- The custom parameterized policy above, created in your account
- `api.dynatrace.com` and `sso.dynatrace.com` in the [allowed outbound connections](https://developer.dynatrace.com/develop/functions/allow-outbound-connections/)

## Setup

1. Create the OAuth client.
2. Store the client secret in the credential vault of the environment where the workflow will run.
3. Download [`iam-group-management.workflow-template.yaml`](./iam-group-management.workflow-template.yaml) and upload it in **Workflows**.
4. In the `groups_definition` task, replace `<REPLACE-PLACEHOLDER>` with your group details.
5. In the `env_var` task, replace `<REPLACE-PLACEHOLDER>` with your account ID, client ID, the credential vault ID of the secret, and the other required fields.
6. Run the workflow.

## Configuration

- The `${bindParam:mz-name}` and `${bindParam:hg-name}` values are set per group in `groups_definition`.
- Remove the production or non-production binding tasks if you only use one environment.

## Notes & limitations

- The workflow creates **one group per run**.
- Further reading: [Grail permissions](https://docs.dynatrace.com/docs/shortlink/assign-bucket-table-permissions#grail-permissions-record) and [IAM policy templating](https://docs.dynatrace.com/docs/manage/identity-access-management/permission-management/manage-user-permissions-policies/advanced/iam-policy-templating).
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.
