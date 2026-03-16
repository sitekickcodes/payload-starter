import type { CollectionConfig } from "payload";
import { generateAltText, altTextFromFilename } from "../lib/generateAltText.ts";

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
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      admin: {
        description:
          "A short description of the image for screen readers and SEO. Auto-generated on upload, but you can edit it. Good alt text improves accessibility and helps search engines understand your images.",
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
      async ({ doc, req }) => {
        if (doc.alt) return;
        if (!doc.mimeType?.startsWith("image/")) return;
        if (!doc.url) return;

        const isSvg = doc.mimeType === "image/svg+xml";

        let altText: string | null = null;

        if (isSvg) {
          // Claude can't process SVGs — infer alt text from filename
          altText = altTextFromFilename(doc.filename as string);
        } else {
          // Build a full URL that Claude's API can fetch
          let imageUrl = doc.url as string;
          if (!imageUrl.startsWith("http")) {
            const base =
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            imageUrl = `${base}${imageUrl}`;
          }
          altText = await generateAltText(imageUrl);
        }

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
