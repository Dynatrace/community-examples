// Checks for the Community App standard. Pure Node, no dependencies.
//
//   node scripts/check-repo.mjs                 check the current folder
//   node scripts/check-repo.mjs --dir ../my-app check another app folder
//   node scripts/check-repo.mjs --require-header  fail if CommunityHeader is missing
//
// Part 1 (universal, any Dynatrace app): app name/ID, scopes with reasons, no tenant URLs/tokens.
// Part 2 (header, only if CommunityHeader.tsx is found anywhere in the app): community guarantees.
// Exit code 1 on any FAIL.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const args = process.argv.slice(2);
const dirIdx = args.indexOf("--dir");
if (dirIdx !== -1) {
  if (!args[dirIdx + 1]) {
    console.log("FAIL --dir needs a folder path");
    process.exit(1);
  }
  process.chdir(args[dirIdx + 1]);
}
const requireHeader = args.includes("--require-header");

const fails = [];
const warns = [];
const infos = [];
const read = (p) => readFileSync(p, "utf8");

const skip = new Set(["node_modules", ".git", "dist", ".dt-app", "out"]);
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    if (skip.has(n)) return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(".");
const find = (name) => files.find((f) => basename(f) === name);

// ================= Part 1: universal =================

// ---------- app.config.json: name, id, scopes ----------
if (!existsSync("app.config.json")) {
  fails.push("app.config.json not found in this folder (run from the app root or use --dir <app folder>)");
} else {
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
}

// ---------- README ----------
if (!existsSync("README.md")) warns.push("README.md is missing (recommended for the repo)");
else {
  const r = read("README.md");
  if (!r.startsWith("---")) warns.push("README.md: add the short YAML front-matter (used for the index entry)");
  for (const hd of ["## Getting started", "## Documentation"])
    if (!r.includes(hd)) warns.push(`README.md: consider a "${hd.slice(3)}" section`);
}

// ---------- hard-coded tenants / tokens ----------
// app.config.json needs the real environmentUrl for local development, so it is only checked in CI (committed state).
const bad = [
  [/\b[a-z]{3}\d{5}\.(?:[a-z]+\.)?(?:apps|live|sprint)\.dynatrace(?:labs)?\.com/i, "hard-coded tenant URL"],
  [/dt0[a-z]\d{2}\.[A-Z0-9]{8,}/, "Dynatrace token"],
];
for (const f of files) {
  if (!/\.(ts|tsx|json|md|js|mjs|yml)$/.test(f) || f.endsWith("check-repo.mjs") || (f.endsWith("app.config.json") && !process.env.CI)) continue;
  const t = read(f);
  for (const [re, what] of bad) if (re.test(t)) fails.push(`${f}: ${what}`);
}

// ================= Part 2: header (only if present) =================
const hdrPath = find("CommunityHeader.tsx");
if (!hdrPath) {
  if (requireHeader) fails.push("CommunityHeader.tsx not found (--require-header is set)");
  else infos.push("CommunityHeader.tsx not found: header checks skipped (see ADD-TO-EXISTING-APP.md to add it)");
} else {
  const h = read(hdrPath);
  const must = [
    ["header.community.chip", "Community chip"],
    ["header.community.tooltip", "Community tooltip"],
    ["header.reportIssue", "Report issue menu item"],
    ["about.disclaimer", "About disclaimer"],
    ["documentation:", "Documentation entry in the help menu"],
  ];
  for (const [key, label] of must) if (!h.includes(key)) fails.push(`CommunityHeader is missing: ${label}`);

  // the header must actually be rendered by the app
  const used = files.some((f) => /\.tsx$/.test(f) && f !== hdrPath && !/\.test\.tsx$/.test(f) && read(f).includes("<CommunityHeader"));
  if (!used) fails.push("No component renders <CommunityHeader /> (it must replace the plain AppHeader)");

  // repoUrl (header links to issues from it)
  const ccPath = find("community.config.ts");
  if (!ccPath) fails.push("community.config.ts not found (the header needs repoUrl)");
  else {
    const url = read(ccPath).match(/repoUrl:\s*"([^"]+)"/)?.[1] ?? "";
    if (!/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+$/.test(url) || /REPLACE_/.test(url))
      fails.push(`${ccPath}: repoUrl must be the real GitHub repo URL (https://github.com/<org>/<repo>)`);
  }
}

infos.forEach((i) => console.log("INFO", i));
warns.forEach((w) => console.log("WARN", w));
fails.forEach((f) => console.log("FAIL", f));
console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nAll repo checks passed");
process.exit(fails.length ? 1 : 0);
