---
title: Azure Security Incident Response
category: Workflows
type: Workflow
also_includes: []
tags: [azure, security, incident-response, microsoft-sentinel, forensics, sub-workflows]
verticals: []
capabilities: [Dynatrace Automation, Application Security, Grail]
last_updated: 2026-10-20
---

# Azure Security Incident Response

Isolate a compromised Azure VM within minutes of a Microsoft Sentinel alert, and preserve its disks for forensic analysis.

## What it does

When Microsoft Sentinel reports an intrusion or suspicious activity on a VM, the parent workflow gets the VM details and runs three sub-workflows:

- **Isolate Vulnerable VM** locks down the VM:
  - adds resource locks (`SEC-INVEST-DONOTDELETE`, `SEC-INVEST-DONOTMODIFY`);
  - disables managed identities;
  - blocks anonymous blob access;
  - attaches an isolation network security group that blocks all inbound and outbound traffic except from an allow-list.
- **Incident RG + Networking** creates a separate investigation resource group with a virtual network, subnet, public IP and network interface.
- **Snapshot, Disks, and VM** snapshots the OS and data disks, creates disks from those snapshots, and deploys an investigation VM with the copies attached.

The compromised VM is cut off from the network immediately, and its state is preserved without risk of tampering. The steps follow established Azure response procedures.

## Screenshots

> **No screenshot available yet.** The source repository didn't include one. If you run this example, please add a screenshot of the workflow (`screenshot-01-workflow.png`) in a pull request.

## Prerequisites

- Dynatrace SaaS with Workflows
- [Azure for Workflows](https://docs.dynatrace.com/docs/shortlink/automation-workflows-azure-setup) with a connection that may manage compute, network, storage, locks and role assignments in the subscription
- Microsoft Sentinel alerts ingested into Dynatrace (the trigger listens for `event.provider == "Microsoft Sentinel"` on virtual machines)
- An SSH key pair for the investigation VM

## Setup

1. **Optional: create a test VM.** In the Azure portal, create a resource group (for example `demo-incident-workflow`) and a VM (for example `vulnerable-vm`) with any region and size. Choose password authentication and set *Public inbound ports* to *None*. Copy the subscription ID.
2. **Upload all four templates** in **Workflows**:
   - `azure-security-incident-workflow-parent.workflow-template.yaml`
   - `azure-security-investigation-incident-rg-networking.workflow-template.yaml`
   - `azure-security-investigation-isolate-vulnerable-vm.workflow-template.yaml`
   - `azure-security-investigation-snapshot-disks-and-vm.workflow-template.yaml`

   Select your Azure connection in each one.
3. **Link the sub-workflows** in the parent. For example, `isolate_vulnerable_vm` must point to *Azure Security Investigation - Isolate Vulnerable VM*.
4. **Add your SSH public key** in the `public_ssh_keys` task of *Snapshot, Disks, and VM*.
5. **Test it.** In the parent workflow, choose **Run** with this example event:

   ```json
   {
     "azure.subscription": "<YOUR_SUBSCRIPTION_ID>",
     "azure.resource.group": "<YOUR_RESOURCE_GROUP>",
     "azure.resource.name": "<YOUR_VM_NAME>"
   }
   ```

After a successful run, Azure has a new `incident-workflow` resource group with the investigation VM, the disk snapshots, an isolation NSG and the cloned disks.

## Configuration

- **Allow-list:** the IP addresses in `ip_address_allow_list` that may still reach the isolated VM.
- **Names and region** of the investigation resources in the sub-workflows.
- **Trigger filter** in the parent, if your Sentinel events use different fields.

## Notes & limitations

- **Clean up after a test.** Delete the `SEC-INVEST-DONOTDELETE` and `SEC-INVEST-DONOTMODIFY` locks (*resource group > Settings > Locks*), then delete the VM and the `incident-workflow` resource group. Remove the locks only when the investigation is complete.
- The parent workflow's built-in guide repeats these steps inside the Workflows app.
- Migrated from the archived [Dynatrace-workflow-samples](https://github.com/Dynatrace/Dynatrace-workflow-samples) repository.
