import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { autoSidebarLoader } from "starlight-auto-sidebar/loader";
import { autoSidebarSchema } from "starlight-auto-sidebar/schema";
import { file } from "astro/loaders";
import { gameSchema, gameSectionSchema } from "./schemas/games";
import { projectSchema, skillSchema } from "./schemas/portfolio";

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
  projects: defineCollection({
    loader: file("src/content/portfolio/projects.json"),
    schema: projectSchema(),
  }),
  skills: defineCollection({
    loader: file("src/content/portfolio/skills.json"),
    schema: skillSchema(),
  }),
};
