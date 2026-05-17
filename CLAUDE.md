# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wishing Cards — Multi-Occasion Wishing Platform.** Started as a Valentine's Day landing page; now ships an occasion selector at `/` with one fully-implemented occasion (Valentine's) and six "Coming soon" stubs ready to be built out.

### Implementation status

| Route | Status | Notes |
|---|---|---|
| `/` | Live | Landing grid driven by `config/occasions.ts` |
| `/valentines` | Live | Full card experience |
| `/birthday`, `/anniversary`, `/graduation`, `/thank-you`, `/get-well`, `/congratulations` | Stub | `ComingSoon` component, occasion-themed hero |
| `/preview` | Dev only | Icon-primitive demo; returns 404 in production (`process.env.NODE_ENV === "production"`) |

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production build
npm run lint     # ESLint
npm test         # Vitest (Icon primitive only today)
```

## Architecture

### Config-driven

Two layers of config:

- **`config/occasions.ts`** — landing-page tile list. Single source of truth for occasion metadata (name, slug, icon, gradients, `implemented` flag). Read by `app/page.tsx` (the landing) and by each stub page (`app/{slug}/page.tsx`) via `getOccasion(slug)`.
- **`config/{occasion}.ts`** — per-occasion content. Today only `config/valentine.ts` exists. New occasions follow the same shape.

URL parameters for personalization (Valentine card today; pattern carries to future occasions):
- `?name=Jane` — recipient name (headline + success + metadata)
- `?sender=Rushi` — overrides sender name

### Components

```
app/
  layout.tsx              Root layout, fonts (Geist), metadata, theme bootstrap (inline script)
  page.tsx                Landing grid (reads config/occasions.ts)
  globals.css             Tailwind 4 + theme tokens (`:root` and `.dark`)
  valentines/page.tsx     Valentine route — Suspense + ValentinePage
  {occasion}/page.tsx     Stub routes (birthday, anniversary, etc.) — ComingSoon
  preview/page.tsx        Icon demo (dev only)

components/
  ValentinePage.tsx       Valentine card client component — all state + interactions
  ComingSoon.tsx          Stub-page UI (uses Occasion from config/occasions.ts)
  Header.tsx              Fixed nav + ThemeToggle. Mounted on every card route + landing
  Avatar.tsx              Initials avatar (hash → colour). Used in success signature
  FloatingHearts.tsx      Background animated hearts
  CelebrationOverlay.tsx  Full-screen "YAY!" overlay shown on "Yes"
  ui/Icon/                Icon primitive (button-like span with ARIA + keyboard). 22 tests

config/
  occasions.ts            Occasion metadata + getOccasion() helper
  valentine.ts            Valentine content + replaceSenderName() helper

hooks/
  useTheme.ts             Light/dark state, syncs with html.classList (set by layout bootstrap)
```

### Theming

Light/dark mode is fully wired:

1. **Inline bootstrap** in `app/layout.tsx` reads `localStorage["valentine-theme"]` + falls back to `prefers-color-scheme`, sets `html.classList` *before* hydration. Prevents flash.
2. **`useTheme` hook** (`hooks/useTheme.ts`) reads `documentElement.classList` first (set by bootstrap), then localStorage, then media query. Writes back to both on toggle.
3. **`Header`** (`components/Header.tsx`) renders the toggle button. Mounted on `/`, `/valentines`, and all stub pages.
4. **Tokens** live in `globals.css` under `:root` (light) and `.dark` (dark). Single source of truth — no `prefers-color-scheme` media query block.
5. **Components** use Tailwind `dark:` utilities for surfaces. `ValentinePage`, `ComingSoon`, `CelebrationOverlay`, `FloatingHearts`, and the landing grid all support both modes.

### Route pattern

- **Route file**: `app/{slug}/page.tsx`. Server component. Defines `metadata` (or `generateMetadata` for dynamic personalization).
- **Stub**: Renders `<ComingSoon occasion={getOccasion("{slug}")} />`.
- **Real implementation**: Imports a client component (e.g. `ValentinePage`) wrapped in `<Suspense>` if it uses `useSearchParams`.

### Adding a real occasion

1. Create `config/{slug}.ts` with the same shape as `config/valentine.ts`.
2. Replace `app/{slug}/page.tsx` body to render a real card client component.
3. Set `implemented: true` for that slug in `config/occasions.ts`.

For multiple occasions, consider factoring the shared card logic out of `ValentinePage.tsx` into a generic `OccasionPage` that takes a config prop.

### Key patterns

- **Client components**: `ValentinePage`, `Header`, `FloatingHearts`, `CelebrationOverlay`, Icon — use `"use client"` and framer-motion.
- **Server components**: All `app/*/page.tsx` files (the valentines page wraps a client component in Suspense).
- **Asset paths**: Images/audio in `public/`, referenced with a leading slash.
- **Animation constants**: `MOTION` in `ValentinePage.tsx` centralizes timing/easing.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4
- Framer Motion (animations) · canvas-confetti (celebration) · lucide-react (icons)
- Vitest + jsdom + Testing Library (Icon primitive)

No environment variables required.
