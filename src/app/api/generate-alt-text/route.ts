import { getPayload } from "payload";
import config from "@payload-config";
import { generateAltText, altTextFromFilename } from "@/lib/generateAltText";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const payload = await getPayload({ config });

  const doc = await payload.findByID({
    collection: "media",
    id: Number(id),
  });

  if (!doc || !doc.mimeType?.startsWith("image/")) {
    return Response.json({ error: "Not an image" }, { status: 400 });
  }

  let alt: string | null = null;

  if (doc.mimeType === "image/svg+xml") {
    alt = altTextFromFilename(doc.filename as string);
  } else {
    const sizes = doc.sizes as Record<string, { url?: string | null }> | undefined;
    const thumbUrl = sizes?.thumbnail?.url;
    const imageUrl = thumbUrl || doc.url;
    if (!imageUrl) {
      return Response.json({ error: "No image URL" }, { status: 400 });
    }

    const fullUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${SITE_URL}${imageUrl}`;

    alt = await generateAltText(fullUrl, doc.filename as string);
  }

  if (alt) {
    await payload.update({
      collection: "media",
      id: Number(id),
      data: { alt },
    });
  }

  return Response.json({ alt });
}
