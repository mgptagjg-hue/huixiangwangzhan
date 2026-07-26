# 辉祥汽贸官网百度蜘蛛可访问性审计与修复报告

初次审计：2026-07-22

服务器续审与修复：2026-07-23

正式站点：https://huixiangqimao.cn

仓库：https://github.com/mgptagjg-hue/huixiangwangzhan

## 最终结论

辉祥汽贸官网是 Astro 静态站，正式 HTML 直接包含正文，不是依赖浏览器执行 React 才出现内容的空壳页面。普通浏览器、Baiduspider、Baiduspider-render、百度移动 UA、Bing、Google、头条、Bytespider 和 OAI-SearchBot 均取得相同首页 HTML。

服务器日志进一步证明真实百度蜘蛛已经到达服务器。对日志来源 IP 按“反向 DNS 属于 `baidu.com`/`baidu.jp`，再正向解析回原 IP”的方式双向验证后，确认 2026-07-18 至 2026-07-20 有 28 次真实百度蜘蛛请求：27 次 HTTP 200、1 次 `/about` 到 `/about/` 的正常 301。请求覆盖首页、关于页、CSS、Logo、车辆图片和真实门店图片，总发送 12,040,919 字节。没有真实百度蜘蛛命中错误日志，也没有已验证百度 IP 被当前防火墙或 IPSet 阻断。

本次发现并修复了两个与索引质量有关的服务器路由问题：

1. HTTPS `www` 原先不跳转到非 `www`；HTTP `www` 只跳到 HTTPS `www`。
2. Nginx 原先使用 `try_files $uri $uri/ /index.html;`，导致未知路径和不存在新闻路径返回首页及 HTTP 200，形成软 404。

修复后，三种 HTTP/`www` 入口均 301 到 `https://huixiangqimao.cn` 的相同路径和查询参数；未知普通路径、未知新闻路径和直接访问 `/404.html` 均返回真正 HTTP 404。19 个 sitemap URL、正式页面、门店图片、robots、sitemap、ByteDance、Bing 和 IndexNow 验证文件保持 HTTP 200。`npm run check:production` 已从 2 项失败变为全项通过。

百度搜索资源平台提示“备案号不存在”仍应作为工信部备案数据校验/同步问题单独反馈，不能归因于网页抓取。反馈材料见 `reports/baidu-filing-feedback.txt`。

## 已确认并修复的问题

### 1. www 规范化

修复前：

- `http://www.huixiangqimao.cn/about/?audit=1` 跳到 `https://www.huixiangqimao.cn/about/?audit=1`。
- `https://www.huixiangqimao.cn/about/?audit=1` 返回 200。

修复后：

- `http://huixiangqimao.cn/about/?audit=after` -> 301 `https://huixiangqimao.cn/about/?audit=after`。
- `http://www.huixiangqimao.cn/about/?audit=after` -> 301 `https://huixiangqimao.cn/about/?audit=after`。
- `https://www.huixiangqimao.cn/about/?audit=after` -> 301 `https://huixiangqimao.cn/about/?audit=after`。

### 2. 软 404

真实生效 vhost `/etc/nginx/conf.d/huixiang.conf` 原配置为：

```nginx
try_files $uri $uri/ /index.html;
```

该规则是未知路径返回首页 200 的直接原因。修复后为：

```nginx
location / {
    try_files $uri $uri/ $uri/index.html =404;
}

error_page 404 /404.html;

location = /404.html {
    internal;
}
```

修复后两个随机不存在路径均返回 404，正式 Astro 目录路由继续返回 200。项目实际车型中心是 `/trucks/`；不存在的 `/vehicles/` 不再伪装成首页。

## 已排除的问题

- 已排除纯 React/Vite 空壳：Astro 5，`output: "static"`。
- 已排除 JavaScript 后加载正文：首页静态 HTML 39,608 字节，剥离脚本和样式后正文 3,489 字符。
- 已排除 Baiduspider 只获得空白、验证码、403 或 WAF 页面。
- 已排除公开 UA 差异：首页 SHA-256 均为 `950cbc74a8cbd88af97428270171a164101ab1cccd7192de4138bda15b241bcc`。
- 已排除 robots 禁止抓取和生产页面 noindex。
- 已排除 `X-Robots-Tag: noindex`。
- 已排除线上核心产物落后：线上首页、robots、sitemap 和两篇文章与服务器 `dist` 哈希一致。
- 已排除错误 AAAA：当前没有 AAAA 记录。
- 已排除 TLS 主机名不匹配：证书同时覆盖根域名与 www。
- 已排除 Nginx UA 过滤：完整 `nginx -T` 未发现 Baiduspider、bot 黑名单、403/444、限流或 X-Robots-Tag 规则。
- 已排除 Nginx WAF：构建模块、已加载配置和配置目录未发现 WAF、ModSecurity 或 Lua access 规则。
- 已排除 Fail2ban：未安装且服务 inactive。
- 已排除宝塔插件 WAF：当前宝塔插件目录仅发现 `webssh`。
- 已排除 firewalld 端口阻塞：public zone 明确开放 HTTP 80 和 HTTPS 443。
- 已排除已知真实百度 IP 被阻断：28 次请求涉及的双向验证 IP 均未命中 `YJ-GLOBAL-INBLOCK` 或显式 REJECT 规则。

