import { defineQuery } from "next-sanity";

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blog" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    content,
    featuredImage {
      asset-> { url, metadata { dimensions { width, height } } },
      alt
    },
    status,
    publishedAt,
    _updatedAt,
    _createdAt
  }
`);

export const BLOG_POST_QUERY = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    content,
    featuredImage {
      asset-> { url, metadata { dimensions { width, height } } },
      alt
    },
    status,
    publishedAt,
    _updatedAt,
    _createdAt
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && path == $path][0] {
    _id,
    path,
    metaTitle,
    metaDescription,
    ogImage {
      asset-> { url, metadata { dimensions { width, height } } }
    }
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    ogImage {
      asset-> { url, metadata { dimensions { width, height } } }
    },
    contact,
    headScripts,
    bodyScripts
  }
`);

export const ANALYTICS_QUERY = defineQuery(`
  *[_type == "analytics"][0] {
    googleAnalyticsId,
    googleTagManagerId,
    facebookPixelId
  }
`);

export const SOCIAL_LINKS_QUERY = defineQuery(`
  *[_type == "socialLinks"][0] {
    instagram,
    facebook,
    x,
    linkedin,
    youtube,
    tiktok
  }
`);
