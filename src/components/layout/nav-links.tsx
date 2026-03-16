"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const linkStyle = "px-4 py-2 text-sm font-semibold transition-colors";

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="hidden h-full md:flex" aria-label="Main navigation">
      <ul className="flex h-full items-center" role="list">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.label} className="relative flex h-full items-center">
              <Link
                href={item.href}
                className={cn(
                  linkStyle,
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" aria-hidden />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
