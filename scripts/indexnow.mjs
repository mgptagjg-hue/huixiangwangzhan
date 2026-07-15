import { SITE_ORIGIN } from "../site-origin.mjs";

const HOST = new URL(SITE_ORIGIN).hostname;
const INDEXNOW_KEY = "24d0c9a09cbb007078ec63115c965aadfd8b5c3d3e8d8fae6cebddd152d7ad7e";
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage:
  npm run indexnow -- https://huixiangqimao.cn/path
  npm run indexnow -- --file docs/indexnow-urls.txt
  npm run indexnow -- --submit https://huixiangqimao.cn/path
  npm run indexnow -- --submit --file docs/indexnow-urls.txt

Notes:
  - The script defaults to dry-run. Add --submit to send to IndexNow.
  - Only HTTPS URLs on huixiangqimao.cn are accepted.
  - Use the same command for new, updated, or deleted official URLs.
`);
}

function parseArgs(values) {
  const options = {
    submit: false,
    file: "",
    urls: []
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--help" || value === "-h") {
      options.help = true;
      continue;
    }

    if (value === "--submit") {
      options.submit = true;
      continue;
    }

    if (value === "--file") {
      const file = values[index + 1];
      if (!file) {
        throw new Error("--file requires a path.");
      }
      options.file = file;
      index += 1;
      continue;
    }

    options.urls.push(value);
  }

  return options;
}

async function readUrlsFromFile(file) {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile(file, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function normalizeUrl(input) {
  const url = new URL(input, SITE_ORIGIN);

  if (url.protocol !== "https:") {
    throw new Error(`Only HTTPS URLs are allowed: ${input}`);
  }

  if (url.hostname !== HOST) {
    throw new Error(`Only ${HOST} URLs are allowed: ${input}`);
  }

  url.hash = "";
  return url.toString();
}

async function main() {
  const options = parseArgs(args);

  if (options.help) {
    printUsage();
    return;
  }

  const fileUrls = options.file ? await readUrlsFromFile(options.file) : [];
  const urlList = [...new Set([...options.urls, ...fileUrls].map(normalizeUrl))];

  if (urlList.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList
  };

  if (!options.submit) {
    console.log("IndexNow dry-run payload:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("Add --submit to send this payload.");
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`IndexNow submission failed: ${response.status} ${response.statusText}\n${text}`);
  }

  console.log(`IndexNow submission accepted: ${response.status} ${response.statusText}`);
  if (text) {
    console.log(text);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
