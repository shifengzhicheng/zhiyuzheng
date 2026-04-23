import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { site } from "../data/site";

export async function GET(context: APIContext) {
  const notes = (await getCollection("notes"))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      pubDate: note.data.date,
      link: `/notes/${note.slug}/`
    }));

  return rss({
    title: `${site.preferredDisplayName} Notes`,
    description: "Notes on OpenROAD, reproducible CAD flows, physical-design experiments, and tooling.",
    site: context.site ?? site.url,
    items: notes
  });
}
