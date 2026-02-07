import { describe, test, expect, vi, afterEach } from "vitest";
import { mapWikiEntriesToRssItems, type WikiEntry } from "../../src/utils/rss";

describe("mapWikiEntriesToRssItems", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("maps wiki entries to RSS items with correct titles", () => {
    const entries: WikiEntry[] = [
      { id: "linux/setup", data: { title: "Linux Setup Guide" } },
      { id: "homelab/overview", data: { title: "Homelab Overview" } },
    ];

    const items = mapWikiEntriesToRssItems(entries);

    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Linux Setup Guide");
    expect(items[1].title).toBe("Homelab Overview");
  });

  test("generates correct wiki links from entry IDs", () => {
    const entries: WikiEntry[] = [
      { id: "linux/setup", data: { title: "Setup" } },
    ];

    const items = mapWikiEntriesToRssItems(entries);

    expect(items[0].link).toBe("/wiki/linux/setup");
  });

  test("uses lastUpdated date when available", () => {
    const lastUpdated = new Date("2024-12-25T00:00:00Z");
    const entries: WikiEntry[] = [
      { id: "test", data: { title: "Test", lastUpdated } },
    ];

    const items = mapWikiEntriesToRssItems(entries);

    expect(items[0].pubDate).toEqual(lastUpdated);
  });

  test("falls back to current date when lastUpdated is not set", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

    const entries: WikiEntry[] = [{ id: "test", data: { title: "Test" } }];

    const items = mapWikiEntriesToRssItems(entries);

    expect(items[0].pubDate).toEqual(new Date("2025-01-15T12:00:00Z"));
  });

  test("handles empty collection", () => {
    const items = mapWikiEntriesToRssItems([]);
    expect(items).toEqual([]);
  });
});
