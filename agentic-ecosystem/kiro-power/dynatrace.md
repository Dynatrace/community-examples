# Dynatrace Observability & Monitoring

## Overview

## Dynatrace MCP Server Capabilities

| Category | Key Functions | Primary Use Cases |
|----------|--------------|-------------------|
| **Entity & Topology** | `find_entity_by_name`, `get_environment_info` | Locate services, hosts, processes; verify tenant connection |
| **Problem Management** | `list_problems`, `chat_with_davis_copilot` | Query active/closed problems; get Davis AI insights on issues |
| **Security** | `list_vulnerabilities` | Retrieve vulnerabilities by risk score; access Davis security assessments |
| **DQL Querying** | `execute_dql`, `generate_dql_from_natural_language`, `explain_dql`, `verify_dql` | Query GRAIL data; convert natural language to DQL; validate syntax |
| **Kubernetes** | `get_kubernetes_events` | Retrieve cluster events; query pod conditions and resource usage |
| **Notifications** | `send_email`, `send_slack_message`, `create_workflow_for_notification` | Send alerts; automate team notifications |
| **Resource Mgmt** | `reset_grail_budget` | Reset query budget limits after exhaustion |

### Finding Service Entities

You can find entities via the `find_entities_by_name` tool using your application name or namespace as well as specific service names.
You should find entities like `[<cluster>][<namespace>] <ServiceName>`.

**Note**: K8s metadata fields (like `k8s.namespace.name`, `k8s.cluster.name`) are NOT available when querying `fetch dt.entity.service`. Use `entity.name` and `id` fields only. For K8s metadata, query logs or events instead.

### Finding Problems

You can find problems via the `list_problems` tool and applying the following filter:

```dql
contains(k8s.namespace.name, "<namespace>") OR contains(dt.entity.application.name, "<application-name>")
```

If you want to narrow down the problem of a specific entity, like a service, you can use the following filter:

```dql
in(affected_entity_ids, "<service-id>") OR dt.entity.$type == "<entity-id>" OR ...
```

### Metrics

You can then investigate metrics via the DQL command

```dql
timeseries avg(<metric-key>),
from: now() -14d, to: now(),
filter: matchesValue(k8s.deployment.name, "*<service-name>*")
```

Additionally, you should add a filter like this: `| filter dt.entity.service == "<service-id>"` to focus on a specific service.

#### Service-Level Metrics

- _Service Response Time_: `dt.service.request.response_time`
- _Service Request Count_: `dt.service.request.count`
- _Service Failure Count_: `dt.service.request.failure_count`

#### Container-Level Metrics

- _Container CPU Usage_: `dt.kubernetes.container.cpu_usage`
- _Container Memory Working Set_: `dt.kubernetes.container.memory_working_set`
- _Container CPU Requests_: `dt.kubernetes.container.requests_cpu`
- _Container Memory Requests_: `dt.kubernetes.container.requests_memory`
- _Container CPU Limits_: `dt.kubernetes.container.limits_cpu`
- _Container Memory Limits_: `dt.kubernetes.container.limits_memory`

#### Kubernetes Infrastructure Metrics

- _Pod Conditions_: `dt.kubernetes.workload.conditions`
- _Pod Status_: `dt.kubernetes.pods`
- _Container State_: `dt.kubernetes.containers`

#### Technology-Specific Metrics

- _JVM Memory Usage_: `dt.runtime.jvm.memory.heap.used`, `dt.runtime.jvm.memory.heap.max`
- _Goroutine count_: `dt.runtime.go.scheduler.goroutine_count`
- _Go Worker thread count_: `dt.runtime.go.scheduler.worker_thread_count`
- _Go Heap Memory_: `dt.runtime.go.memory.heap`
- _Go Memory Committed_: `dt.runtime.go.memory.committed`

You can find additional metrics via `fetch metric.series | filter dt.entity.service == "<service-id>" | limit 50` or for containers: `fetch metric.series | filter k8s.namespace.name == "<namespace>" | filter metric.key == "dt.kubernetes.container.cpu_usage" or metric.key == "dt.kubernetes.container.memory_working_set" | limit 50`.

