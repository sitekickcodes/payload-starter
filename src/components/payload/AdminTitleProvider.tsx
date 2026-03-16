"use client";

import { useEffect, type ReactNode } from "react";

const FALLBACK_SUFFIX = "— Admin";

export default function AdminTitleProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    let suffix = "";

    fetch("/api/globals/site-settings?depth=0")
      .then((res) => res.json())
      .then((data) => {
        const name = data?.contact?.businessName;
        if (!name) return;
        suffix = `— ${name} Admin`;
        rewrite();
      });

    function rewrite() {
      if (!suffix) return;
      const raw = document.title;
      if (raw.includes(suffix)) return;
      if (!raw.includes(FALLBACK_SUFFIX)) return;
      observer.disconnect();
      document.title = raw.replace(FALLBACK_SUFFIX, suffix);
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const observer = new MutationObserver(rewrite);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
