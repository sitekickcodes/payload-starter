import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Returns all page routes from collections that have a `slug` field.
 *
 * Convention: set `custom.basePath` on a collection to control the URL prefix.
 * e.g. `custom: { basePath: "/blog" }` on a "posts" collection → `/blog/my-post`
 * Default: `/{collection-slug}/{doc-slug}`
 */
export async function GET() {
  const payload = await getPayload({ config });
  const routes: string[] = [];

  // System collections that don't generate frontend pages
  const systemSlugs = new Set([
    "users",
    "media",
    "form-submissions",
    "redirects",
    "payload-preferences",
    "payload-migrations",
    "payload-locked-documents",
    "payload-jobs",
    "import-export-files",
  ]);

  for (const collection of payload.config.collections) {
    if (systemSlugs.has(collection.slug)) continue;

    // Only include collections that have a `slug` field (convention for page routes)
    const hasSlugField = collection.fields.some(
      (f) => "name" in f && f.name === "slug",
    );
    if (!hasSlugField) continue;

    const basePath =
      (collection.custom?.basePath as string) || `/${collection.slug}`;

    const { docs } = await payload.find({
      collection: collection.slug as never,
      limit: 0,
      select: { slug: true },
      pagination: false,
    });

    for (const doc of docs) {
      const slug = (doc as Record<string, unknown>).slug;
      if (typeof slug === "string" && slug) {
        routes.push(`${basePath}/${slug}`);
      }
    }
  }

  return Response.json(routes);
}
