import type { Metadata } from "next";
import { cms } from "@/lib/cms";

/**
 * Generate metadata for a static page, pulling overrides from the CMS.
 * Falls back to the provided defaults if no CMS entry exists.
 */
export async function pageMetadata(
  path: string,
  defaults: { title: string; description: string },
): Promise<Metadata> {
  const page = await cms.getPage(path);
  return {
    title: page?.metaTitle || defaults.title,
    description: page?.metaDescription || defaults.description,
    ...(page?.ogImage && {
      openGraph: { images: [{ url: page.ogImage.url }] },
    }),
  };
}