### Logs

You can find logs via the `fetch logs` tool and applying the following filter:

```dql
fetch logs
| filter k8s.namespace.name == "<namespace>"
| sort timestamp desc
```

Filter error logs with

```dql
| filter loglevel == "ERROR"
```

You can furthermore narrow down logs for a specific service by adding a filter like this: `| filter contains(k8s.deployment.name, "<service-name>")`.

## DQL Query Fundamentals

### Query Syntax Fundamentals

**Pipeline Processing:** DQL queries process data left-to-right through a chain of commands. Each command receives records from the previous command, transforms them, and passes results to the next.

**Basic Structure:**
```dql
fetch <record-type> | filter <condition> | summarize <aggregation> | sort <field> | limit <count>
```

**Execution Model:**
- `fetch` retrieves raw records from Grail storage
- `filter` reduces the result set (apply early for performance)
- `fields` selects specific columns (reduces data transfer)
- `summarize` aggregates records into groups
- `sort` orders results (can reference aggregation aliases)
- `limit` restricts output size (use liberally during development)

**Record Flow:** Each record flows through the pipeline. Commands like `filter` remove records, `fields` reshapes them, `summarize` combines multiple records into one.

### Commands

**fetch** - Retrieve data: `fetch logs`, `fetch events`, `fetch spans`, `fetch dt.entity.service`
**filter** - Apply conditions: `| filter loglevel == "ERROR" and timestamp > now() - 1h`
**fields** - Select fields: `| fields timestamp, content, loglevel`
**summarize** - Aggregate: `| summarize count(), by:{namespace}` (**ALWAYS requires aggregation function** - count(), sum(), avg(), etc.)
**sort** - Order: `| sort timestamp desc`
**limit** - Restrict: `| limit 100`
**timeseries** - Metrics: `timeseries avg(dt.host.cpu.usage), interval:5m, by:{host}`

### Operators & Functions

**Comparison:** `==`, `!=`, `<`, `<=`, `>`, `>=`
**Logical:** `and`, `or`, `not`
**Pattern Matching:**
- `matchesValue(field, "pattern*")` - Wildcard patterns (`*` for any characters)
- `matchesPhrase(field, "exact phrase")` - Exact phrase search
- `startsWith(field, "prefix")` - Check if field starts with value
- `endsWith(field, "suffix")` - Check if field ends with value
- `contains(field, "substring")` - Check if field contains substring
**Null:** `isNull(field)`, `isNotNull(field)`
**Array:** `in(array, value)` - Check if value exists in array field (NOT for filtering by multiple literal values)

### String Matching & Wildcards

```dql
// Exact match (double quotes required)
filter loglevel == "ERROR"

// Multiple values (use OR - NO set literal syntax in DQL)
filter loglevel == "ERROR" or loglevel == "WARN"
filter (loglevel == "ERROR" or loglevel == "WARN")  // Parentheses for clarity

// Wildcard patterns (* for any characters)
filter matchesValue(k8s.deployment.name, "*frontend*")
filter matchesValue(k8s.deployment.name, "prod-*")
filter matchesValue(log.source, "*/var/log/*", caseSensitive:false)  // Case-insensitive

// Starts/ends with (simpler than wildcards for prefix/suffix)
filter startsWith(k8s.deployment.name, "api-")
filter endsWith(k8s.pod.name, "-prod")

// Contains (substring search)
filter contains(k8s.deployment.name, "frontend")
filter contains(content, "timeout")

// Phrase search (exact sequence)
filter matchesPhrase(content, "connection timeout")
```

### Escaping Special Characters

**Backslash escaping** for special characters in strings:
```dql
// Escape quotes within strings
filter content == "Error: \"invalid input\""

// Escape backslashes
filter path == "C:\\Program Files\\App"

// Field names with spaces or special chars (use backticks)
filter `field.with-dash` == "value"
filter `field with spaces` == "value"
```

