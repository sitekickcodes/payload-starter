"use client";

import { useDocumentInfo } from "@payloadcms/ui";

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--theme-elevation-500)",
  marginBottom: "4px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "var(--theme-elevation-1000)",
  lineHeight: 1.5,
};

const linkStyle: React.CSSProperties = {
  ...valueStyle,
  color: "var(--theme-elevation-800)",
  textDecoration: "underline",
};

const cardStyle: React.CSSProperties = {
  padding: "24px",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "8px",
  background: "var(--theme-elevation-50)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const messageStyle: React.CSSProperties = {
  ...valueStyle,
  whiteSpace: "pre-wrap",
  padding: "12px 16px",
  background: "var(--theme-elevation-0)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "6px",
  marginTop: "4px",
};

const timestampStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--theme-elevation-400)",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

export function ContactEntryView() {
  const { initialData } = useDocumentInfo();
  const data = initialData as Record<string, unknown> | undefined;
  if (!data) return null;

  const inquiryLabels: Record<string, string> = {
    general: "General",
    support: "Support",
    sales: "Sales",
    partnership: "Partnership",
    other: "Other",
  };

  return (
    <div style={cardStyle}>
      <Field label="Name">
        <div style={valueStyle}>{data.name as string}</div>
      </Field>
      <Field label="Email">
        <a href={`mailto:${data.email}`} style={linkStyle}>
          {data.email as string}
        </a>
      </Field>
      <Field label="Inquiry Type">
        <div style={valueStyle}>
          {inquiryLabels[(data.inquiry as string) || "general"] || (data.inquiry as string)}
        </div>
      </Field>
      <Field label="Message">
        <div style={messageStyle}>{data.message as string}</div>
      </Field>
      {data.createdAt ? (
        <div style={timestampStyle}>
          Received {new Date(data.createdAt as string).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </div>
      ) : null}
    </div>
  );
}
