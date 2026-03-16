import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { cms } from "@/lib/cms";

export async function Header() {
  const settings = await cms.getSiteSettings();

  return (
    <header className="relative z-40">
      <div className="border-b border-border">
        <nav className="container relative flex h-16 items-center justify-between">
          {/* Site name — left */}
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label={`${settings.siteName} – Home`}
          >
            <span className="text-lg font-semibold">{settings.siteName}</span>
          </Link>

          {/* Nav — centered on container */}
          <div className="absolute inset-y-0 left-1/2 flex w-full -translate-x-1/2 items-stretch justify-center pointer-events-none">
            <div className="pointer-events-auto flex h-full items-stretch">
              <NavLinks />
            </div>
          </div>

          {/* CTA — right (desktop) + hamburger (mobile) */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="default"
              size="default"
              className="hidden sm:inline-flex shrink-0 rounded-full px-5"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Get in Touch
            </Button>
            <MobileNav />
          </div>
        </nav>
      </div>
    </header>
  );
}
