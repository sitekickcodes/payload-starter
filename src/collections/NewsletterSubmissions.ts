import type { CollectionConfig } from "payload";

export const NewsletterSubmissions: CollectionConfig = {
  slug: "newsletter-submissions",
  labels: { singular: "Subscriber", plural: "Newsletter" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "createdAt"],
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
      name: "email",
      type: "email",
      required: true,
      admin: { readOnly: true },
    },
  ],
};
