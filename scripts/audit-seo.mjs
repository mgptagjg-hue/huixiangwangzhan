import fs from "node:fs";
import path from "node:path";
import { OFFICIAL_SITE_ORIGIN, SITE_ORIGIN } from "../site-origin.mjs";

const root = path.resolve("dist");
const companyName = "长兴辉祥汽车贸易有限公司";
const storeName = "辉祥汽贸";
const phone = "15268286681";
const address = "浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸";
const businessId = `${OFFICIAL_SITE_ORIGIN}/#business`;
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
const forbiddenOriginPattern = /huixiang-auto\.example|https?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/]|$)/i;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const toutiaoPushUrl = "https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?6333db47b94f0b0dd6f60e284337c2d762189f322152e09641a27daf1c3e2123bc434964556b7d7129e9b750ed197d397efd7b0c6c715c1701396e1af40cec962b8d7c8c6655c9b00211740aa8a98e2e";
const toutiaoScriptId = 'el.id = "ttzz"';
const staticVerificationFiles = new Map([
  ["ByteDanceVerify.html", "IcGxuEx9vFouoT6roKt7"]
]);
const htmlFiles = [];
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    const relative = path.relative(root, full).replaceAll("\\", "/");
    if (entry.isFile() && entry.name.endsWith(".html") && !staticVerificationFiles.has(relative)) {
      htmlFiles.push(full);
    }
  }
}

function textBetween(source, regex) {
  const match = source.match(regex);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function canonicalMatches(html) {
  return [
    ...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/gi)
  ].map((match) => match[1]);
}

function builtPathToUrl(relativePath) {
  if (relativePath === "index.html") return `${OFFICIAL_SITE_ORIGIN}/`;
  const route = relativePath.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  return `${OFFICIAL_SITE_ORIGIN}/${route}/`;
}