**Parse pattern escaping** (pipe `|` conflicts with DQL pipeline operator):
```dql
// ❌ Wrong: Pipe character breaks parsing
parse content, "LD 'error' | 'code:' DATA:code"  // Syntax error

// ✅ Correct: Avoid pipe in pattern or use separate parse commands
parse content, "LD 'error code:' DATA:code"
parse content, "LD 'error' LD 'code:' DATA:code"

// ✅ Alternative: Two parse commands
parse content, "LD 'error' DATA:error_part"
| parse error_part, "LD 'code:' DATA:code"
```

### Critical Syntax Rules

**1. Strings MUST use double quotes:** `"ERROR"` ✅ | `'ERROR'` ❌
**2. Summarize ALWAYS needs aggregation function:** `summarize count(), by:{x}` ✅ | `summarize by:{x}` ❌
**3. Multiple values use OR, not IN with lists:** `id == "SERVICE-1" or id == "SERVICE-2"` ✅ | ~~`id in ("SERVICE-1", "SERVICE-2")`~~ ❌ | The `in()` function only works with array fields, not literal value lists
**4. Use aliases for aggregations:** `summarize cnt = count() | sort cnt desc` ✅
**5. Array access after expand:** `fetch logs | expand tags | fields tags[key]` ✅ | `expand tags | fields key` ❌
**6. Metrics as fields not supported:** Service metrics like `dt.service.request.response_time` cannot be selected as fields on `fetch dt.entity.service`. Use `timeseries` or `fetch metrics` instead

### Common Patterns

```dql
// Error analysis by namespace/deployment (find error hotspots)
fetch logs | filter loglevel == "ERROR" and timestamp > now() - 24h
| summarize cnt = count(), by:{k8s.namespace.name, k8s.deployment.name} | sort cnt desc | limit 20

// Service performance timeseries (track response time trends)
timeseries avg(dt.service.request.response_time), percentile(dt.service.request.response_time, 95),
  from: now() - 7d, filter: dt.entity.service == "SERVICE-123"

// Pod health monitoring (errors & warnings by pod)
fetch logs | filter k8s.namespace.name == "prod" and (loglevel == "ERROR" or loglevel == "WARN") and timestamp > now() - 1h
| summarize cnt = count(), by:{k8s.pod.name, loglevel} | sort cnt desc

// Container resource usage (CPU/memory trends)
timeseries avg(dt.kubernetes.container.cpu_usage), avg(dt.kubernetes.container.memory_working_set),
  filter: k8s.namespace.name == "prod", by: {k8s.deployment.name}

// Log lookup with entity context (enrich logs with service metadata)
fetch logs | filter timestamp > now() - 1h
| lookup [fetch dt.entity.service], sourceField:dt.entity.service, lookupField:id
| fields timestamp, content, entity.name, k8s.deployment.name

// Parse log content (extract specific error codes/messages)
fetch logs | filter loglevel == "ERROR" and timestamp > now() - 1h
| parse content, "LD 'error:' SPACE? DATA:error_msg"
| summarize cnt = count(), by:{error_msg} | sort cnt desc | limit 10
```

### Entity Fields vs Metrics

**Important Distinction**: Entity fields and metric data require different query approaches:

```dql
// ✅ Correct: Query entity metadata
fetch dt.entity.service
| filter matchesValue(entity.name, "*checkout*")
| fields id, entity.name, calls, called_by

// ❌ Wrong: Cannot access metrics as fields on entities
fetch dt.entity.service
| fields id, dt.service.request.response_time  // This fails!

// ✅ Correct: Query metrics with timeseries
timeseries avg(dt.service.request.response_time),
  from: now() - 1h,
  filter: dt.entity.service == "SERVICE-123"

// ✅ Correct: Query metrics directly
fetch metrics
| filter metric.key == "dt.service.request.response_time"
  and dt.entity.service == "SERVICE-123"
  and timestamp > now() - 1h
```

**Rule**: Use `fetch dt.entity.*` for topology/metadata, use `timeseries` or `fetch metrics` for performance data.

### Data Discovery

