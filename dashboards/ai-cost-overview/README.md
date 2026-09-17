# DQL Usage Overview
This dashboard provides insights into **DQL usage, execution cost, and optimization opportunities** across a Dynatrace environment. It is designed to help teams understand where DQL is used, how much it costs, and where improvements can reduce overall consumption.

<img width="2560" height="1243" alt="Screenshot 1" src="https://github.com/user-attachments/assets/ba313956-3362-4c5b-ae57-14ef156feb34" />


## 🎯 Purpose

The dashboard helps you quickly understand **DQL cost drivers and usage behavior** from an operational and financial perspective.

It enables you to:
- Track overall DQL usage and cost trends
- Identify heavy users, expensive queries, and costly data sources
- Detect inefficient or un‑optimized DQL usage
- Support governance, FinOps, and optimization initiatives



## 📊 What You’ll See

This dashboard contains multiple visual tiles grouped into logical sections to help interpret DQL usage and cost.

### DQL Usage Overview
High‑level KPIs and trends including:
- Total DQL cost
- Cost over time
- Data scanned (GB)
- Execution counts

### User Analysis
Insights into DQL usage per user, including:
- Total cost per user
- Executions by DQL type** (logs, events, traces, metrics)
- Cost distribution by category

### Deep‑Dive Analysis
- Cost by Bucket
- Cost by App


### Optimization Opportunity
Focused views to highlight cost reduction potential:
- Most Expensive Queries
- Un‑optimized DQL
- Avg Cost & GB per Execution
  

## ⚙️ Getting Started

Follow these steps to import and use the dashboard in your Dynatrace environment:

1. Download the josn file from this repository.
2. In Dynatrace, open the **Dashboards** app.
3. Click **Import dashboard** and upload the JSON file.
4. Once imported, review and adjust:
   - Timeframe defaults
   - Any environment‑specific filters or buckets
5. Save the dashboard and start exploring your DQL usage data.

