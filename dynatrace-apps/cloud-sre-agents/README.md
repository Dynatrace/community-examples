# Cloud SRE Agents

## What this does for you
When Dynatrace Intelligence detects a problem, Cloud SRE Agents calls in the cloud-native specialists — [AWS DevOps Agent](https://aws.amazon.com/devops-agent/), [Azure SRE Agent](https://learn.microsoft.com/en-us/azure/sre-agent/), [Google Gemini Cloud Assist](https://docs.cloud.google.com/cloud-assist/investigations) — to pull the deeper evidence only they can reach: CloudTrail history, Azure subscription policy, GCP project IAM, recent deployments, native runbooks. They run in parallel the moment the problem fires; their findings (and, for AWS and Azure, a suggested remediation) land on the same problem screen the on-call SRE is already reading.

One screen. No tab-switching. The work starts without you.

```
  Without Cloud SRE Agents       🤖 With Cloud SRE Agents
  ────────────────────────────   ──────────────────────────────────────
  02:00  page 🔔                 02:00  🔔 page + agents dispatch
  02:05  VPN, open laptop 💻     02:03  👀 on-call reads root cause
  02:25  trawl AWS console ⚙️    02:07  💡 first agent finding appears
  03:15  form a hypothesis 💭    02:10  📋 remediation path suggested
  04:15  resolved ✅             02:12  ✅ on-call approves, resolved

  MTTR ≈ 2h15m ⏱️                MTTR ≈ 🚀 12m   (illustrative)
```

## How It Works
When Dynatrace Intelligence fires a problem, three workflows do the rest in the background:

- **Workflow 1 — Investigate.** Evaluates your interaction profiles and dispatches the problem to matching agents in parallel, the moment it fires.
- **Workflow 2 — Periodic Tasks.** Polls Azure and GCP for completion, detects AWS stalls, writes findings back as problem annotations.
- **Workflow 3 — Event Handlers (AWS-only).** Normalises raw AWS events (`TASK_CREATED`, `TASK_UPDATED`, `JOURNAL_RECORD_CREATED`) into the events stream so the UI and Workflow 2 can correlate by problemEventId. AWS bizevents do not carry a task id — raw events are the only reliable source.

Agents do not communicate with each other; each runs independently in its own cloud.


```mermaid
flowchart TB    
    Q -->|AWS| B1
    Q -->|Azure| B2
    Q -->|GCP| B3
    B4 --> C1
    B5 -.-> C1
    C1 --> D1

    subgraph one["`<span style='display:block;width:100%;color:#1866FE'>Dynatrace</span>`"]
        A1["Dynatrace Intelligence detects an issue"]
        A2["Identify root cause and create Problem"]
        A3["`Trigger workflow<br>*(Workflow 1)*`"]
        Q["Dispatch on profile match"]
    
        A3-->Q
        A1-->A2
        A2-->A3    
    end    

    subgraph two["Cloud-native agents"]
        B1["AWS DevOps Agent"]
        B2["Azure SRE Agent"]
        B3["Google Geminie Cloud Assist"]
        B4["Investigate Problem"]
        B5["Mitigate"]
    
        B1-->B4
        B2-->B4
        B3-->B4
        B4-. Optional .-> B5      
    end

    C1["`Update and add annotation<br>*(Workflow 2 and 3)*`"]

    subgraph three["`<span style='display:block;width:100%;color:#1866FE'>Dynatrace</span>`"]
        D1["Dynatrace Problem"]
        D2["`Root cause<br>*(Detected from Dynatrace)*`"]
        D3["`Cloud-native evidence<br>*(from agents)*`"]
        D4["`Suggested Remediation<br>*(AWS and Azure only)*`"]

        D1-->|Includes| D2
        D1-->|Includes| D3
        D1-.->|"Optional"|D4
    end

    style one fill:#A3C2FF,stroke:#1866FE,stroke-width:3px
    style three fill:#A3C2FF,stroke:#1866FE,stroke-width:3px
```














Two configuration objects drive the dispatch in Workflow 1:

- Interaction Profile — a routing rule. Combines global filters with one or more agent assignments and optional per-agent filters. Only enabled profiles are evaluated.
- Agent — a connection to a cloud AI service (AWS / Azure / GCP). Has type, endpoint, credential, optional monthly duration budget. Disable to pause without losing config.

## Before you start - Install the app

*Cloud SRE Agents is available as a Dynatrace app to all customers upon request.*

1. *Cloud SRE Agents* is delivered via a [Hub subscription](https://docs.dynatrace.com/docs/shortlink/hub#add-subscription). Email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with your account name and tenant ID, as described [here](https://github.com/Dynatrace/community-examples/blob/main/dynatrace-apps/README.md).
2. We'll process your request and send instructions for subscribing to the channel and installing the app.

## First 5 minutes
Once installed, follow the next steps to start your first investigation:

1. Setup tab (3 min). Install IAM policy, group, service user. Install all three workflows. Set workflow actor to the service user on each.
2. Add one agent (1 min). Configuration → add agent (any cloud) → endpoint + credential → save. Accept the outbound-whitelist prompt.
3. Add one profile (1 min). Configuration → add profile → one global filter (e.g. Has AWS Resources = true) → assign the agent → enable.
4. Test (30 sec). Trigger Investigation → pick a recent problem → Test (Dry Run). If the profile matches, uncheck Dry Run and dispatch.

The next matching problem dispatches automatically. Findings appear on the problem screen as each agent completes, usually within minutes.

## Agent configurations
**Agents** are connections to cloud AI services. Each agent has a type (AWS, Azure, or Google Cloud) connects via two settings: Endpoint URL and Credential. Both come from the cloud provider's own console — set them up there first, then paste into the agent form. Disable an agent to pause it without losing configuration.

### AWS DevOps Agent
1. In AWS Agent Space, configure a new Telemetry Source of type Dynatrace.
2. The setup flow surfaces a webhook URL and a webhook secret — copy both.
    - Endpoint URL: the webhook URL from the setup flow.
    - Credential: the webhook secret from the setup flow.

Follow the description in the [AWS documentation](https://docs.aws.amazon.com/devopsagent/latest/userguide/connecting-telemetry-sources-connecting-dynatrace.html) on how to connect Dynatrace with the AWS DevOps Agent. 
When adding Dynatrace as a Telemetry capability provider, you need to create a Dynatrace OAuth Client. You have to set-up this  clientwith the following permissions:
```
storage:bizevents:read
storage:logs:read
storage:events:read
storage:metrics:read
storage:system:read
storage:buckets:read
storage:spans:read
storage:entities:read
storage:smartscape:read
storage:fieldsets:read
storage:user.events:read
storage:security.events:read
openpipeline:events:ingest
```

### Azure SRE Agent
1. In Microsoft Entra ID → App registrations, create a new app and generate a client secret.
2. In your Azure SRE instance, open Settings → Basic and copy the Agent Endpoint URL.
3. In the SRE instance's Access Control (IAM) panel, assign the new app the SRE Agent Standard User role so it can trigger interactions.
    - Endpoint URL: the Agent Endpoint URL from step 2.
    - Credential: the client secret from step 1.


### Google Gemini Cloud Assist
1. In Google Cloud IAM, create a service account and grant it the Gemini Cloud Assist Investigation Admin and Service Account Token Creator roles.
2. Create a new key for the service account and download it as JSON.
    - Endpoint URL: not required — leave blank.
    - Credential: paste the full service-account JSON.


## Filters Reference
**Filters** control dispatch. They can be combined with AND/OR logic and nested arbitrarily. 

### AWS
| Filter	| Description | 
| --- | ---| 
| AWS Account ID	| Match by AWS account | 
| AWS Resource Type	| Match by resource type | 
| AWS Tag Key	| Resource has a tag with this key | 
| AWS Tag Value	| Tag key has a specific value | 
| Has AWS Resources	| Problem affects AWS resources (boolean) | 

### Azure
| Filter	| Description | 
| --- | --- | 
| Azure Subscription ID| 	Match by subscription | 
| Azure Resource Type	| Match by resource type | 
| Azure Tag Key	| Resource has a tag with this key | 
| Azure Tag Value	| Tag key has a specific value | 
| Has Azure Resources	| Problem affects Azure resources (boolean) | 

### Google Cloud
| Filter	| Description | 
| --- | --- | 
| GCP Project ID	| Match by project | 
| GCP Resource Type	| Match by resource type | 
| GCP Tag Key	| Resource has a tag with this key | 
| GCP Tag Value	| Tag key has a specific value | 
| GCP Label Key	| Resource has a label with this key | 
| GCP Label Value	| Label key has a specific value | 
| Has GCP Resources | Problem affects GCP resources (boolean) | 

### Problem
| Filter	| Description | 
| --- | --- | 
| Problem Category	| AVAILABILITY, ERROR, SLOWDOWN, RESOURCE_CONTENTION, MONITORING_UNAVAILABLE, CUSTOM_ALERT | 
| Problem Status	|  ACTIVE or CLOSED | 
| Entity Type	| Affected entity type (HOST, SERVICE, PROCESS_GROUP, etc.) | 
| Has Similar Problems	| Dynatrace identified similar historical problems (boolean) | 
| Problem Field	| Match any problem field with `equals` / `not_equals` / `contains` / `not_contains`. Useful for `event.name`, `k8s.cluster.name`, `affected_entity_ids`, `related_entity_ids`, custom attributes. Strings, booleans, numbers; booleans match as `true` / `false`. Object fields (e.g. `smartscape.related_entities`) not supported — use string equivalents (`smartscape.related_entity.ids`). Use Test (Dry Run) to discover available field names. | 

### Budget
| Filter	| Description | 
| --- |  --- | 
| Has Available Budget	| Agent's monthly duration is below its configured budget. Duration is a proxy measured from Grail event timestamps (includes network/ingest delay), not the cloud provider's clock — fine as a circuit-breaker, not for cost accounting. With strict mode on, blocks dispatch; otherwise records a warning. Resets at UTC month start. |


## Cost model
Cloud SRE Agents sits on DPS-metered Dynatrace primitives. Agent working time on the cloud side is on your cloud bill, not here.

| DPS surface	| Cost driver | 
| --- |  --- | 
| Events — Ingest & Process	| Dispatched problems, AWS raw events | 
| Events — Retain	| Tenant retention window | 
| Events — Query (DQL)	| Workflow 2 ticks, UI loads, in-action queries | 
| Automation Workflow	| Execution duration (all three workflows) | 
| AppEngine Functions	| One invocation per action execution | 

**Rough monthly estimate.** For a sample tenant — 100 Davis problems matched per day, one active dashboard user with ~20 manual refreshes/day, the default 1-minute scheduler cadence, 35-day retention — total monthly DPS spend is approximately USD 130–150. Approximate breakdown: scheduler-workflow AppEngine invocations ~$130; the three workflows' wall-clock execution combined ~$2–4; bizevent ingest under $0.10; event retention under $0.05; per-user UI DQL scans under $1. Numbers move with: scheduler interval, workflow wall-clock duration, problem volume, and retention window. Model your own assumptions against the [Dynatrace Rate Card](https://www.dynatrace.com/pricing/rate-card/).

The Statistics tab shows agent working time as a directional signal for cloud-side spend. These are proxy estimates, not billing-grade — derived from event timestamps in Grail (including network/ingest delay), not the cloud provider's clock. Use them for trend-spotting and the budget circuit-breaker; reconcile against AWS / Azure / GCP usage reports for exact numbers.

## CLI tools
For scripted access — config-as-code, demo-tenant migrations, support runbooks — `dtctl` reads and writes agents and interaction profiles directly as App Settings objects.

> `dtctl` bypasses the app's UI-layer validation. Orphan `agentRefs`, corrupt filter expressions, deleting a referenced agent, and round-tripping the masked credential placeholder all succeed at the Settings API. Edit through the UI when those guardrails matter.

### List
```
dtctl get settings --schema app:community.cloudsreagents:cloudsreagent-agent -o json | jq
dtctl get settings --schema app:community.cloudsreagents:cloudsreagent-interactionprofile -o json | jq
```

### Get one
```
dtctl get settings <objectId>
```

Credentials are returned masked (`"***753***"`); other fields literal.

### Create
When --schema and --scope are passed as flags, the file contains the value fields directly (no schemaid / scope / value envelope).

```
cat > /tmp/agent.yaml <<EOF
name: prod-aws
type: aws
enabled: true
endpoint: https://agent.example.com/api
credential: <secret>
storeRawMessages: false
strictBudget: false
durationBudgetMinutes: 60
EOF
dtctl create settings -f /tmp/agent.yaml \
  --schema app:community.cloudsreagents:cloudsreagent-agent --scope tenant
```

For an interaction profile, the same flat-shape applies. agentRefs[].agentId is the objectId of an existing agent (grab one from the List recipe above). globalFilterExpression and agentRefs[].filterExpression are JSON-stringified FilterGroups — same shape the UI stores.

```
cat > /tmp/profile.yaml <<EOF
name: production
enabled: true
deferred: 0
topologyMaxDepth: 3
globalFilterExpression: '{"logic":"and","filters":[{"type":"has_aws_resources","expected":true}]}'
agentRefs:
  - agentId: <agent-objectId>
    enabled: true
EOF
dtctl create settings -f /tmp/profile.yaml \
  --schema app:community.cloudsreagents:cloudsreagent-interactionprofile --scope tenant
```

Validate before persisting by appending --dry-run.

### Update via apply (kubectl-style upsert)
`dtctl update settings` is intentionally blocked — use `apply`. The cleanest round-trip exports with dtctl get -o yaml (the keys are lowercase: `objectid`, `schemaid`, `scope`, `value`, …; a hand-crafted file with camelCase keys won't be recognised), edits in place, then applies back. value is full-replace, so an omitted field is cleared.

```
dtctl get settings <objectId> -o yaml > /tmp/setting.yaml
# edit /tmp/setting.yaml — change fields under `value:`
dtctl apply -f /tmp/setting.yaml --show-diff
```

Sending the masked credential string back via `apply` is accepted as "leave the credential alone." Replace it with plaintext to actually rotate the secret.

### Delete
```
dtctl delete settings <objectId> -y
```

Deleting an agent does not auto-clean references in profiles — `agentRefs[].agentId` will dangle. Re-apply affected profiles afterwards.

### Audit configurations
The `validate-configurations` app function scans every stored profile and reports the integrity issues that `dtctl + jq` can't easily verify on their own: malformed `globalFilterExpression` or `agentRefs[].filterExpression` (depth-limited recursive walk over the same rules the UI uses), and `agentRefs[].agentId` values that no longer resolve to an existing agent.

```
dtctl exec function community.cloudsreagents/validate-configurations --method POST -o json | jq '.body | fromjson'
```

Returns `{ ok, scannedAt, agents: { total }, profiles: { total, issues: [...] } }`. Each issue carries `kind` (`corrupt_global_filter` | `corrupt_agent_filter` | `orphan_agent_ref`), the offending `profileId` / `profileName`, a human-readable `detail`, and (for agent-ref issues) the `agentRefIndex`. Read-only — no settings are modified.


## User Interface

**Tabs**
- **Overview** — Interactive network graph of problems, agents, profiles, and activities. Click to highlight, double-click to navigate.
- **Activity** — Timeline of all investigations and mitigations. Expand cards to see findings. Rate responses (Good / OK / Bad) to track quality.
- **Statistics** — Performance analytics: problems handled, agent time, success rates, satisfaction scores, and per-agent breakdowns. Agent working time drives cloud costs, so this is your primary cost lens.
- **Actions** — Manually dispatch a problem to a specific agent or through profile-based routing. Use Test (Dry Run) to validate filters without invoking agents.

**Settings menu**
- Create and manage agents and interaction profiles. Each row supports enable/disable, edit, permissions, and delete.
- Profiles are routing rules that decide which problems go to which agents. Each profile has global filters, one or more agent assignments, and optional per-agent filters. Only enabled profiles are evaluated.

**Help menu**
- **Get started** — Guided setup for IAM policy, group, service user, and workflows. Live status badges show what's configured and what's missing.

## Troubleshooting
- **No activities appearing?** Check that workflows are installed and enabled (Setup tab), the service user is correct, and at least one profile + agent is enabled. Use Trigger Investigation → Test (Dry Run) to validate filters.
- **Investigation timeouts?** Verify the agent credential is valid, the endpoint is on the outbound allowlist, and the cloud service is reachable. Enable Store Raw Messages for debugging.
- **Budget blocking dispatch?** Check the agent's Monthly Duration Budget in Configuration. The budget resets at UTC month start. Toggle strict enforcement off to let dispatch proceed with a warning.
