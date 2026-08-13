# Cloud Cost Optimization Review — Claude Code Prompt

**Tool:** Claude Code with `dtctl`  
**Output:** Self-contained HTML report saved to `~/Downloads/`

---

## How to use

1. Replace `<CONTEXT_NAME>` with the `dtctl` context for the customer you're reviewing.
2. Paste the entire block below into Claude Code.
3. Claude Code discovers the environment, runs the analysis, and opens the report.
4. Print to PDF to share with the AE or customer.

---

## Prompt

```
Switch to dtctl context <CONTEXT_NAME> and produce a cloud cost optimization review for their environment. Follow this process:

1. Discover before assuming. Query smartscapeNodes "AWS_*" and smartscapeNodes "AZURE_*" counts to find out which cloud (if either) actually has resources monitored — don't assume AWS just because that's the usual case. Separately check for a Kubernetes footprint (K8S_CLUSTER, K8S_NODE, K8S_POD counts) — some tenants have none. Only build sections for what's actually present. If a cloud integration isn't enabled (no AWS_*/AZURE_* entities despite hosts reporting cloud.provider), say so explicitly and fall back to OneAgent host-level metrics, scoped down accordingly.

2. Dangling/idle resource detection, scoped to whichever cloud is present:
- AWS: unattached EBS volumes, idle EC2 (avg CPU <5% over 14d), unassociated EIPs, idle NAT gateways, zero-invocation Lambdas.
- Azure: unattached managed disks, deallocated VMs (price their still-attached disks, not compute), idle VMs (avg CPU <5% over 14d, fetch OS type and price Windows vs. Linux separately — Windows roughly doubles the rate), unassociated public IPs.
- Before counting anything as waste, check if it's there by design. Specifically: unattached disks/volumes with names indicating DR/replication (e.g., "ASRReplica", "DR", "standby") are often intentional — verify before flagging. Idle VMs in HA/DR clusters (matching naming patterns like *hdb1c01/02/03, or resource groups split across regions) may be legitimate low-CPU standby/replica nodes — cross-check naming and resource group layout, and if it looks like an HA pair or DR replica, exclude it from the savings total and disclose it separately with a caveat instead.

3. Kubernetes over-provisioning, if a K8s footprint exists:
- Compare requested vs. used CPU/memory per namespace.
- Use a live, point-in-time snapshot (e.g., last 15 min, arrayLast), not a multi-day average summed by namespace. A multi-day sum over by:{cluster,namespace} will include stale requests_cpu/requests_memory values from pods that are Failed or Pending (their spec still reports resource requests via kube-state-metrics even though they're not consuming node capacity) — this can inflate the "wasted" figure by 10-20x in namespaces with high pod churn (CI/CD runners, batch/Spark-style job executors).
- Filter to Running-phase pods only before summing requests/usage.
- Sanity-check the result against real node capacity: sum dt.kubernetes.node.cpu_allocatable / memory_allocatable across all nodes and confirm total requested capacity doesn't grossly exceed it. If it does, the aggregation is wrong — investigate before reporting.
- Verify the billing model with evidence, not naming. Don't assume a namespace is "Fargate-billed" because the name contains "fargate" — check actual node hostnames (fargate-ip-... for AWS, or absence of VMSS-backed nodes) to confirm per-cluster, since it changes both the price used and how directly the savings translate to the bill.
- Price the gap using a rate derived from evidence: AWS Fargate published rates for confirmed-Fargate clusters, or a rate derived from the actual dominant AKS/EKS node VM size for node-backed clusters (not an arbitrary flat rate).

4. Pricing discipline. Use published on-demand list rates by exact instance/VM type and OS. For Azure managed disks, use tiered pricing (disks bill at fixed monthly tier rates, not linear $/GB) — round each disk's size up to its tier. Flag any instance type you don't have a confident published rate for (footnote it, don't silently guess). State clearly that these are list-price estimates, not the customer's actual bill (Savings Plans/RIs/Hybrid Benefit/commitments will lower real cost).

5. Tone. Write for the customer, not for an internal audit. Gentle, collaborative language — "savings opportunity," "underused," "worth a look" — never "waste," "danger," or alarm-red styling. Explicitly say upfront that some of this is normal at scale and isn't a mistake. Lead with a "here's what's actually fine" note if hygiene is good in some area — don't manufacture urgency where there isn't any.

6. Output. A single self-contained HTML file (inline CSS, no JS frameworks, no external assets): exec summary with a total $/mo estimate broken into categories, a "where we'd start" callout, per-category tables (top 15-20 rows, footnoted as such), an explicit "what we excluded and why" section for anything ruled out in step 2, and a "how we calculated this" methodology section with confidence caveats. Save it to ~/Downloads/ and open it.
```

---

**Tip:** If you already know the customer only has one cloud provider or no Kubernetes, you can trim step 1's discovery — but leaving it in catches surprises (e.g. a tenant with zero AWS entities despite AWS-tagged hosts).
