import json
import os
from pathlib import Path

from dotenv import load_dotenv

from budget.dynatrace.auth import get_token
from budget.dynatrace.client import DynatraceClient
from budget.dynatrace.events import build_events, send_biz_events
from budget.tracker import aggregate_monthly, check_budget
from budget.utils import current_month_range

load_dotenv()

RESULTS_DIR = Path("results")


def save(filename: str, data) -> None:
    path = RESULTS_DIR / filename
    path.write_text(json.dumps(data, indent=2))
    print(f"  -> saved {path}")


def main():
    client_id = os.environ["DT_CLIENT_ID"]
    client_secret = os.environ["DT_CLIENT_SECRET"]
    account_uuid = os.environ["DT_ACCOUNT_UUID"]
    subscription_uuid = os.environ.get("DT_SUBSCRIPTION_UUID")
    monthly_budget = float(os.environ.get("DT_MONTHLY_BUDGET", 0))
    environment_url = os.environ.get("DT_ENVIRONMENT_URL")
    ingest_token = os.environ.get("DT_INGEST_TOKEN")
    event_bucket = os.environ.get("DT_EVENT_BUCKET")  # optional restricted bucket

    token = get_token(client_id, client_secret, account_uuid)
    client = DynatraceClient(account_uuid, token, subscription_uuid)

    # Resolve subscription
    if not subscription_uuid:
        subscriptions = client.get_all_subscriptions()
        save("subscriptions.json", subscriptions)
        if not subscriptions:
            print("No active subscriptions found for this account.")
            return
        if len(subscriptions) > 1:
            print("Multiple active subscriptions found:")
            for s in subscriptions:
                print(f"  {s['uuid']}  {s['name']}  ({s['status']})")
            print("\nSet DT_SUBSCRIPTION_UUID in .env to pick one.")
            return
        subscription_uuid = subscriptions[0]["uuid"]
        client._subscription = subscription_uuid
        print(f"Using subscription: {subscriptions[0]['name']} ({subscription_uuid})\n")

    # Subscription detail
    detail = client.get_subscription(subscription_uuid)
    save("subscription_detail.json", detail)

    sub_budget = detail.get("budget", {})
    period = detail.get("currentPeriod", {})
    print("=== Subscription detail ===")
    print(f"  Name:          {detail.get('name')}")
    print(f"  Status:        {detail.get('status')}")
    print(f"  Period:        {period.get('startTime')} -> {period.get('endTime')} ({period.get('daysRemaining')} days remaining)")
    print(f"  Budget:        {sub_budget.get('used'):,.2f} / {sub_budget.get('total'):,.2f} {sub_budget.get('currencyCode')}")
    print(f"  Capabilities:  {len(detail.get('capabilities', []))} available")

    # Cost per environment for current month (up to yesterday)
    start, end = current_month_range()
    month_label = start[:7]
    print(f"\nFetching cost per environment for {month_label} ({start[:10]} to {end[:10]})...")
    per_env = client.get_cost_per_environment(start_time=start, end_time=end)
    save("cost_per_environment.json", per_env)

    # Aggregate and save summary
    summary = aggregate_monthly(per_env)
    save("monthly_summary.json", summary)

    currency = summary["currency"]
    total = summary["total"]

    print(f"\n=== Monthly totals by capability ({month_label}) ===")
    for capability, amount in summary["by_capability"].items():
        print(f"  {amount:>12,.2f} {currency}  {capability}")

    print(f"\n=== Monthly totals by environment ({month_label}) ===")
    for env_id, env_data in summary["by_environment"].items():
        print(f"\n  {env_id}  ({env_data['total']:,.2f} {currency})")
        for capability, amount in env_data["by_capability"].items():
            print(f"    {amount:>12,.2f} {currency}  {capability}")

    print(f"\n=== Monthly total ===")
    print(f"  {total:>12,.2f} {currency}")

    if monthly_budget:
        print(f"\n=== Budget check (limit: {monthly_budget:,.2f} {currency}) ===")
        alerts = check_budget(summary, monthly_budget)
        if alerts:
            for alert in alerts:
                print(f"  !! {alert}")
        else:
            pct = total / monthly_budget * 100
            print(f"  OK  {total:,.2f} {currency} spent — {pct:.1f}% of {monthly_budget:,.2f} {currency} limit")
    else:
        print("\n  (Set DT_MONTHLY_BUDGET in .env to enable budget check)")

    # Send biz events
    if environment_url and ingest_token:
        print(f"\n=== Sending biz events ===")
        events = build_events(summary, month_label, monthly_budget, bucket=event_bucket)
        send_biz_events(environment_url, ingest_token, events)
        print(f"  {len(events)} events sent to {environment_url}")
        if event_bucket:
            print(f"  Routed to bucket: {event_bucket}")
    else:
        print("\n  (Set DT_ENVIRONMENT_URL + DT_INGEST_TOKEN in .env to enable biz event sending)")


if __name__ == "__main__":
    main()
