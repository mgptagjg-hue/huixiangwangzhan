import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist");
const banned = [
  "最好",
  "第一",
  "包过",
  "最低价",
  "权威推荐",
  "最便宜",
  "最实惠",
  "唯一",
  "官方唯一",
  "绝对",
  "保证赚钱",
  "必有现车",
  "终身免费",
  "全网最低",
  "行业第一"
];
const requiredPages = [
  "index.html",
  "about/index.html",
  "trucks/index.html",
  "services/index.html",
  "huzhou-truck-sales/index.html",
  "dongfeng-duolika/index.html",
  "guides/index.html",
  "faq/index.html",
  "news/index.html",
  "contact/index.html"
];

const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function textBetween(source, regex) {
  const match = source.match(regex);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, "").trim();
}

const failures = [];

if (!fs.existsSync(root)) {
  failures.push("dist directory does not exist; run npm run build first.");
} else {
  walk(root);

  for (const rel of requiredPages) {
    if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing built page: ${rel}`);
  }

  for (const requiredFile of ["sitemap.xml", "robots.txt"]) {
    if (!fs.existsSync(path.join(root, requiredFile))) failures.push(`Missing ${requiredFile}`);
  }

  const titles = new Map();
  const descriptions = new Map();

  for (const file of htmlFiles) {
    const rel = path.relative(root, file).replaceAll("\\", "/");
    const html = fs.readFileSync(file, "utf8");
    const title = stripTags(textBetween(html, /<title>([\s\S]*?)<\/title>/i));
    const description = textBetween(html, /<meta name="description" content="([^"]+)"/i);
    const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

    if (!title) failures.push(`${rel}: missing title`);
    if (!description) failures.push(`${rel}: missing meta description`);
    if (h1Count !== 1) failures.push(`${rel}: expected 1 h1, found ${h1Count}`);

    if (titles.has(title)) failures.push(`${rel}: duplicate title also used by ${titles.get(title)}`);
    else titles.set(title, rel);

    if (descriptions.has(description)) failures.push(`${rel}: duplicate meta description also used by ${descriptions.get(description)}`);
    else descriptions.set(description, rel);

    for (const term of banned) {
      if (html.includes(term)) failures.push(`${rel}: contains banned marketing term "${term}"`);
    }

    if (!jsonLdBlocks.length) failures.push(`${rel}: missing JSON-LD schema`);
    for (const block of jsonLdBlocks) {
      try {
        JSON.parse(block[1]);
      } catch (error) {
        failures.push(`${rel}: invalid JSON-LD (${error.message})`);
      }
    }
  }
}

if (failures.length) {
  console.error("SEO audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${htmlFiles.length} HTML pages checked, sitemap.xml and robots.txt present.`);
