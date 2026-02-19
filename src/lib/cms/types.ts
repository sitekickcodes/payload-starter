/**
 * Shared CMS content types.
 *
 * These interfaces define the contract between frontend pages and the CMS.
 * Each CMS adapter (payload.ts, sanity.ts) must return data matching these shapes.
 */

export interface CMSImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  /** Rich text content — render with the CMS-specific RichText component */
  content: unknown;
  featuredImage?: CMSImage;
  status: "draft" | "published";
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
}

export interface Page {
  id: string;
  path: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: CMSImage;
}

export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  ogImage?: CMSImage;
  contact?: {
    businessName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  headScripts?: string;
  bodyScripts?: string;
}

export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

/** The CMS adapter interface that each implementation must satisfy. */
export interface CMSAdapter {
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | null>;
  getPage(path: string): Promise<Page | null>;
  getSiteSettings(): Promise<SiteSettings>;
  getAnalytics(): Promise<AnalyticsSettings>;
  getSocialLinks(): Promise<SocialLinks>;
}
