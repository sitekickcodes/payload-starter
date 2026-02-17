# Sitekick Starter

The foundation for every Sitekick project. A pre-configured Next.js starter with Payload CMS, our typography system, component library, and deployment config baked in so the team can skip setup and start building.

## Stack

- **Next.js 16** — App Router, React Server Components, TypeScript
- **Payload CMS 3** — Headless CMS with admin panel at `/admin`
- **Neon Postgres** — Serverless database via `@payloadcms/db-vercel-postgres`
- **Vercel Blob** — File/image storage via `@payloadcms/storage-vercel-blob`
- **Tailwind CSS v4** — Utility-first styling with CSS variables
- **shadcn/ui** — Component library using **Base UI** (not Radix)
- **Bun** — Package manager and runtime
- **Deployed on Vercel**

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sitekickcodes/sitekick-starter.git
cd sitekick-starter

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Fill in PAYLOAD_SECRET, POSTGRES_URL, BLOB_READ_WRITE_TOKEN

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel.

On first visit to `/admin`, you'll be prompted to create your first admin user.

## Connecting Services

### Neon Postgres
1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string into `POSTGRES_URL` in `.env.local`
3. Or add the Neon integration in your Vercel project (auto-sets `POSTGRES_URL`)

### Vercel Blob
1. Add Blob storage in your Vercel project dashboard
2. Copy the token into `BLOB_READ_WRITE_TOKEN` in `.env.local`
3. Or it's auto-set when you add Blob via the Vercel dashboard

### Payload Secret
Generate one with: `openssl rand -base64 32`

## Payload CMS

### Collections

| Collection | Description |
|------------|-------------|
| **Users** | Auth-enabled. Fields: email, name, role (admin/editor) |
| **Media** | Image/PDF uploads with thumbnail, card, and desktop sizes |
| **Pages** | Title, slug, rich text content, SEO meta group. Drafts with autosave |

### Adding Collections

Create a new file in `src/collections/` and add it to the `collections` array in `src/payload.config.ts`.

### Generating Types

After changing collections, regenerate the TypeScript types:

```bash
bun run generate:types
```

This updates `src/payload-types.ts` with types matching your collections.

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
    (payload)/
      layout.tsx        # Payload admin layout (isolated)
      admin/            # Admin panel routes
      api/              # REST + GraphQL API routes
  collections/
    Users.ts            # Auth-enabled user collection
    Media.ts            # Image/PDF uploads
    Pages.ts            # CMS pages with SEO meta
  components/
    ui/                 # shadcn/ui components (add as needed)
  lib/
    utils.ts            # cn() class merge utility
  payload.config.ts     # Payload CMS configuration
  payload-types.ts      # Auto-generated types
```

## Deploying to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add integrations: **Neon Postgres** + **Blob Storage**
4. Set `PAYLOAD_SECRET` in environment variables
5. Set build command to `bun run ci`
6. Deploy

The `ci` script runs database migrations before building.

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
