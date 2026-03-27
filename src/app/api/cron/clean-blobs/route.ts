import { list, del } from "@vercel/blob";

export const maxDuration = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch all media records from Payload (public read)
  const res = await fetch(`${SITE_URL}/api/media?limit=500&depth=0`);
  if (!res.ok) {
    return Response.json(
      { error: `Failed to fetch media: ${res.status}` },
      { status: 500 },
    );
  }
  const { docs } = (await res.json()) as {
    docs: Array<{
      filename: string;
      sizes?: Record<string, { filename?: string | null } | null>;
    }>;
  };

  // 2. Build set of all referenced filenames (primary + resize variants)
  const referencedFiles = new Set<string>();
  for (const doc of docs) {
    if (doc.filename) referencedFiles.add(`media/${doc.filename}`);
    if (doc.sizes) {
      for (const sizeData of Object.values(doc.sizes)) {
        if (sizeData?.filename) referencedFiles.add(`media/${sizeData.filename}`);
      }
    }
  }

  // 3. List all blobs
  const allBlobs: Array<{ url: string; pathname: string; size: number }> = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    allBlobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // 4. Find orphans
  const orphans = allBlobs.filter((b) => !referencedFiles.has(b.pathname));

  // Safety: abort if no blobs matched (something is wrong)
  if (orphans.length > 0 && referencedFiles.size === 0) {
    return Response.json(
      { error: "Safety abort: no DB records found, refusing to delete" },
      { status: 500 },
    );
  }

  // 5. Delete orphans
  const deleted: string[] = [];
  let freedBytes = 0;
  for (const blob of orphans) {
    try {
      await del(blob.url);
      deleted.push(blob.pathname);
      freedBytes += blob.size;
    } catch {
      // Log but continue
    }
  }

  return Response.json({
    totalBlobs: allBlobs.length,
    referencedFiles: referencedFiles.size,
    orphansFound: orphans.length,
    deleted: deleted.length,
    freedMB: Math.round(freedBytes / 1_000_000 * 10) / 10,
    deletedFiles: deleted,
  });
}
