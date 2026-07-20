# Repository Standards

These standards keep the library consistent, trustworthy, and easy to maintain. Every solution in the repo follows them.

---

## 1. Folder placement

Each solution goes in **one subfolder** inside its category folder:

```
<category>/<solution-name>/
```

Categories: `dynatrace-apps/` · `dashboards/` · `notebooks/` · `launchpads/` · `agentic-ecosystem/` · `configuration-as-code/` · `observability-blueprints/`

> **Apps note:** Consumers install apps via the Dynatrace Hub, not from this repo. The `dynatrace-apps/` folder is an **index** — each app subfolder holds a README that describes the app and links to its Hub listing. It does not store the app's source code.

> **Hybrid note:** Dashboards, notebooks, and launchpads have separate folders. A solution that combines several types lives in **one** folder (its primary artifact) and is **cross-linked** from the others — see [§7 Hybrid solutions & cross-linking](#7-hybrid-solutions--cross-linking).

## 2. Naming pattern

- **Folders:** lowercase, hyphen-separated, descriptive, no customer names.
  ✅ `order-fulfillment-observability`  ❌ `Acme Corp Dashboard`, `dash_v2 final`
- **README:** always exactly `README.md`.
- **Screenshots:** `screenshot-01-<short-label>.png`, numbered in display order.
  e.g. `screenshot-01-overview.png`, `screenshot-02-drilldown.png`
- **Config artifacts:** name by type — `dashboard.json`, `notebook.json`, `workflow.yaml`. For Monaco/Terraform, use a `config/` subfolder.
- No spaces, no uppercase, no version numbers in folder names (put versions in the README).

## 3. Required files in every solution subfolder

| File | Required? | Notes |
|------|-----------|-------|
| `README.md` | ✅ Always | Follows the README standard below. |
| At least one screenshot | ✅ Always | A real screenshot of the working artifact. |
| Config artifact (JSON/YAML) | ✅ Where applicable | The actual export from Dynatrace. Apps link to the Hub instead. |

## 4. README standard

Every solution README has two parts: a **metadata header** (machine-readable) and **human sections**.

### 4a. Metadata header (YAML front-matter)

Placed at the very top of the README. This powers future search/filtering in the discovery layer.

```yaml
---
title: Order Fulfillment – Business Observability
category: Dashboards, Notebooks & Launchpads   # Apps | Dashboards, Notebooks & Launchpads | Agentic | Config as Code | Blueprints
type: Dashboard              # primary artifact: Dashboard | Notebook | Launchpad | App | Agent | Config | Blueprint
also_includes: []            # other artifact types in this solution, e.g. [Notebook] — drives cross-linking
tags: [business-observability, logs, order-management, retail]
verticals: [retail, e-commerce]   # optional
capabilities: [Logs, Grail, Business Events]   # Dynatrace capabilities used
author: Jane Doe
contact: "@jane.doe (Slack)"  # optional
last_updated: 2026-06-17
---
```

### 4b. Required human sections

| Section | Purpose |
|---------|---------|
| `# <Title>` + one-line summary | The problem solved and the benefit, in one sentence. |
| `## What it does` | 2–4 sentences: problem, audience, value. |
| `## Screenshots` | Embedded screenshot(s). |
| `## Prerequisites` | Dynatrace version, required apps/capabilities, data sources, permissions. |
| `## Setup` | Step-by-step import/deploy. |
| `## Configuration` | What to change for your environment (variables, placeholders). |

### 4c. Optional sections

`## Notes & limitations` · `## Related solutions`

## 5. Reusability & safety rules

- **No secrets.** Never commit API tokens, credentials, or private keys.
- **No customer data.** Anonymize or use synthetic data. Remove customer names from titles, folders, and screenshots.
- **No hard-coded environment values.** Replace tenant URLs, IDs, and management-zone names with variables or placeholders.
- **State the blast radius** (config-as-code): say exactly what the config creates or modifies.

## 6. The gold standard

The **[order-fulfillment-observability](./example-entry/dashboards/order-fulfillment-observability/)** entry is the reference implementation. Copy its structure, README, and naming for any new submission.

## 7. Hybrid solutions & cross-linking

Some solutions combine more than one artifact type — e.g. a dashboard that drills into a notebook. Handle these with **one physical home plus cross-links** — never duplicate files across folders.

**1. One home.** The solution lives in exactly one folder: the folder of its **primary** artifact (the main thing a user comes for). All its files — dashboard JSON, the notebook, screenshots, README — sit in that single subfolder.

**2. Declare every type in the metadata.** In the solution's README front-matter, set `type` to the primary type and list any others under `also_includes`:

```yaml
type: Dashboard
also_includes: [Notebook]
```

**3. Cross-list from the other folders.** In each *secondary* type's folder README, add the solution to the **"Also includes…"** section with a link to its primary home. A folder's file listing can only show what physically lives there, so this section is the only way someone browsing that folder discovers a hybrid that lives elsewhere — which is exactly why it's allowed where a plain contents table is not.

**Example.** A "Banking Wire Transfers" solution that is a dashboard + notebook:
- Lives in `dashboards/banking-wire-transfers/` (both the dashboard JSON and the notebook file are here).
- Its README declares `type: Dashboard` and `also_includes: [Notebook]`.
- `notebooks/README.md` lists it under "Also includes Notebooks": `[Banking Wire Transfers](../dashboards/banking-wire-transfers/) — Dashboard + Notebook`.

**Keeping it current.** Because every solution declares `also_includes` in its metadata, the "Also includes…" sections can later be **auto-generated by a GitHub Action** from that metadata — so they never go stale. Maintaining them by hand is fine while volume is low.
