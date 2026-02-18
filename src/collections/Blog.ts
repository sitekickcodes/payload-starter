import type { CollectionConfig } from "payload";

export const Blog: CollectionConfig = {
  slug: "blog",
  admin: {
    group: "Collections",
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "updatedAt"],
    description:
      "Blog posts published on the site. Supports drafts and scheduled publishing.",
  },
  custom: {
    basePath: "/blog",
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
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
      index: true,
      admin: {
        position: "sidebar",
        description: "URL-friendly identifier. Must be unique.",
      },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      label: "Publish Date",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "When this post should go live.",
      },
    },
  ],
};
