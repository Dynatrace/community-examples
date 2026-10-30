# Community App Checklist

Tick before opening a PR. Items marked (auto) are enforced by `npm run check` / CI.

## Must

- [ ] Built with the App Toolkit (React + TypeScript), Strato components, tokens and icons only
- [ ] `CommunityHeader` in use with the **Community** chip, **Report issue** and **About this app** disclaimer intact (auto)
- [ ] `repoUrl` set to this app's GitHub repo (auto)
- [ ] App name: Title Case, 40 characters or fewer, no "App" / "Extension"; app ID 50 characters or fewer (auto)
- [ ] Minimal scopes, each justified in `app.config.json`; no wildcards (auto)
- [ ] No secrets, tenant URLs or customer data in the repo (auto)
- [ ] Strato imports from sub-packages; no Redux, Emotion, styled-components (auto)
- [ ] Icon-only controls have accessible names; form fields have visible labels; keyboard operable
- [ ] Usable on mobile, tablet and desktop widths
- [ ] User-facing text wrapped in react-intl (English)
- [ ] Empty states and error messages instead of blank pages
- [ ] README: front-matter, all required sections, at least one real screenshot (auto: sections)
- [ ] Privacy section filled in (PII: what, why, retention)
- [ ] `npm run check` passes

## Should

- [ ] Unit tests for your logic; end-to-end and accessibility tests (Playwright, axe)
- [ ] Japanese translations
- [ ] CHANGELOG and semantic versions
- [ ] Short "getting started" guidance inside the app for first-time users
