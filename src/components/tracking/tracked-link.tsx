"use client";

import { track } from "@vercel/analytics";

interface TrackedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

export function TrackedLink({
  event,
  properties,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, properties);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