## 仍无法由本机确认的事项

- 云厂商控制台安全组、外部 CDN/WAF 产品的后台策略；公网和服务器证据未显示其阻断正常请求。
- 百度搜索资源平台内部抓取诊断的错误码、抓取 IP 和备案数据同步状态，需要在百度后台查看。
- 修复后下一次真实百度蜘蛛来访时间；修复后的模拟 Baiduspider 检查已经通过，但模拟 UA 不能替代真实来源 IP。

## 服务器与安全审计

- 操作系统：OpenCloudOS，Linux 6.6.119。
- 实际 Nginx：`/usr/sbin/nginx`，版本 1.26.3。
- 实际 vhost：`/etc/nginx/conf.d/huixiang.conf`。
- 已加载 include：`/etc/letsencrypt/options-ssl-nginx.conf`；完整 `nginx -T` 未显示其他站点级 include。
- 正式站点目录：`/www/wwwroot/huixiang`。
- 源码目录：`/www/wwwroot/huixiangwangzhan`。
- firewalld：active，80/443 开放。
- iptables/nftables：存在云防护维护的拒绝列表；未发现已验证百度 IP 命中。
- IPSet：`YJ-GLOBAL-INBLOCK` 审计时有 11,233 条记录；未无条件放行自报 Baiduspider UA，也未删除安全规则。
- Fail2ban：未安装，inactive。
- Baiduspider error log：0 条。

## 真实 Baiduspider 日志

日志范围：`/var/log/nginx/huixiang_access.log*`。所有包含 Baiduspider UA 的记录共 45 条，其中 28 条通过 DNS 双向验证为百度来源，其余 17 条没有百度 PTR，不能当作真实百度蜘蛛。

已验证请求汇总：

- 总请求：28。
- HTTP 200：27。
- HTTP 301：1。
- 总发送字节：12,040,919。
- 首次：2026-07-18 23:41:51，`116.179.32.145` 请求 `/`，200，38,732 字节。
- 最后：2026-07-20 20:15:11，`220.181.108.166` 请求 `/`，200，38,956 字节。
- 请求内容：首页 6 次，并抓取 `/about/`、CSS、Logo、车辆图和门店实景图。
- 已验证来源 PTR 示例：`baiduspider-116-179-32-145.crawl.baidu.com`、`baiduspider-220-181-108-166.crawl.baidu.com`，正向解析均回到原 IP。

## 备份与变更安全

变更前已经创建并核验：

- vhost 备份：`/root/huixiang-crawl-audit/huixiang.conf.before.20260723_114417`
- 修复前完整配置快照：`/root/huixiang-crawl-audit/nginx-full.before.20260723_114417.txt`
- 正式站点备份：`/www/backup/huixiang_20260723_114417`，约 16 MB
- 修复后完整配置快照：`/root/huixiang-crawl-audit/nginx-full.after.20260723_114417.txt`

备份保留在服务器，没有加入 GitHub。没有读取、输出或提交 SSH 私钥、SSL 私钥内容、密码或 Token。

## 30 项最终审计结果

