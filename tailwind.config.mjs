/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#162131",
        navy: "#0b2341",
        steel: "#516173",
        line: "#d9e0e8",
        mist: "#f4f7fa",
        paper: "#ffffff",
        accent: "#c83224",
        amber: "#f47b20"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Microsoft YaHei",
          "PingFang SC",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(11, 35, 65, 0.12)"
      }
    }
  },
  plugins: []
};
