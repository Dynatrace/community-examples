# Cloud Cost Optimization Review — Dynatrace Assist Prompt

**Tool:** Dynatrace Assist  
**Based on:** the Claude Code variant in `prompt-claude-code.md`  
**Output:** HTML presented in a code block — copy, save as `.html`, open in browser

---

## How to use

1. Paste the entire prompt below into Dynatrace Assist.
2. When Assist pauses and prompts you to continue (tool call budget limit), type **"Continue investigation"**.
3. Copy the final HTML from Assist's response into your text editor. Save as `report.html`.
4. Open in browser. Print to PDF if needed.

> Assist runs against the **currently open tenant** — no context switching needed.  
> The "Continue investigation" step is expected behaviour due to platform tool call limits, not an error.

---

## Prompt

```
Please produce a cloud cost optimization review for their environment. Follow this process:

##### Discover before assuming.
Query smartscapeNodes "AWS_*" and smartscapeNodes "AZURE_*" counts to find out which cloud (if either) actually has resources monitored — don't assume AWS just because that's the usual case. Separately check for a Kubernetes footprint (K8S_CLUSTER, K8S_NODE, K8S_POD counts) — some tenants have none. Only build sections for what's actually present. If a cloud integration isn't enabled (no AWS_*/AZURE_* entities despite hosts reporting cloud.provider), say so explicitly and fall back to OneAgent host-level metrics, scoped down accordingly.

##### Dangling/idle resource detection, scoped to whichever cloud is present:
- AWS: unattached EBS volumes, idle EC2 (avg CPU <5% over 14d), unassociated EIPs, idle NAT gateways, zero-invocation Lambdas.
- Azure: unattached managed disks, deallocated VMs (price their still-attached disks, not compute), idle VMs (avg CPU <5% over 14d, fetch OS type and price Windows vs. Linux separately — Windows roughly doubles the rate), unassociated public IPs.
- Before counting anything as waste, check if it's there by design. Specifically: unattached disks/volumes with names indicating DR/replication (e.g., "ASRReplica", "DR", "standby") are often intentional — verify before flagging. Idle VMs in HA/DR clusters (matching naming patterns like *hdb1c01/02/03, or resource groups split across regions) may be legitimate low-CPU standby/replica nodes — cross-check naming and resource group layout, and if it looks like an HA pair or DR replica, exclude it from the savings total and disclose it separately with a caveat instead.

##### Kubernetes over-provisioning, if a K8s footprint exists:
- Compare requested vs. used CPU/memory per namespace.
- Use a live, point-in-time snapshot (e.g., last 15 min, arrayLast), not a multi-day average summed by namespace. A multi-day sum over by:{cluster,namespace} will include stale requests_cpu/requests_memory values from pods that are Failed or Pending (their spec still reports resource requests via kube-state-metrics even though they're not consuming node capacity) — this can inflate the "wasted" figure by 10-20x in namespaces with high pod churn (CI/CD runners, batch/Spark-style job executors).
- Filter to Running-phase pods only before summing requests/usage.
- Sanity-check the result against real node capacity: sum dt.kubernetes.node.cpu_allocatable / memory_allocatable across all nodes and confirm total requested capacity doesn't grossly exceed it. If it does, the aggregation is wrong — investigate before reporting.
- Verify the billing model with evidence, not naming. Don't assume a namespace is "Fargate-billed" because the name contains "fargate" — check actual node hostnames (fargate-ip-... for AWS, or absence of VMSS-backed nodes) to confirm per-cluster, since it changes both the price used and how directly the savings translate to the bill.
- Price the gap using a rate derived from evidence: AWS Fargate published rates for confirmed-Fargate clusters, or a rate derived from the actual dominant AKS/EKS node VM size for node-backed clusters (not an arbitrary flat rate).

##### Pricing discipline
Use published on-demand list rates by exact instance/VM type and OS. For Azure managed disks, use tiered pricing (disks bill at fixed monthly tier rates, not linear $/GB) — round each disk's size up to its tier. Flag any instance type you don't have a confident published rate for (footnote it, don't silently guess). State clearly that these are list-price estimates, not the customer's actual bill (Savings Plans/RIs/Hybrid Benefit/commitments will lower real cost).

##### Tone
Don't write for an internal audit. Gentle, collaborative language — "savings opportunity," "underused," "worth a look" — never "waste," "danger," or alarm-red styling. Explicitly say upfront that some of this is normal at scale and isn't a mistake. Lead with a "here's what's actually fine" note if hygiene is good in some area — don't manufacture urgency where there isn't any.

##### Output
HTML output presented in a code block for easy copy/paste. Provide an exec summary with a total $/mo estimate broken into categories, a "where we'd start" callout, per-category tables (top 15-20 rows, footnoted as such), an explicit "what we excluded and why" section for anything ruled out in part 2, and a "how we calculated this" methodology section with confidence caveats.
```

---

**Tip:** If you have [Assist personalization](https://docs.dynatrace.com/docs/shortlink/dynatrace-assist) enabled, adapt the `##### Tone` and `##### Output` sections to add "this is for personal use" and Assist will adjust its style accordingly.
