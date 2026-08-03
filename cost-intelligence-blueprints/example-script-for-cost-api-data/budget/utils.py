import calendar
from datetime import datetime, timedelta, timezone


def current_month_range() -> tuple[str, str]:
    """Returns (start_time, end_time) as ISO 8601 UTC strings.

    start: first day of the current calendar month at 00:00:00Z
    end:   yesterday at 23:59:59Z — last fully completed billing day
    """
    
    now = datetime.now(timezone.utc)
    yesterday = now.date() - timedelta(days=1)
    start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    end = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59, tzinfo=timezone.utc)
    return start.strftime("%Y-%m-%dT%H:%M:%SZ"), end.strftime("%Y-%m-%dT%H:%M:%SZ")
