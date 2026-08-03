import time
import requests
from typing import Optional

_RETRY_STATUSES = {429, 500, 502, 503, 504}
_MAX_RETRIES = 3


def _get_with_retry(session: requests.Session, url: str, params: dict) -> requests.Response:
    for attempt in range(_MAX_RETRIES):
        resp = session.get(url, params=params)
        if resp.status_code not in _RETRY_STATUSES:
            return resp
        if attempt < _MAX_RETRIES - 1:
            time.sleep(2 ** attempt)
    return resp

_BASE = "https://api.dynatrace.com"


class DynatraceClient:
    def __init__(self, account_uuid: str, token: str, subscription_uuid: Optional[str] = None):
        self._account = account_uuid
        self._subscription = subscription_uuid
        self._session = requests.Session()
        self._session.headers["Authorization"] = f"Bearer {token}"

    def _require_subscription(self) -> str:
        if not self._subscription:
            raise ValueError("subscription_uuid is required — call get_all_subscriptions() first to find yours.")
        return self._subscription

    # ------------------------------------------------------------------
    # Subscriptions
    # ------------------------------------------------------------------

    def get_all_subscriptions(self, active_only: bool = True) -> list[dict]:
        """GET /sub/v2/accounts/{accountUuid}/subscriptions — list subscriptions.

        active_only=True (default) filters to status == 'ACTIVE', which is the
        paying DPS subscription. Pass False to get all statuses.
        """
        url = f"{_BASE}/sub/v2/accounts/{self._account}/subscriptions"
        resp = self._session.get(url)
        resp.raise_for_status()
        data = resp.json().get("data", [])
        if active_only:
            data = [s for s in data if s.get("status") == "ACTIVE" and s.get("type") == "REGULAR"]
        return data

    def get_subscription(self, subscription_uuid: str) -> dict:
        """GET /sub/v2/accounts/{accountUuid}/subscriptions/{subscriptionUuid}.

        Returns full detail including budget totals, currentPeriod, and capabilities list.
        """
        url = f"{_BASE}/sub/v2/accounts/{self._account}/subscriptions/{subscription_uuid}"
        resp = self._session.get(url)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Costs
    # ------------------------------------------------------------------

    def get_cost_per_environment(
        self,
        start_time: str,
        end_time: str,
        environment_ids: Optional[list[str]] = None,
        capability_keys: Optional[list[str]] = None,
        page_size: Optional[int] = None,
    ) -> list[dict]:
        """GET /sub/v3/.../environments/cost — cost by environment and capability.

        Handles pagination automatically and returns all pages merged.
        start_time / end_time: ISO 8601, e.g. '2026-07-01T00:00:00Z'
        """
        sub = self._require_subscription()
        url = f"{_BASE}/sub/v3/accounts/{self._account}/subscriptions/{sub}/environments/cost"
        params: dict = {"startTime": start_time, "endTime": end_time}
        if environment_ids:
            params["environmentIds"] = ",".join(environment_ids)
        if capability_keys:
            params["capabilityKeys"] = ",".join(capability_keys)
        if page_size:
            params["page-size"] = page_size

        results: list[dict] = []
        while True:
            resp = _get_with_retry(self._session, url, params)
            resp.raise_for_status()
            body = resp.json()
            results.extend(body.get("data", []))
            next_page = body.get("nextPageKey")
            if not next_page:
                break
            params["page-key"] = next_page

        return results
