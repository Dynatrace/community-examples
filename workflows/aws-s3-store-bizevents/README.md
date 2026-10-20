---
title: Store Business Events in an AWS S3 Bucket
category: Workflows
type: Workflow
also_includes: []
tags: [aws, s3, cloudformation, business-events, bizevents, getting-started]
verticals: []
capabilities: [Dynatrace Automation, Business Events, Grail, DQL]
last_updated: 2026-10-20
---

# Store Business Events in an AWS S3 Bucket

A minimal, self-contained example of the AWS for Workflows S3 actions: copy the latest business event into an S3 bucket.

## What it does

The workflow uses [AWS for Workflows](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/aws) and runs on demand:

1. **S3 list buckets:** lists the buckets in `eu-central-1`.
2. **S3 create bucket:** creates `dynatrace-bizevents` in `eu-central-1` if it doesn't exist yet.
3. **Fetch BizEvent:** gets the most recent business event with DQL. The result is empty if there were no business events in the last 30 days.
4. **S3 put object:** stores the event in the bucket, with the current timestamp as the key.

A CloudFormation template creates the AWS side for you.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows and the AWS for Workflows app
- An AWS account and the [AWS CLI](https://aws.amazon.com/cli/), with permission to create IAM resources
- Business events in Grail

## Setup

1. **Create the AWS resources** with [`cloudformation-store-bizevents-in-s3-bucket.json`](./cloudformation-store-bizevents-in-s3-bucket.json). This is step 2 of the [AWS for Workflows setup](https://docs.dynatrace.com/docs/platform-modules/automations/workflows/actions/aws/aws-workflows-setup). The template creates:
   - an IAM identity provider that trusts identities issued by `https://token.dynatrace.com`;
   - an IAM role that trusts this provider, with inline policies for `account:ListRegions`, `s3:PutObject`, `s3:ListAllMyBuckets` and `s3:CreateBucket`.

   Replace `[TENANT-ID]` and run:

   ```
   aws cloudformation create-stack --stack-name dynatrace-s3-workflow-example --template-url https://raw.githubusercontent.com/Dynatrace/community-examples/main/workflows/aws-s3-store-bizevents/cloudformation-store-bizevents-in-s3-bucket.json --parameters ParameterKey=TenantUrl,ParameterValue=[TENANT-ID].apps.dynatrace.com ParameterKey=ConnectionName,ParameterValue=S3-Example --capabilities CAPABILITY_IAM
   ```

   CloudFormation's `--template-url` normally expects an S3 URL. If AWS rejects the GitHub URL, download the file and use `--template-body file://cloudformation-store-bizevents-in-s3-bucket.json` instead.
2. **Create the connection in Dynatrace** (step 3 of the setup). Name it `S3-Example` and use the ARN of the new role. Get the ARN with:

   ```
   aws iam list-roles --query 'Roles[?starts_with(RoleName, `DynatraceS3WorkflowExample`)].Arn'
   ```
3. **Import and run the workflow.** Upload [`store-bizevent-in-s3-bucket.workflow-template.yaml`](./store-bizevent-in-s3-bucket.workflow-template.yaml) in **Workflows**, select the `S3-Example` connection in the three S3 tasks, and choose **Run**.

## Configuration

- **Region and bucket name:** `eu-central-1` and `dynatrace-bizevents`, set in the S3 tasks. S3 bucket names are global, so you might need a unique name.
- **Query:** change the DQL in `fetch_bizevents` to export the events you need.

## Notes & limitations

- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository. During the move, the trust-policy condition keys in the CloudFormation template were corrected. They had pointed to an internal development token issuer and now use `token.dynatrace.com`, the same issuer as the identity provider.
