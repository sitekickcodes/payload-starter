import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    useAsTitle: "path",
    defaultColumns: ["path", "metaTitle", "updatedAt"],
    description:
      "SEO metadata for each page on the site. Pages are auto-discovered from the codebase.",
  },
  access: {
    read: () => true,
    create: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "path",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "The URL path of this page. Auto-detected from the codebase.",
      },
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "text",
      admin: {
        description:
          "Page title shown in browser tabs and search results. Keep under 60 characters.",
      },
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
      admin: {
        description:
          "Description shown in search results. Keep between 120–160 characters.",
      },
    },
    {
      name: "ogImage",
      label: "OG Image",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Social sharing image for this page. Falls back to the default in Site Settings.",
      },
    },
  ],
};
