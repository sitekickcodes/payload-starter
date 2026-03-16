# Sitekick Website Starter

The foundation for every Sitekick project. A pre-configured Next.js starter with your choice of CMS, a shared typography system, component library, and deployment config baked in so the team can skip setup and start building.

## Quick Start

```bash
npx @sitekickcodes/create-website my-site
```

Or with bunx:

```bash
bunx @sitekickcodes/create-website my-site
```

The CLI walks you through choosing a CMS, provisioning services (GitHub, database, Vercel), and pushing your first deploy.

## Stack

- **Next.js 16** — App Router, React Server Components, TypeScript
- **Tailwind CSS v4** — Utility-first styling with CSS variables
- **shadcn/ui** — Component library using **Base UI**
- **Bun** — Package manager and runtime
- **Deployed on Vercel**

### CMS Options

| | Payload CMS | Sanity |
|---|---|---|
| **Hosting** | Self-hosted inside your Next.js app | Hosted service (Sanity-managed) |
| **Admin** | `/admin` | `/studio` |
| **Database** | Neon Postgres | Sanity CDN |
| **Media** | Vercel Blob | Sanity Image CDN |
| **Rich text** | Lexical editor | Portable Text |
| **Query language** | Local API (Payload SDK) | GROQ |

Both options produce **identical frontend pages** thanks to the CMS abstraction layer.

## CMS Abstraction Layer

Frontend pages never import from Payload or Sanity directly. They import from `src/lib/cms/`:

```tsx
import { cms } from "@/lib/cms";
import type { BlogPost } from "@/lib/cms";

export default async function BlogPage() {
  const posts = await cms.getBlogPosts();
  return posts.map((post) => <BlogCard key={post.id} post={post} />);
}
```

This works identically whether Payload or Sanity is powering the backend. The adapter pattern is defined in:

| File | Purpose |
|------|---------|
| `src/lib/cms/types.ts` | Shared content interfaces (`BlogPost`, `Page`, `SiteSettings`, etc.) |
| `src/lib/cms/payload.ts` | Payload adapter — implements interfaces using Payload's local API |
| `src/lib/cms/sanity.ts` | Sanity adapter — implements interfaces using GROQ queries |
| `src/lib/cms/index.ts` | Re-exports the active adapter (set during scaffolding) |

## Manual Setup (Without CLI)

```bash
# Clone the repo
git clone https://github.com/sitekickcodes/website-starter.git
cd website-starter

# Install dependencies
bun install

# Pull environment variables from 1Password
bun run env:pull

# Start dev server
bun dev
```

> **No 1Password?** Copy the template instead: `cp .env.example .env.local` and fill in the values by hand.

