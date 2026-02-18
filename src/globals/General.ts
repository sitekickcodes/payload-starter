import type { GlobalConfig } from "payload";

export const General: GlobalConfig = {
  slug: "general",
  admin: {
    group: "Site Settings",
    description:
      "Site identity, contact info, SEO defaults, and custom scripts.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "My Site",
      admin: {
        description: "Used in metadata, emails, and the browser tab.",
      },
    },
    {
      name: "siteDescription",
      type: "textarea",
      admin: {
        description:
          "Default meta description for SEO. Can be overridden per page.",
      },
    },
    {
      name: "ogImage",
      label: "Default OG Image",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Default social sharing image. Recommended size: 1200×630px.",
      },
    },
    {
      name: "contact",
      type: "group",
      label: "Contact Info",
      fields: [
        {
          name: "businessName",
          label: "Business Name",
          type: "text",
          admin: {
            description:
              "Legal or display name of the business. Used in the admin panel title.",
          },
        },
        {
          name: "email",
          type: "email",
          admin: {
            placeholder: "hello@example.com",
            description: "Primary contact email shown on the site.",
          },
        },
        {
          name: "phone",
          type: "text",
          admin: {
            placeholder: "+1 (555) 123-4567",
          },
        },
        {
          name: "street",
          type: "text",
          admin: { placeholder: "123 Main St" },
        },
        {
          type: "row",
          fields: [
            {
              name: "city",
              type: "text",
              admin: { placeholder: "Austin" },
            },
            {
              name: "state",
              type: "text",
              admin: { placeholder: "TX" },
            },
            {
              name: "zip",
              label: "ZIP Code",
              type: "text",
              admin: { placeholder: "78701" },
            },
          ],
        },
      ],
    },
    {
      name: "headScripts",
      label: "Head Scripts",
      type: "code",
      admin: {
        language: "html",
        description:
          "Custom code injected into the <head> tag. Use for tracking scripts, meta tags, or third-party integrations.",
      },
    },
    {
      name: "bodyScripts",
      label: "Body Scripts",
      type: "code",
      admin: {
        language: "html",
        description:
          "Custom code injected before the closing </body> tag. Use for chat widgets, analytics, or other scripts.",
      },
    },
  ],
};
