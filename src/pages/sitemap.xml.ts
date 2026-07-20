import type { APIRoute } from "astro";
import { articles } from "@data/articles";
import { newsArticles } from "@data/news";
import { MAIN_ROUTES } from "@data/site";
import { canonicalPageUrl } from "../../site-origin.mjs";

const articleRoutes = articles.map((article) => ({
  path: `/guides/${article.slug}`,
  priority: "0.7",
  changefreq: "monthly",
  lastmod: article.updatedAt
}));

const newsRoutes = newsArticles.map((article) => ({
  path: `/news/${article.slug}`,
  priority: "0.8",
  changefreq: "monthly",
  lastmod: article.updatedAt
}));

const allRoutes = [
  ...MAIN_ROUTES,
  ...articleRoutes,
  ...newsRoutes
];

export const GET: APIRoute = () => {
  const urls = allRoutes
    .map((route) => {
      const loc = canonicalPageUrl(route.path);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
