import type { APIRoute } from "astro";
import { SITE } from "@data/site";

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: ${new URL("/sitemap.xml", SITE.url).toString()}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
};
