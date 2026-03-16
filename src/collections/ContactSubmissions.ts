import type { CollectionConfig } from "payload";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: { singular: "Message", plural: "Contact" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "inquiry", "createdAt"],
    group: "Forms",
    hideAPIURL: true,
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "entryView",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/payload/form-entry-view#ContactEntryView",
        },
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      admin: { hidden: true },
    },
    {
      name: "email",
      type: "email",
      required: true,
      admin: { hidden: true },
    },
    {
      name: "inquiry",
      type: "select",
      options: [
        { label: "General", value: "general" },
        { label: "Support", value: "support" },
        { label: "Sales", value: "sales" },
        { label: "Partnership", value: "partnership" },
        { label: "Other", value: "other" },
      ],
      admin: { hidden: true },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      admin: { hidden: true },
    },
  ],
};
