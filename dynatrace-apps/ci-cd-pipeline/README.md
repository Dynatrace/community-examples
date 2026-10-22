# CI/CD Observability — Dynatrace App

Unified observability for **pipelines, jobs, stages and PRs** across multiple CI/CD providers (Azure DevOps, GitHub, GitLab, etc.) inside **Dynatrace Platform**.

<img width="1677" height="914" alt="cicd-image-1" src="https://github.com/user-attachments/assets/69897507-f272-4bb1-a17e-d87c8278b201" />

---

## ✨ Features

- **Pipeline view**: status, total time, history, recent runs.
- **Stage/Job view**: start/end, duration, outcome, metadata (pipeline, project/repo).
- **Filters (Filter Bar)**: timeframe, action name/ID, session, status.
- **Pipeline Execution Flamegraph**: hierarchical view of the job execution in that pipeline.
- **OpenPipeline Setup**:
  - Setup wizard for importing and removing OpenPipeline rules
- **Support to Custom CI/CD Providers**:
  - Any tool that can send an HTTP request, see [Custom Events](#-custom-events) below
- **Supported Technologies**:
  - **Azure Devops**
  - **Gitlab Pipelines**
  - **Github Actions (Workflows)**

---

## 🚀 Install the app on the Dynatrace platform

CI/CD Observability is available as a Dynatrace app to all customers upon request. It is delivered via a Hub subscription.

1. Email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with your **account name** and **tenant ID**.
2. We'll process your request and send instructions for subscribing to the channel and installing the app.
3. After installation, open the app and navigate to the **Setup** tab to find your target technology. Follow the instructions to **set up the webhooks on the chosen provider**.
4. Select **Import Configuration** to import the OpenPipeline rules to your environment. Those rules translate the incoming webhook events into SDLC events (OpenTelemetry standard), which are then consumed by the app.
   <img width="1681" height="838" alt="cicd-image-4" src="https://github.com/user-attachments/assets/3a143725-c627-44d0-8f59-1b67fb7649fe" />
5. Start exploring the data.
   <img width="1677" height="914" alt="cicd-image-2" src="https://github.com/user-attachments/assets/5619affb-f590-4271-a061-37be5512651e" />

> **Note:** Filters are only applied after clicking the refresh button to avoid unnecessary queries.

<img width="1684" height="563" alt="cicd-image-3" src="https://github.com/user-attachments/assets/e4a25259-aabd-456c-995b-11a93da4dd41" />

---

## ✨ Custom Events

Any CI/CD tool, script or plugin can send its pipelines and jobs to the app. The events show up on every page (Overview, Explorer, DORA and the execution flamegraph) in the same way as the built-in providers.

1. In the app, open **Setup** and click **Import Configuration** on **Custom CI/CD (any tool)**. This creates an OpenPipeline ingest source that normalizes the events.
2. Create an access token with the `openpipeline.events_sdlc.custom` scope.
3. `POST` one event or an array of events to:

```
https://<YOUR-DT-ENV-ID>.live.dynatrace.com/platform/ingest/custom/events.sdlc/custom
Authorization: Api-Token <YOUR-ACCESS-TOKEN>
Content-Type: application/json
```

Send one **pipeline** event when a run finishes and one **task** event for each of its jobs. Only `finished` events are charted. `started` events are accepted but not shown.

### Pipeline run event

Example: build 1042 of the Concourse pipeline `checkout-service`, which failed in its `unit-tests` job.

```json
{
  "event.category": "pipeline",
  "event.status": "finished",
  "event.type": "run",
  "event.provider": "concourse",
  "cicd.pipeline.id": "main/checkout-service",
  "cicd.pipeline.name": "checkout-service",
  "cicd.pipeline.run.id": "concourse-main-checkout-service-1042",
  "cicd.pipeline.run.outcome": "failed",
  "cicd.pipeline.run.url.full": "https://concourse.example.com/teams/main/pipelines/checkout-service/jobs/deploy-staging/builds/1042",
  "cicd.pipeline.run.trigger": "push",
  "vcs.repository.name": "shop/checkout-service",
  "vcs.repository.url.full": "https://github.com/shop/checkout-service",
  "vcs.ref.head.name": "main",
  "ext.pipeline.project.name": "shop",
  "ext.pipeline.build.name": "a1b2c3d Add retry to payment client",
  "ext.pipeline.build.tags": ["concourse", "demo"],
  "ext.pipeline.run.trigger.user": "jane.doe",
  "pipeline.queued.duration": 4,
  "pipeline.outcome.failure.reason": "Job 'unit-tests' failed: 3 tests failed in PaymentClientTest",
  "start_time": "2026-10-21T20:09:43.000Z",
  "end_time": "2026-10-21T20:15:23.000Z",
  "duration": 340
}
```

| Field | Required | Used for |
|---|---|---|
| `event.category` | yes | Must be `pipeline` |
| `event.status` | yes | `finished` or `started`. Defaults to `finished` when `end_time` is set |
| `cicd.pipeline.run.id` | yes | Identifies the run and links its jobs. Keep it unique across tools |
| `cicd.pipeline.name` | yes | Pipeline name in every table, chart and filter |
| `cicd.pipeline.run.outcome` | yes | Success rate, failures and DORA |
| `start_time`, `end_time` | yes | ISO 8601 timestamps |
| `duration` | yes | Run duration **in seconds**. Calculated from `start_time` and `end_time` when missing |
| `event.provider` | no | Provider filter and column. Defaults to `custom`. Don't use `gitlab`: those events are routed into the GitLab pipelines, which drop custom fields |
| `cicd.pipeline.id` | no | Pipeline definition id |
| `cicd.pipeline.run.url.full` | no | Link to the run |
| `vcs.repository.name`, `vcs.repository.url.full` | no | Repository column and link |
| `vcs.ref.head.name` | no | Branch filter (`refs/heads/` is stripped) |
| `ext.pipeline.project.name` | no | Project filter and DORA grouping |
| `ext.pipeline.build.name` | no | Commit / build message |
| `ext.pipeline.build.tags` | no | Array of tags for the build tag filter |
| `ext.pipeline.run.trigger.user` | no | Owner filter |
| `cicd.pipeline.run.trigger` | no | Trigger type filter (e.g. `push`, `schedule`) |
| `pipeline.queued.duration` | no | Queue time **in seconds** |
| `pipeline.outcome.failure.reason` | no | Failure reasons on the Overview and in the flamegraph |
| `event.type` | no | Free text, e.g. `run`, `build`, `deploy` |

### Job / task event

Example: the failed `unit-tests` job of the same build. Concourse groups map to `ext.task.stage.name`, and the job's `get`/`task`/`put` steps go into `job.steps`.

```json
{
  "event.category": "task",
  "event.status": "finished",
  "event.type": "build",
  "event.provider": "concourse",
  "cicd.pipeline.id": "main/checkout-service",
  "cicd.pipeline.name": "checkout-service",
  "cicd.pipeline.run.id": "concourse-main-checkout-service-1042",
  "task.id": "concourse-main-checkout-service-1042-unit-tests",
  "task.name": "unit-tests",
  "task.outcome": "failed",
  "task.retry": 0,
  "ext.task.stage.name": "test",
  "vcs.repository.name": "shop/checkout-service",
  "start_time": "2026-10-21T20:11:45.000Z",
  "end_time": "2026-10-21T20:14:01.000Z",
  "duration": 136,
  "job.steps": [
    "{\"name\":\"get: build-artifact\",\"conclusion\":\"success\",\"started_at\":\"2026-10-21T20:11:45.000Z\",\"completed_at\":\"2026-10-21T20:11:51.000Z\"}",
    "{\"name\":\"task: unit-tests\",\"conclusion\":\"failed\",\"started_at\":\"2026-10-21T20:11:51.000Z\",\"completed_at\":\"2026-10-21T20:14:01.000Z\"}"
  ]
}
```

| Field | Required | Used for |
|---|---|---|
| `event.category` | yes | Must be `task` |
| `event.status` | yes | `finished` or `started`. Defaults to `finished` when `end_time` is set |
| `cicd.pipeline.run.id` | yes | Same value as on the pipeline run event |
| `task.name` | yes | Job name |
| `task.outcome` | yes | Job success rate and failures |
| `start_time`, `end_time` | yes | ISO 8601 timestamps, inside the pipeline run's time range |
| `duration` | yes | Job duration **in seconds**. Calculated from `start_time` and `end_time` when missing |
| `ext.task.stage.name` | no | Groups jobs into stages: Stage views and the stage level in the flamegraph |
| `task.id` | no | Job id |
| `task.retry` | no | Attempt number. Defaults to `0` |
| `vcs.repository.name` | no | Repository column |
| `job.steps` | no | Steps for the Step views and the flamegraph: an array of JSON strings, each an object with `name`, `conclusion`, `started_at` and `completed_at` |

### Outcomes

Outcomes are case-insensitive and normalized:

| Sent | Stored as |
|---|---|
| `success`, `succeeded`, `passed` | `success` |
| `failure`, `failed`, `error`, `timeout` | `failure` |
| `canceled`, `cancelled`, `cancellation`, `aborted` | `canceled` |
| `skipped`, `skip` | `skipped` |
| `partiallySuccess`, `partiallySucceeded` | `partiallySucceeded` |

Any other value is kept as sent. It shows up in tables but is not counted as a success or a failure.

### OpenTelemetry names

The OpenTelemetry CI/CD attribute names are accepted as alternatives: `cicd.pipeline.result` (for `cicd.pipeline.run.outcome`), `cicd.pipeline.task.name` (`task.name`), `cicd.pipeline.task.run.id` (`task.id`) and `cicd.pipeline.task.run.result` (`task.outcome`). The app reads SDLC events, so OpenTelemetry spans and metrics are not shown.

### Sending without the ingest source

Events can also be sent to the built-in endpoint `/platform/ingest/v1/events.sdlc` (scope `openpipeline.events_sdlc`), but they are then stored as sent and must already be in the app's internal form:
- `duration` in **nanoseconds**
- outcomes exactly as in the *Stored as* column
- the same type for `cicd.pipeline.run.id` on pipeline and job events

Events sent to the classic Events API (`/api/v2/events/ingest`) or as business events are not SDLC events and do not appear in the app.

## 🗺️ Roadmap

1. ~~Add Jenkins Support~~ ✅
2. ~~New page focused on DORA Metrics~~ ✅
3. ~~Add more filtering Options~~ ✅
4. Correlate Releases with Dynatrace Problems
