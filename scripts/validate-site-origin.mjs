import fs from "node:fs";
import path from "node:path";
import { OFFICIAL_SITE_ORIGIN, SITE_ORIGIN } from "../site-origin.mjs";

const projectRoot = path.resolve(".");
const scanTargets = [
  "astro.config.mjs",
  "src/data/site.ts",
  "src/data/schema.ts",
  "src/layouts/BaseLayout.astro",
  "src/pages/sitemap.xml.ts",
  "src/pages/robots.txt.ts",
  "scripts/indexnow.mjs"
];
const forbiddenPatterns = [
  { label: "example domain", pattern: /huixiang-auto\.example/i },
  { label: "localhost absolute URL", pattern: /https?:\/\/localhost(?=[:/]|$)/i },
  { label: "127.0.0.1 absolute URL", pattern: /https?:\/\/127\.0\.0\.1(?=[:/]|$)/i }
];
const failures = [];

if (SITE_ORIGIN !== OFFICIAL_SITE_ORIGIN) {
  failures.push(`Resolved site origin is ${SITE_ORIGIN}, expected ${OFFICIAL_SITE_ORIGIN}.`);
}

for (const relativePath of scanTargets) {
  const filePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`Missing production configuration file: ${relativePath}`);
    continue;
  }

  const source = fs.readFileSync(filePath, "utf8");
  for (const { label, pattern } of forbiddenPatterns) {
    if (pattern.test(source)) failures.push(`${relativePath} contains ${label}.`);
  }
}

if (failures.length) {
  console.error("Production origin validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Production origin validation passed: ${SITE_ORIGIN}`);