1. **当前 GitHub commit**：`ae0f2f1ec114ce40073ab4f34ef93ec738b611b9`。
2. **服务器源码 commit**：同为 `ae0f2f1ec114ce40073ab4f34ef93ec738b611b9`，`main` 与 `origin/main` 一致；服务器已有一个未提交的 `package-lock.json` 修改，本次未覆盖。
3. **正式构建版本**：服务器 `dist` 与正式目录的首页、robots、sitemap 哈希一致。
4. **Astro 静态构建**：是，`output: "static"`。
5. **dist 首页静态正文**：有，非空壳。
6. **robots 源码**：唯一来源 `src/pages/robots.txt.ts`。
7. **robots 线上内容**：200、`text/plain`，允许抓取并引用正式 sitemap。
8. **meta robots**：正式页面 index/follow；仅 404 页面 noindex。
9. **X-Robots-Tag**：线上正式页面未发现 noindex。
10. **sitemap URL 数量**：19。
11. **sitemap 页面状态**：19/19 为正式非 www HTTPS URL，均返回 200。
12. **UA 抓取矩阵**：修复前后各 132 条；修复后无请求错误，未知路径全部 404。
13. **浏览器与 Baiduspider 哈希**：完全一致。
14. **IPv4**：A 记录 `124.223.165.156`，访问正常。
15. **IPv6**：没有 AAAA，不存在错误 IPv6 旧站分流。
16. **DNS**：根域名和 www 均解析到 `124.223.165.156`。
17. **TLS**：TLS 1.3，证书验证成功并覆盖根域名及 www。
18. **Nginx 实际 vhost**：`/etc/nginx/conf.d/huixiang.conf`。
19. **UA 过滤**：未发现。
20. **WAF 阻拦**：未发现 Nginx/宝塔 WAF；firewalld 与 IPSet 未阻断已验证百度 IP。
21. **真实百度日志**：28 条已验证请求，27 个 200、1 个正常 301、0 个错误日志。
22. **www 跳转**：已修复，HTTP/HTTPS www 均 301 到非 www 相同 URI。
23. **软 404**：已修复，未知普通路径和新闻路径均返回 404。
24. **修改内容**：只修改服务器实际 Nginx vhost；新增本地审计报告和测试日志。
25. **未修改内容**：文章、图片、正文、Astro 源码、验证文件、备案信息、防火墙规则、DNS 和 Git 历史均未修改。
26. **`npm run audit:seo`**：初审通过，20 个 HTML 页面、19 个 sitemap URL。
27. **`npm run check:production`**：修复前 2 项失败；修复后全项通过。
28. **`nginx -t`**：实际 `/usr/sbin/nginx -t` 在替换后和最终复核时均通过。
29. **部署状态**：Nginx 配置修复已生效并重载；没有重新部署或改写站点内容，因为正式文件哈希已与构建一致。
30. **百度后台人工步骤**：执行抓取诊断、查看抓取异常/频次/Robots，并单独提交备案号反馈材料。

## 修复前后对比

| 项目 | 修复前 | 修复后 |
| --- | --- | --- |
| HTTPS www | 200，保留 www | 301 到非 www 相同 URI |
| HTTP www | 301 到 HTTPS www | 301 到非 www HTTPS 相同 URI |
| HTTP 根域名 | 301 到 HTTPS 根域名 | 保持正确 301 |
| 随机未知路径 | 首页正文，HTTP 200 | 自定义 404 正文，HTTP 404 |
| 不存在新闻路径 | 首页正文，HTTP 200 | 自定义 404 正文，HTTP 404 |
| 正式 Astro 页面 | 200 | 保持 200 |
| 首页多 UA HTML | 相同完整正文 | 保持相同完整正文 |
| robots/sitemap | 200 | 保持 200 |
| ByteDance/Bing/IndexNow | 200 | 保持 200 |
| 门店图片 | 200 | 保持 200 |
| `check:production` | 2 FAIL | 全部 PASS |

## 最终验证

- `/`、`/about/`、`/trucks/`、`/services/`、`/news/`、真实新闻详情、`/contact/`、`/faq/`：全部 200。
- `ByteDanceVerify.html`：200，`text/html`。
- `BingSiteAuth.xml`：200，`text/xml`。
- IndexNow key 文件：200，`text/plain`。
- `robots.txt`：200，`text/plain`。
- `sitemap.xml`：200，`text/xml`。
- 门店 WebP：200，`image/webp`。
- 未知普通路径和未知新闻路径：404，`text/html`。
- `/usr/sbin/nginx -t`：successful。
- Nginx 服务：active。

## 下一步人工操作

1. 在百度搜索资源平台“数据统计 -> 抓取诊断”诊断首页、`/about/`、`/trucks/`、`/news/`、一篇真实新闻和 `/contact/`。
2. 查看抓取异常、抓取频次和 Robots；若仍报错，保存平台错误原因与抓取 IP，再与 `/var/log/nginx/huixiang_access.log` 同时段记录核对。
3. 备案号问题使用 `reports/baidu-filing-feedback.txt` 和工信部查询截图单独反馈。
4. 观察下一轮真实百度蜘蛛日志；不要仅凭自报 UA 建立白名单。

## 证据文件

- `reports/static-html-audit.csv`
- `reports/live-crawl-matrix.csv`
- `reports/live-crawl-matrix-after-fix.csv`
- `reports/dns-resolver-matrix.csv`
- `reports/baidu-filing-feedback.txt`
- `reports/http-ai-compatibility-before.csv`
- `reports/http-ai-compatibility-after-stage1.csv`
- `reports/http-ai-compatibility-report.md`

原始 HTTP 响应副本和命令日志仅用于本地临时核验，按仓库日志与临时文件规则不提交 GitHub；关键结果已经归纳到上述报告和矩阵中。
