# Sitekick Project Rules

## Stack

- Next.js 16 (App Router, React Server Components, TypeScript)
- Payload CMS 3 (headless CMS at /admin)
- Neon Postgres via @payloadcms/db-vercel-postgres
- Vercel Blob for file/image storage
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

- `src/app/(frontend)/` — site pages and layouts
- `src/app/(payload)/` — Payload admin and API routes (auto-generated, do not modify)
- `src/collections/` — Payload CMS collection configs
- `src/components/ui/` — shadcn/ui components
- `src/lib/` — shared utilities
- `src/hooks/` — custom React hooks
- `public/images/`, `public/icons/`, `public/videos/`, `public/fonts/`, `public/og/` — static assets

## Coding Conventions

- Use TypeScript strict mode for all files
- Use functional components with arrow functions
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer server components by default; only add "use client" when needed
- Use `@/` import alias for all project imports
- Keep components small and composable

## Styling

- Use Tailwind utility classes for styling
- Use the pre-built typography classes from globals.css: `.h1`-`.h6`, `.body-lg`, `.body-md`, `.body-sm`, `.text-lead`, `.text-button`, `.text-eyebrow`, `.text-caption`, `.text-overline`, `.text-quote`
- All font sizes must be 12px (0.75rem) minimum for accessibility
- Three font families are registered as CSS variables: `--font-display` (headings, quotes), `--font-sans` (body, UI), `--font-mono` (code) — see `globals.css` and `layout.tsx` for the actual typefaces

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
- After changing collections, run `bun run generate:types` to update `src/payload-types.ts`
- Use `payload.db.drizzle` for custom database queries outside Payload collections
- Media uploads go to Vercel Blob automatically — do not store uploads locally
- The (payload) route group files are auto-generated — do not edit them manually

## Environment Variables

- Never commit secrets to git
- All env vars are documented in `.env.example` with 1Password `op://` references
- `NEXT_PUBLIC_` prefixed vars are exposed to the browser — only use for non-sensitive values
- Google Analytics is disabled when `NEXT_PUBLIC_GA_ID` is empty

## Git

- Do not commit `.env.local` or any `.env` files (except `.env.example`)
- Do not commit `node_modules/`, `.next/`, or `src/app/(payload)/admin/importMap.js`
- Use descriptive commit messages
