# Gremlin Reliability Management

## 💡 What this does for you

Gremlin runs the failure tests, maps the dependencies, and scores every service for reliability. Gremlin Reliability Management brings that data directly into Dynatrace, next to the metrics and services you're already watching, so you can see what's resilient and where the risk is without switching tools.

No separate dashboard to check. No test report to go dig up. The reliability score is just there, on the service you're already looking at.

## 🔍 How it works

Once installed, Gremlin data shows up next to the services you already monitor in Dynatrace:

- **Reliability scores** for every service, tracked over time so you can see whether things are getting better or worse
- **Failure tests** that confirm your resilience mechanisms actually work, not just that they exist on paper
- **Configuration drift and hidden vulnerabilities**, detected automatically without needing to run a test first
- **Dependency maps** that show the failure paths you can't see just by looking at a service on its own
- **Standardized test suites and benchmarking**, so teams can be compared against the same bar instead of their own judgment calls

## 🚀 Install the app on the Dynatrace platform

*Gremlin Reliability Management is available as a Dynatrace app to all customers upon request.*

1. *Gremlin Reliability Management* is delivered via a [Hub subscription](https://docs.dynatrace.com/docs/shortlink/hub#add-subscription). Email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with your account name and tenant ID, as described [here](https://github.com/Dynatrace/community-examples/blob/main/dynatrace-apps/README.md).
2. We'll process your request and send instructions for subscribing to the channel and installing the app.

## ⚙️ Configuration

Before you start, you'll need:

- A Gremlin account and a Dynatrace account
- The Gremlin and Dynatrace agents deployed to your infrastructure
- An API key created in Dynatrace

**Send Gremlin events to Dynatrace**

This sends an event to Dynatrace whenever a Gremlin test starts or stops, so you can correlate test runs with what Dynatrace was already seeing at the time.

1. In the Gremlin web app, go to Company Settings > Options, scroll to Dynatrace under Integrations, and click Add.
2. Enter your Dynatrace instance URL and the API key you created above.
3. Click Save.

See the [Gremlin Dynatrace integration docs](https://www.gremlin.com/docs/platform-integrations-dynatrace) for details.

**Monitor services with Dynatrace metrics during a test**

This lets Gremlin watch Dynatrace metrics while a test is running and stop the test automatically if something breaks, instead of you having to watch a dashboard yourself.

1. In the Gremlin web app, go to Configurations > Health Checks.
2. Select Dynatrace from the Observability Tool dropdown.
3. Enter your Dynatrace instance URL in the API Base URL box.
4. If you're running a private or self-hosted Dynatrace instance, select Yes under "Is this observability tool behind a firewall or on-prem?" and follow the instructions for installing a [Private Network Integration (PNI) agent](https://www.gremlin.com/docs/platform/integration-agent/).
5. Enter your Dynatrace API key in the Authorization box, or store and retrieve it via [AWS Secrets Manager](https://www.gremlin.com/docs/platform-health-checks#toc-authenticating-using-a-secrets-management-tool).
6. Click Save.
7. Name your Health Check.
8. Choose how to [monitor your service](https://www.gremlin.com/docs/platform-health-checks-dynatrace#toc-creating-a-dynatrace-health-check): select a Kubernetes object, provide an Entity ID, or enter a Problems URL.
9. Optionally set the Polling Interval and Health Check Category.
10. Click Save Health Check.
