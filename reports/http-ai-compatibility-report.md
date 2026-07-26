# 辉祥汽贸裸域名 AI 读取兼容层报告

执行日期：2026-07-26

HTTPS 规范域名：https://huixiangqimao.cn

## 最终结论

已完成低风险第一、二阶段兼容层，没有部署 HTTP 根首页 200 镜像，也没有根据 User-Agent 返回不同内容。

普通 HTTP 页面仍然返回永久 301，并保留相同路径和查询参数。与原来的 Nginx 默认 169 字节跳转页相比，现在 HTTP 非 www 的 301 响应提供 646 字节 UTF-8 HTML 说明，包含长兴辉祥汽车贸易有限公司、辉祥汽贸、15268286681、浙江省湖州市长兴县、完整门店地址和 HTTPS 官网链接。

HTTP 非 www 下的 robots、sitemap、llms、ByteDance、Bing 和 IndexNow 验证文件直接返回 200。HTTP www 不提供第二套发现文件，仍统一 301 到非 www HTTPS。

## 服务器检查

- 实际 Nginx：`/usr/sbin/nginx` 1.26.3。
- 实际 vhost：`/etc/nginx/conf.d/huixiang.conf`。
- 已加载 include：`/etc/letsencrypt/options-ssl-nginx.conf`。
- 正式站点目录：`/www/wwwroot/huixiang`。
- 正式发现文件均存在：robots、sitemap、llms、ByteDance、Bing、IndexNow key。
- 修改前 HTTP 根路径：301、`text/html`、169 字节、Nginx 默认正文，不含公司名称。
- 修改前路径查询参数已正确保留在 Location 中。

## 隔离验证

生产修改前，在 `127.0.0.1:18080` 启动了使用独立 pid、日志和配置的临时 Nginx 实例。测试方案使用内部错误页把 418 转换为 301，并由精确 internal location 提供静态说明正文和动态 Location。

隔离测试结果：

- HTTP 状态：301。
- Location：根路径与 `/news/?source=ai` 均保留原路径和查询参数。
- Content-Type：`text/html; charset=utf-8`。
- 正文：包含公司名称、电话、地址和 HTTPS 链接。
- 临时 Nginx 在测试后停止。

## 备份

- vhost：`/root/huixiang-http-ai-compat-audit/huixiang.conf.before.20260726_101529`
- 修改前完整配置：`/root/huixiang-http-ai-compat-audit/nginx-full.before.20260726_101529.txt`
- 正式站点：`/www/backup/huixiang_http_ai_compat_20260726_101529`，约 16 MB
- 修改后完整配置：`/root/huixiang-http-ai-compat-audit/nginx-full.after.20260726_101529.txt`

备份仅保存在服务器，没有提交 GitHub。

## 第一阶段结果

`curl -i http://huixiangqimao.cn/` 的关键结果：

```text
HTTP/1.1 301 Moved Permanently
Content-Type: text/html; charset=utf-8
Content-Length: 646
Location: https://huixiangqimao.cn/
```

正文包含：

- 长兴辉祥汽车贸易有限公司
- 辉祥汽贸
- 15268286681
- 浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸
- https://huixiangqimao.cn/

`http://huixiangqimao.cn/news/?source=ai` 返回：

```text
HTTP/1.1 301 Moved Permanently
Location: https://huixiangqimao.cn/news/?source=ai
```

正文明确说明这只是 HTTPS 地址提示，不是独立 HTTP 版官网；不含价格、库存、营销承诺、表单、Cookie 或脚本跳转。

## 第二阶段结果

HTTP 非 www 直接读取结果：

| URL | 状态 | Content-Type | 字节 |
| --- | ---: | --- | ---: |
| `/robots.txt` | 200 | `text/plain` | 175 |
| `/sitemap.xml` | 200 | `text/xml` | 3551 |
| `/llms.txt` | 200 | `text/plain` | 4341 |
| `/ByteDanceVerify.html` | 200 | `text/html` | 20 |
| `/BingSiteAuth.xml` | 200 | `text/xml` | 85 |
| IndexNow key 文件 | 200 | `text/plain` | 64 |

robots、sitemap 和 llms 中的正式链接全部使用 `https://huixiangqimao.cn`，没有加入 HTTP URL 或 `www` URL。