```dql
// Available entities/record types
fetch dt.entity.* | summarize count(), by:{entity.type} | limit 100

// K8s resources (ALWAYS include aggregation with summarize)
fetch logs | filter timestamp > now() - 1h | summarize count(), by:{k8s.cluster.name, k8s.namespace.name} | limit 50
fetch logs | filter k8s.namespace.name == "ns" and timestamp > now() - 1h | summarize count(), by:{k8s.deployment.name}

// Available metrics
fetch metrics | summarize count(), by:{metric.key} | limit 100
fetch metrics | filter contains(metric.key, "kubernetes") | summarize count(), by:{metric.key}

// Log fields and values
fetch logs | limit 5
fetch logs | summarize count(), by:{loglevel}
```

### Best Practices & Performance

**Core Principles:**
1. **Start small, expand gradually** - Limit 10-50 initially, avoid overwhelming context/budget
2. **Always filter by time** - `timestamp > now() - 1h` (smallest necessary range)
3. **Filter early** - Indexed fields first (entity IDs, k8s labels, timestamps), then others
4. **Use aliases** - `summarize cnt = count() | sort cnt desc` enables sorting on aggregations
5. **Limit aggressively** - Control result size and cost

**Query Cost Hierarchy (Highest to Lowest Impact):**

| Factor | High Cost ❌ | Low Cost ✅ |
|--------|-------------|------------|
| **Time Range** | `now() - 7d` | `now() - 1h` |
| **Aggregations** | `by:{trace.id}` (high cardinality) | `by:{namespace}` (low cardinality) |
| **Filtering** | `contains(content, "text")` unfiltered | Filter by indexed fields first |
| **Field Selection** | Default (all fields) | `fields timestamp, content` |

**Efficient Pattern Template:**
```dql
fetch <type>
| filter <indexed_field> == "value" and timestamp > now() - 1h  // Indexed filters first
| filter <text_search>                                           // Expensive filters last
| fields <specific>, <fields>                                    // Only needed fields
| summarize <alias> = <function>(), by:{<low_cardinality>}      // Aggregate early
| sort <alias> desc | limit 100                                  // Control output
```

## Time Ranges: Syntax & Cost Trade-offs

**Syntax:**
```dql
// Relative (recommended)
timestamp > now() - 1h | now() - 24h | now() - 7d
// Absolute
timestamp > toTimestamp("2024-01-15T00:00:00Z")
// Timeseries
timeseries avg(metric), from: now() - 7d, to: now()
```

**Use Case Quick Reference:**

| Time Range | Cost | Use Case | Strategy |
|------------|------|----------|----------|
| `now() - 1h` | Low | Active troubleshooting | Start here, expand if needed |
| `now() - 6h` | Low-Med | Recent investigation | Pattern identification |
| `now() - 24h` | Medium | Daily analysis | Error trend analysis |
| `now() - 7d` | Med-High | Weekly trends | Use `timeseries` + aggregation |
| `now() - 30d` | High | Historical analysis | Specific filters required |
| `> 30d` | Very High | Rare investigations | Always aggregate/limit |

## Investigation Workflows

### Workflow 1: Service Degradation (Slow Response Times)

```dql
// 1. Find recent problems
fetch events | filter event.kind == "DAVIS_PROBLEM" and contains(affected_entity_ids, "SERVICE")
  and matchesValue(dt.entity.service_name, "*checkout*") and timestamp > now() - 2h
| fields timestamp, display_id, event.name, affected_entity_ids

// 2. Service metrics: response time & failures
timeseries avg(dt.service.request.response_time), percentile(dt.service.request.response_time, 95),
  sum(dt.service.request.failure_count), from: now() - 6h, interval: 5m,
  filter: dt.entity.service == "SERVICE-ABC123"

// 3. Error patterns in logs
fetch logs | filter dt.entity.service == "SERVICE-ABC123" and loglevel == "ERROR" and timestamp > now() - 1h
| summarize cnt = count(), by:{content} | sort cnt desc | limit 20

// 4. Resource constraints (CPU/memory)
timeseries avg(dt.kubernetes.container.cpu_usage), avg(dt.kubernetes.container.memory_working_set),
  from: now() - 2h, interval: 1m, filter: matchesValue(k8s.deployment.name, "*checkout*"), by: {k8s.pod.name}

// 5. Slow traces
fetch spans | filter dt.entity.service == "SERVICE-ABC123" and timestamp > now() - 1h and duration > 1000000000
| summarize avgDuration = avg(duration), p95 = percentile(duration, 95), cnt = count(), by:{span.name} | sort p95 desc
```

