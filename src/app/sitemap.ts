import type { MetadataRoute } from "next";
import { getSiteRoutes } from "@/lib/getSiteRoutes";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Auto-discover all static page routes from the filesystem
  const staticEntries: MetadataRoute.Sitemap = getSiteRoutes()
    .filter((route) => !route.includes("[")) // Exclude dynamic segments
    .map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency:
        route === "/"
          ? ("weekly" as const)
          : ("monthly" as const),
      priority: route === "/" ? 1 : 0.7,
    }));

  return staticEntries;
}
