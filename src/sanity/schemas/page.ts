import { defineType, defineField } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "path",
      title: "Path",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
      description: "The URL path of this page. Auto-detected from the codebase.",
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Page title shown in browser tabs and search results. Keep under 60 characters.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "Description shown in search results. Keep between 120–160 characters.",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description:
        "Social sharing image for this page. Falls back to the default in Site Settings.",
    }),
  ],
  preview: {
    select: { title: "metaTitle", subtitle: "path" },
    prepare({ title, subtitle }) {
      return { title: title || subtitle, subtitle };
    },
  },
});
