# Sitekick Project Rules

## Stack

- Next.js 16 (App Router, React Server Components, TypeScript)
- Payload CMS 3 (headless CMS at /admin) OR Sanity (hosted CMS at /studio)
- Neon Postgres via @payloadcms/db-vercel-postgres (Payload only)
- Vercel Blob for file/image storage (Payload only)
- Sanity CDN for content and media (Sanity only)
- Tailwind CSS v4 with CSS variables
- shadcn/ui with Base UI
- Bun as package manager (not npm/yarn/pnpm)
- Deployed on Vercel
- 1Password CLI for env var management

## Commands

- Use `bun` for all package operations: `bun add`, `bun install`, `bun run`
- Use `bunx` instead of `npx` for one-off commands
- Add shadcn components with: `bunx shadcn@latest add <component>`
- Pull env vars with: `bun run env:pull`

## Project Structure

- `src/app/(frontend)/` — site pages and layouts (CMS-agnostic)
- `src/app/(payload)/` — Payload admin and API routes (auto-generated, do not modify)
- `src/app/studio/` — Sanity Studio route (Sanity only)
- `src/collections/` — Payload CMS collection configs
- `src/globals/` — Payload CMS global configs (General, Analytics, Social Links)
- `src/sanity/` — Sanity schemas, client, queries (Sanity only)
- `src/lib/cms/` — CMS abstraction layer (types, adapters, index)
- `src/components/payload/` — Payload admin panel customizations
- `src/components/ui/` — shadcn/ui components
- `src/lib/` — shared utilities
- `src/hooks/` — custom React hooks
- `public/images/`, `public/icons/`, `public/videos/`, `public/fonts/`, `public/og/` — static assets
- `create-website/` — CLI scaffolding tool (published separately as @sitekickcodes/create-website)

## CMS Abstraction Layer

- Frontend pages import from `@/lib/cms` — never directly from Payload or Sanity
- `src/lib/cms/types.ts` defines shared interfaces: `BlogPost`, `Page`, `CMSImage`, `SiteSettings`, `AnalyticsSettings`, `SocialLinks`
- `src/lib/cms/payload.ts` implements the adapter using Payload's local API
- `src/lib/cms/sanity.ts` implements the adapter using GROQ queries
- `src/lib/cms/index.ts` re-exports the active adapter (set during scaffolding)
- The `CMSAdapter` interface in types.ts is the contract both adapters fulfill
- When adding new content types, update types.ts first, then implement in both adapters

## Coding Conventions

- Use TypeScript strict mode for all files
- Use functional components with arrow functions
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer server components by default; only add "use client" when needed
- Use `@/` import alias for all project imports
- Keep components small and composable

## Styling

- Use Tailwind utility classes for styling
- Always use Tailwind's default scale for spacing, sizing, max-width, breakpoints, and all other measurements — do not use arbitrary values (`w-[347px]`) when a Tailwind token exists
- Use the pre-built typography classes from globals.css: `.h1`-`.h6`, `.body-lg`, `.body-md`, `.body-sm`, `.text-lead`, `.text-button`, `.text-eyebrow`, `.text-caption`, `.text-overline`, `.text-quote`
- All font sizes must be 12px (0.75rem) minimum for accessibility
- Three font families are registered as CSS variables: `--font-display` (headings, quotes), `--font-sans` (body, UI), `--font-mono` (code) — see `globals.css` and `layout.tsx` for the actual typefaces
- Breakpoints follow Tailwind defaults: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px) — design mobile-first

## Figma MCP / Design Implementation

- When translating Figma designs, always check for an existing component or utility class before creating anything new
- Map Figma text styles to the typography classes in globals.css first (`.h1`-`.h6`, `.body-*`, `.text-*`)
- Map Figma colors, spacing, and other tokens to existing Tailwind theme values before adding custom ones
- If a design element matches a common UI pattern (accordion, dialog, tabs, tooltip, etc.), check if a shadcn/ui component already exists in `src/components/ui/`
- If no local component exists but shadcn has one, install it first (`bunx shadcn@latest add <component>`), then customize — do not build from scratch
- If no shadcn component fits, ask before creating a new component
- Keep customizations in the component file itself; avoid one-off global styles

## Payload CMS

- Collections live in `src/collections/` and are registered in `src/payload.config.ts`
- Globals live in `src/globals/` and are registered in `src/payload.config.ts`
- After changing collections/globals, run `bun run generate:types` to update `src/payload-types.ts`
- Use `payload.db.drizzle` for custom database queries outside Payload collections
- Media uploads go to Vercel Blob automatically — do not store uploads locally
- The (payload) route group files are auto-generated — do not edit them manually
- Admin title dynamically shows the business name from the General global


### Schema Changes

When changing field names, adding/removing fields, or modifying collection/global schemas that affect the database:

1. Make the schema change in the code (collection/global config)
2. Run \`bunx payload migrate:create\` to generate a migration file in \`src/migrations/\`
3. Commit the migration file alongside the schema change
4. Push — the build script runs \`payload migrate --disable-transpile && next build\` which applies pending migrations before the build starts

This is Payload's recommended workflow. The migration runs automatically on every deploy.

**NEVER** run \`bun dev\` against the production database — it writes a \`batch = -1\` marker to \`payload_migrations\` that triggers an interactive prompt on the next build, blocking deployment. Always use a local database for development.

Note: Migration files must use \`import { sql } from 'drizzle-orm'\` (not from \`@payloadcms/db-vercel-postgres\`) to avoid ESM re-export issues on Vercel.

### Media Uploads

- `clientUploads: true` — files upload directly from browser to Vercel Blob (no size limit)
- `addRandomSuffix: false` — required to avoid Payload CDN race condition bug (#14709)
- `afterError` hook auto-cleans orphan blobs when an upload fails
- `afterChange` hook auto-generates alt text via Claude (fire-and-forget, uses thumbnail)
- `scripts/clean-orphan-blobs.mjs` — manual bulk orphan cleanup (dry run by default, `--delete` to execute)
- `/api/cron/clean-blobs` — API endpoint for manual orphan cleanup
- `/api/cron/backfill-alt-text` — regenerate alt text for all images (`?all=true` to overwrite existing)

## Sanity CMS

- Schemas live in `src/sanity/schemas/` and are registered in `src/sanity/config.ts`
- Client config is in `src/sanity/client.ts`, GROQ queries in `src/sanity/queries.ts`
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- Sanity Studio is embedded at `/studio` via `src/app/studio/[[...tool]]/page.tsx`

## Performance

- On-demand revalidation via Payload `afterChange` hooks — no time-based ISR
- Collections and globals use `revalidatePath()` (dynamic import from `next/cache`) to purge pages when content changes in the admin panel

## Environment Variables

- Never commit secrets to git
- All env vars are documented in `.env.example` with 1Password `op://` references
- `NEXT_PUBLIC_` prefixed vars are exposed to the browser — only use for non-sensitive values
- Google Analytics is disabled when `NEXT_PUBLIC_GA_ID` is empty

## Git

- Do not commit `.env.local` or any `.env` files (except `.env.example`)
- Do not commit `node_modules/` or `.next/`
- Use descriptive commit messages