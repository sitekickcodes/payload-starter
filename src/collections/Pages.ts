import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "updatedAt"],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "meta",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "Defaults to page title if left empty",
          },
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};