### Workflow 2: High Error Rate Analysis

```dql
// 1. Identify which deployments have errors
fetch logs | filter k8s.namespace.name == "production" and loglevel == "ERROR" and timestamp > now() - 1h
| summarize errorCount = count(), by:{k8s.deployment.name} | sort errorCount desc | limit 10

// 2. Error message patterns (use top deployment from step 1)
fetch logs | filter k8s.deployment.name == "payment-service" and loglevel == "ERROR" and timestamp > now() - 1h
| summarize cnt = count(), by:{content} | sort cnt desc | limit 20

// 3. When did errors start?
fetch logs | filter k8s.deployment.name == "payment-service" and loglevel == "ERROR" and timestamp > now() - 6h
| summarize errorCount = count(), by:{timeframe = bin(timestamp, 5m)} | sort timeframe asc

// 4. Correlate with K8s events
fetch events | filter k8s.namespace.name == "production" and matchesValue(k8s.deployment.name, "*payment*")
  and timestamp > now() - 2h | fields timestamp, event.type, event.name, k8s.pod.name | sort timestamp desc

// 5. Which pods are failing?
fetch logs | filter k8s.deployment.name == "payment-service" and loglevel == "ERROR" and timestamp > now() - 30m
| summarize errorCount = count(), firstError = min(timestamp), lastError = max(timestamp), by:{k8s.pod.name}
| sort errorCount desc
```

### Resource Exhaustion Pattern (OOMKilled/Crashing Pods)

```dql
// Find OOMKilled pods
fetch events | filter event.type == "RESOURCE_CONTENTION_EVENT" or contains(event.name, "OOMKilled")
  and timestamp > now() - 2h | fields timestamp, event.name, k8s.deployment.name, k8s.pod.name

// Memory/CPU usage trends
timeseries avg(dt.kubernetes.container.memory_working_set), avg(dt.kubernetes.container.cpu_usage),
  from: now() - 4h, interval: 1m, filter: matchesValue(k8s.deployment.name, "*api*"), by: {k8s.pod.name}

// Compare requests vs actual usage
fetch dt.entity.cloud_application_instance | filter matchesValue(entity.name, "*api*")
| summarize avgMemoryUsed = avg(dt.kubernetes.container.memory_working_set),
    memoryRequest = max(dt.kubernetes.container.requests_memory), memoryLimit = max(dt.kubernetes.container.limits_memory),
    by:{k8s.deployment.name}
```

## Troubleshooting Guide

### Syntax Error Quick Reference

| Error | Wrong ❌ | Correct ✅ |
|-------|---------|-----------|
| **String quotes** | `'ERROR'` | `"ERROR"` (must use double quotes) |
| **Missing aggregation** | `summarize by:{ns}` | `summarize count(), by:{ns}` |
| **Set literal syntax** | `loglevel in {"ERROR", "WARN"}` | `loglevel == "ERROR" or loglevel == "WARN"` (use OR) |
| **Sorting aggregations** | `sort count() desc` | `summarize cnt = count() \| sort cnt desc` (use alias) |
| **Missing time filter** | `filter loglevel == "ERROR"` | `filter timestamp > now() - 1h and loglevel == "ERROR"` |
| **Array access** | `expand tags \| fields key` | `fetch logs \| expand tags \| fields tags[key]` |
| **Special char fields** | `filter field-name == "x"` | ``filter `field-name` == "x"`` (use backticks) |
| **Time binning** | `by:{timestamp}` | `by:{timeframe = bin(timestamp, 5m)}` (use alias) |
| **IN with literals** | `id in ("VAL1", "VAL2")` | `id == "VAL1" or id == "VAL2"` (use OR chain) |
| **Metrics as fields** | `fetch dt.entity.service \| fields dt.service.request.response_time` | Use `timeseries` or `fetch metrics` for metric data |

