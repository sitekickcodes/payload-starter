# Sitekick Starter

The foundation for every Sitekick project. A pre-configured Next.js starter with our typography system, component library, and tooling baked in so the team can skip setup and start building.

## Stack

- **Next.js 16** — App Router, React Server Components, TypeScript
- **Tailwind CSS v4** — Utility-first styling with CSS variables
- **shadcn/ui** — Component library using **Base UI** (not Radix)
- **Bun** — Package manager and runtime

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

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sitekickcodes/sitekick-starter.git
cd sitekick-starter

# Install dependencies
bun install

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

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
    globals.css       # Theme, colors, typography classes
    layout.tsx        # Root layout, font loading
    page.tsx          # Home page
  components/
    ui/               # shadcn/ui components (add as needed)
  lib/
    utils.ts          # cn() class merge utility
  hooks/              # Custom hooks
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
