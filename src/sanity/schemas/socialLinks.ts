import { defineType, defineField } from "sanity";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({ name: "instagram", title: "Instagram", type: "url" }),
    defineField({ name: "facebook", title: "Facebook", type: "url" }),
    defineField({ name: "x", title: "X (Twitter)", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "youtube", title: "YouTube", type: "url" }),
    defineField({ name: "tiktok", title: "TikTok", type: "url" }),
  ],
  preview: {
    prepare() {
      return { title: "Social Links" };
    },
  },
});
