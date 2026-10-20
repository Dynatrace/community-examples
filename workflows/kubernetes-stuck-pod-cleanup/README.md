---
title: Kubernetes Stuck Pod Cleanup
category: Workflows
type: Workflow
also_includes: []
tags: [kubernetes, auto-remediation, edgeconnect, anomaly-detection, davis-events]
verticals: []
capabilities: [Dynatrace Automation, Kubernetes, EdgeConnect, Davis AI]
last_updated: 2026-10-20
---

# Kubernetes Stuck Pod Cleanup

Force-delete pods that hang in the terminating phase automatically, instead of waiting for someone to notice and run `kubectl` by hand.

## What it does

Dynatrace Kubernetes anomaly detection raises a Davis event when a pod is stuck in the terminating phase. This workflow reacts to that event and uses the Kubernetes Automation connector (through EdgeConnect) to force-delete the pod. The folder also contains the Kubernetes manifests you need to set up Kubernetes Automation with the Dynatrace Operator, plus a test pod that you can use to simulate the problem.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows and the Kubernetes app
- Kubernetes cluster monitored by the Dynatrace Operator
- [Kubernetes Automation](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/guides/deployment-and-configuration/edgeconnect/kubernetes-automation) with EdgeConnect (the `dynatrace.kubernetes.connector` app)
- An OAuth client for EdgeConnect
- `kubectl` access to the cluster

## Setup

1. **Set up Kubernetes Automation with the Operator.** Follow the [operator-supported setup](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/guides/deployment-and-configuration/edgeconnect/kubernetes-automation/edge-connect-kubernetes-automation-operator-supported-setup) and apply each manifest with `kubectl apply -f <file>.yaml`:
   - [`secret.yaml`](./secret.yaml): stores the OAuth client for EdgeConnect.
   - [`role.yaml`](./role.yaml): the permissions for the automation use cases.
   - [`serviceaccount.yaml`](./serviceaccount.yaml): the service account that EdgeConnect impersonates to call the Kubernetes API server.
   - [`rolebinding.yaml`](./rolebinding.yaml): links the service account to the role.
   - [`edgeconnect.yaml`](./edgeconnect.yaml): deploys EdgeConnect in the `dynatrace` namespace and creates the Kubernetes connection in Dynatrace.
2. **Turn on anomaly detection.** In **Settings > Anomaly Detection > Workloads**, enable detection of pods stuck in the pending and terminating phases ([details](https://docs.dynatrace.com/docs/observe/infrastructure-monitoring/container-platform-monitoring/kubernetes-app/reference/anomaly-detectors)).
3. **Import the workflow.** In **Workflows**, choose **Upload** and select [`kubernetes-stuck-pod-cleanup.workflow-template.yaml`](./kubernetes-stuck-pod-cleanup.workflow-template.yaml). Select the connection that you created with `edgeconnect.yaml`, then activate the trigger.
4. **Optional: simulate the problem.** Apply [`podtermination.yaml`](./podtermination.yaml) to create a pod that stays in the terminating phase once deleted, then run `kubectl delete pods pod-stuck`. If your security rules require it, replace the image with one you trust.
5. **Watch it work.** Open the Kubernetes app, select **Pods** and filter for your test cluster. After the detection timeframe (10 minutes by default), the workflow runs and force-deletes the pod.

## Configuration

- `secret.yaml`: replace the sample OAuth client ID and secret with your own. Don't commit real values.
- `edgeconnect.yaml`: replace `apiServer` (`abcde123456.apps.dynatrace.com`) with your environment.
- The workflow trigger filters on Kubernetes anomaly detection events. Narrow it to specific clusters or namespaces if you don't want it to act everywhere.

## Notes & limitations

- The workflow **force-deletes** pods. Test it on a non-production cluster first, and scope the role in `role.yaml` to what you need.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.

## Related solutions

- [Workflow JavaScript Snippets](../workflow-javascript-snippets/): includes a snippet that picks the Kubernetes connection from the cluster UID in an event.
- [Kubernetes Threat Detection](../kubernetes-threat-detection/)
