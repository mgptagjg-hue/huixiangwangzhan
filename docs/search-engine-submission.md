# 搜索资源平台提交前技术准备

更新时间：2026-07-14

## 基本信息

- 正式域名：https://huixiangqimao.cn
- Sitemap：https://huixiangqimao.cn/sitemap.xml
- Robots：https://huixiangqimao.cn/robots.txt
- 技术栈：Astro 静态站，TypeScript，Tailwind CSS
- 构建命令：`npm run build`
- 静态文件根目录：`public/`
- 构建产物目录：`dist/`

## 公网检查状态

2026-07-14 后续实测已取得公网结果：

- 正式首页、robots、sitemap 和 17 个 sitemap 页面均返回 200。
- 五类浏览器/爬虫 User-Agent 均可读取包含公司全称的静态 HTML，未发现 UA 封禁。
- `www` 尚未 301 到非 www 正式域名。
- 不存在路径、尚未部署的 Bing XML 和 IndexNow key 被 Nginx 回退为首页 200，存在软 404。

完整证据和服务器修复位置见 `docs/public-crawlability-audit.md`。

## Robots 内容

```txt
User-agent: *
Allow: /

Sitemap: https://huixiangqimao.cn/sitemap.xml
```

## Sitemap 生成方式

`src/pages/sitemap.xml.ts` 在构建时生成 sitemap。

来源包括：

- `src/data/site.ts` 中的 `MAIN_ROUTES`
- `src/data/articles.ts` 中的购车指南文章
- `src/data/news.ts` 中的新闻动态文章

当前本地构建后的 sitemap 共包含 17 条 URL。`lastmod` 使用页面或文章数据中的真实更新时间，不使用每次构建时间。

## URL 提交清单

说明：

- “本地构建状态”来自 `dist/` 构建产物验证。
- “公网 HTTP 状态”来自 2026-07-14 的生产抓取检查。
- 所有 URL 均进入 sitemap，均未发现 `noindex`。

17 条 URL 的完整清单、lastmod、canonical 和公网检查结果统一维护在 `docs/public-crawlability-audit.md`，避免两份表格产生状态漂移。

## 百度搜索资源平台准备

HTML Meta 验证备用入口：

- 全局 head 模板：`src/layouts/BaseLayout.astro`
- 当前已包含百度 Meta 验证标签：
  `<meta name="baidu-site-verification" content="codeva-WvxQBXoXv6" />`

HTML 文件验证入口：

- 百度下载的真实验证文件应放入：`public/`
- 示例访问形式：`https://huixiangqimao.cn/验证文件名.html`
- 不要把验证文件放入新闻文章、React/Astro 页面正文或非公开目录。

## Bing Webmaster Tools 准备

Meta 验证备用入口：

- 全局 head 模板：`src/layouts/BaseLayout.astro`
- 等 Bing 平台提供真实 meta 标签后，再加入 `<head>...</head>`。
- 不要自行编造 Bing 验证码。

XML 或 HTML 文件验证入口：

- Bing 下载的真实验证文件应放入：`public/`
- 示例访问形式：
  - `https://huixiangqimao.cn/BingSiteAuth.xml`
  - `https://huixiangqimao.cn/验证文件名.html`

## IndexNow 准备

IndexNow Key 文件：

- 源码位置：`public/24d0c9a09cbb007078ec63115c965aadfd8b5c3d3e8d8fae6cebddd152d7ad7e.txt`
- 线上访问地址：`https://huixiangqimao.cn/24d0c9a09cbb007078ec63115c965aadfd8b5c3d3e8d8fae6cebddd152d7ad7e.txt`
- 文件内容：仅包含该 IndexNow Key，不带 BOM、空行或尾部换行。

提交脚本：

- 脚本位置：`scripts/submit-indexnow.mjs`
- 本地检查：`scripts/check-indexnow.mjs`
- 首次提交清单：`scripts/indexnow-urls.json`
- npm 命令：`npm run indexnow`

部署后先运行本地检查：

```bash
npm run build
npm run check:indexnow
```

第一次接入：确认线上 Key 文件能够直接访问且正文与 Key 完全一致后，运行：

```bash
npm run indexnow -- --file scripts/indexnow-urls.json
```

发布或真实修改新闻后，只提交发生变化的 URL：

```bash
npm run indexnow -- https://huixiangqimao.cn/news/huzhou-truck-after-sales-service
```

修改车型中心后：

```bash
npm run indexnow -- https://huixiangqimao.cn/trucks
```

注意：

- 仅提交 `https://huixiangqimao.cn` 下的正式 URL。
- `npm run indexnow` 会正式发送请求；如只想校验，可额外使用 `--dry-run`。
- 删除页面应先确保线上返回 404 或 410，再提交对应正式 URL。
- 不要提交测试页、预览页、localhost、IP 地址、后台页、登录页或参数重复页。
- IndexNow 不是排名保证，不能替代 sitemap、百度资源提交或正常内容运营。
- 只有真实新增、修改或删除页面时才提交，不要每天重复提交未变化页面。
- 提交脚本会先检查公网 Key 正文、URL 状态、重定向、`noindex` 和 canonical；任一项不符合就会以非 0 状态退出，不会调用 IndexNow API。
- 当前服务器若把无尾斜杠 canonical URL 301 到尾斜杠版本，应先统一 Nginx 与 canonical URL 规则，再进行首次提交。

## 部署后人工复测清单

1. 打开 `https://huixiangqimao.cn/robots.txt`，确认返回 200。
2. 打开 `https://huixiangqimao.cn/sitemap.xml`，确认返回 200。
3. 验证 sitemap XML 格式正确。
4. 确认 sitemap 中所有 URL 都是 `https://huixiangqimao.cn`。
5. 逐条检查提交 URL 返回 200。
6. 确认页面无 `noindex`。
7. 确认 canonical 与正式 URL 一致。
8. 确认 robots 未屏蔽主要页面和静态资源。
9. 上传百度或 Bing 真实验证文件后，确认文件可从公网访问。
10. IndexNow key 文件部署后，确认 key URL 可从公网访问。
11. 在百度搜索资源平台和 Bing Webmaster Tools 中人工提交 sitemap。
12. 仅在确认线上 Key 文件内容与文件名完全一致后，再运行 `npm run indexnow` 正式提交。
