# 🧩 Apps

Full Dynatrace Apps built by the community and delivered via the Dynatrace Hub.

> Apps run in customer environments and are delivered via the **Hub**, not cloned from this folder. Selected apps are documented here (each in its own subfolder with a README and Hub link); the **authoritative, always-current list** of community apps is the Hub itself.

## Browse the apps

Search the **[Dynatrace Hub](https://docs.dynatrace.com/docs/shortlink/hub)** for a complete list of available community apps using the search term `community-app`.

## Getting an app

Most apps here are delivered via the Hub using [Hub subscriptions](https://docs.dynatrace.com/docs/shortlink/hub#add-subscription):

1. **Request access** — email [community-apps@dynatrace.com](mailto:community-apps@dynatrace.com) with the **app name**, your **account name**, and your **tenant ID**.
2. **Get your channel ID** — once we verify your request, we'll send you the channel ID.
3. **Subscribe & install** — open **Settings → General → Hub subscriptions → Add subscription**, name it, paste the channel ID, and **Save**. Then search for the app in **Hub** and install it.

## Building and contributing an app

1. Start from the template: `npx degit Dynatrace/community-examples/templates/community-app my-app`
2. Work through the template's `CHECKLIST.md`; `npm run check` must pass.
3. Create your own GitHub repository for the app. "Report issue" in the app's help menu opens its issues.
4. Add an index entry here (README with the Hub listing link) and follow [CONTRIBUTING.md](../CONTRIBUTING.md).
