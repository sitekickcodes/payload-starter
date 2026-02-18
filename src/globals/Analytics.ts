import type { GlobalConfig } from "payload";

export const Analytics: GlobalConfig = {
  slug: "analytics",
  admin: {
    group: "Site Settings",
    description: "Tracking and analytics integrations.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "googleAnalyticsId",
      label: "Google Analytics ID",
      type: "text",
      admin: {
        placeholder: "G-XXXXXXXXXX",
        description: "Your GA4 measurement ID. Leave empty to disable.",
      },
    },
    {
      name: "googleTagManagerId",
      label: "Google Tag Manager ID",
      type: "text",
      admin: {
        placeholder: "GTM-XXXXXXX",
        description:
          "GTM container ID. Use this if you manage tags through Tag Manager instead of adding them individually.",
      },
    },
    {
      name: "facebookPixelId",
      label: "Facebook Pixel ID",
      type: "text",
      admin: {
        placeholder: "1234567890",
        description: "Meta Pixel ID for Facebook/Instagram ad tracking.",
      },
    },
  ],
};
