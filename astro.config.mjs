// @ts-check
import { defineConfig } from "astro/config";

import starlight from "@astrojs/starlight";
import starlightAutoSidebar from "starlight-auto-sidebar";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://telmooo.github.io",
  base: "/miyazono",
  output: "static",
  experimental: {
    csp: {
      algorithm: "SHA-512",
    },
  },
  integrations: [
    starlight({
      plugins: [starlightAutoSidebar()],
      title: {
        en: "Wiki | Telmo Baptista",
        ja: "知識の宝庫 | Telmo Baptista",
      },
      description: "Wiki, System Setups, and Guides",
      disable404Route: true,
      logo: {
        src: "./src/assets/logo.webp",
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      editLink: {
        baseUrl: "https://github.com/Telmooo/miyazono/edit/main/",
      },
      sidebar: [
        // Back to homepage
        { label: "Home", link: "/" },
        // Wiki entrypoint
        { label: "Wiki Introduction", link: "/wiki/" },
        {
          label: "Awesome",
          autogenerate: { directory: "wiki/awesome" },
        },
        { label: "Linux", autogenerate: { directory: "wiki/linux" } },
        { label: "Homelab", autogenerate: { directory: "wiki/homelab" } },
      ],
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/Telmooo" },
      ],
      favicon: "/logo.png",
    }),
  ],
  srcDir: "./src",
  publicDir: "./public",
  outDir: "./dist",

  vite: {
    plugins: [tailwindcss()],
  },
});
