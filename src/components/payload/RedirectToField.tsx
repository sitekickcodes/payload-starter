"use client";

import { TextInput, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = TextFieldClientProps & {
  routes?: string[];
};

export const RedirectToField: React.FC<Props> = ({
  field,
  path: fieldPath,
  routes: staticRoutes = [],
}) => {
  const { value, setValue } = useField<string>({
    path: fieldPath ?? field.name,
  });
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [dynamicRoutes, setDynamicRoutes] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  // Fetch collection-based routes on first focus
  const fetchDynamicRoutes = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    try {
      const res = await fetch("/api/site-routes");
      if (res.ok) {
        const routes = await res.json();
        setDynamicRoutes(routes);
      }
    } catch {
      // Silently fail — static routes still work
    }
  }, []);

  // Deduplicate and merge static + dynamic routes
  const allRoutes = [...new Set([...staticRoutes, ...dynamicRoutes])].sort();

  const query = filter || value || "";
  const filtered = query
    ? allRoutes.filter((r) => r.toLowerCase().includes(query.toLowerCase()))
    : allRoutes;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setFilter(e.target.value);
      setOpen(true);
    },
    [setValue],
  );

  const handleSelect = useCallback(
    (route: string) => {
      setValue(route);
      setFilter("");
      setOpen(false);
    },
    [setValue],
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="field-type"
      style={{ position: "relative" }}
      onFocus={() => {
        setOpen(true);
        fetchDynamicRoutes();
      }}
    >
      <TextInput
        path={fieldPath ?? field.name}
        label={field.label || field.name}
        value={value || ""}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Page or URL..."
        required={field.required}
      />

      {open && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--theme-elevation-0)",
            border: "1px solid var(--theme-border-color)",
            borderRadius: "0 0 4px 4px",
            maxHeight: 240,
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              padding: "8px 12px 4px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--theme-elevation-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Pages
          </div>
          {filtered.map((route) => (
            <button
              key={route}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(route)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "var(--theme-text)",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--theme-elevation-100, var(--theme-elevation-1))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              {route}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedirectToField;
