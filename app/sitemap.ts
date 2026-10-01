import type { MetadataRoute } from "next";
import { getClosedListings, getListings } from "@/lib/properties/feed";
import { site } from "@/lib/site";

/** Každá stránka musí být v sitemapě i dosažitelná odkazem. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, closed] = await Promise.all([
    getListings(),
    getClosedListings(),
  ]);

  const staticPages = [
    { path: "", priority: 1 },
    { path: "/nemovitosti", priority: 0.9 },
    { path: "/odhad-zdarma", priority: 0.8 },
    { path: "/o-mne", priority: 0.7 },
    { path: "/reference", priority: 0.7 },
    { path: "/kontakt", priority: 0.6 },
    { path: "/ochrana-osobnich-udaju", priority: 0.2 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified: new Date(),
      priority: page.priority,
    })),
    ...listings.map((l) => ({
      url: `${site.url}/nemovitosti/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      priority: 0.9,
    })),
    ...closed.map((l) => ({
      url: `${site.url}/nemovitosti/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      priority: 0.3,
    })),
  ];
}