Open [http://localhost:3000](http://localhost:3000) for the site, and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel (or `/studio` for Sanity).

On first visit to the admin, you'll be prompted to create your first user.

## Connecting Services

### Neon Postgres (Payload only)
1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string into `POSTGRES_URL` in `.env.local`
3. Or add the Neon integration in your Vercel project (auto-sets `POSTGRES_URL`)

### Vercel Blob (Payload only)
1. Add Blob storage in your Vercel project dashboard
2. Copy the token into `BLOB_READ_WRITE_TOKEN` in `.env.local`

### Sanity (Sanity only)
1. Create a Sanity project at [sanity.io](https://www.sanity.io)
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`

### Payload Secret (Payload only)
Generate one with: `openssl rand -base64 32`

## Payload CMS Collections & Globals

### Collections

| Collection | Description |
|------------|-------------|
| **Blog** | Blog posts with rich text, featured images, drafts, and SEO |
| **Pages** | Static pages with title, slug, rich text, and SEO meta |
| **Media** | Image/PDF uploads with thumbnail, card, and desktop sizes |
| **Redirects** | URL redirect rules |
| **Form Submissions** | Contact form entries |
| **Users** | Auth-enabled. Fields: email, name, role (admin/editor) |

### Globals

| Global | Description |
|--------|-------------|
| **General** | Site name, business name, contact info |
| **Analytics** | Google Analytics ID |
| **Social Links** | Social media profile URLs |

### Adding Collections

Create a new file in `src/collections/` and add it to the `collections` array in `src/payload.config.ts`.

After changing collections, regenerate types:

```bash
bun run generate:types
```

## Fonts

| Token | Font | Usage |
|-------|------|-------|
| `font-sans` | Geist Sans | Body text, UI elements |
| `font-mono` | Geist Mono | Code, technical content |
| `font-display` | Instrument Serif | Headings, quotes, display text |

## Typography Classes

Pre-built utility classes in `globals.css` that set font-family, size, line-height, weight, and tracking in one class. All sizes are 12px minimum for accessibility.

### Headings (Instrument Serif)

| Class | Size |
|-------|------|
| `.h1` | 4rem (64px) |
| `.h2` | 3rem (48px) |
| `.h3` | 2.25rem (36px) |
| `.h4` | 1.75rem (28px) |
| `.h5` | 1.375rem (22px) |
| `.h6` | 1.125rem (18px) |

### Body (Geist Sans)

| Class | Size |
|-------|------|
| `.body-lg` | 1.125rem (18px) |
| `.body-md` | 1rem (16px) |
| `.body-sm` | 0.875rem (14px) |

### UI Text

| Class | Size | Notes |
|-------|------|-------|
| `.text-lead` | 1.25rem (20px) | Intro paragraphs, hero subtext |
| `.text-button` | 0.875rem (14px) | Medium weight, slight tracking |
| `.text-eyebrow` | 0.75rem (12px) | Uppercase, wide tracking |
| `.text-caption` | 0.75rem (12px) | Metadata, timestamps |
| `.text-overline` | 0.75rem (12px) | Uppercase, widest tracking |
| `.text-quote` | 1.25rem (20px) | Instrument Serif italic |

### Usage

```tsx
<p className="text-eyebrow">Case Study</p>
<h2 className="h2">Building the Future of Web</h2>
<p className="text-lead">A deep dive into modern web architecture.</p>
<p className="body-md">The rest of the content goes here...</p>
```

## Adding Components

shadcn/ui is configured with Base UI. Add components with:

```bash
bunx shadcn@latest add button dialog dropdown-menu
```

Components are installed to `src/components/ui/` and automatically use Base UI primitives.

## Project Structure

```
src/
  app/
    (frontend)/
      globals.css       # Theme, colors, typography classes
      layout.tsx        # Root layout, font loading
      page.tsx          # Home page
    (payload)/          # Payload admin & API routes (auto-generated)
    studio/             # Sanity Studio route (Sanity only)
  collections/          # Payload CMS collection configs
  globals/              # Payload CMS global configs
  sanity/               # Sanity schemas, client, queries (Sanity only)
  components/
    payload/            # Payload admin customizations
    ui/                 # shadcn/ui components
  lib/
    cms/                # CMS abstraction layer
      types.ts          # Shared content interfaces
      payload.ts        # Payload adapter
      sanity.ts         # Sanity adapter
      index.ts          # Active adapter re-export
    utils.ts            # cn() class merge utility
  hooks/                # Custom React hooks
  payload.config.ts     # Payload CMS configuration
  payload-types.ts      # Auto-generated Payload types
```

## Deploying to Vercel

1. Push to GitHub
2. Import project in Vercel
3. For Payload: Add integrations — **Neon Postgres** + **Blob Storage**, set `PAYLOAD_SECRET`
4. For Sanity: Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
5. Set build command to `bun run ci`
6. Deploy

The `ci` script runs database migrations before building (Payload only).

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run payload` | Run Payload CLI commands |
| `bun run generate:types` | Regenerate Payload TypeScript types |
| `bun run generate:importmap` | Regenerate admin import map |
| `bun run ci` | Run migrations + build (Vercel build command) |

## CLI Tool

The CLI tool is published separately as `@sitekickcodes/create-website`. See [create-website/README.md](create-website/README.md) for full documentation.

## License

MIT
