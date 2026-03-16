"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          size?: "normal" | "compact" | "invisible";
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/**
 * Invisible Cloudflare Turnstile widget.
 * Renders nothing visible — calls onVerify with a token when ready.
 */
export function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const scriptLoaded = useRef(false);

  const handleVerify = useCallback(
    (token: string) => onVerify(token),
    [onVerify],
  );

  const handleExpire = useCallback(() => {
    onExpire?.();
    // Auto-reset to get a new token
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }, [onExpire]);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    function renderWidget() {
      if (!containerRef.current || !window.turnstile) return;
      // Remove previous widget if any
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: handleVerify,
        "expired-callback": handleExpire,
        size: "invisible",
        theme: "auto",
      });
    }

    if (window.turnstile) {
      renderWidget();
      return;
    }

    if (!scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [handleVerify, handleExpire]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
}
