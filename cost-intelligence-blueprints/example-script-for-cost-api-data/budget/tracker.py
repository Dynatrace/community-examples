from collections import defaultdict


def _sort_desc(d: dict) -> dict:
    return dict(sorted(d.items(), key=lambda x: x[1], reverse=True))


def aggregate_monthly(cost_per_env: list[dict]) -> dict:
    """Collapse cost-per-environment daily entries into monthly totals.

    Returns:
        {
            "by_capability": {"Full-Stack Monitoring": 1234.56, ...},  # sorted desc
            "by_environment": {
                "env-id": {
                    "by_capability": {"Full-Stack Monitoring": 123.45, ...},
                    "total": 123.45,
                },
                ...
            },
            "total": 9876.54,
            "currency": "USD",
        }
    """
    by_capability: dict[str, float] = defaultdict(float)
    by_environment: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    currency = "USD"

    for env in cost_per_env:
        env_id = env.get("environmentId") or env.get("clusterId", "unknown")
        for entry in env.get("cost", []):
            name = entry["capabilityName"]
            value = entry["value"]
            currency = entry.get("currencyCode", currency)
            by_capability[name] += value
            by_environment[env_id][name] += value

    return {
        "by_capability": _sort_desc(by_capability),
        "by_environment": {
            env_id: {
                "by_capability": _sort_desc(caps),
                "total": sum(caps.values()),
            }
            for env_id, caps in sorted(
                by_environment.items(),
                key=lambda x: sum(x[1].values()),
                reverse=True,
            )
        },
        "total": sum(by_capability.values()),
        "currency": currency,
    }


def check_budget(summary: dict, monthly_budget: float) -> list[str]:
    """Compare aggregated monthly totals against a budget limit.

    Returns a list of alert strings (empty when within budget).
    Warns at 90% of budget, alerts when exceeded.
    """
    alerts = []
    total = summary["total"]
    currency = summary["currency"]
    pct = (total / monthly_budget * 100) if monthly_budget else 0

    if total > monthly_budget:
        alerts.append(
            f"OVER BUDGET  {total:,.2f} {currency} spent"
            f" — {total - monthly_budget:,.2f} {currency} over the"
            f" {monthly_budget:,.2f} {currency} monthly limit ({pct:.1f}%)"
        )
    elif pct >= 90:
        alerts.append(
            f"WARNING  {total:,.2f} {currency} spent"
            f" — {pct:.1f}% of the {monthly_budget:,.2f} {currency} monthly limit"
        )

    return alerts
