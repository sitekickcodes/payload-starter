import { defineType, defineField } from "sanity";

export const analytics = defineType({
  name: "analytics",
  title: "Analytics",
  type: "document",
  fields: [
    defineField({
      name: "googleAnalyticsId",
      title: "Google Analytics ID",
      type: "string",
      description: "Your GA4 measurement ID (G-XXXXXXXXXX). Leave empty to disable.",
    }),
    defineField({
      name: "googleTagManagerId",
      title: "Google Tag Manager ID",
      type: "string",
      description:
        "GTM container ID. Use this if you manage tags through Tag Manager.",
    }),
    defineField({
      name: "facebookPixelId",
      title: "Facebook Pixel ID",
      type: "string",
      description: "Meta Pixel ID for Facebook/Instagram ad tracking.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Analytics" };
    },
  },
});
