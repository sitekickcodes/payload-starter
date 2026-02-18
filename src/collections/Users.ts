import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Admin",
    useAsTitle: "email",
    description: "Manage team members and their roles.",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      defaultValue: "editor",
      required: true,
    },
  ],
};
