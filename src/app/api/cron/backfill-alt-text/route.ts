import { getPayload } from "payload";
import config from "@payload-config";
import { generateAltText, altTextFromFilename } from "@/lib/generateAltText";

export const maxDuration = 120;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });

  // If ?all=true, regenerate for ALL images (replaces existing alt text)
  const regenerateAll = new URL(request.url).searchParams.get("all") === "true";

  const { docs } = await payload.find({
    collection: "media",
    limit: 50,
    ...(regenerateAll
      ? {}
      : {
          where: {
            or: [
              { alt: { exists: false } },
              { alt: { equals: "" } },
              { alt: { equals: null } },
            ],
          },
        }),
  });

  const results: Array<{ id: number; filename: string; alt: string | null }> = [];

  for (const doc of docs) {
    if (!doc.mimeType?.startsWith("image/")) continue;

    const isSvg = doc.mimeType === "image/svg+xml";
    let altText: string | null = null;

    if (isSvg) {
      altText = altTextFromFilename(doc.filename as string);
    } else {
      // Use thumbnail for cheaper API call
      const sizes = doc.sizes as Record<string, { url?: string | null }> | undefined;
      const thumbUrl = sizes?.thumbnail?.url;
      const imageUrl = thumbUrl || doc.url;
      if (!imageUrl) continue;

      const fullUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `${SITE_URL}${imageUrl}`;

      altText = await generateAltText(fullUrl, doc.filename as string);
    }

    if (altText) {
      await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: altText },
      });
    }

    results.push({
      id: doc.id as number,
      filename: doc.filename as string,
      alt: altText,
    });
  }

  return Response.json({
    processed: results.length,
    updated: results.filter((r) => r.alt).length,
    results,
  });
}
