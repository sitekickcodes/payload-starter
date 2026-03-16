import { client } from "@/sanity/client";
import {
  PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  ANALYTICS_QUERY,
  SOCIAL_LINKS_QUERY,
} from "@/sanity/queries";
import type {
  CMSAdapter,
  CMSImage,
  Page,
  SiteSettings,
  AnalyticsSettings,
  SocialLinks,
} from "./types";

function toImage(
  img: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } }; alt?: string } | undefined,
): CMSImage | undefined {
  if (!img?.asset?.url) return undefined;
  return {
    url: img.asset.url,
    alt: img.alt || undefined,
    width: img.asset.metadata?.dimensions?.width || undefined,
    height: img.asset.metadata?.dimensions?.height || undefined,
  };
}

export const sanityAdapter: CMSAdapter = {
  async getPage(path: string) {
    const doc = await client.fetch(PAGE_QUERY, { path });
    if (!doc) return null;

    return {
      id: doc._id as string,
      path: doc.path as string,
      metaTitle: (doc.metaTitle as string) || undefined,
      metaDescription: (doc.metaDescription as string) || undefined,
      ogImage: toImage(doc.ogImage as Parameters<typeof toImage>[0]),
    };
  },

  async getSiteSettings() {
    const doc = await client.fetch(SITE_SETTINGS_QUERY);
    const contact = doc?.contact as Record<string, string> | undefined;

    return {
      siteName: (doc?.siteName as string) || "My Site",
      siteDescription: (doc?.siteDescription as string) || undefined,
      ogImage: toImage(doc?.ogImage as Parameters<typeof toImage>[0]),
      contact: contact
        ? {
            businessName: contact.businessName || undefined,
            email: contact.email || undefined,
            phone: contact.phone || undefined,
            street: contact.street || undefined,
            city: contact.city || undefined,
            state: contact.state || undefined,
            zip: contact.zip || undefined,
          }
        : undefined,
      headScripts: (doc?.headScripts as string) || undefined,
      bodyScripts: (doc?.bodyScripts as string) || undefined,
    };
  },

  async getAnalytics() {
    const doc = await client.fetch(ANALYTICS_QUERY);
    return {
      googleAnalyticsId: (doc?.googleAnalyticsId as string) || undefined,
      googleTagManagerId: (doc?.googleTagManagerId as string) || undefined,
      facebookPixelId: (doc?.facebookPixelId as string) || undefined,
    };
  },

  async getSocialLinks() {
    const doc = await client.fetch(SOCIAL_LINKS_QUERY);
    return {
      instagram: (doc?.instagram as string) || undefined,
      facebook: (doc?.facebook as string) || undefined,
      x: (doc?.x as string) || undefined,
      google: (doc?.google as string) || undefined,
      linkedin: (doc?.linkedin as string) || undefined,
      youtube: (doc?.youtube as string) || undefined,
      tiktok: (doc?.tiktok as string) || undefined,
    };
  },
};
