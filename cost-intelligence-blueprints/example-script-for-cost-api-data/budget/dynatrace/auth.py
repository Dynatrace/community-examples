import requests

_TOKEN_URL = "https://sso.dynatrace.com/sso/oauth2/token"
_DEFAULT_SCOPES = ["account-uac-read"]


def get_token(
    client_id: str,
    client_secret: str,
    account_uuid: str,
    scopes: list[str] = _DEFAULT_SCOPES,
) -> str:
    resp = requests.post(
        _TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": " ".join(scopes),
            "resource": f"urn:dtaccount:{account_uuid}",
        },
    )
    resp.raise_for_status()
    return resp.json()["access_token"]
