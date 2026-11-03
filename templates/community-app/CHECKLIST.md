# Community App Checklist

Short on purpose. `npm run check` covers the items marked (auto).

## Must

- [ ] The **By Community** chip, **Report issue** and the "not officially supported" notice in **About this app** are visible (`CommunityHeader`) (auto)
- [ ] **Documentation** link in the help menu (what the app does and how to get started) (auto)
- [ ] `repoUrl` points to the app's GitHub repo, so Report issue works (auto)
- [ ] Minimal permission scopes, each with a reason in `app.config.json` (auto)
- [ ] No secrets, tenant URLs or customer data in the repo (auto)

## Think about

- [ ] Strato components and design tokens for a consistent look
- [ ] Accessibility (names for icon-only buttons, labels on form fields, keyboard use) and small screens
- [ ] User-facing text via react-intl (English)
- [ ] Empty states and error messages instead of blank pages
- [ ] Tests for your own logic
- [ ] A short changelog and version numbers
- [ ] Privacy: does the app handle personal data?
