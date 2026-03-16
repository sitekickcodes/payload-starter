"use client";

import { usePathname } from "next/navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/** Pretty labels for known path segments */
const SEGMENT_LABELS: Record<string, string> = {
  about: "About",
  contact: "Contact",
};

function segmentToLabel(segment: string): string {
  return SEGMENT_LABELS[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AutoBreadcrumbJsonLd() {
  const pathname = usePathname();

  // No breadcrumbs on the homepage
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { name: "Home", item: siteUrl },
    ...segments.map((segment, i) => ({
      name: segmentToLabel(segment),
      item: `${siteUrl}/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
