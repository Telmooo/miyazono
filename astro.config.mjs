// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [starlight({
        title: {
            en: "Wiki | Telmo Baptista",
            ja: "知識の宝庫 | Telmo Baptista"
        },
        description: "Wiki, System Setups, and Guides",
        logo: {
            src: "./src/assets/logo.png"
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
            { label: "Wiki Introduction", link: "/wiki" },
            { label: "Linux", autogenerate: { directory: "wiki/linux" } }
        ],
        social: [
            { icon: "github", label: "GitHub", href: "https://github.com/Telmooo" }
        ],
        favicon: "/logo.png",
    })]
});