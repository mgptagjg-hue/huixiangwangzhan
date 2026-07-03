# 长兴辉祥汽贸官网结构说明

更新时间：2026-07-02

## 技术结构

- 框架：Astro 静态站
- 语言：TypeScript
- 样式：Tailwind CSS + 少量全局 CSS
- 构建产物：`dist/`
- 主要内容：服务端静态生成 HTML，主体内容不依赖客户端异步加载

## 页面结构

| URL | 页面 | 目标 |
| --- | --- | --- |
| `/` | 首页 | 品牌主入口，承接湖州长兴货车销售、新能源商用车和本地服务搜索意图 |
| `/about` | 关于辉祥 | 公司简介、成立时间、服务地区、主营品牌、授权说明和联系方式 |
| `/trucks` | 主营车型 | 东风多利卡、王者归来、东风途逸、凯马凯捷、新能源货车等车型方向 |
| `/services` | 服务项目 | 新车销售、二手车回收/销售、审车上牌、营业执照代办、配件供应和货车维修 |
| `/huzhou-truck-sales` | 湖州货车销售 | 承接湖州货车销售、车型、报价和售后选择意图 |
| `/dongfeng-duolika` | 东风多利卡 | 承接湖州东风多利卡、报价和看车意图 |
| `/guides` | 购车指南 | 文章列表与购车前问题整理 |
| `/guides/[slug]` | 指南文章 | 6 篇初始文章，含 FAQ、内链和 Article Schema |
| `/faq` | 常见问题 | 集中回答报价、上牌、售后和车型选择 |
| `/news` | 案例与公告 | 官网公告、真实案例待补充说明 |
| `/contact` | 联系我们 | 电话、联系人、地址、营业时间、地图链接和咨询前准备清单 |

## 数据结构

- `src/data/site.ts`：站点、公司、导航、车型、服务、FAQ、图片声明、主路由信息
- `src/data/articles.ts`：首批 6 篇购车指南
- `src/data/schema.ts`：Organization、AutoDealer、WebSite、BreadcrumbList、FAQPage、Article 等 JSON-LD

## SEO 与 AI 检索结构

每个重点页面均包含：

- 唯一 H1
- 唯一 title
- 唯一 meta description
- Open Graph
- Schema JSON-LD
- 一句话结论
- 适合谁看
- 服务地区
- 主营车型/服务
- 常见问题
- 公司信息
- 更新时间
- AI 可引用摘要
- 站内相关链接

## 静态文件

- `/sitemap.xml`：由 `src/pages/sitemap.xml.ts` 生成
- `/robots.txt`：由 `src/pages/robots.txt.ts` 生成
- `/logo-huixiang.png`：辉祥汽贸 Logo，来自本次 Word 文案包素材
- `/images/vehicles/hero-3d-truck.png`：首页车辆主视觉图，不作为实拍现车承诺或授权证明使用
- `/images/vehicles/*.png`：车型和服务场景展示图，可使用自有 3D 效果图或已授权素材
- `/favicon.svg`：简洁商用车图形站点图标