HTTP www 对这些路径不直接返回文件，例如 `http://www.huixiangqimao.cn/robots.txt?x=1` 返回 301，Location 为 `https://huixiangqimao.cn/robots.txt?x=1`。

## UA 测试矩阵

测试 UA：普通 curl、Bytespider、ToutiaoSpider、Baiduspider。每类 UA 测试根路径和带查询参数的新闻路径，并分别记录不跟随与跟随跳转结果。

修改前：

- 16 行，0 错误。
- 初始状态全部 301。
- 正文全部 169 字节。
- 正文均不含公司名称。
- 跟随后全部到 HTTPS 200，HTTPS 正文完整。

修改后：

- 16 行，0 错误。
- 初始状态全部 301。
- Content-Type 全部为 `text/html; charset=utf-8`。
- 正文全部 646 字节并包含公司名称。
- Location 仅为对应的 HTTPS 根路径或保留查询参数的新闻路径。
- 跟随后全部到 HTTPS 200，HTTPS 正文包含公司名称。

证据：

- `reports/http-ai-compatibility-before.csv`
- `reports/http-ai-compatibility-after-stage1.csv`

## HTTPS 与路由回归

- 正式 HTTPS 页面保持 200，正文未修改。
- canonical、内部链接、结构化数据和 sitemap 仍使用 HTTPS 非 www。
- HTTPS www 仍 301 到非 www 相同路径和查询参数。
- HTTP www 最终到非 www HTTPS。
- HTTPS 未知路径返回真正 404。
- HTTPS 不存在新闻路径返回真正 404。
- `/trucks/` 是正式车型页面并保持 200。
- `/vehicles/` 不是正式页面并返回 404。
- ByteDance、Bing、IndexNow 验证保持正常。

## 检查结果

- 实际 `/usr/sbin/nginx -t`：通过。
- Nginx 重载：仅在语法检查通过后执行。
- Nginx 服务：active。
- `npm run check:production`：最终全项通过。
- 第一次生产检查的 www 请求曾出现一次瞬时 `fetch failed`；随后的 HTTP/HTTPS www 直接检查正常，重跑完整检查后全部通过。

## 未修改内容

- 没有修改文章、图片或页面正文。
- 没有修改 Astro 源码和 HTTPS 正式页面文件。
- 没有修改 canonical、sitemap URL、内部链接或 JSON-LD。
- 没有按 UA 返回不同正文。
- 没有部署 HTTP 根首页 200。
- 没有读取、输出或提交 SSH 私钥、SSL 私钥内容、密码或 Token。

## 备选 HTTP 根首页 200 方案（未部署）

只有在多 AI 平台人工验证确认“301 + 自定义正文”仍无效后，才考虑以下方案。该方案仅让 HTTP 非 www 的精确根路径 `/` 返回 200，其他普通 HTTP 路径仍使用现有 301；HTTP www 仍 301；HTTPS 不受影响。

配置草案：

```nginx
# 仅供评估，当前未部署。
location = / {
    alias /etc/nginx/huixiang-http-root-compat.html;
    types { }
    default_type "text/html; charset=utf-8";
    add_header Refresh "0; url=https://huixiangqimao.cn/" always;
}

location / {
    return 418;
}
```

备选 HTML 草案：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>长兴辉祥汽车贸易有限公司</title>
    <link rel="canonical" href="https://huixiangqimao.cn/" />
    <meta http-equiv="refresh" content="0; url=https://huixiangqimao.cn/" />
  </head>
  <body>
    <h1>长兴辉祥汽车贸易有限公司</h1>
    <p>门店名称：辉祥汽贸</p>
    <p>联系电话：15268286681</p>
    <p>地址：浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸</p>
    <p><a href="https://huixiangqimao.cn/">访问 HTTPS 正式官网</a></p>
  </body>
</html>
```

该草案不使用 JavaScript，不含表单、登录、支付或 Cookie，也不按 UA 分流。当前明确未安装、未测试、未部署。

## 当前状态

第一阶段部署后已停止进一步升级。现在等待人工使用豆包、元宝、千问、Kimi 和其他 AI 读取工具测试裸域名。除非明确确认第一阶段仍不能解决问题，不应部署 HTTP 根首页 200 兼容页。
