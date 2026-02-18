import type { GlobalConfig } from "payload";

export const SocialLinks: GlobalConfig = {
  slug: "social-links",
  admin: {
    group: "Site Settings",
    description: "Social media profile links displayed on the site.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "instagram",
      type: "text",
      admin: { placeholder: "https://instagram.com/yourhandle" },
    },
    {
      name: "facebook",
      type: "text",
      admin: { placeholder: "https://facebook.com/yourpage" },
    },
    {
      name: "x",
      label: "X (Twitter)",
      type: "text",
      admin: { placeholder: "https://x.com/yourhandle" },
    },
    {
      name: "linkedin",
      type: "text",
      admin: { placeholder: "https://linkedin.com/company/yourcompany" },
    },
    {
      name: "youtube",
      type: "text",
      admin: { placeholder: "https://youtube.com/@yourchannel" },
    },
    {
      name: "tiktok",
      type: "text",
      admin: { placeholder: "https://tiktok.com/@yourhandle" },
    },
  ],
};
