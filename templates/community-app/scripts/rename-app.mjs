// Usage: npm run rename -- "My Tool" my.team.my.tool https://github.com/<org>/<repo>
import { readFileSync, writeFileSync } from "node:fs";

const [name, id, repoUrl] = process.argv.slice(2);
if (!name || !id || !repoUrl) {
  console.error('Usage: npm run rename -- "<App Name>" <app.id> <https://github.com/org/repo>');
  process.exit(1);
}

const cfg = JSON.parse(readFileSync("app.config.json", "utf8"));
const oldName = cfg.app.name;
cfg.app.name = name;
cfg.app.id = id;
writeFileSync("app.config.json", JSON.stringify(cfg, null, 2) + "\n");

const cc = "ui/app/community.config.ts";
writeFileSync(cc, readFileSync(cc, "utf8").replace(/repoUrl:\s*"[^"]*"/, `repoUrl: "${repoUrl}"`));

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
pkg.name = id.replace(/\./g, "-");
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

let readme = readFileSync("README.md", "utf8");
readme = readme.replaceAll(oldName, name).replace(/^title: .*/m, `title: ${name}`);
writeFileSync("README.md", readme);

console.log(`Renamed "${oldName}" -> "${name}" (${id}), repo ${repoUrl}`);
console.log("Next: edit the README (what it does, screenshots, prerequisites), then run: npm run check");
