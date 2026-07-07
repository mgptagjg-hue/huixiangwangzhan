import type { APIRoute } from "astro";
import { articles } from "@data/articles";
import { newsArticles } from "@data/news";
import { MAIN_ROUTES, SITE } from "@data/site";

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
  lastmod: article.date
}));

const allRoutes = [
  ...MAIN_ROUTES.map((route) => ({ ...route, lastmod: SITE.updatedAt })),
  ...articleRoutes,
  ...newsRoutes
];

export const GET: APIRoute = () => {
  const urls = allRoutes
    .map((route) => {
      const loc = new URL(route.path, SITE.url).toString();
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
