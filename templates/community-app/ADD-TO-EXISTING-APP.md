# Add the community header to an existing app

You don't need the whole template. Two files and three lines:

1. Copy into your app (anywhere under `ui/`):
   - `ui/app/components/CommunityHeader.tsx`
   - `ui/app/community.config.ts`  (set `repoUrl` to your app's GitHub repo)
2. In `App.tsx`, render it instead of your current `AppHeader`:
   ```tsx
   import { CommunityHeader } from "./components/CommunityHeader";
   // ...
   <CommunityHeader tabs={[{ label: "Overview", to: "/" }]} documentationUrl="https://..." />
   ```
3. Check that `react-router-dom`, `react-intl` and the Strato / SDK packages from `package.json` are installed.

Optional: copy `scripts/check-repo.mjs` (one file, no dependencies) and run `node scripts/check-repo.mjs` in the app root (or `--dir <app folder>`). It works on any app layout: scopes, secrets and tenant URLs are always checked; header checks run only if `CommunityHeader.tsx` is found.
It checks scopes, secrets / tenant URLs, `repoUrl` and that the header is in place.
(Paths inside the script assume the template layout; adjust them if yours differs.)
