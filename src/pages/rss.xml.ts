import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { mapWikiEntriesToRssItems, type WikiEntry } from "../utils/rss";

export async function GET(context: APIContext) {
  const wikiCollection = await getCollection("docs");

  return rss({
    title: "Telmo Baptista's Wiki",
    description:
      "A place for my guides, how-tos, configurations and other useful stuff for my (future) self.",
    site: context.site!,
    items: mapWikiEntriesToRssItems(wikiCollection as WikiEntry[]),
  });
}
