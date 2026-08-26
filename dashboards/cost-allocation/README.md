# DPS Cost Allocation Dashboard v3.10

## Overview
**Understand your costs. Stay in control.**

The **Cost Allocation Dashboard** helps you break down and explore usage and cost data per environment — giving you the transparency you need to manage resources effectively.

With this dashboard, you can:
- View total usage and costs for any selected period.
- Apply service fees on top of Dynatrace rate cards — different dashboards can use different rate card configurations.
- Track how costs evolve over time.
- Drill down by cost center or product.
- Trace each usage item back to its source.

Whether you're showing costs back to teams or investigating optimization opportunities, the dashboard gives you the visibility to make informed decisions.

**Simple. Transparent. Secure.**

Before using the Cost Allocation Dashboard, make sure you have configured [Dynatrace Cost Allocation](https://docs.dynatrace.com/docs/license/cost-allocation).

For questions and support, join the conversation in the [Dynatrace Community](https://community.dynatrace.com/t5/DPS-Cost-Allocation/gh-p/DPSCostAllocationpublic).

<img width="1919" height="1199" alt="Screenshot" src="https://github.com/user-attachments/assets/771353df-2f85-4334-92da-e352c52a6346" />

---

## 🎯 Purpose
The **DPS Cost Allocation Dashboard** helps organizations:
- Understand how their usage of Dynatrace capabilities, linked to their DPS license, is distributed across customer-defined cost centers.
- Optimize resource allocation and usage.
- Support chargeback and show-back use cases between teams or departments within an organization.

The dashboard allows you to view your current cost-field enrollment status, along with the usage and expenses associated with each supported capability. Use the **top left section** to navigate between different capabilities. The variables in the **top middle area** enable you to adjust the pricing according to your rate card.

You can also use this dashboard as a foundation to create your own usage and cost summaries, which can then be shared internally with your colleagues.

---

## 📊 What You’ll See
The dashboard includes the following visualizations:
- **Estimated Cost Distribution per Capability (Pie Chart):** Visualizes the cost distribution across different capabilities.
- **Estimated Costs per Cost Center or Product (Pie Chart):** Displays the cost distribution across various cost centers or products.
- **Total Costs (Single Value):** Shows the total cost for the selected timeframe.
- **List of Usage and Estimated Costs (Table):** Provides a detailed breakdown of usage and costs per capability and cost center.

---

## ⚙️ Getting Started

### Prerequisites
Before you begin, ensure you have:
- A Dynatrace environment with access to the Dashboards app.
- Appropriate permissions to import and edit dashboards.
- Appropriate permissions to view System Events.
- DPS Cost Allocation properly set up.

### Installation Steps
1. **Download the JSON File**  
   Choose the version that fits your needs:
   - [Standard version](DPS%20Cost%20Allocation%20Overview%20Dashboard%20v3.10.json) — cost overview by capability and cost center, no additional setup required.
   - [Extended version](DPS%20Cost%20Allocation%20Overview%20Dashboard%20extended%20v3.10.json) & [Helper Notebook](Notebook%20helper/Cost%20Allocation%20Extended%20Setup%20Notebook%20v3.10.json) — additionally maps individual users to cost centers or products via a lookup table, and adds support for Query, Workflow, Functions, and Real User Monitoring (Real User Monitoring, Real User Monitoring with Session Replay, Real User Monitoring Property). Requires setting up a notebook and a workflow.
   
   > To download a file, open the link and click the **Download raw file** button (top right of the file viewer).

2. **Import the Dashboard:**
   - Open the **Dashboards** app in your Dynatrace environment.
   - Click on **Import dashboard** and upload the downloaded JSON file.
   - **If you downloaded the extended version**, also import the helper notebook:
     - Open the **Notebooks** app in your Dynatrace environment.
     - Click on **Import notebook** and upload the helper notebook JSON file.
     - Follow the instructions at the top of the notebook to create a lookup table that maps users to a cost center or product.

3. **Adjust Variables:**
   - Configure the `price_points` variable with a JSON array that maps each capability key to its unit price. See [Configuring the `price_points` Variable](#%EF%B8%8F-configuring-the-price_points-variable) below for details.
   - Modify the namespace and cluster filters if your environment differs.

4. **Share and Explore:**
   - Share the dashboard with your team and start analyzing your cost data.

---

## ⚙️ Configuring the `price_points` Variable

The `price_points` variable holds a JSON array that maps each Dynatrace capability to its unit price. It drives all cost calculations in the dashboard.

Each entry looks like this:

```json
[
  {
    "key": "FULLSTACK_MONITORING",
    "name": "Full-Stack Monitoring",
    "price": "800.00",
    "Category": "Application and Infrastructure Observability",
    "unitName": "memory-gibibyte-hours",
    "priceUnit": "100000",
    "currencyCode": "USD"
  },
  ...
]
```

### Option A — Generate from your Account Management Portal (recommended)

Use the included `convert-ratecard.js` script to produce the JSON automatically from your contract rate card:

1. Log in to your **Dynatrace Account Management Portal** and navigate to the rate card section. See `pricing-page.png` in this folder for the expected page layout.
2. Select and copy the full rate card table text.
3. Paste it into `AMP-ratecard.txt` (replacing any existing content), keeping the tab-separated format with four columns: **Name**, **Deployment Type**, **Unit price**, **Unit of measure**.
4. Run the converter:
   ```bash
   node convert-ratecard.js
   ```
   This writes the result to `price-point.json` in the same folder.
5. Copy the contents of `price-point.json` and paste it as the default value of the `price_points` variable in the dashboard.

> **Note:** The script automatically detects the currency code, price, and price units. After generating the file, review and adjust the `price` and `priceUnit` fields in `price-point.json` to match your actual contract rates before pasting into the dashboard.

### Option B — Edit manually

Open the dashboard, navigate to the `price_points` variable, and edit the JSON array directly. Adjust the `price`, `priceUnit`, and `currencyCode` fields to match your contract rates.

---

## 🛠️ Support
For additional help, visit the [Dynatrace Community](https://community.dynatrace.com/t5/DPS-Cost-Allocation/gh-p/DPSCostAllocationpublic).

---

**Stay in control of your costs with the DPS Cost Allocation Dashboard!**
