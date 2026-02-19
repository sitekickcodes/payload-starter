import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "My Site",
      description: "Used in metadata, emails, and the browser tab.",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
      description:
        "Default meta description for SEO. Can be overridden per page.",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      description:
        "Default social sharing image. Recommended size: 1200×630px.",
    }),
    defineField({
      name: "contact",
      title: "Contact Info",
      type: "object",
      fields: [
        defineField({
          name: "businessName",
          title: "Business Name",
          type: "string",
          description:
            "Legal or display name of the business.",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
        defineField({
          name: "street",
          title: "Street",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
        }),
        defineField({
          name: "zip",
          title: "ZIP Code",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "headScripts",
      title: "Head Scripts",
      type: "text",
      rows: 5,
      description:
        "Custom code injected into the <head> tag. Use for tracking scripts or meta tags.",
    }),
    defineField({
      name: "bodyScripts",
      title: "Body Scripts",
      type: "text",
      rows: 5,
      description:
        "Custom code injected before the closing </body> tag. Use for chat widgets or analytics.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
