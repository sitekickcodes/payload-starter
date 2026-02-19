# create-sitekick

Scaffold a production-ready Next.js site with your choice of CMS in one command. Built by [Sitekick](https://github.com/sitekickcodes).

## Quick Start

```bash
bun create sitekick my-site
```

Or with npx:

```bash
npx create-sitekick my-site
```

## What You Get

A fully configured Next.js 16 project with:

- **App Router** with React Server Components and TypeScript
- **Tailwind CSS v4** with a complete design system (typography classes, CSS variables, responsive breakpoints)
- **shadcn/ui** components ready to use
- **CMS abstraction layer** — your frontend code is identical regardless of which CMS you choose
- **Vercel-optimized** deployment with Blob storage, Postgres, and edge caching

## CMS Options

### Payload CMS

Self-hosted, open-source CMS that runs inside your Next.js app at `/admin`.

- Integrated admin panel — no separate service to manage
- Neon Postgres database
- Vercel Blob for media storage
- Rich text editing with Lexical editor
- AI-generated alt text for images (OpenAI)
- Draft/publish workflow with version history
- Import/export content between environments

### Sanity

Hosted CMS with Sanity Studio embedded at `/studio`.

- Sanity-managed infrastructure — no database to provision
- Image CDN with on-the-fly transformations
- GROQ query language for precise data fetching
- Real-time collaboration
- Portable Text for rich content

## Interactive Setup

The CLI walks you through setting up everything you need:

```
$ bun create sitekick my-site

┌  create-sitekick
│
◆  What is your project name?
│  my-site
│
◆  Which CMS do you want to use?
│  ● Payload CMS
│  ○ Sanity
│
◇  Cloned template
◇  Configured for Payload CMS
◇  Dependencies installed
◇  Git initialized
│
◆  GitHub
│  ● Create a new repo
│  ○ Use an existing repo
│  ○ Skip
◇  GitHub repo created: my-site
│
◆  Neon Database
│  ● Create a new database
│  ○ Use an existing database
│  ○ Skip
◇  Neon database created: my-site
◇  Generated PAYLOAD_SECRET
│
◆  Vercel
│  ● Create a new Vercel project
│  ○ Link to an existing project
│  ○ Skip
◇  Vercel project created: my-site
◇  Vercel connected to GitHub — pushes will auto-deploy
│
◆  OpenAI (optional)
│  ○ Enter API key now
│  ● Skip — set up later
│
◇  Environment files written
◇  Pushed 3 env var(s) to Vercel
◇  Pushed to GitHub — Vercel will auto-deploy
│
└  Done! Your Sitekick project is ready at ./my-site
```

## What Gets Provisioned

The CLI handles authentication and resource creation for each service:

| Service | What it does |
|---------|-------------|
| **GitHub** (`gh`) | Creates a repo, pushes initial commit, connects to Vercel for auto-deploy |
| **Neon** (`neonctl`) | Provisions a Postgres database, returns the connection string |
| **Vercel** (`vercel`) | Creates a project, links to GitHub, pushes env vars |
| **Sanity** (`sanity`) | Creates a Sanity project and production dataset |
| **OpenAI** | Stores your API key for AI-powered alt text generation |

Each step checks if the CLI tool is installed (and offers to install it), verifies authentication (and prompts login if needed), and asks whether to create a new resource or link an existing one.

## Project Structure

```
my-site/
├── src/
│   ├── app/
│   │   └── (frontend)/        # Pages, layouts, error boundaries
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── cms/               # CMS abstraction layer
│   │   │   ├── types.ts       # Shared content interfaces
│   │   │   ├── payload.ts     # Payload adapter (or sanity.ts)
│   │   │   └── index.ts       # Active adapter re-export
│   │   └── utils.ts           # Shared utilities
│   └── hooks/                 # Custom React hooks
├── .env.local                 # Environment variables (auto-generated)
├── .env.example               # Template for team members
└── package.json
```

### CMS-specific files (included based on your choice)

**Payload:**
```
├── src/collections/           # Blog, Pages, Media, Users, etc.
├── src/globals/               # Site Settings, Analytics, Social Links
├── src/components/payload/    # Admin panel customizations
└── src/payload.config.ts      # Payload configuration
```

**Sanity:**
```
├── src/sanity/schemas/        # Blog, Page, Site Settings, etc.
├── src/sanity/client.ts       # Sanity client configuration
├── src/sanity/queries.ts      # GROQ queries
└── src/app/studio/            # Embedded Sanity Studio
```

## The CMS Abstraction Layer

Frontend pages never import from Payload or Sanity directly. They import from `@/lib/cms`:

```tsx
import { cms } from "@/lib/cms";
import type { BlogPost } from "@/lib/cms";

export default async function BlogPage() {
  const posts = await cms.getBlogPosts();
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

This works identically whether Payload or Sanity is powering the backend.

## Prerequisites

- [Bun](https://bun.sh) (package manager)
- [Node.js](https://nodejs.org) 22.x or later

Optional (the CLI will prompt to install these):
- [GitHub CLI](https://cli.github.com) (`gh`)
- [Vercel CLI](https://vercel.com/cli) (`vercel`)
- [Neon CLI](https://neon.tech/docs/reference/neon-cli) (`neonctl`) — for Payload
- [Sanity CLI](https://www.sanity.io/docs/cli) (`sanity`) — for Sanity

## Updating

To publish a new version after making changes to the starter:

```bash
cd create-sitekick
bun run build
# bump version in package.json
npm publish
```

## License

MIT