### Zero Results Checklist

1. **Widen time range**: `timestamp > now() - 1h` → `now() - 6h`
2. **Verify field names**: `fetch logs | limit 5` to see available fields
3. **Check case-sensitivity**: `loglevel == "ERROR"` vs `"Error"`
4. **Review filter logic**: AND requires all conditions true, OR requires any
5. **Validate entity IDs**: Format is `SERVICE-ABC123`, not friendly names

### Performance Issues

**Query too slow (>10s)?**
- ✅ Add time filter: `timestamp > now() - 1h` (biggest impact)
- ✅ Filter by indexed fields first (entity IDs, k8s labels, timestamps)
- ✅ Reduce aggregation cardinality: Group by namespace, not trace ID
- ✅ Specify fields: `fields timestamp, content` vs getting all fields
- ✅ Limit results: `| limit 100`

**Query Limits Exceeded:**
- "Result size exceeded" → Add `| limit 1000` or aggregate instead
- "Query timeout" → Narrow time range, add specific filters, reduce cardinality
- "Too many groups" → Filter before aggregating on high-cardinality fields

### Common Pattern Fixes

```dql
// Lookup (not join)
fetch logs | lookup [fetch dt.entity.service], sourceField:dt.entity.service, lookupField:entity.id

// Nested aggregations (use subquery or multi-step)
summarize avg(value), by:{namespace} | summarize totalAvg = avg(avg())
```

## RUM & Frontend Monitoring

**Available Data:** User sessions, actions (load/click), Core Web Vitals, JS errors, XHR/Fetch failures, browser/device/geo metadata

### Key RUM Queries

**Session & Performance Analysis**
```dql
// Sessions with errors
fetch dt.session | filter timestamp > now() - 24h and error.count > 0
| summarize errorSessions = count(), totalErrors = sum(error.count), by:{app.name} | sort errorSessions desc

// Slow page loads (>3s)
fetch dt.user_action | filter timestamp > now() - 2h and action.type == "Load" and duration > 3000
| fields timestamp, app.name, action.name, duration | sort duration desc | limit 100

// Performance by type
fetch dt.user_action | filter timestamp > now() - 24h
| summarize avgDuration = avg(duration), p95 = percentile(duration, 95), cnt = count(), by:{action.type, app.name}
| sort p95 desc
```

**Core Web Vitals**
```dql
// LCP, CLS, FID trends
timeseries avg(dt.rum.largest_contentful_paint), avg(dt.rum.cumulative_layout_shift), avg(dt.rum.first_input_delay),
  from: now() - 7d, interval: 1h, filter: app.name == "MyWebApp"
```
**Thresholds:** LCP <2.5s (good), FID <100ms (good), CLS <0.1 (good)

**JavaScript Errors & Failed Requests**
```dql
// Top JS errors
fetch dt.rum.errors | filter timestamp > now() - 24h and error.type == "JavaScript"
| summarize errorCount = count(), affectedSessions = countDistinct(session.id), by:{error.message}
| sort errorCount desc | limit 20

// API failure rate by endpoint
fetch dt.rum.action | filter timestamp > now() - 24h
| summarize totalCalls = sum(xhr.count), failedCalls = sum(xhr.failure.count), by:{xhr.url}
| fields xhr.url, totalCalls, failedCalls, failureRate = failedCalls / totalCalls * 100 | sort failureRate desc
```

**Frontend-Backend Correlation**
```dql
// Backend services involved in failed user actions
fetch spans | filter timestamp > now() - 1h and trace.id in [
    fetch dt.user_action | filter error.count > 0 | fields trace.id ]
| summarize errorSpanCount = count(), by:{dt.entity.service, span.name} | sort errorSpanCount desc
```

**Additional Patterns:** Geographic analysis (`by:{geo.country, geo.city}`), Browser/device segmentation (`by:{browser.family, device.type}`), Apdex calculation (use `countIf()` with duration thresholds)
