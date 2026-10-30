// Repo-level checks for the Community App standard. Exit code 1 on any FAIL.
// Pure Node, no dependencies:  node scripts/check-repo.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const fails = [];
const warns = [];
const read = (p) => readFileSync(p, "utf8");

// ---------- app.config.json: name, id, scopes ----------
const cfg = JSON.parse(read("app.config.json"));
const { name, id, scopes = [] } = cfg.app ?? {};
if (!name || !id) fails.push("app.config.json: app.name and app.id are required");
else {
  if (name.length > 40) fails.push(`App name > 40 chars (${name.length})`);
  if (id.length > 50) fails.push(`appID > 50 chars (${id.length})`);
  if (/\b(app|extension)\b/i.test(name)) fails.push('App name must not contain "App" or "Extension"');
  const small = new Set(["a", "an", "the", "of", "in", "on", "for", "and", "or", "to", "at", "by"]);
  const notTitle = name.split(" ").filter((w, i) => !(i > 0 && small.has(w.toLowerCase())) && w[0] !== w[0].toUpperCase());
  if (notTitle.length) warns.push(`App name should be Title Case. Check: ${notTitle.join(", ")}`);
}
for (const s of scopes) if (!s.comment || s.comment.trim().length < 10) fails.push(`Scope ${s.name}: add a real justification in "comment"`);
if (scopes.some((s) => s.name.includes("*"))) fails.push("Wildcard scopes are not allowed");
if (/\{your-environment-id\}/.test(cfg.environmentUrl ?? "")) warns.push("environmentUrl is still the placeholder (fine for the template; set it locally, do not commit a real tenant URL)");

// ---------- community.config.ts: repoUrl ----------
const ccPath = "ui/app/community.config.ts";
if (!existsSync(ccPath)) fails.push(`Missing ${ccPath}`);
else {
  const m = read(ccPath).match(/repoUrl:\s*"([^"]+)"/);
  const url = m?.[1] ?? "";
  if (!/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+$/.test(url) || /REPLACE_/.test(url))
    fails.push(`${ccPath}: repoUrl must be the real GitHub repo URL (https://github.com/<org>/<repo>)`);
}

// ---------- header must keep the community guarantees ----------
const hdrPath = "ui/app/components/CommunityHeader.tsx";
if (!existsSync(hdrPath)) fails.push(`Missing ${hdrPath}`);
else {
  const h = read(hdrPath);
  const must = [
    ["header.community.chip", "Community chip"],
    ["header.community.tooltip", "Community tooltip"],
    ["header.reportIssue", "Report issue menu item"],
    ["about.disclaimer", "About disclaimer"],
    ['feedback: "default"', "Share feedback via in-product overlay"],
  ];
  for (const [key, label] of must) if (!h.includes(key)) fails.push(`CommunityHeader is missing: ${label}`);
}
if (existsSync("ui/app/App.tsx") && !read("ui/app/App.tsx").includes("CommunityHeader"))
  fails.push("App.tsx must render <CommunityHeader />");

// ---------- README + required files ----------
for (const f of ["README.md", "CHECKLIST.md", "NOTICE", ".github/ISSUE_TEMPLATE/bug_report.md"])
  if (!existsSync(f)) fails.push(`Missing ${f}`);
if (existsSync("README.md")) {
  const r = read("README.md");
  if (!r.startsWith("---")) fails.push("README.md needs YAML front-matter");
  for (const hd of ["## What it does", "## Screenshots", "## Prerequisites", "## Setup", "## Configuration", "## Privacy"])
    if (!r.includes(hd)) fails.push(`README.md missing section: ${hd}`);
}

// ---------- banned libraries ----------
const pkg = JSON.parse(read("package.json"));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
for (const d of deps)
  if (d === "redux" || d === "styled-components" || d.startsWith("@emotion/")) fails.push(`Banned dependency: ${d}`);

// ---------- hard-coded tenants / tokens ----------
// app.config.json needs the real environmentUrl for local development, so it is only checked in CI (committed state).
const bad = [
  [/\b[a-z]{3}\d{5}\.(?:[a-z]+\.)?(?:apps|live|sprint)\.dynatrace(?:labs)?\.com/i, "hard-coded tenant URL"],
  [/dt0[a-z]\d{2}\.[A-Z0-9]{8,}/, "Dynatrace token"],
];
const skip = new Set(["node_modules", ".git", "dist", ".dt-app", "out"]);
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    if (skip.has(n)) return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const f of walk(".")) {
  if (!/\.(ts|tsx|json|md|js|mjs|yml)$/.test(f) || f.endsWith("check-repo.mjs") || (f.endsWith("app.config.json") && !process.env.CI)) continue;
  const t = read(f);
  for (const [re, what] of bad) if (re.test(t)) fails.push(`${f}: ${what}`);
}

warns.forEach((w) => console.log("WARN", w));
fails.forEach((f) => console.log("FAIL", f));
console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nAll repo checks passed");
process.exit(fails.length ? 1 : 0);
