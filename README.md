# Dynatrace Community Examples & Solutions

**A community-driven library of reusable Dynatrace artifacts — dashboards, apps, agents, and configurations — built to solve real-world customer scenarios.**

Start from something that already works instead of rebuilding from scratch: accelerate POCs, raise quality in the field, and grow a shared knowledge base that compounds as more people contribute.

> ⚠️ **Community Examples & Solutions are not officially maintained or supported by Dynatrace.** They are shared as-is by the community. Use them as inspiration and starting points, and review before using in production.

---

## What's inside

The repository is organized by artifact category. Each folder has its own README with the examples it contains and how to use them.

### 🟢 Ready to use & quick to contribute

| Folder | Category | What you'll find |
|--------|----------|------------------|
| [`dashboards/`](./dashboards) | 📊 **Dashboards** | Ready-to-import dashboards for real use cases. |
| [`notebooks/`](./notebooks) | 📓 **Notebooks** | Analysis notebooks that walk through an investigation or flow. |
| [`launchpads/`](./launchpads) | 🚀 **Launchpads** | Curated launchpads that guide users to the right apps and dashboards. |
| [`agentic-ecosystem/`](./agentic-ecosystem) | ✨ **Agentic Ecosystem** | Agent definitions, prompts, and workflow templates to jump-start Agentic AI use cases. |
| [`configuration-as-code/`](./configuration-as-code) | ⚙️ **Configuration as Code** | Monaco / Terraform examples for automating configuration management. |
| [`dynatrace-apps/`](./dynatrace-apps) | 🧩 **Apps** | An **index** of full Dynatrace Apps (AI workflow connectors, CI/CD Observability, Cloud SRE Agents). Consumers install these via the **Hub**, not from this repo — each entry links to its Hub listing. |
| [`observability-blueprints/`](./observability-blueprints) | 🗺 **Observability Blueprints** | End-to-end reference setups that combine multiple artifacts into a complete solution for a scenario. |
| [`cost-intelligence-blueprints/`](./cost-intelligence-blueprints) | 💰 **Cost Intelligence Blueprints** | End-to-end solutions for DPS cost visibility, budget alerting, and cost optimization using the Account Management API, workflows, and Grail. |

> Dashboards, notebooks, and launchpads each have their own folder. A solution that combines several (e.g. a dashboard that drills into a notebook) lives under its **primary** artifact, with the other pieces in the same subfolder.

---

## How to contribute

Community Examples & Solutions are contributed by **Dynatrace employees**.

- **Dynatrace employees:** the contribution process lives on the internal **Community Examples & Solutions** page (search "Community Examples & Solutions" on the internal SharePoint). See also **[CONTRIBUTING.md](./CONTRIBUTING.md)**.
- **Everyone:** these solutions are free to use and adapt. Found a problem with one? Open a [GitHub issue](../../issues).

Every contribution meets the [quality bar](./CONTRIBUTING.md): clear customer value, reusable by design (no hard-coded IDs/environments), production-ready, low adoption friction, and self-service documentation. All submissions follow the **[repository standards](./STANDARDS.md)** — the fastest way to get it right is to copy the **[gold-standard example](./example-entry/dashboards/order-fulfillment-observability/)**.

---

## Installing a Custom App

Most apps in this repository are delivered via the [Dynatrace Hub](https://docs.dynatrace.com/docs/shortlink/hub) using the [Hub subscriptions](https://docs.dynatrace.com/docs/shortlink/hub#add-subscription) concept — community-built apps are delivered exactly like any other Dynatrace app.

1. **Request access** — email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with the **app name**, your **account name**, and your **tenant ID**.
2. **Get your channel ID** — once we verify your request, we'll send you the channel ID for that app.
3. **Subscribe & install** — in your Dynatrace environment, open **Settings → General → Hub subscriptions → Add subscription**, give it a meaningful name, paste the channel ID, and **Save**. Then search for the app in **Hub** and install it.

---

## Questions & support

- 🐛 **Found an issue with an example?** Open a [GitHub issue](../../issues).
- 🧩 **App access & install:** email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) — see [Installing a Custom App](#installing-a-custom-app) above.
- 🏢 **Dynatrace employees:** see the internal **Community Examples & Solutions** page for contribution help.

---

*Part of the Dynatrace Open Source Initiative. Projects here are maintained by the community and, unless stated otherwise, are not officially supported by Dynatrace.*
