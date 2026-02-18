import type { CollectionConfig } from "payload";
import { generateAltText } from "../lib/generateAltText";
import fs from "fs/promises";
import path from "path";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    description:
      "Images, PDFs, and other files. Alt text is auto-generated for images.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return;
        if (doc.alt) return;
        if (!doc.mimeType?.startsWith("image/")) return;
        if (!doc.url) return;

        let imageSource: string | { base64: string; mimeType: string };

        if (doc.url.startsWith("http")) {
          // Production: Vercel Blob URL is publicly accessible
          imageSource = doc.url;
        } else {
          // Local dev: read file from disk and send as base64
          const filePath = path.resolve(process.cwd(), `media/${doc.filename}`);
          try {
            const buffer = await fs.readFile(filePath);
            imageSource = {
              base64: buffer.toString("base64"),
              mimeType: doc.mimeType,
            };
          } catch {
            console.warn("[media] Could not read local file:", filePath);
            return;
          }
        }

        const altText = await generateAltText(imageSource);
        if (!altText) return;

        await req.payload.update({
          collection: "media",
          id: doc.id,
          data: { alt: altText },
        });
      },
    ],
  },
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "desktop",
        width: 1920,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
  },
};
