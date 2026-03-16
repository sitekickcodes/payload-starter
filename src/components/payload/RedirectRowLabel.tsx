"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function RedirectRowLabel() {
  const { data } = useRowLabel<{ from?: string; to?: string }>();
  if (!data?.from) return "New Redirect";
  return `${data.from} → ${data.to || "..."}`;
}
