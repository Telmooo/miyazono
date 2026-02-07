import type { RSSFeedItem } from "@astrojs/rss";

export interface WikiEntry {
  id: string;
  data: {
    title: string;
    lastUpdated?: Date;
  };
}

export function mapWikiEntriesToRssItems(entries: WikiEntry[]): RSSFeedItem[] {
  return entries.map((entry) => ({
    title: entry.data.title,
    pubDate: entry.data.lastUpdated ?? new Date(),
    link: `/wiki/${entry.id}`,
  }));
}
