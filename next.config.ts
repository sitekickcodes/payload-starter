import { withBotId } from "botid/next/config";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

// Build the config with Payload's wrapper
const config = withPayload(nextConfig, { devBundleServerPackages: false });

// Payload injects Critical-CH / Accept-CH on every route (/:path*),
// causing an ~800ms first-visit penalty in Chromium. Rescope those
// headers to /admin only where dark mode detection is needed.
const payloadHeaders = config.headers;
config.headers = async () => {
  const all = payloadHeaders ? await payloadHeaders() : [];
  return all.map((entry) => {
    if (
      entry.source === "/:path*" &&
      entry.headers?.some(
        (h: { key: string }) =>
          h.key === "Critical-CH" || h.key === "Accept-CH",
      )
    ) {
      return { ...entry, source: "/admin/:path*" };
    }
    return entry;
  });
};

export default withBotId(config);
