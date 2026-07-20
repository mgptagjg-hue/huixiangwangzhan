# 辉祥汽贸官网公网可抓取性审计

检查日期：2026-07-14
正式站点：https://huixiangqimao.cn
技术栈：Astro 5 静态生成、TypeScript、Tailwind CSS、Nginx 1.26.3

## 结论

本地源码和静态构建已满足搜索引擎读取要求：正式域名统一、正文直接存在于原始 HTML、robots 和 sitemap 格式正确、17 个正式 URL 均有 canonical 和真实 `lastmod`。

生产服务器仍有三项必须处理的问题：

1. `https://www.huixiangqimao.cn/` 返回 200，没有 301 到非 www 正式域名。
2. 不存在的路径返回首页 HTML 和 HTTP 200，形成软 404。
3. Bing XML 与 IndexNow key 尚未部署到生产静态根目录，访问时被 Nginx 回退为首页 HTML。

因此当前状态是“本地构建合格、主要公开页面可抓取、生产路由规则仍需修复并重新部署”，不能表述为生产问题已经全部修复。

## 已发现并修复的源码问题

- `astro.config.mjs` 原来使用错误域名 `https://huixiang-auto.example`，现改为共享的正式 Origin。
- 原来 `astro.config.mjs`、站点数据和 IndexNow 脚本分别维护域名，现统一从 `site-origin.mjs` 读取。
- 未配置环境变量时，站点 Origin 可靠回退到 `https://huixiangqimao.cn`；传入其他域名会直接失败。
- 新增构建前域名校验，生产文件出现示例域名、localhost 或 `127.0.0.1` 绝对地址时构建失败。
- 主路由原来共用 `SITE.updatedAt`，现每个页面独立维护真实 `lastmod`。
- 404 页面原来没有明确索引指令，现输出 `noindex, follow`，且不进入 sitemap。
- 首页原始 HTML 增加“主营品牌”可见语义标签，便于搜索引擎和 AI 判断品牌列表用途。
- SEO 审计已扩展到 canonical、sitemap 完整性、重复 URL、lastmod、robots、JSON-LD、noindex、原始 HTML 正文和测试域名检查。
- 新增 `npm run check:production`，网络或生产检查失败时返回非零退出码。

## 正式域名配置

统一来源：`site-origin.mjs`

```text
https://huixiangqimao.cn
```

使用位置：

- `astro.config.mjs`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro` 间接生成 canonical 和 Open Graph
- `src/data/schema.ts` 间接生成 Organization、AutoDealer、Article 等 JSON-LD
- `src/pages/sitemap.xml.ts`
- `src/pages/robots.txt.ts`
- `scripts/submit-indexnow.mjs`
- `scripts/check-indexnow.mjs`

## Sitemap

生成方式：Astro 构建时根据 `MAIN_ROUTES`、指南文章数据和新闻文章数据动态生成。
本地构建 URL 数量：17。
不包含 404、后台、登录页、草稿、参数页、锚点或 noindex 页面。

| URL | lastmod | changefreq | priority |
| --- | --- | --- | --- |
| https://huixiangqimao.cn/ | 2026-07-07 | weekly | 1.0 |
| https://huixiangqimao.cn/about | 2026-07-07 | monthly | 0.8 |
| https://huixiangqimao.cn/trucks | 2026-07-07 | monthly | 0.9 |
| https://huixiangqimao.cn/services | 2026-07-03 | monthly | 0.9 |
| https://huixiangqimao.cn/huzhou-truck-sales | 2026-07-07 | monthly | 0.9 |
| https://huixiangqimao.cn/dongfeng-duolika | 2026-07-07 | monthly | 0.9 |
| https://huixiangqimao.cn/guides | 2026-07-03 | weekly | 0.8 |
| https://huixiangqimao.cn/faq | 2026-07-03 | monthly | 0.8 |
| https://huixiangqimao.cn/news | 2026-07-07 | weekly | 0.7 |
| https://huixiangqimao.cn/contact | 2026-07-03 | monthly | 0.8 |
| https://huixiangqimao.cn/guides/huzhou-dongfeng-truck-selection | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/guides/huzhou-duolika-price-explained | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/guides/huzhou-4m2-truck-use-cases | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/guides/truck-price-cost-checklist | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/guides/changxing-truck-registration-questions | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/guides/huzhou-truck-after-sales-questions | 2026-07-02 | monthly | 0.7 |
| https://huixiangqimao.cn/news/huzhou-truck-after-sales-service | 2026-07-07 | monthly | 0.8 |

## Robots

本地构建内容：

```text
User-agent: *
Allow: /

