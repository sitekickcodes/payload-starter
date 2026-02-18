"use client";

import { useEffect, type ReactNode } from "react";

const FALLBACK_SUFFIX = "— Admin";

export default function AdminTitleProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    let observer: MutationObserver | null = null;

    fetch("/api/globals/general?depth=0")
      .then((res) => res.json())
      .then((data) => {
        const name = data?.contact?.businessName;
        if (!name) return;

        const suffix = `— ${name} Admin`;

        function rewrite() {
          const raw = document.title;
          if (raw.includes(suffix)) return;
          document.title = raw.replace(FALLBACK_SUFFIX, suffix);
        }

        rewrite();

        observer = new MutationObserver(rewrite);
        const el = document.querySelector("title");
        if (el)
          observer.observe(el, {
            childList: true,
            characterData: true,
            subtree: true,
          });
      });

    return () => observer?.disconnect();
  }, []);

  return <>{children}</>;
}
