import type { CollectionConfig } from "payload";
import { getSiteRoutes } from "../lib/getSiteRoutes.ts";

const siteRoutes = getSiteRoutes();

export const Redirects: CollectionConfig = {
  slug: "redirects",
  admin: {
    group: "Site Settings",
    useAsTitle: "from",
    defaultColumns: ["from", "to", "type", "updatedAt"],
    description:
      "Redirect old URLs to new ones to maintain search engine ranking.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "from",
      type: "text",
      required: true,
      unique: true,
      admin: {
        placeholder: "/old-page",
        description: "The URL path to redirect from (e.g. /old-page)",
      },
    },
    {
      name: "to",
      type: "text",
      required: true,
      admin: {
        placeholder: "Page or URL...",
        description: "The URL path to redirect to",
        components: {
          Field: {
            path: "@/components/payload/RedirectToField",
            clientProps: {
              routes: siteRoutes,
            },
          },
        },
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "301",
      options: [
        { label: "301 — Permanent", value: "301" },
        { label: "302 — Temporary", value: "302" },
      ],
      admin: {
        description:
          "Use 301 for permanent moves (SEO transfers). Use 302 for temporary redirects.",
      },
    },
  ],
};
