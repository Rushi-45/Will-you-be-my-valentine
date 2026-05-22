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
| `/sign-in/[[...sign-in]]` | Live | Clerk `<SignIn />` page (also opens as a modal from the Header) |
| `/sign-up/[[...sign-up]]` | Live | Clerk `<SignUp />` page |
| `/dashboard` | Live | Protected — redirects to `/sign-in` when signed out. Placeholder for saved-cards / activity (DB layer pending) |

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

## Authentication

Auth is via [Clerk](https://clerk.com) (`@clerk/nextjs` v7). Email + password only; social/magic-link disabled in the Clerk dashboard.

- **Provider**: `<ClerkProvider afterSignOutUrl="/">` wraps `<html>` in `app/layout.tsx`. Sits above the inline theme bootstrap script (still runs pre-hydration).
- **Middleware**: `middleware.ts` at the project root. `clerkMiddleware` + `createRouteMatcher(["/dashboard(.*)"])` — only `/dashboard` is protected; everything else is public.
- **Sign-in / sign-up**: `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`. Catch-all segments let Clerk handle verification / factor sub-routes.
- **Header integration**: `components/Header.tsx` uses `useUser()` to conditionally render `<SignInButton mode="modal">` when signed out, `<UserButton />` when signed in.
- **Dashboard**: `app/dashboard/page.tsx` is a server component using `auth()` and `currentUser()` from `@clerk/nextjs/server`. Redirects to `/sign-in` if `userId` is null (the middleware also enforces this).

**Note on Clerk v7:** `SignedIn` / `SignedOut` control components and `afterSignOutUrl` on `<UserButton>` were removed. Use `useUser()` from a client component, or the server-side `<Show when="signed-in">`. Configure `afterSignOutUrl` on `<ClerkProvider>` (or via the env var `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL`).

## Database (Drizzle + Neon Postgres)

- **Connection**: `lib/db/index.ts` exports a `db` client built on `@neondatabase/serverless` + `drizzle-orm/neon-http`. Edge-compatible.
- **Schema**: `lib/db/schema.ts`. Single `users` table for now (id = Clerk user_id as primary key, email unique, firstName/lastName/imageUrl/timestamps).
- **User sync**: `lib/db/users.ts` exports `getOrCreateUser()` — lazy sync helper. Called from server components (`app/dashboard/page.tsx`). On first auth'd request, fetches the Clerk user via `currentUser()` and inserts a row. No webhook needed at this stage.
- **Migrations**: `drizzle.config.ts` at the project root. `drizzle-kit` reads `.env.local` (via `dotenv` in the config). Generated SQL lands in `drizzle/`.
- **Scripts**: `npm run db:push` (dev-style direct push), `db:generate` / `db:migrate` (proper migration flow), `db:studio` (web UI).
- **Webhook sync** (`app/api/webhooks/clerk/route.ts`): handles `user.created`, `user.updated`, `user.deleted` from Clerk. Uses `verifyWebhook` (Svix-backed) with `CLERK_WEBHOOK_SIGNING_SECRET`. Upserts on create/update, cascade-delete on delete. Returns 500 on handler errors so Clerk retries.
- **Lazy sync as fallback** (`getOrCreateUser`): handles the race where a user hits `/dashboard` before the webhook arrives. Webhook is the primary path; lazy-sync is the safety net. Both write to the same `users` row via id (Clerk user_id).

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4
- Framer Motion (animations) · canvas-confetti (celebration) · lucide-react (icons)
- @clerk/nextjs v7 (authentication)
- Drizzle ORM + @neondatabase/serverless (database)
- Vitest + jsdom + Testing Library (Icon primitive)

## Environment variables

| Var | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Verifies incoming Clerk webhooks (`/api/webhooks/clerk`) | Yes (prod) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in path | Optional (default `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up path | Optional (default `/sign-up`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Post-sign-in redirect | Optional (default `/dashboard`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Post-sign-up redirect | Optional (default `/dashboard`) |
| `DATABASE_URL` | Neon Postgres pooled connection string | Yes (for `/dashboard`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | Optional |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical metadata | Optional |

`.env.example` documents all of these. `.env.local` is gitignored (with an `!.env.example` exception so the template stays tracked).
