import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";

export async function GET(context: APIContext) {
  const wikiCollection = await getCollection("docs");

  return rss({
    // `<title>` field in output xml
    title: "Telmo Baptista’s Wiki",
    // `<description>` field in output xml
    description:
      "A place for my guides, how-tos, configurations and other useful stuff for my (future) self.",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: context.site!,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: wikiCollection.map(
      (entry) =>
        ({
          title: entry.data.title,
          pubDate: entry.data.lastUpdated ?? new Date(),
          link: `/wiki/${entry.id}`,
        }) as RSSFeedItem,
    ),
  });
}
