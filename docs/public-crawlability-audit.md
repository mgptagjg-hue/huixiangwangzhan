# 辉祥汽贸官网公网可抓取性审计

检查日期：2026-07-20
正式站点：https://huixiangqimao.cn
技术栈：Astro 5 静态生成、TypeScript、Tailwind CSS、Nginx 1.26.3

## 结论

官网已经上线，并非客户端 JavaScript 空壳。线上首页、robots、sitemap 均返回 HTTP 200；Baiduspider、bingbot、Googlebot、OAI-SearchBot 均可读取包含公司名称的完整首页 HTML，未遇到 403、验证码或爬虫专用空页面。

本次源码更新后，本地构建包含 19 个静态 HTML 页面和 18 条 sitemap URL。新增“长兴辉祥汽车贸易有限公司官网正式上线公告”，并统一企业 Schema、canonical、robots 和 IndexNow URL。

生产 Nginx 仍有两项服务器配置需要在部署时修复：

1. `https://www.huixiangqimao.cn/` 当前返回 200，应 301 到 `https://huixiangqimao.cn/`。
2. 不存在路径当前回退首页并返回 200，形成 soft 404，应返回真正的 HTTP 404。

## 线上实测

| 地址或检查项 | 2026-07-20 实测 | 结论 |
| --- | --- | --- |
| `https://huixiangqimao.cn/` | 200 `text/html` | 正常 |
| `https://huixiangqimao.cn/robots.txt` | 200 `text/plain` | 正常 |
| `https://huixiangqimao.cn/sitemap.xml` | 200 `text/xml` | 正常 |
| `http://huixiangqimao.cn/` | 301 到正式 HTTPS | 正常 |
| `https://www.huixiangqimao.cn/` | 200 | 必须改为 301 |
| 不存在路径 | 200 且返回首页 | 必须改为 404 |
| `BingSiteAuth.xml` | 200 XML | 正常 |
| IndexNow Key | 200 `text/plain`，正文与 Key 一致 | 正常 |

HTTPS 请求可正常完成 TLS 校验。未发现循环跳转、测试域名、服务器 IP 或 localhost 出现在正式页面中。

## 爬虫响应

线上检查脚本使用以下 User-Agent 请求首页：

- Baiduspider
- bingbot
- Googlebot
- OAI-SearchBot
- 普通浏览器 User-Agent

四类搜索爬虫均获得 HTTP 200、`text/html` 和包含“长兴辉祥汽车贸易有限公司”的完整静态 HTML。一次普通浏览器请求出现网络环境瞬时连接失败，重试和 curl 请求正常；没有证据表明网站按 User-Agent 屏蔽爬虫。

## 本地构建结果

- `npm run build`：通过，生成 19 个页面。
- `npm run audit:seo`：通过，检查 19 个 HTML 页面和 18 条 sitemap URL。
- `npm run check:indexnow`：通过，检查 6 条本轮真实更新 URL。
- 首页、关于、车型、服务、FAQ、新闻、公告和联系页面正文均直接存在于 `dist/**/*.html`，无需执行客户端 JavaScript。
- 每个公开页面包含唯一 H1、title、description、canonical、JSON-LD、公司名称、门店名称、电话和地址。
- 404 页面包含 `noindex, follow`，且不进入 sitemap。

## Canonical 与 Sitemap

服务器对目录页面的直接 200 地址使用尾斜杠。本次已将 canonical、sitemap 和 IndexNow URL 统一为该形式，例如：

```text
https://huixiangqimao.cn/about/
https://huixiangqimao.cn/trucks/
https://huixiangqimao.cn/news/
https://huixiangqimao.cn/news/official-website-launch-announcement/
```

Sitemap 由 `src/pages/sitemap.xml.ts` 根据 `MAIN_ROUTES`、指南数据和新闻数据在构建时生成。`lastmod` 来自页面或文章的真实维护日期，不使用构建时间虚假刷新。

## Robots

最新构建内容：

```text
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: https://huixiangqimao.cn/sitemap.xml
```

## 企业实体

全站企业结构化数据统一使用：

```text
https://huixiangqimao.cn/#business
```

实体类型为 Organization、AutoDealer、LocalBusiness，包含公司名称、门店名称、官网、电话、地址、服务地区、主营品牌、主营服务、门店图片和备案标识。未添加评分、评论、销量、固定库存、价格或绝对化宣传。

## Nginx 必须修复

在现有 HTTPS 配置中为 `www` 主机增加永久跳转：

```nginx
server {
    listen 443 ssl;
    server_name www.huixiangqimao.cn;

    # 沿用服务器现有证书配置。
    return 301 https://huixiangqimao.cn$request_uri;
}
```

主站不要把所有未知路径回退到 `index.html`。静态 Astro 站应使用类似：

```nginx
location / {
    try_files $uri $uri/ =404;
}

error_page 404 /404.html;
```

修改前备份站点配置，随后只使用服务器实际安装的 Nginx 检查和重载命令。不要同时执行系统 Nginx 与宝塔 Nginx 两套命令。

## 部署后复测

```bash
npm run check:production
npm run indexnow -- --file scripts/indexnow-urls.json
```

只有 `check:production` 全部通过后再提交 IndexNow。百度和 Bing 还需在各自搜索资源平台人工提交最新 sitemap 与本轮 URL。
