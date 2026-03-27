"use client";

import { useDocumentInfo, useField } from "@payloadcms/ui";
import { useCallback, useState } from "react";

const GenerateAltTextButton = () => {
  const { id } = useDocumentInfo();
  const altField = useField<string>({ path: "alt" });
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/generate-alt-text?id=${id}`);
      if (!res.ok) throw new Error("Failed");
      const { alt } = await res.json();
      if (alt) {
        altField.setValue(alt);
      }
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  }, [id, altField]);

  if (!id) return null;

  return (
    <button
      type="button"
      onClick={generate}
      disabled={loading}
      style={{
        background: "none",
        border: "1px solid var(--theme-elevation-400)",
        borderRadius: 4,
        padding: "4px 10px",
        cursor: loading ? "wait" : "pointer",
        fontSize: 12,
        color: "var(--theme-elevation-800)",
        marginBottom: 8,
      }}
    >
      {loading ? "Generating..." : "Generate Alt Text"}
    </button>
  );
};

export default GenerateAltTextButton;
