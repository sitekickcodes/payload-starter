"use client";

import { useTheme } from "@payloadcms/ui";

export const HomepageNotice: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 8,
        border: `1px solid ${isDark ? "#3c4043" : "#d2e3fc"}`,
        background: isDark ? "#1e2a3a" : "#e8f0fe",
        color: isDark ? "#8ab4f8" : "#1967d2",
        fontSize: 13,
        lineHeight: "20px",
        marginBottom: 8,
      }}
    >
      Homepage SEO is inherited from{" "}
      <a
        href="/admin/globals/site-settings"
        style={{
          fontWeight: 600,
          textDecoration: "underline",
          textUnderlineOffset: 2,
          color: "inherit",
        }}
      >
        Site Settings
      </a>
      . The page title, description, and social image shown below are
      read-only — edit them in Site Settings to update.
    </div>
  );
};

export default HomepageNotice;
