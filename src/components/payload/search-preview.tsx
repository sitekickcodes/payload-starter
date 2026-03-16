"use client";

import { useFormFields, useTheme } from "@payloadcms/ui";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const light = {
  bg: "#fff",
  border: "#dadce0",
  siteName: "#202124",
  url: "#4d5156",
  title: "#1a0dab",
  description: "#4d5156",
  favicon: { bg: "#f1f3f4", color: "#5f6368" },
};

const dark = {
  bg: "#202124",
  border: "#3c4043",
  siteName: "#dadce0",
  url: "#969ba1",
  title: "#8ab4f8",
  description: "#bdc1c6",
  favicon: { bg: "#303134", color: "#9aa0a6" },
};

const SearchPreviewCard = ({
  title,
  description,
  displayUrl,
  faviconLetter = "S",
  displaySiteName = "Site Name",
}: {
  title: string;
  description: string;
  displayUrl: string;
  faviconLetter?: string;
  displaySiteName?: string;
}) => {
  const { theme } = useTheme();
  const t = theme === "dark" ? dark : light;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--theme-elevation-800)",
          marginBottom: 8,
        }}
      >
        Google Search Preview
      </div>
      <div
        style={{
          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
          maxWidth: 600,
          padding: "16px 20px",
          borderRadius: 8,
          border: `1px solid ${t.border}`,
          background: t.bg,
        }}
      >
        <div
          style={{
            fontSize: 11,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: t.favicon.bg,
              fontSize: 13,
              fontWeight: 700,
              color: t.favicon.color,
              flexShrink: 0,
            }}
          >
            {faviconLetter}
          </span>
          <span style={{ lineHeight: "16px" }}>
            <span style={{ fontSize: 13, color: t.siteName }}>
              {displaySiteName}
            </span>
            <br />
            <span style={{ fontSize: 11, color: t.url }}>
              {displayUrl}
            </span>
          </span>
        </div>
        <div
          style={{
            fontSize: 18,
            lineHeight: "24px",
            color: t.title,
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: "20px",
            color: t.description,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "No description set — search engines will generate one from page content."}
        </div>
      </div>
    </div>
  );
};

export const SearchPreview: React.FC = () => {
  const metaTitle = useFormFields(([fields]) => fields.metaTitle);
  const metaDescription = useFormFields(([fields]) => fields.metaDescription);
  const path = useFormFields(([fields]) => fields.path);

  const title = (metaTitle?.value as string) || "Page Title";
  const description = (metaDescription?.value as string) || "";
  const pagePath = (path?.value as string) || "/";
  const isHomepage = pagePath === "/";
  const fullTitle = isHomepage ? title : `${title} | Site Name`;
  const displayUrl = `${siteUrl}${isHomepage ? "" : pagePath}`;

  return (
    <SearchPreviewCard
      title={fullTitle}
      description={description}
      displayUrl={displayUrl}
    />
  );
};

export const SiteSettingsSearchPreview: React.FC = () => {
  const siteNameField = useFormFields(([fields]) => fields.siteName);
  const siteDescriptionField = useFormFields(([fields]) => fields.siteDescription);

  const name = (siteNameField?.value as string) || "Site Name";
  const description = (siteDescriptionField?.value as string) || "";

  return (
    <SearchPreviewCard
      title={name}
      description={description}
      displayUrl={siteUrl}
      faviconLetter={name.charAt(0).toUpperCase()}
      displaySiteName={name}
    />
  );
};

export default SearchPreview;
