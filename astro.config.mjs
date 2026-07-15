import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { SITE_ORIGIN } from "./site-origin.mjs";

export default defineConfig({
  output: "static",
  devToolbar: {
    enabled: false
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ],
  site: SITE_ORIGIN
});
