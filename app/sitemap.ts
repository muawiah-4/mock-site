import type { MetadataRoute } from "next";
import { CATALOG, COLLECTIONS } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: Entry[] = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/collection"), lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];

  const collectionPages: Entry[] = COLLECTIONS.map(
    (c): Entry => ({
      url: absoluteUrl(`/collection/${c.id}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const watchPages: Entry[] = CATALOG.map(
    (v): Entry => ({
      url: absoluteUrl(`/watch/${v.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [...staticPages, ...collectionPages, ...watchPages];
}
