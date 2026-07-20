import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_ORIGIN = "https://huixiangqimao.cn";
export const SITE_HOST = "huixiangqimao.cn";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
export const DIST_DIR = path.join(PROJECT_ROOT, "dist");

const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export function findIndexNowKey() {
  const keyFiles = fs
    .readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
    .map((entry) => entry.name)
    .filter((name) => KEY_PATTERN.test(path.basename(name, ".txt")));

  if (keyFiles.length === 0) {
    throw new Error("public/ 中未找到符合格式的 IndexNow Key 文件。");
  }

  if (keyFiles.length > 1) {
    throw new Error(`public/ 中发现多个疑似 IndexNow Key 文件：${keyFiles.join("、")}`);
  }

  const fileName = keyFiles[0];
  const key = path.basename(fileName, ".txt");
  const filePath = path.join(PUBLIC_DIR, fileName);
  const content = fs.readFileSync(filePath);
  const expected = Buffer.from(key, "utf8");

  if (!content.equals(expected)) {
    throw new Error(`${filePath} 的文件内容必须与文件名中的 Key 完全一致，且不能包含 BOM、空行或换行。`);
  }

  return {
    key,
    fileName,
    filePath,
    keyLocation: `${SITE_ORIGIN}/${fileName}`
  };
}

export function normalizeOfficialUrl(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("IndexNow URL 必须是非空字符串。");
  }

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error(`URL 必须是完整的正式 HTTPS 地址：${input}`);
  }

  if (url.origin !== SITE_ORIGIN || url.hostname !== SITE_HOST) {
    throw new Error(`只允许提交 ${SITE_ORIGIN}/ 下的 URL：${input}`);
  }

  if (url.protocol !== "https:" || url.port || url.username || url.password) {
    throw new Error(`URL 必须使用正式 HTTPS 域名且不能包含端口或认证信息：${input}`);
  }

  if (url.search || url.hash) {
    throw new Error(`不允许提交带查询参数或锚点的重复 URL：${input}`);
  }

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  if (/^\/404(?:\.html)?$/i.test(url.pathname)) {
    throw new Error(`不允许提交网站的 404 页面：${input}`);
  }

  return url.toString();
}

export function builtHtmlPathForUrl(input) {
  const url = new URL(normalizeOfficialUrl(input));
  const segments = url.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (segments.some((segment) => segment === "." || segment === ".." || segment.includes("\\"))) {
    throw new Error(`URL 路径不安全：${input}`);
  }

  return segments.length === 0
    ? path.join(DIST_DIR, "index.html")
    : path.join(DIST_DIR, ...segments, "index.html");
}

export function inspectBuiltPage(input, { required = false } = {}) {
  const url = normalizeOfficialUrl(input);
  const htmlPath = builtHtmlPathForUrl(url);

  if (!fs.existsSync(htmlPath)) {
    if (required) {
      throw new Error(`首次提交清单中的 URL 没有对应构建页面：${url}`);
    }
    return { exists: false, htmlPath };
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    throw new Error(`拒绝提交 noindex 页面：${url}`);
  }

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
  if (!canonical) {
    throw new Error(`构建页面缺少 canonical：${url}`);
  }

  if (canonical !== url) {
    throw new Error(`拒绝提交非 canonical 或可能重定向的 URL：${url}；canonical 为 ${canonical}`);
  }

  return { exists: true, htmlPath, canonical };
}

export function readUrlFile(filePath) {
  const absolutePath = path.resolve(PROJECT_ROOT, filePath);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    throw new Error(`无法读取 URL JSON 文件 ${absolutePath}：${error.message}`);
  }

  if (!Array.isArray(data) || data.some((item) => typeof item !== "string")) {
    throw new Error(`${absolutePath} 必须是只包含 URL 字符串的 JSON 数组。`);
  }

  return { absolutePath, urls: data };
}
