import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { autoSidebarLoader } from "starlight-auto-sidebar/loader";
import { autoSidebarSchema } from "starlight-auto-sidebar/schema";
import { file } from "astro/loaders";
import { gameSchema, gameSectionSchema } from "./schemas/games";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  autoSidebar: defineCollection({
    loader: autoSidebarLoader(),
    schema: autoSidebarSchema(),
  }),
  games: defineCollection({
    loader: file("src/content/games/games.json"),
    schema: gameSchema(),
  }),
  gameSections: defineCollection({
    loader: file("src/content/games/sections.json"),
    schema: gameSectionSchema(),
  }),
};
