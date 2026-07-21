import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { OFFICIAL_SITE_ORIGIN } from "../site-origin.mjs";

const COMPANY_NAME = "长兴辉祥汽车贸易有限公司";
const STORE_NAME = "辉祥汽贸";
const PHONE = "15268286681";
const ADDRESS = "浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸";
const TOUTIAO_PUSH_URL = "https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?6333db47b94f0b0dd6f60e284337c2d762189f322152e09641a27daf1c3e2123bc434964556b7d7129e9b750ed197d397efd7b0c6c715c1701396e1af40cec962b8d7c8c6655c9b00211740aa8a98e2e";
const BYTEDANCE_VERIFICATION_CONTENT = "IcGxuEx9vFouoT6roKt7";
const USER_AGENTS = ["Mozilla/5.0", "Baiduspider", "bingbot", "Googlebot", "OAI-SearchBot", "ToutiaoSpider"];
const REQUEST_TIMEOUT_MS = 20_000;
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

async function request(url, userAgent = "Mozilla/5.0") {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const startedAt = Date.now();
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": userAgent, Accept: "text/html,application/xml,text/plain;q=0.9,*/*;q=0.8" },
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      const body = await response.text();
      return {
        ok: true,
        response,
        body,
        elapsedMs: Date.now() - startedAt,
        contentType: response.headers.get("content-type") || ""
      };
    } catch (error) {
      if (attempt === 2) return { ok: false, error, elapsedMs: Date.now() - startedAt };
    }
  }
}

function canonicalFromHtml(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
    html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1] || "";
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

async function checkHomepageByUserAgent() {
  const hashes = new Map();
  for (const userAgent of USER_AGENTS) {
    const result = await request(`${OFFICIAL_SITE_ORIGIN}/`, userAgent);
    if (!result.ok) {
      fail(`${userAgent}: request failed after ${result.elapsedMs}ms (${result.error.message})`);
      continue;
    }

    const { response, body, elapsedMs, contentType } = result;
    const containsCompany = body.includes(COMPANY_NAME);
    console.log(
      `UA ${userAgent}: ${response.status} ${response.url} ${elapsedMs}ms ${contentType} ${body.length} bytes company=${containsCompany}`
    );
    if (response.status !== 200) fail(`${userAgent}: homepage returned ${response.status}.`);
    if (!contentType.toLowerCase().includes("text/html")) fail(`${userAgent}: homepage Content-Type is ${contentType}.`);
    if (!containsCompany) fail(`${userAgent}: homepage HTML does not contain the company name.`);
    if (!body.includes(TOUTIAO_PUSH_URL)) fail(`${userAgent}: homepage HTML does not contain the Toutiao auto-push script.`);
    if (response.url !== `${OFFICIAL_SITE_ORIGIN}/`) fail(`${userAgent}: final URL is ${response.url}.`);
    hashes.set(userAgent, createHash("sha256").update(body).digest("hex"));
  }

  if (hashes.size === USER_AGENTS.length && new Set(hashes.values()).size === 1) {
    pass("All tested user agents received identical homepage HTML.");
  } else if (hashes.size === USER_AGENTS.length) {
    fail("Search crawler user agents received different homepage HTML.");
  }
}

async function checkTextResources() {
  const robots = await request(`${OFFICIAL_SITE_ORIGIN}/robots.txt`);
  if (!robots.ok) {
    fail(`robots.txt request failed (${robots.error.message}).`);
  } else {
    if (robots.response.status !== 200) fail(`robots.txt returned ${robots.response.status}.`);
    if (!robots.contentType.toLowerCase().includes("text/plain")) fail(`robots.txt Content-Type is ${robots.contentType}.`);
    if (!robots.body.includes("User-agent: *") || !robots.body.includes("Allow: /")) fail("robots.txt does not allow public crawling.");
    if (!robots.body.includes("User-agent: OAI-SearchBot")) fail("robots.txt does not explicitly allow OAI-SearchBot.");
    if (!robots.body.includes("User-agent: ToutiaoSpider")) fail("robots.txt does not explicitly allow ToutiaoSpider.");
    if (!robots.body.includes(`Sitemap: ${OFFICIAL_SITE_ORIGIN}/sitemap.xml`)) fail("robots.txt references the wrong sitemap.");
    if (/Disallow:\s*\/$/im.test(robots.body)) fail("robots.txt blocks the entire site.");
    if (!failures.some((item) => item.startsWith("robots.txt"))) pass("robots.txt is readable and allows crawling.");
  }

  const sitemap = await request(`${OFFICIAL_SITE_ORIGIN}/sitemap.xml`);
  if (!sitemap.ok) {
    fail(`sitemap.xml request failed (${sitemap.error.message}).`);
    return [];
  }

  if (sitemap.response.status !== 200) fail(`sitemap.xml returned ${sitemap.response.status}.`);
  if (!/(application|text)\/xml/i.test(sitemap.contentType)) fail(`sitemap.xml Content-Type is ${sitemap.contentType}.`);
  if (!/^<\?xml[\s\S]*<urlset\b/.test(sitemap.body.trim())) fail("sitemap.xml is not a sitemap XML document.");
  const urls = sitemapUrls(sitemap.body);
  if (!urls.length) fail("sitemap.xml contains no URLs.");
  if (!urls.includes(`${OFFICIAL_SITE_ORIGIN}/news/official-website-launch-announcement/`)) {
    fail("sitemap.xml does not include the official website launch announcement.");
  }
  if (urls.some((url) => !url.startsWith(`${OFFICIAL_SITE_ORIGIN}/`) && url !== OFFICIAL_SITE_ORIGIN)) {
    fail("sitemap.xml contains a URL outside the canonical origin.");
  }
  if (urls.length) pass(`sitemap.xml parsed with ${urls.length} URLs.`);
  return urls;
}

async function checkSitemapPages(urls) {
  const workerCount = Math.min(5, urls.length);
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const result = await request(url);
      if (!result.ok) {
        fail(`${url}: request failed (${result.error.message}).`);
        continue;
      }
      if (result.response.status !== 200) fail(`${url}: returned ${result.response.status}.`);
      if (result.response.url !== url) fail(`${url}: redirects to ${result.response.url}.`);
      if (!result.contentType.toLowerCase().includes("text/html")) fail(`${url}: Content-Type is ${result.contentType}.`);
      if (result.body.length < 1_000) fail(`${url}: HTML body is unexpectedly short.`);
      if (/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(result.body)) fail(`${url}: contains noindex.`);
      if ((result.body.match(/<h1[\s>]/gi) ?? []).length !== 1) fail(`${url}: does not contain exactly one H1.`);
      if (!/<title>[\s\S]+<\/title>/i.test(result.body)) fail(`${url}: is missing a title.`);
      if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(result.body)) fail(`${url}: is missing a meta description.`);
      const canonical = canonicalFromHtml(result.body);
      if (canonical !== url) fail(`${url}: canonical is ${canonical || "missing"}.`);
      if (/huixiang-auto\.example|https?:\/\/(localhost|127\.0\.0\.1)/i.test(result.body)) fail(`${url}: contains a test origin.`);
      if (!result.body.includes(COMPANY_NAME)) fail(`${url}: HTML does not contain the company name.`);
      if (!result.body.includes(STORE_NAME)) fail(`${url}: HTML does not contain the store name.`);
      if (!result.body.includes(PHONE)) fail(`${url}: HTML does not contain the phone number.`);
      if (!result.body.includes(ADDRESS)) fail(`${url}: HTML does not contain the store address.`);
      const jsonLdBlocks = [...result.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
      if (!jsonLdBlocks.length) fail(`${url}: is missing JSON-LD.`);
      for (const block of jsonLdBlocks) {
        try {
          JSON.parse(block[1]);
        } catch (error) {
          fail(`${url}: contains invalid JSON-LD (${error.message}).`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  if (urls.length && !failures.some((item) => item.startsWith(OFFICIAL_SITE_ORIGIN))) {
    pass(`All ${urls.length} sitemap pages passed status, canonical, indexability, and HTML checks.`);
  }
}

async function checkCanonicalRouting() {
  const httpResponse = await fetch(`http://${new URL(OFFICIAL_SITE_ORIGIN).hostname}/`, {
    redirect: "manual",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  }).catch((error) => ({ error }));
  if (httpResponse.error) {
    fail(`HTTP redirect check failed (${httpResponse.error.message}).`);
  } else {
    const location = httpResponse.headers.get("location") || "";
    if (![301, 308].includes(httpResponse.status)) fail(`HTTP origin returned ${httpResponse.status}, expected 301 or 308.`);
    if (new URL(location, OFFICIAL_SITE_ORIGIN).toString() !== `${OFFICIAL_SITE_ORIGIN}/`) fail(`HTTP origin redirects to ${location || "nowhere"}.`);
  }

  const www = await request("https://www.huixiangqimao.cn/");
  if (!www.ok) {
    fail(`www redirect check failed (${www.error.message}).`);
  } else if (www.response.url !== `${OFFICIAL_SITE_ORIGIN}/`) {
    fail(`www host does not redirect to the canonical origin; final URL is ${www.response.url}.`);
  } else {
    pass("HTTP and www requests resolve to the canonical HTTPS origin.");
  }

  const missing = await request(`${OFFICIAL_SITE_ORIGIN}/definitely-not-a-real-page-crawl-check`);
  if (!missing.ok) {
    fail(`404 behavior check failed (${missing.error.message}).`);
  } else if (missing.response.status !== 404) {
    fail(`Unknown path returned ${missing.response.status} instead of 404 (soft 404 / homepage fallback).`);
  } else {
    pass("Unknown paths return HTTP 404.");
  }
}

async function checkVerificationFiles() {
  const bytedance = await request(`${OFFICIAL_SITE_ORIGIN}/ByteDanceVerify.html`);
  if (!bytedance.ok) {
    fail(`ByteDanceVerify.html request failed (${bytedance.error.message}).`);
  } else if (
    bytedance.response.status !== 200 ||
    bytedance.response.url !== `${OFFICIAL_SITE_ORIGIN}/ByteDanceVerify.html` ||
    bytedance.body !== BYTEDANCE_VERIFICATION_CONTENT
  ) {
    fail(`ByteDanceVerify.html is not serving the exact verification content (${bytedance.response.status}, ${bytedance.contentType}).`);
  } else {
    pass("ByteDanceVerify.html is publicly readable with exact content.");
  }

  const bing = await request(`${OFFICIAL_SITE_ORIGIN}/BingSiteAuth.xml`);
  if (!bing.ok) {
    fail(`BingSiteAuth.xml request failed (${bing.error.message}).`);
  } else if (
    bing.response.status !== 200 ||
    !/(application|text)\/xml/i.test(bing.contentType) ||
    !/<users>[\s\S]*<user>[^<]+<\/user>[\s\S]*<\/users>/i.test(bing.body)
  ) {
    fail(`BingSiteAuth.xml is not being served as the Bing XML verification file (${bing.response.status}, ${bing.contentType}).`);
  } else {
    pass("BingSiteAuth.xml is publicly readable as XML.");
  }

  const indexNowFile = fs.readdirSync(path.resolve("public")).find((name) => /^[a-f0-9]{64}\.txt$/i.test(name));
  if (!indexNowFile) {
    fail("No IndexNow key file was found in public/.");
    return;
  }
  const expectedKey = path.basename(indexNowFile, ".txt");
  const indexNow = await request(`${OFFICIAL_SITE_ORIGIN}/${indexNowFile}`);
  if (!indexNow.ok) {
    fail(`IndexNow key request failed (${indexNow.error.message}).`);
  } else if (indexNow.response.status !== 200 || indexNow.body.trim() !== expectedKey) {
    fail(`IndexNow key file is not publicly serving its expected plain-text content (${indexNow.response.status}, ${indexNow.contentType}).`);
  } else {
    pass("IndexNow key file is publicly readable.");
  }
}

async function main() {
  console.log(`Checking production site: ${OFFICIAL_SITE_ORIGIN}`);
  await checkHomepageByUserAgent();
  const urls = await checkTextResources();
  await checkSitemapPages(urls);
  await checkCanonicalRouting();
  await checkVerificationFiles();

  if (failures.length) {
    console.error(`Production crawlability check failed with ${failures.length} error(s).`);
    process.exit(1);
  }
  console.log("Production crawlability check passed.");
}

main().catch((error) => {
  console.error(`Production crawlability check failed: ${error.message}`);
  process.exit(1);
});
