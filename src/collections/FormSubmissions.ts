import type { CollectionConfig } from "payload";

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  admin: {
    useAsTitle: "form",
    defaultColumns: ["form", "email", "createdAt"],
    group: "Admin",
    hideAPIURL: true,
    description:
      "Submissions from contact forms, newsletter signups, and other site forms.",
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "form",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
        description: "Which form this submission came from (e.g. contact, newsletter)",
      },
    },
    {
      name: "data",
      type: "json",
      required: true,
      admin: {
        readOnly: true,
        description: "The raw form submission data",
      },
    },
    {
      name: "email",
      type: "email",
      admin: {
        readOnly: true,
        description: "Submitter's email (if provided)",
      },
    },
  ],
};
