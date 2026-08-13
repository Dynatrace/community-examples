# Kiro Agent Instructions for Dynatrace

This folder contains the `dynatrace.md` steering file of the [Dynatrace Kiro power](https://kiro.dev/powers/), designed to enable the Kiro agent to interact seamlessly with your Dynatrace environment.

## Overview

The `dynatrace.md` file serves as a comprehensive guide for the Kiro agent. It defines the capabilities and usage patterns for various Dynatrace MCP tools, enabling the agent to act as an expert observability assistant.

<img width="1800" height="740" alt="schemativ overview" src="https://raw.githubusercontent.com/Dynatrace/community-examples/refs/heads/main/agentic%20ecosystem/Kiro%20power/overview.png" />

## Supported Use Cases

The instructions cover a broad spectrum of monitoring and troubleshooting scenarios, ensuring Kiro can handle complex requests:

### 🔍 Deep Dive Investigations
*   **Service Degradation:** Step-by-step workflows to investigate slow response times by correlating metrics, logs, and traces.
*   **High Error Rate Analysis:** Identifying which deployments are failing, analyzing error patterns, and pinpointing affected pods.
*   **Resource Exhaustion:** Diagnosing OOMKilled events, analyzing memory/CPU trends, and comparing requests vs. limits.
*   **End-to-End Troubleshooting:** Correlating frontend user issues (RUM) with backend service performance and database calls.

### 📊 Data Querying & Analysis (DQL)
*   **Log Analysis:** Advanced filtering (by time, namespace, level), pattern matching, and aggregation of log data.
*   **Metrics & Timeseries:** Fetching and visualizing CPU, memory, and custom metric trends over specific time windows.
*   **Query Optimization:** Best practices for writing efficient queries, managing limits, and debugging slow or zero-result queries.
*   **Frontend Monitoring:** Analyzing user sessions, Core Web Vitals (LCP, CLS), and JavaScript errors.

### ☸️ Infrastructure & Topology
*   **Kubernetes Insights:** Retrieving and filtering cluster events to understand platform health.
*   **Entity Management:** Locating specific services, hosts, and processes within the topology.
*   **Problem Detection:** Querying active and closed problems detected by Davis AI to understand root causes.

## Usage

To use this steering file with Kiro:

1.  **Download:** Download the `dynatrace.md` file.
2.  **Install:** Place the file in your Kiro `steering` directory (.kiro/steering) or import it via the agent configuration.
3.  **Interact:** Ask Kiro questions such as:
    *   *"Investigate the slow response times on the checkout service."*
    *   *"Show me the most frequent error logs in production for the last hour."*
    *   *"Analyze the memory usage of the payment-service pods."*
    *   *"What are the top JavaScript errors affecting our users right now?"*

## Requirements

*   A running Kiro agent instance.
*   Access to a Dynatrace environment with permissions to query Grail (DQL) and access topology data.
