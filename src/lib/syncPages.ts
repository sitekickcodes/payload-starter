import type { Payload } from "payload";
import { getSiteRoutes } from "./getSiteRoutes.ts";

/**
 * Syncs the Pages collection with the filesystem routes.
 * - Creates new page docs for routes that don't exist yet
 * - Removes page docs for routes that no longer exist
 * Runs on server init.
 */
export async function syncPages(payload: Payload) {
  const routes = getSiteRoutes();

  const { docs: existing } = await payload.find({
    collection: "pages",
    limit: 0,
    pagination: false,
    select: { path: true },
  });

  const existingPaths = new Set(existing.map((doc) => doc.path));
  const currentPaths = new Set(routes);

  // Create pages for new routes
  const toCreate = routes.filter((r) => !existingPaths.has(r));
  for (const route of toCreate) {
    await payload.create({
      collection: "pages",
      data: { path: route },
      overrideAccess: true,
    });
    payload.logger.info(`[syncPages] Created page: ${route}`);
  }

  // Remove pages for deleted routes
  const toDelete = existing.filter((doc) => !currentPaths.has(doc.path));
  for (const doc of toDelete) {
    await payload.delete({
      collection: "pages",
      id: doc.id,
      overrideAccess: true,
    });
    payload.logger.info(`[syncPages] Removed page: ${doc.path}`);
  }

  if (toCreate.length || toDelete.length) {
    payload.logger.info(
      `[syncPages] Synced ${routes.length} pages (+${toCreate.length} / -${toDelete.length})`,
    );
  }
}
