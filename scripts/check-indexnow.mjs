import fs from "node:fs";
import path from "node:path";
import {
  DIST_DIR,
  SITE_ORIGIN,
  findIndexNowKey,
  inspectBuiltPage,
  normalizeOfficialUrl,
  readUrlFile
} from "./indexnow-utils.mjs";

const urlFile = "scripts/indexnow-urls.json";

function main() {
  const keyInfo = findIndexNowKey();
  const distKeyPath = path.join(DIST_DIR, keyInfo.fileName);

  if (!fs.existsSync(path.join(DIST_DIR, "index.html"))) {
    throw new Error("dist/index.html 不存在，请先运行 npm run build。");
  }

  if (!fs.existsSync(distKeyPath)) {
    throw new Error(`构建产物中缺少 IndexNow Key 文件：${distKeyPath}`);
  }

  if (!fs.readFileSync(distKeyPath).equals(fs.readFileSync(keyInfo.filePath))) {
    throw new Error("public 与 dist 中的 IndexNow Key 文件内容不一致。");
  }

  const expectedLocation = `${SITE_ORIGIN}/${keyInfo.key}.txt`;
  if (keyInfo.keyLocation !== expectedLocation) {
    throw new Error(`keyLocation 不正确：${keyInfo.keyLocation}`);
  }

  const { absolutePath, urls } = readUrlFile(urlFile);
  const normalized = urls.map(normalizeOfficialUrl);
  if (new Set(normalized).size !== normalized.length) {
    throw new Error(`${absolutePath} 包含重复 URL。`);
  }

  urls.forEach((url, index) => {
    if (url !== normalized[index]) {
      throw new Error(`首次提交清单必须使用 canonical URL：${url}；应为 ${normalized[index]}`);
    }
    inspectBuiltPage(url, { required: true });
  });

  for (const requiredFile of ["sitemap.xml", "robots.txt"]) {
    if (!fs.existsSync(path.join(DIST_DIR, requiredFile))) {
      throw new Error(`构建产物缺少 ${requiredFile}。`);
    }
  }

  console.log(`IndexNow Key：${keyInfo.key}`);
  console.log(`源 Key 文件：${keyInfo.filePath}`);
  console.log(`构建 Key 文件：${distKeyPath}`);
  console.log(`keyLocation：${keyInfo.keyLocation}`);
  console.log(`首次提交 URL 数量：${urls.length}`);
  console.log("IndexNow 本地检查通过。");
}

try {
  main();
} catch (error) {
  console.error(`IndexNow 本地检查失败：${error.message}`);
  process.exitCode = 1;
}
