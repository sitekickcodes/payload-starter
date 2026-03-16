import type { SiteSettings, SocialLinks } from "@/lib/cms";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/* ------------------------------------------------------------------ */
/*  Organization + LocalBusiness (homepage)                            */
/* ------------------------------------------------------------------ */

export function buildOrganizationSchema(
  settings: SiteSettings,
  socialLinks: SocialLinks,
) {
  const contact = settings.contact;
  const sameAs = [
    socialLinks.instagram,
    socialLinks.facebook,
    socialLinks.x,
    socialLinks.youtube,
    socialLinks.tiktok,
    socialLinks.google,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: settings.siteName,
    description: settings.siteDescription,
    url: siteUrl,
    ...(contact?.phone && { telephone: contact.phone.replace(/\D/g, "") }),
    ...(contact?.email && { email: contact.email }),
    ...(contact?.street && {
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.street,
        addressLocality: contact.city,
        addressRegion: contact.state,
        postalCode: contact.zip,
        addressCountry: "US",
      },
    }),
    sameAs,
  };
}

/* ------------------------------------------------------------------ */
/*  WebSite (homepage)                                                 */
/* ------------------------------------------------------------------ */

export function buildWebSiteSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: settings.siteName,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList                                                     */
/* ------------------------------------------------------------------ */

export function buildBreadcrumbSchema(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
