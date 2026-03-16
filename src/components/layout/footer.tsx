import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faGoogle,
  faTiktok,
  faXTwitter,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { TrackedLink } from "@/components/tracking/tracked-link";
import { cms } from "@/lib/cms";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Map CMS social link keys to their display label and icon */
const SOCIAL_ICON_MAP: Record<string, { label: string; icon: IconDefinition }> = {
  instagram: { label: "Instagram", icon: faInstagram },
  facebook: { label: "Facebook", icon: faFacebookF },
  tiktok: { label: "TikTok", icon: faTiktok },
  google: { label: "Google", icon: faGoogle },
  x: { label: "X", icon: faXTwitter },
  linkedin: { label: "LinkedIn", icon: faLinkedinIn },
  youtube: { label: "YouTube", icon: faYoutube },
};

export async function Footer() {
  const [socialLinks, settings] = await Promise.all([
    cms.getSocialLinks(),
    cms.getSiteSettings(),
  ]);
  const contact = settings.contact;

  const socialEntries = Object.entries(socialLinks)
    .filter(([, url]) => !!url)
    .map(([key, url]) => ({
      key,
      href: url as string,
      ...(SOCIAL_ICON_MAP[key] || { label: key, icon: faGoogle }),
    }));

  return (
    <footer className="overflow-hidden border-t border-border bg-secondary/40">
      <div className="container py-10 md:py-12">
        {/* Newsletter */}
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="h6">Stay in the loop</h4>
            <p className="body-sm mt-1 text-muted-foreground">
              Get updates and news straight to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-x-12 lg:gap-x-16">
          {/* Brand — constrained width */}
          <div className="max-w-md space-y-4">
            <Link href="/" className="text-lg font-semibold">
              {settings.siteName}
            </Link>
            {settings.siteDescription && (
              <p className="body-sm text-muted-foreground">
                {settings.siteDescription}
              </p>
            )}
          </div>

          {/* Link columns: Pages, Social */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-12 lg:gap-x-16">
            {/* Pages */}
            <div className="space-y-4">
              <h4 className="h6">Explore</h4>
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social — only show if there are links */}
            {socialEntries.length > 0 && (
              <div className="space-y-4">
                <h4 className="h6">Social</h4>
                <ul className="space-y-2">
                  {socialEntries.map(({ key, href, label, icon }) => (
                    <li key={key}>
                      <TrackedLink
                        href={href}
                        event="social_link_click"
                        properties={{ platform: label }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="body-sm flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <FontAwesomeIcon icon={icon} className="size-4 shrink-0" aria-hidden />
                        {label}
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact info — spans both columns */}
            {(contact?.street || contact?.phone || contact?.email) && (
              <div className="col-span-2 space-y-4 border-t border-border pt-6">
                <h4 className="h6">Contact</h4>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
                  {contact?.street && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <TrackedLink
                        href={socialLinks?.google || `https://maps.google.com/?q=${encodeURIComponent(`${contact.street}, ${contact.city}, ${contact.state} ${contact.zip}`)}`}
                        event="address_click"
                        properties={{ page: "footer" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.street}, {contact.city}, {contact.state} {contact.zip}
                      </TrackedLink>
                    </div>
                  )}
                  {contact?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 shrink-0 text-muted-foreground" />
                      <TrackedLink
                        href={`tel:${contact.phone.replace(/\D/g, "")}`}
                        event="phone_click"
                        properties={{ page: "footer" }}
                        className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.phone}
                      </TrackedLink>
                    </div>
                  )}
                  {contact?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 shrink-0 text-muted-foreground" />
                      <TrackedLink
                        href={`mailto:${contact.email}`}
                        event="email_click"
                        properties={{ page: "footer" }}
                        className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.email}
                      </TrackedLink>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-8">
          <p className="type-caption text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </p>
          <a
            href="https://sitekick.co"
            target="_blank"
            rel="noopener noreferrer"
            className="type-caption text-muted-foreground transition-colors hover:text-foreground"
          >
            Website by Sitekick
          </a>
        </div>
      </div>
    </footer>
  );
}
