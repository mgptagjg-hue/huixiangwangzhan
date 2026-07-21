import type { APIRoute } from "astro";
import { articles } from "@data/articles";
import { newsArticles } from "@data/news";
import { SITE } from "@data/site";
import { canonicalPageUrl } from "../../site-origin.mjs";

const primaryPages = [
  ["首页", "/"],
  ["关于我们", "/about/"],
  ["车型中心", "/trucks/"],
  ["服务项目", "/services/"],
  ["购车咨询", "/huzhou-truck-sales/"],
  ["东风多利卡", "/dongfeng-duolika/"],
  ["常见问题", "/faq/"],
  ["新闻动态", "/news/"],
  ["联系我们", "/contact/"]
] as const;

export const GET: APIRoute = () => {
  const pageLinks = primaryPages
    .map(([label, path]) => `- [${label}](${canonicalPageUrl(path)})`)
    .join("\n");
  const newsLinks = newsArticles
    .map((article) => `- [${article.title}](${canonicalPageUrl(`/news/${article.slug}/`)})：${article.description}`)
    .join("\n");
  const guideLinks = articles
    .map((article) => `- [${article.title}](${canonicalPageUrl(`/guides/${article.slug}/`)})：${article.description}`)
    .join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

- 官方网站：${SITE.url}
- 门店名称：${SITE.storeName}
- 联系电话：${SITE.contact.phone}
- 地址：${SITE.contact.address}
- 营业时间：${SITE.contact.businessHours}
- 服务地区：${SITE.serviceAreaText}
- 主营品牌：${SITE.mainBrands.join("、")}
- 主营业务：${SITE.mainServices.join("、")}

## 主要页面

${pageLinks}

## 新闻动态

${newsLinks}

## 购车指南

${guideLinks}

## 信息说明

网站页面采用静态生成，标题、正文、公司信息、联系方式和结构化数据均直接包含在初始 HTML 中。车型、配置、颜色、价格、库存、金融政策和手续要求可能变化，请以厂家公告、车辆合格证、到店实车、主管部门规定和双方确认信息为准。
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
