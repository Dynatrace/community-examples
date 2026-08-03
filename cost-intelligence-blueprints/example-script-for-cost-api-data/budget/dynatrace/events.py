import requests
from datetime import datetime, timezone
from typing import Optional


def send_biz_events(environment_url: str, api_token: str, events: list[dict]) -> None:
    """POST a batch of biz events to the DT ingest endpoint.

    environment_url: full base URL, e.g. https://abc12345.live.dynatrace.com
    api_token:       DT API token with bizevents.ingest scope
    """
    url = f"{environment_url.rstrip('/')}/api/v2/bizevents/ingest"
    headers = {
        "Authorization": f"Api-Token {api_token}",
        "Content-Type": "application/json",
    }
    resp = requests.post(url, headers=headers, json=events)
    resp.raise_for_status()


def build_events(summary: dict, month: str, monthly_budget: float, bucket: Optional[str] = None, run_id: Optional[str] = None) -> list[dict]:
    """Build the full set of biz events from an aggregated monthly summary.

    Produces:
      - dps.cost.monthly.capability  — one per capability (cross-environment total)
      - dps.cost.monthly.environment — one per environment (cross-capability total)
      - dps.cost.monthly.budget      — one overall budget status event

    bucket: if set, adds dt.system.bucket to route events to a restricted bucket.
    """
    currency = summary["currency"]
    total = summary["total"]
    pct = (total / monthly_budget * 100) if monthly_budget else None
    run_id = run_id or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if monthly_budget and total > monthly_budget:
        budget_status = "OVER_BUDGET"
    elif pct is not None and pct >= 90:
        budget_status = "WARNING"
    else:
        budget_status = "OK"

    def base(event_type: str) -> dict:
        e = {
            "event.type": event_type,
            "event.provider": "dps.cost.current.month",
            "month": month,
            "currencyCode": currency,
            "runId": run_id,
        }
        if bucket:
            e["dt.system.bucket"] = bucket
        return e

    events: list[dict] = []

    # One event per capability
    for capability_name, value in summary["by_capability"].items():
        e = base("dps.cost.monthly.capability")
        e["capabilityName"] = capability_name
        e["value"] = round(value, 6)
        events.append(e)

    # One event per environment
    for env_id, env_data in summary["by_environment"].items():
        e = base("dps.cost.monthly.environment")
        e["environmentId"] = env_id
        e["value"] = round(env_data["total"], 6)
        events.append(e)

    # One event per environment per capability
    for env_id, env_data in summary["by_environment"].items():
        for capability_name, value in env_data["by_capability"].items():
            e = base("dps.cost.monthly.environment.capability")
            e["environmentId"] = env_id
            e["capabilityName"] = capability_name
            e["value"] = round(value, 6)
            events.append(e)

    # Budget status event
    e = base("dps.cost.monthly.budget")
    e["total"] = round(total, 6)
    e["budgetLimit"] = monthly_budget
    e["budgetStatus"] = budget_status
    if pct is not None:
        e["budgetPct"] = round(pct, 2)
    events.append(e)

    return events
