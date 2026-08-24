# Setup dtctl and use it for extracting data from Dynatrace platform
dtctl is a CLI for the Dynatrace platform. Manage workflows, dashboards, queries, and more from your terminal or let AI agents do it for you. Its predictable verb-noun syntax (inspired by kubectl) makes it easy for both humans and AI agents to operate.


## Step 1: Install dtctl
https://github.com/dynatrace-oss/dtctl

---

## Step 2: Authenticate

#### OAuth login (recommended, no token management needed)
dtctl auth login --context my-env --environment "https://abc12345.apps.dynatrace.com"

#### Verify everything works
dtctl doctor

---

## Step 3: Create query 
Create a query like `dtctl query "fetch logs | limit 10" ` or run it or use the demo.dql

---

## Step 4: Run Query out of your Terminal

Run to see results in your terminal:
`dtctl query -f "demo.dql"`
--> see screenshot-run-demo-file

Export data as csv:
`dtctl query -f "demo.dql" -o csv > my_cost.csv`
--> see example-output.csv

Export data as csv and as json:
`dtctl query -f "demo.dql" -o csv > my_cost.csv && dtctl query -f "demo.dql" -o json > my_cost.json`
--> see example-output.json