function isValidDate(value) {
  return isoDatePattern.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

if (SITE_ORIGIN !== OFFICIAL_SITE_ORIGIN) {
  failures.push(`Resolved origin is ${SITE_ORIGIN}, expected ${OFFICIAL_SITE_ORIGIN}`);
}

const astroConfig = fs.readFileSync(path.resolve("astro.config.mjs"), "utf8");
if (astroConfig.includes("huixiang-auto.example")) failures.push("astro.config.mjs contains the example domain");
if (!astroConfig.includes("SITE_ORIGIN")) failures.push("astro.config.mjs does not use the shared SITE_ORIGIN");

if (!fs.existsSync(root)) {
  failures.push("dist directory does not exist; run npm run build first.");
} else {
  walk(root);

  for (const [relativePath, expectedContent] of staticVerificationFiles) {
    const verificationPath = path.join(root, relativePath);
    if (!fs.existsSync(verificationPath)) {
      failures.push(`Missing static verification file: ${relativePath}`);
      continue;
    }
    const actual = fs.readFileSync(verificationPath);
    if (!actual.equals(Buffer.from(expectedContent, "utf8"))) {
      failures.push(`${relativePath}: verification content changed during build`);
    }
  }

  for (const rel of requiredPages) {
    if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing built page: ${rel}`);
  }

  for (const requiredFile of ["sitemap.xml", "robots.txt"]) {
    if (!fs.existsSync(path.join(root, requiredFile))) failures.push(`Missing ${requiredFile}`);
  }

  const titles = new Map();
  const descriptions = new Map();
  const indexableBuiltUrls = [];

  for (const file of htmlFiles) {
    const rel = path.relative(root, file).replaceAll("\\", "/");
    const html = fs.readFileSync(file, "utf8");
    const text = stripTags(html);
    const title = stripTags(textBetween(html, /<title>([\s\S]*?)<\/title>/i));
    const description = textBetween(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    const canonicals = canonicalMatches(html);
    const hasNoIndex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    const is404 = rel === "404.html";
    const toutiaoPushCount = html.split(toutiaoPushUrl).length - 1;
    const toutiaoScriptIdCount = html.split(toutiaoScriptId).length - 1;

    if (!title) failures.push(`${rel}: missing title`);
    if (!description) failures.push(`${rel}: missing meta description`);
    if (toutiaoPushCount !== 1) failures.push(`${rel}: expected 1 Toutiao push URL, found ${toutiaoPushCount}`);
    if (toutiaoScriptIdCount !== 1) failures.push(`${rel}: expected 1 Toutiao ttzz assignment, found ${toutiaoScriptIdCount}`);
    if (h1Count !== 1) failures.push(`${rel}: expected 1 h1, found ${h1Count}`);
    if (text.length < 200) failures.push(`${rel}: static HTML body is unexpectedly short`);
    if (!text.includes(companyName)) failures.push(`${rel}: static HTML does not contain the company name`);
    if (!text.includes(storeName)) failures.push(`${rel}: static HTML does not contain the store name`);
    if (!text.includes(phone)) failures.push(`${rel}: static HTML does not contain the phone number`);
    if (!text.includes(address)) failures.push(`${rel}: static HTML does not contain the store address`);

    if (titles.has(title)) failures.push(`${rel}: duplicate title also used by ${titles.get(title)}`);
    else titles.set(title, rel);

    if (descriptions.has(description)) failures.push(`${rel}: duplicate meta description also used by ${descriptions.get(description)}`);
    else descriptions.set(description, rel);

    if (canonicals.length !== 1) failures.push(`${rel}: expected 1 canonical, found ${canonicals.length}`);
    if (canonicals[0]) {
      let canonicalUrl;
      try {
        canonicalUrl = new URL(canonicals[0]);
      } catch {
        failures.push(`${rel}: invalid canonical ${canonicals[0]}`);
      }
      if (canonicalUrl?.origin !== OFFICIAL_SITE_ORIGIN) failures.push(`${rel}: canonical is outside ${OFFICIAL_SITE_ORIGIN}`);
      if (!is404 && canonicalUrl?.toString() !== builtPathToUrl(rel)) {
        failures.push(`${rel}: canonical ${canonicalUrl?.toString()} does not match the direct 200 URL ${builtPathToUrl(rel)}`);
      }
    }

    if (is404 && !hasNoIndex) failures.push("404.html: missing noindex");
    if (!is404 && hasNoIndex) failures.push(`${rel}: public page contains noindex`);
    if (!is404) indexableBuiltUrls.push(builtPathToUrl(rel));
    if (forbiddenOriginPattern.test(html)) failures.push(`${rel}: contains localhost or a test domain`);

    for (const term of banned) {
      if (html.includes(term)) failures.push(`${rel}: contains banned marketing term "${term}"`);
    }

    if (!jsonLdBlocks.length) failures.push(`${rel}: missing JSON-LD schema`);
    if (!is404 && !html.includes(businessId)) failures.push(`${rel}: missing unified business entity ${businessId}`);
    for (const block of jsonLdBlocks) {
      try {
        JSON.parse(block[1]);
      } catch (error) {
        failures.push(`${rel}: invalid JSON-LD (${error.message})`);
      }
    }
  }

  const homepage = fs.existsSync(path.join(root, "index.html")) ? fs.readFileSync(path.join(root, "index.html"), "utf8") : "";
  for (const requiredText of [companyName, "长兴辉祥汽贸", phone, "浙江省湖州市长兴县", "主营业务", "主营品牌", "服务地区", 'href="/about/"', 'href="/services/"', 'href="/contact/"']) {
    if (!homepage.includes(requiredText)) failures.push(`index.html: missing crawlable content ${requiredText}`);
  }

  const sitemapPath = path.join(root, "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    if (!/^<\?xml[^>]*encoding="UTF-8"[^>]*\?>/i.test(sitemap.trim())) failures.push("sitemap.xml: missing UTF-8 XML declaration");
    if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/i.test(sitemap)) failures.push("sitemap.xml: invalid urlset root");

    const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => match[1]);
    const sitemapUrls = [];
    for (const block of urlBlocks) {
      const loc = textBetween(block, /<loc>([^<]+)<\/loc>/i);
      const lastmod = textBetween(block, /<lastmod>([^<]+)<\/lastmod>/i);
      const changefreq = textBetween(block, /<changefreq>([^<]+)<\/changefreq>/i);
      const priority = textBetween(block, /<priority>([^<]+)<\/priority>/i);
      sitemapUrls.push(loc);
      if (!isValidDate(lastmod)) failures.push(`sitemap.xml: ${loc || "unknown URL"} has invalid lastmod ${lastmod || "missing"}`);
      if (!changefreq) failures.push(`sitemap.xml: ${loc || "unknown URL"} is missing changefreq`);
      if (!priority) failures.push(`sitemap.xml: ${loc || "unknown URL"} is missing priority`);
      try {
        const url = new URL(loc);
        if (url.origin !== OFFICIAL_SITE_ORIGIN) failures.push(`sitemap.xml: ${loc} is outside the official origin`);
        if (url.search || url.hash) failures.push(`sitemap.xml: ${loc} contains a query or hash`);
      } catch {
        failures.push(`sitemap.xml: invalid loc ${loc}`);
      }
    }

    if (sitemapUrls.length < 18) failures.push(`sitemap.xml: expected at least 18 URLs, found ${sitemapUrls.length}`);
    if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push("sitemap.xml: contains duplicate URLs");
    if (sitemapUrls.some((url) => /\/404(?:\/|$)/.test(url))) failures.push("sitemap.xml: contains the 404 page");
    for (const builtUrl of indexableBuiltUrls) {
      if (!sitemapUrls.includes(builtUrl)) failures.push(`sitemap.xml: missing built public page ${builtUrl}`);
    }
  }

  const robotsPath = path.join(root, "robots.txt");
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, "utf8");
    if (!robots.includes("User-agent: *")) failures.push("robots.txt: missing User-agent: *");
    if (!robots.includes("Allow: /")) failures.push("robots.txt: missing Allow: /");
    if (!robots.includes("User-agent: OAI-SearchBot")) failures.push("robots.txt: missing OAI-SearchBot rule");
    if (!robots.includes("User-agent: ToutiaoSpider")) failures.push("robots.txt: missing ToutiaoSpider rule");
    if (/Disallow:\s*\/$/im.test(robots)) failures.push("robots.txt: blocks the whole site");
    if (!robots.includes(`Sitemap: ${OFFICIAL_SITE_ORIGIN}/sitemap.xml`)) failures.push("robots.txt: references the wrong sitemap");
  }

  const launchAnnouncementPath = path.join(root, "news", "official-website-launch-announcement", "index.html");
  if (!fs.existsSync(launchAnnouncementPath)) {
    failures.push("Missing official website launch announcement page");
  } else {
    const announcement = fs.readFileSync(launchAnnouncementPath, "utf8");
    for (const requiredText of [
      "长兴辉祥汽车贸易有限公司官网已正式上线。",
      "浙ICP备2026052872号-1",
      "浙公网安备33052202000930号",
      "网站所展示的车型配置、颜色、价格和库存会随厂家配置及实际销售情况变化"
    ]) {
      if (!announcement.includes(requiredText)) failures.push(`launch announcement: missing ${requiredText}`);
    }
    if (!announcement.includes('"@type":"Article"')) failures.push("launch announcement: missing Article JSON-LD");
    if (!announcement.includes('"@type":"BreadcrumbList"')) failures.push("launch announcement: missing BreadcrumbList JSON-LD");
    if (!announcement.includes('property="og:type" content="article"')) failures.push("launch announcement: missing article Open Graph type");
  }
}

if (failures.length) {
  console.error("SEO audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const sitemapCount = fs.existsSync(path.join(root, "sitemap.xml"))
  ? [...fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").matchAll(/<url>/g)].length
  : 0;
console.log(`SEO audit passed: ${htmlFiles.length} HTML pages checked, ${sitemapCount} sitemap URLs verified.`);
