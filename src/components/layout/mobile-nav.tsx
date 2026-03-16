"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const measured = useRef(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Measure header height once and on resize
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.offsetHeight);
    };
    measure();
    measured.current = true;
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Lock body scroll when menu is open, compensate for scrollbar width
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      {/* Hamburger button — two thin lines → X */}
      <button
        type="button"
        className="relative z-50 flex size-11 cursor-pointer items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative h-2 w-6">
          <span
            className={cn(
              "absolute left-0 block h-px w-6 bg-foreground transition-all duration-300 ease-out",
              isOpen ? "top-1/2 -translate-y-px rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 block h-px w-6 bg-foreground transition-all duration-300 ease-out",
              isOpen ? "top-1/2 -translate-y-px -rotate-45" : "bottom-0",
            )}
          />
        </div>
      </button>

      {/* Menu panel — sits below the header, fills the rest of the viewport */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex flex-col bg-background transition-all duration-500 ease-out",
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-4",
        )}
        style={{ top: headerHeight }}
      >
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-4 pt-10">
          <ul className="flex flex-col gap-1" role="list">
            {navItems.map((item, index) => {
              const active = isActive(item.href);

              return (
                <li
                  key={item.label}
                  style={{
                    transitionDelay: isOpen
                      ? `${(index + 1) * 80}ms`
                      : "0ms",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(16px)",
                  }}
                  className="transition-all duration-500"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3 font-display text-2xl transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
