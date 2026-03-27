import type { CollectionConfig } from "payload";
import { list, del } from "@vercel/blob";
import {
  generateAltText,
  altTextFromFilename,
} from "../lib/generateAltText.ts";

/**
 * Sanitize a filename into a URL-friendly slug.
 * "imgi_66_WOOLCLOUD_BANNER.webp" → "woolcloud-banner.webp"
 * "Trust_for_Public_Land_logo_white.svg" → "trust-for-public-land-logo-white.svg"
 */
function friendlyFilename(raw: string): string {
  const ext = raw.includes(".") ? raw.slice(raw.lastIndexOf(".")) : "";
  const name = raw.slice(0, raw.length - ext.length);

  const clean = name
    // Strip common prefixes like "imgi_66_", "img_123_", "IMG-20250101_" etc.
    .replace(/^(img[a-z]?[-_]?\d+[-_])/i, "")
    // Replace underscores, dots, and multiple hyphens with single hyphen
    .replace(/[_.]+/g, "-")
    // Remove non-alphanumeric chars except hyphens
    .replace(/[^a-zA-Z0-9-]/g, "")
    // Collapse multiple hyphens
    .replace(/-{2,}/g, "-")
    // Trim leading/trailing hyphens
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${clean}${ext.toLowerCase()}`;
}

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    description:
      "Images, PDFs, and other files. Alt text is auto-generated for images.",
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: () => true,
  },
  fields: [
          },
    },
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      admin: {
        description:
          "A short description of the image for screen readers and SEO. Auto-generated on upload, but you can edit it. Good alt text improves accessibility and helps search engines understand your images.",
      },
    },
    {
      name: "generateAltText",
      type: "ui",
      admin: {
        disableListColumn: true,
        components: {
          Field: "@/components/payload/GenerateAltTextButton.tsx",
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Sanitize filename on upload
        const file = req.file;
        if (file?.name) {
          file.name = friendlyFilename(file.name);
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation !== "create") return;
        if (doc.alt) return;
        if (!doc.mimeType?.startsWith("image/")) return;

        const isSvg = doc.mimeType === "image/svg+xml";

        if (isSvg) {
          const altText = altTextFromFilename(doc.filename as string);
          if (altText) {
            req.payload
              .update({
                collection: "media",
                id: doc.id,
                data: { alt: altText },
              })
              .catch(() => {});
          }
          return;
        }

        const thumbUrl = (doc.sizes as Record<string, any>)?.thumbnail?.url;
        const imageUrl = thumbUrl || doc.url;
        if (!imageUrl) return;

        const fullUrl = (imageUrl as string).startsWith("http")
          ? (imageUrl as string)
          : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${imageUrl}`;

        generateAltText(fullUrl, doc.filename as string)
          .then((altText) => {
            if (altText) {
              return req.payload.update({
                collection: "media",
                id: doc.id,
                data: { alt: altText },
              });
            }
          })
          .catch(() => {});
      },
    ],
    afterError: [
      ({ req }) => {
        if (req.method !== "POST") return;

        const filename = req.file?.name;
        if (!filename) return;

        const blobPathname = `media/${filename}`;

        (async () => {
          try {
            const result = await list({ prefix: blobPathname, limit: 100 });
            if (result.blobs.length === 0) return;

            const { docs } = await req.payload.find({
              collection: "media",
              limit: 1,
              depth: 0,
              where: { filename: { equals: filename } },
            });

            if (docs.length > 0) return;

            for (const blob of result.blobs) {
              await del(blob.url);
            }

            req.payload.logger.info(
              `[Media] Cleaned orphan blob: ${blobPathname}`,
            );
          } catch {
            // Silent
          }
        })();
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
