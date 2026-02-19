import { getPayload } from "payload";
import config from "@payload-config";
import type {
  CMSAdapter,
  CMSImage,
  BlogPost,
  Page,
  SiteSettings,
  AnalyticsSettings,
  SocialLinks,
} from "./types";

async function getClient() {
  return getPayload({ config });
}

function toImage(doc: Record<string, unknown> | undefined): CMSImage | undefined {
  if (!doc || typeof doc !== "object") return undefined;
  const url = doc.url as string | undefined;
  if (!url) return undefined;
  return {
    url,
    alt: (doc.alt as string) || undefined,
    width: (doc.width as number) || undefined,
    height: (doc.height as number) || undefined,
  };
}

export const payloadAdapter: CMSAdapter = {
  async getBlogPosts() {
    const payload = await getClient();
    const { docs } = await payload.find({
      collection: "blog",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      depth: 1,
    });

    return docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      featuredImage: toImage(doc.featuredImage as Record<string, unknown>),
      status: doc.status as "draft" | "published",
      publishedAt: doc.publishedAt || undefined,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    }));
  },

  async getBlogPost(slug: string) {
    const payload = await getClient();
    const { docs } = await payload.find({
      collection: "blog",
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    });

    const doc = docs[0];
    if (!doc) return null;

    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      featuredImage: toImage(doc.featuredImage as Record<string, unknown>),
      status: doc.status as "draft" | "published",
      publishedAt: doc.publishedAt || undefined,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    };
  },

  async getPage(path: string) {
    const payload = await getClient();
    const { docs } = await payload.find({
      collection: "pages",
      where: { path: { equals: path } },
      depth: 1,
      limit: 1,
    });

    const doc = docs[0];
    if (!doc) return null;

    return {
      id: String(doc.id),
      path: doc.path,
      metaTitle: doc.metaTitle || undefined,
      metaDescription: doc.metaDescription || undefined,
      ogImage: toImage(doc.ogImage as Record<string, unknown>),
    };
  },

  async getSiteSettings() {
    const payload = await getClient();
    const doc = await payload.findGlobal({ slug: "general", depth: 1 });

    return {
      siteName: doc.siteName,
      siteDescription: doc.siteDescription || undefined,
      ogImage: toImage(doc.ogImage as Record<string, unknown>),
      contact: doc.contact
        ? {
            businessName: doc.contact.businessName || undefined,
            email: doc.contact.email || undefined,
            phone: doc.contact.phone || undefined,
            street: doc.contact.street || undefined,
            city: doc.contact.city || undefined,
            state: doc.contact.state || undefined,
            zip: doc.contact.zip || undefined,
          }
        : undefined,
      headScripts: doc.headScripts || undefined,
      bodyScripts: doc.bodyScripts || undefined,
    };
  },

  async getAnalytics() {
    const payload = await getClient();
    const doc = await payload.findGlobal({ slug: "analytics" });

    return {
      googleAnalyticsId: doc.googleAnalyticsId || undefined,
      googleTagManagerId: doc.googleTagManagerId || undefined,
      facebookPixelId: doc.facebookPixelId || undefined,
    };
  },

  async getSocialLinks() {
    const payload = await getClient();
    const doc = await payload.findGlobal({ slug: "social-links" });

    return {
      instagram: doc.instagram || undefined,
      facebook: doc.facebook || undefined,
      x: doc.x || undefined,
      linkedin: doc.linkedin || undefined,
      youtube: doc.youtube || undefined,
      tiktok: doc.tiktok || undefined,
    };
  },
};
