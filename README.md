# Wishing Cards — Multi-Occasion Wishing Platform

A **production-ready, animated wishing-cards platform** built for resale or your own occasions. Pick an occasion at `/`, personalize it, share the link. Currently ships with a fully-featured **Valentine's Day** card; six other occasions (Birthday, Anniversary, Graduation, Thank You, Get Well, Congratulations) ship as "Coming soon" stubs ready for you to extend.

---

## Why this template

- **Config-driven** — Each occasion is defined in `config/occasions.ts`. Per-occasion content lives in its own config file (e.g. `config/valentine.ts`).
- **Polished animations** — Framer Motion entrance + interactions, confetti on "Yes", floating hearts background, runaway "No" button.
- **Built to sell or extend** — Add a new occasion by dropping a route under `app/{slug}/page.tsx` and a config file. Clean structure, MIT license, no attribution required.
- **Dark mode** — Anti-FOUC bootstrap, system-preference fallback, theme persists in `localStorage`.
- **Modern stack** — Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion. Deploys cleanly on Vercel or Netlify.

---

## Routes

| Path | Status | What it does |
|---|---|---|
| `/` | Live | Occasion selector grid |
| `/valentines` | Live | Animated proposal card with runaway "No" |
| `/birthday` | Stub | "Coming soon" placeholder |
| `/anniversary` | Stub | "Coming soon" placeholder |
| `/graduation` | Stub | "Coming soon" placeholder |
| `/thank-you` | Stub | "Coming soon" placeholder |
| `/get-well` | Stub | "Coming soon" placeholder |
| `/congratulations` | Stub | "Coming soon" placeholder |
| `/preview` | Dev only | Icon-primitive showcase (404 in production) |

---

## Features (Valentine card)

| Feature | Description |
|---|---|
| **Animated question card** | Smooth entrance, floating hearts, soft shadows |
| **Yes / No buttons** | No button runs away on hover/touch. Yes button grows with each "No" click; card can expand to fit |
| **Crying cat** | Optional GIF above the promise text when they click "No" |
| **Celebration overlay** | Full-screen overlay with floating cats and confetti when they click "Yes" |
| **Success screen** | Hugging cat GIF, custom headline, message, and signature |
| **Optional background music** | Toggle (off by default). Set an MP3 path in config or `null` to hide |
| **Personalized links** | `?name=Jane` and `?sender=Rushi` |
| **SEO & sharing** | Open Graph, Twitter cards, dynamic metadata for `?name=` links |
| **Responsive & touch-friendly** | 48px tap targets, safe-area insets honoured |

---

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4
- Framer Motion (animations) · canvas-confetti (celebration) · lucide-react (icons)
- Vitest + Testing Library (Icon primitive tests)

---

## Setup

```bash
git clone <your-repo-url>
cd will-you-be-my-valentine
npm install
cp .env.example .env.local         # then fill in your Clerk keys (see Auth below)
npm run dev
```

- `http://localhost:3000` — occasion selector
- `http://localhost:3000/valentines?name=Jane` — personalized Valentine card
- `http://localhost:3000/dashboard` — protected dashboard (sign in to access)

---

## Customization (high level)

All customer-facing content lives in `config/`. See **CUSTOMIZATION.md** for the full field-by-field reference.

- **`config/occasions.ts`** — list of occasions shown on the landing page. Edit to add/remove tiles or change gradients & icons.
- **`config/valentine.ts`** — every string and image path on the Valentine card. Edit for your own copy, recipient defaults, or assets.

Place images and audio in `public/` and reference them with a leading slash (e.g. `/crying_cat.gif`).

### Personalized links

| Parameter | Example | Effect |
|---|---|---|
| `name` | `?name=Jane` | Recipient's name (headline + success + metadata) |
| `sender` | `?sender=Rushi` | Overrides the sender name in the success message and signature |

Example: `https://yoursite.com/valentines?name=Jane&sender=Rushi`

### Adding a new occasion (replacing a stub)

1. Create `config/{slug}.ts` with the same shape as `config/valentine.ts`.
2. Replace `app/{slug}/page.tsx` to render your real card component (e.g. copy `ValentinePage` and adapt).
3. Flip `implemented: true` for that slug in `config/occasions.ts`.

---

## Authentication (Clerk)

Auth is wired via [Clerk](https://clerk.com) — free up to 10k MAU. Email + password only at launch.

**Routes:**
- `/sign-in` — sign-in page (also opens as a modal from the header "Sign in" button)
- `/sign-up` — sign-up page
- `/dashboard` — protected; redirects to `/sign-in` when signed out

**Setup:**
1. Create a free app at [dashboard.clerk.com](https://dashboard.clerk.com)
2. In Clerk → **User & Authentication** → enable Email + Password, disable everything else (Phone, OAuth, magic links)
3. Copy the publishable + secret keys from **API Keys** into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
4. The remaining `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` / fallback URLs in `.env.example` keep defaults; no changes needed.

**Production (Vercel):** add the same keys to the project's environment variables before deploying.

**What's gated:** only `/dashboard` (see `middleware.ts`). All occasion routes, the landing page, and `/sign-in` / `/sign-up` stay public.

---

## Theme

- Light/dark toggle in the header on every card route.
- Stores choice in `localStorage["valentine-theme"]`.
- Falls back to system `prefers-color-scheme` on first visit.
- Theme is applied **before hydration** via an inline script in `app/layout.tsx` — no flash on refresh.

---

## Deployment

### Build

```bash
npm run build
```

Requires Clerk env vars (see [Authentication](#authentication-clerk)).

### Vercel

Push to GitHub → Add New Project in Vercel → import the repo → Deploy. Build command stays `npm run build`.

### Netlify

Add new site → Import existing project → connect repo → build command `npm run build`. Use Netlify's Next.js runtime.

Set the `site.url` and `site.ogImage` fields in each occasion config for production link previews.

---

## Tests

```bash
npm test
```

Vitest + jsdom + Testing Library. The Icon primitive has full coverage (22 tests). Card-level tests are tracked as a follow-up.

---

## Project structure

```
app/
  page.tsx                  Occasion selector landing
  layout.tsx                Root layout, theme bootstrap, metadata
  globals.css               Tailwind 4 + theme tokens
  valentines/page.tsx       Valentine route
  birthday|anniversary|graduation|
    thank-you|get-well|congratulations/page.tsx   Stubs
  preview/page.tsx          Icon showcase (dev only)

components/
  ValentinePage.tsx         Valentine card logic
  ComingSoon.tsx            Stub-page UI
  Header.tsx                Fixed nav + theme toggle
  Avatar.tsx                Initials avatar
  FloatingHearts.tsx        Background hearts
  CelebrationOverlay.tsx    "Yes" overlay
  ui/Icon/                  Icon primitive + tests

config/
  occasions.ts              Landing page occasion list
  valentine.ts              Valentine copy + assets

hooks/
  useTheme.ts               Theme state + toggle
```

---

## License

MIT. See `LICENSE`. Use, modify, and resell freely; no attribution required.

---

## Support

For the full config reference, see **CUSTOMIZATION.md**.
