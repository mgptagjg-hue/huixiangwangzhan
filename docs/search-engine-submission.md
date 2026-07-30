# 搜索资源平台提交清单

更新时间：2026-07-20

## 基本信息

- 正式域名：https://huixiangqimao.cn
- Sitemap：https://huixiangqimao.cn/sitemap.xml
- Robots：https://huixiangqimao.cn/robots.txt
- 技术栈：Astro 静态生成、TypeScript、Tailwind CSS
- 构建命令：`npm run build`
- 静态文件源目录：`public/`
- 构建产物目录：`dist/`
- 全局 head：`src/layouts/BaseLayout.astro`

## 本轮正式更新 URL

以下 6 条 URL 对应本次新增或真实更新内容：

1. https://huixiangqimao.cn/
2. https://huixiangqimao.cn/news/official-website-launch-announcement/
3. https://huixiangqimao.cn/about/
4. https://huixiangqimao.cn/trucks/
5. https://huixiangqimao.cn/news/
6. https://huixiangqimao.cn/contact/

完整 sitemap 共 18 条 URL，包含首页、关于、车型中心、东风多利卡、服务、购车咨询、FAQ、指南列表、6 篇指南、新闻列表、2 篇新闻和联系我们。

## Robots

```text
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: https://huixiangqimao.cn/sitemap.xml
```

## 百度搜索资源平台

- 百度 Meta 验证标签仍在全站公共 head 中：`codeva-WvxQBXoXv6`。
- 提交 sitemap：`https://huixiangqimao.cn/sitemap.xml`。
- 在普通收录或 URL 提交功能中提交上面的 6 条本轮更新 URL。
- 不要在项目中保存百度 Token；API 提交凭据只在安全环境中单独管理。

## Bing Webmaster Tools

- 验证文件：`public/BingSiteAuth.xml`。
- 公网地址：`https://huixiangqimao.cn/BingSiteAuth.xml`。
- 提交 sitemap：`https://huixiangqimao.cn/sitemap.xml`。
- 使用 URL Submission 提交上面的 6 条本轮更新 URL。

## IndexNow

源码中已安全接入 IndexNow，Key 文件位于 `public/`，提交脚本不会读取或复用其他平台密钥。

部署后先检查：

```bash
npm run build
npm run check:indexnow
npm run check:production
```

确认公网 Key、页面 200、canonical、robots、sitemap、www 跳转和 404 均正确后，再提交本轮清单：

```bash
npm run indexnow -- --file scripts/indexnow-urls.json
```

推荐使用一键命令。它会依次构建网站、检查本地 IndexNow 配置、检查线上正式站点，再提交 `scripts/indexnow-urls.json`：

```bash
npm run indexnow:all
```

任何检查失败都会中止提交。

以后只提交真实新增、修改或删除的 URL：

```bash
npm run indexnow -- https://huixiangqimao.cn/news/example/
npm run indexnow -- https://huixiangqimao.cn/trucks/
```

IndexNow 不能替代 sitemap、百度资源提交或持续内容运营，也不代表一定收录或获得排名。

## 部署后检查

1. 首页、robots、sitemap 和公告返回 200。
2. `http://huixiangqimao.cn/` 301 到正式 HTTPS。
3. `https://www.huixiangqimao.cn/` 301 到非 www 正式域名。
4. 不存在路径返回 404，而不是首页 200。
5. sitemap 中所有 URL 均为正式 HTTPS、尾斜杠 canonical URL。
6. 页面没有 `noindex`，正文和企业信息可在原始 HTML 中读取。
7. 百度验证标签、ICP、公安备案、Bing XML 和 IndexNow Key 均可公开读取。
8. 运行 `npm run check:production` 并确认全部通过。
