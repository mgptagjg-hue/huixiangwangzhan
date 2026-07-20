import {
  INDEXNOW_ENDPOINT,
  SITE_HOST,
  findIndexNowKey,
  inspectBuiltPage,
  normalizeOfficialUrl,
  readUrlFile
} from "./indexnow-utils.mjs";

const STATUS_MESSAGES = {
  200: "提交成功",
  202: "已接收，密钥验证处理中",
  400: "请求格式错误",
  403: "密钥验证失败",
  422: "URL 或主机不匹配",
  429: "提交过于频繁"
};

function printUsage() {
  console.log(`用法：
  npm run indexnow -- https://huixiangqimao.cn/
  npm run indexnow -- https://huixiangqimao.cn/news/example/ https://huixiangqimao.cn/trucks/
  npm run indexnow -- --file scripts/indexnow-urls.json

可选：
  --dry-run  只校验并显示提交内容，不发送网络请求

只有真实新增、修改或删除页面时才提交。首次批量提交前必须先部署并确认 Key 文件可公开访问。`);
}

function parseArgs(values) {
  const options = { dryRun: false, file: "", urls: [] };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") return { ...options, help: true };
    if (value === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (value === "--file") {
      if (!values[index + 1]) throw new Error("--file 后必须提供 JSON 文件路径。");
      options.file = values[index + 1];
      index += 1;
      continue;
    }
    if (value.startsWith("--")) throw new Error(`不支持的参数：${value}`);
    options.urls.push(value);
  }

  return options;
}

async function fetchWithTimeout(url, options = {}) {
  try {
    return await fetch(url, {
      ...options,
      redirect: "manual",
      signal: AbortSignal.timeout(30000)
    });
  } catch (error) {
    throw new Error(`公网预检请求失败 ${url}：${error.message}`);
  }
}

async function verifyPublicKey(key, keyLocation) {
  const response = await fetchWithTimeout(keyLocation, {
    headers: { Accept: "text/plain" }
  });
  const content = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Key 验证地址发生重定向，拒绝提交：${keyLocation}`);
  }
  if (response.status !== 200) {
    throw new Error(`Key 验证地址未返回 200：${keyLocation}（HTTP ${response.status}）`);
  }
  if (!contentType.toLowerCase().includes("text/plain")) {
    throw new Error(`Key 验证地址不是纯文本：${keyLocation}（${contentType || "无 Content-Type"}）`);
  }
  if (content !== key) {
    throw new Error(`Key 验证地址正文与 Key 不完全一致，可能包含 BOM、空格或换行：${keyLocation}`);
  }
}

function canonicalFromHtml(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || "";
}

function hasNoIndex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

async function preflightPublicUrls(urls, builtStates) {
  for (const url of urls) {
    const response = await fetchWithTimeout(url, {
      headers: { Accept: "text/html,application/xhtml+xml" }
    });
    const content = await response.text();
    const location = response.headers.get("location");

    if (response.status >= 300 && response.status < 400) {
      throw new Error(`拒绝提交重定向 URL：${url}（HTTP ${response.status}${location ? `，Location: ${location}` : ""}）`);
    }

    if (response.status === 404 || response.status === 410) {
      if (builtStates.get(url)?.exists) {
        throw new Error(`拒绝提交意外返回 ${response.status} 的现有页面：${url}`);
      }
      console.log(`删除 URL 预检：${url} 返回 ${response.status}，允许通知删除状态。`);
      continue;
    }

    if (response.status !== 200) {
      throw new Error(`拒绝提交未返回 200 的 URL：${url}（HTTP ${response.status}）`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html")) {
      throw new Error(`拒绝提交非 HTML 页面：${url}（${contentType || "无 Content-Type"}）`);
    }
    if (hasNoIndex(content)) {
      throw new Error(`拒绝提交线上 noindex 页面：${url}`);
    }

    const canonical = canonicalFromHtml(content);
    if (!canonical || canonical !== url) {
      throw new Error(`拒绝提交非 canonical URL：${url}；线上 canonical 为 ${canonical || "缺失"}`);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const fileResult = options.file ? readUrlFile(options.file) : { urls: [] };
  const rawUrls = [...options.urls, ...fileResult.urls];
  if (rawUrls.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const normalizedUrls = rawUrls.map(normalizeOfficialUrl);
  const urlList = [...new Set(normalizedUrls)];
  const builtStates = new Map();
  for (const url of urlList) {
    builtStates.set(url, inspectBuiltPage(url, { required: Boolean(options.file) }));
  }

  const { key, keyLocation } = findIndexNowKey();
  const payload = { host: SITE_HOST, key, keyLocation, urlList };

  console.log(`提交端点：${INDEXNOW_ENDPOINT}`);
  console.log(`提交 URL 数量：${urlList.length}`);
  console.log("提交 URL 列表：");
  urlList.forEach((url) => console.log(`- ${url}`));
  console.log(`Key 验证地址：${keyLocation}`);

  if (options.dryRun) {
    console.log("执行结果：dry-run 校验通过，未发送 IndexNow 请求。");
    return;
  }

  console.log("开始公网预检：Key 文件、HTTP 状态、重定向、noindex 与 canonical。");
  await verifyPublicKey(key, keyLocation);
  await preflightPublicUrls(urlList, builtStates);
  console.log("公网预检通过，准备发送 IndexNow 请求。");

  let response;
  try {
    response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000)
    });
  } catch (error) {
    throw new Error(`IndexNow 网络请求失败：${error.message}`);
  }

  const responseText = await response.text();
  const statusMessage = STATUS_MESSAGES[response.status] || `未预期的响应状态：${response.statusText}`;
  console.log(`HTTP 状态码：${response.status}`);
  console.log(`状态说明：${statusMessage}`);
  if (responseText) console.log(`响应内容：${responseText}`);

  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow 提交失败：HTTP ${response.status}，${statusMessage}`);
  }

  console.log(`提交结果：${statusMessage}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
