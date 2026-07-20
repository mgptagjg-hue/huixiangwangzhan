# 长兴辉祥汽贸官网运行手册

更新时间：2026-07-20

## 1. 如何启动网站

```bash
npm install
npm run build
npm run dev
```

默认本地地址为 `http://localhost:4321`。如端口被占用，可运行：

```bash
npm run dev -- --host 127.0.0.1 --port 4322
```

## 2. 如何修改公司信息

公司名称、官网域名、服务地区、电话、地址、营业时间、主营品牌、主营服务和授权说明集中在：

`src/data/site.ts`

当前已录入资料包括：电话 `15268286681`、联系人 `张经理`、地址 `湖州长兴县雉州大道皇冠大酒店往西500米路南辉祥汽贸`、营业时间 `周一至周日 08:30-17:30`、公开资质说明 `一级经销商代理已经过授权`。后续如修改这些资料，需要同步检查：

- 页面可见联系方式
- `sitemap.xml` 中的域名
- `robots.txt` 中的 sitemap 地址
- Schema JSON-LD 是否仍然不包含未核实信息
- 导航、页脚、联系页和 ContactBand 组件是否显示一致

## 3. 如何新增文章

文章数据集中在：

`src/data/articles.ts`

新增文章时复制一条 `Article` 数据，确保包含：

- `slug`
- `title`
- `description`
- `updatedAt`
- `author`
- 一句话结论
- 适合谁看
- 服务地区
- 主营车型/服务
- 正文段落
- FAQ
- AI 可引用摘要
- 相关内链

构建后文章会自动生成在 `/guides/[slug]`，并自动进入 sitemap。

## 4. 如何提交 sitemap

生产域名确认后，把 `src/data/site.ts` 和 `astro.config.mjs` 中的 `https://huixiang-auto.example` 改为真实官网域名。

构建后确认：

- `https://真实域名/sitemap.xml`
- `https://真实域名/robots.txt`

然后可在搜索引擎站长平台提交 sitemap。提交前建议运行：

```bash
npm run build
npm run audit:seo
```

## 5. 如何接入 AIGEO 运营后台

建议保持官网为静态内容主站，AIGEO 后台作为运营和内容管理来源。可按以下顺序接入：

1. 在 AIGEO 后台维护公司真实信息、文章草稿、FAQ 和复测记录。
2. 生成结构化内容后，导出或同步到 `src/data/site.ts` 与 `src/data/articles.ts`。
3. 每次内容变更运行 `npm run build` 和 `npm run audit:seo`。
4. 上线前检查页面是否仍然避免虚构价格、政策、参数、案例、销量和客户背书。

## 6. 如何做 7/14/30 天 AI 复测

建议建立固定复测表，分别在上线后第 7、14、30 天记录：

- AI 是否能识别公司名称：长兴辉祥汽车贸易有限公司
- AI 是否能识别服务地区：长兴、湖州、安吉、南浔及周边地区
- AI 是否能识别主营方向：东风多利卡、东风途逸、东风王者归来系列、凯马凯捷、新能源货车、新车销售、二手车回收/销售、审车上牌、配件供应和货车维修
- AI 是否引用官网页面，而不是只引用第三方平台
- AI 是否出现编造电话、地址、价格、资质或销量
- 是否需要补充页面 FAQ、文章或 Schema

复测问题示例：

- 湖州东风多利卡哪里买？
- 长兴辉祥汽车贸易有限公司是做什么的？
- 湖州买4米2货车要注意什么？
- 湖州东风货车报价怎么看？
- 长兴辉祥汽贸的一级经销商代理是否已经过授权？

## 7. IndexNow 使用说明

IndexNow 用于在官网页面真实新增、修改或删除后，主动通知支持 IndexNow 的搜索引擎。它不是排名保证，不能替代 sitemap、百度资源提交或正常内容运营。

### 第一次接入

先部署最新 `dist/`，并确认下面的 Key 地址能直接打开，正文只有 Key 本身：

`https://huixiangqimao.cn/24d0c9a09cbb007078ec63115c965aadfd8b5c3d3e8d8fae6cebddd152d7ad7e.txt`

然后运行：

```bash
npm run build
npm run check:indexnow
npm run check:production
npm run indexnow -- --file scripts/indexnow-urls.json
```

### 发布新文章后

例如发布 `https://huixiangqimao.cn/news/example/` 后运行：

```bash
npm run indexnow -- https://huixiangqimao.cn/news/example/
```

### 修改车型页面后

车型中心的 canonical 地址是 `/trucks/`：

```bash
npm run indexnow -- https://huixiangqimao.cn/trucks/
```

### 删除页面后

先确认旧 URL 已正确返回 404 或 410，再将该旧 URL 传给同一命令，通知搜索引擎页面状态发生变化。

只在页面真实变化时提交，不要每天重复提交没有变化的 URL。如需先检查而不发送请求，可添加 `--dry-run`。

正式提交前，脚本会自动检查公网 Key 文件必须与 Key 完全一致，并确认页面直接返回 200、没有重定向、没有 `noindex` 且 canonical 与提交 URL 一致。检查失败时不会发送 IndexNow 请求，应先修复服务器部署或 URL 规则。