Sitemap: https://huixiangqimao.cn/sitemap.xml
```

线上实测：HTTP 200，`Content-Type: text/plain`，未屏蔽 Baiduspider、bingbot、正常页面或静态资源。

## 原始 HTML

以下构建产物均直接包含可见正文，不需要执行浏览器 JavaScript：

- `dist/index.html`
- `dist/about/index.html`
- `dist/services/index.html`
- `dist/trucks/index.html`
- `dist/faq/index.html`
- `dist/contact/index.html`
- `dist/guides/index.html`
- `dist/news/index.html`

所有文件均包含公司全称、唯一 canonical，且没有 `noindex`。首页原始 HTML 还包含公司简称、电话、地址、主营业务、主营品牌、服务地区及关于、服务、联系页面内链。

## 本地启动检查

开发服务器使用以下命令启动：

```bash
npm run dev
```

受管沙箱中 Astro 在约 770ms 内启动并成功返回：首页 200、robots 200、sitemap 200、不存在路径 404。随后 Vite 依赖优化尝试读取工作区外目录，被当前沙箱权限拦截；该限制不影响 `npm run build` 和静态产物，不属于页面或路由代码错误。在普通本机终端运行时不受 Codex 文件系统沙箱限制。

## DNS 检查

使用 `223.5.5.5`、`119.29.29.29`、`1.1.1.1`、`8.8.8.8` 分别查询，结果一致：

| 名称 | A | AAAA | CNAME | NS |
| --- | --- | --- | --- | --- |
| huixiangqimao.cn | 124.223.165.156 | 无 | 无 | snipe.dnspod.net、toy.dnspod.net |
| www.huixiangqimao.cn | 124.223.165.156 | 无 | 无 | 继承父域权威 NS |

- 没有错误 AAAA 记录，不存在 IPv6 优先访问到未配置服务器的问题。
- 四个解析器的 NS 一致，未发现 NS 分裂。
- 未发现 DS 记录，表示当前未启用 DNSSEC；没有发现损坏的 DNSSEC 链。
- 当前执行环境的系统 DNS 曾出现约 11 秒首次查询延迟，但指定四个公共 DNS 查询结果稳定一致。
- 使用 `--resolve` 绕过本机 DNS 直连服务器时，5 次请求全部成功，总耗时约 67–86ms，服务器 TCP/TLS 响应正常。

## HTTP、HTTPS 与 www

| 请求 | 实测结果 | 结论 |
| --- | --- | --- |
| http://huixiangqimao.cn/ | 301 到 https://huixiangqimao.cn/ | 正常 |
| https://huixiangqimao.cn/ | 200 text/html | 正常 |
| http://www.huixiangqimao.cn/ | 301 到 https://www.huixiangqimao.cn/ | 未统一到正式域名 |
| https://www.huixiangqimao.cn/ | 200 text/html | 必须改为 301 到非 www |
| 不存在的测试路径 | 200 text/html，正文为首页 | 软 404，必须修复 |

未发现循环跳转、跳到服务器 IP、测试域名或预览域名。

## SSL

- 证书主题：`CN=huixiangqimao.cn`
- SAN：`huixiangqimao.cn`、`www.huixiangqimao.cn`
- 签发机构：Let's Encrypt YE2
- 有效期：2026-07-13 至 2026-10-11
- 证书链构建：成功，共 4 个链元素
- curl SSL 校验结果：0，表示通过

## 不同 User-Agent

| User-Agent | 状态 | 最终地址 | Content-Type | 公司全称 |
| --- | --- | --- | --- | --- |
| Mozilla/5.0 | 200；个别新进程首次请求出现约 10.7 秒连接失败 | https://huixiangqimao.cn/ | text/html | 有 |
| Baiduspider | 200 | https://huixiangqimao.cn/ | text/html | 有 |
| bingbot | 200 | https://huixiangqimao.cn/ | text/html | 有 |
| Googlebot | 200 | https://huixiangqimao.cn/ | text/html | 有 |
| OAI-SearchBot | 200 | https://huixiangqimao.cn/ | text/html | 有 |

成功请求取得的首页 HTML 内容完全一致，未发现基于 User-Agent 返回不同正文、403、验证码或人机验证。独立 Node 进程 5 次测试中 4 次约 129–154ms 成功、1 次约 10.7 秒失败；curl 首次系统 DNS 查询约 11.26 秒，后续约 0.10 秒。结合公共 DNS 和直连测试，当前证据更支持执行环境递归 DNS 路径偶发延迟，而不是特定爬虫 UA 被封禁。

## 服务器、CDN 与防护

- 响应头显示 `Server: nginx/1.26.3`。
- 未看到 CDN 或 WAF 特征响应头。
- 五类 User-Agent 均未被 403、验证码或不同内容拦截。
- 无服务器、宝塔或云安全组管理权限，无法直接查看防火墙、WAF、地域限制、频率限制或 Nginx 日志，因此不能断言这些后台策略完全不存在。

## 验证文件状态

- 本地 `public/BingSiteAuth.xml` 与 Bing 原文件哈希一致，构建后存在于 `dist/BingSiteAuth.xml`。
- 线上 `/BingSiteAuth.xml` 当前返回 200 `text/html` 首页，不是 XML，Bing 文件验证不能通过。
- 本地 IndexNow key 文件已存在于 `public/`，构建后进入 `dist/`。
- 线上 IndexNow key 地址当前返回 200 `text/html` 首页，不是 key 纯文本，暂时不要执行正式 IndexNow 提交。

## 仍需人工处理

### 1. 部署最新构建产物

在服务器或宝塔中确认 `huixiangqimao.cn` 的实际网站根目录，将当前项目最新 `dist/` 内容完整同步到该目录。不要上传 `.env`、私钥、Token、数据库、`node_modules` 或源码缓存。

部署后必须确认：

- `/BingSiteAuth.xml` 返回 200 XML 原文。
- IndexNow key 文件返回 200 纯文本，正文只包含该 key。
- 首页包含本次新增的“主营品牌”文本。

### 2. 修复 Nginx 软 404

在宝塔面板“网站 -> huixiangqimao.cn -> 设置 -> 配置文件”检查站点配置。静态 Astro 站点不应把未知路径回退到 `/index.html`。

建议核心规则：

```nginx
location / {
    try_files $uri $uri/ =404;
}

error_page 404 /404.html;
```

删除或替换类似以下会制造软 404 的规则：

```nginx
try_files $uri $uri/ /index.html;
```

修改前备份当前 Nginx 配置，修改后执行配置测试并平滑重载，不要关闭全部安全策略。

### 3. 统一 www

为 `www.huixiangqimao.cn` 配置永久跳转：

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name www.huixiangqimao.cn;
    return 301 https://huixiangqimao.cn$request_uri;
}
```

SSL 证书路径应继续使用服务器现有安全配置，不要把私钥写入项目或 Git。

### 4. 部署后复测

```bash
npm run check:production
```

只有该命令返回 0，并且 Bing/IndexNow 文件正文正确、不存在路径返回 404、www 跳到非 www 后，才能确认生产抓取链路完整。

若搜索引擎仍偶发超时，再在宝塔 Nginx 访问日志、错误日志、云服务器安全组和防火墙中按时间检查爬虫请求，不要直接关闭所有安全防护。
