"use client";

import { useDocumentInfo, useField, Button } from "@payloadcms/ui";
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
    <div style={{ marginBottom: 8 }}>
      <Button
        onClick={generate}
        disabled={loading}
        buttonStyle="secondary"
        size="small"
        type="button"
      >
        {loading ? "Generating..." : "Generate Alt Text"}
      </Button>
    </div>
  );
};

export default GenerateAltTextButton;
