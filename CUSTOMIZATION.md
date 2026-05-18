# Customizing Wishing Cards

All user-facing content lives under `config/`. Edit those files; you usually don't need to touch components.

## 1. Landing page tiles — `config/occasions.ts`

This file controls the grid on `/`. Each entry:

| Field | Purpose |
|---|---|
| `name` | Tile title (e.g. "Valentine's Day") |
| `slug` | URL segment, e.g. `valentines` → `/valentines` |
| `description` | Tile subtitle |
| `icon` | A `lucide-react` icon component |
| `gradient` | Tailwind gradient classes for the tile icon and stub-page hero |
| `bgGradient` | Tailwind gradient classes for the tile hover background |
| `implemented` | `true` if the route is a real card, `false` for a "Coming soon" stub |

Add, remove, or reorder entries to change the landing page. Removing a tile does **not** remove the route — delete `app/{slug}/page.tsx` separately if you want a real 404.

## 2. Valentine card — `config/valentine.ts`

The Valentine page reads everything from this single file.

### Site / SEO

| Field | What it does |
|---|---|
| `site.title` | Browser tab title and SEO title |
| `site.description` | Meta description |
| `site.favicon` | Favicon path |
| `site.url` | Full site URL for canonical and Open Graph |
| `site.ogImage` | Share image path or URL |
| `site.keywords` | SEO keywords array |

### Card copy

| Field | What it does |
|---|---|
| `senderName` | Your name. Used wherever `{senderName}` appears |
| `eyebrow` | Small line above the headline (e.g. "February 14 · Just Us") |
| `headline.line1` / `headline.line2` | The two-line question |
| `promise` | Paragraph above the Yes/No buttons |
| `noButtonMessages` | Array of 5 escalating messages for repeat "No" clicks |
| `success.headline` | Success-screen title |
| `success.message` | Success-screen body. Use `{senderName}` to interpolate |
| `success.signature` | Sign-off, e.g. `"With love, {senderName}"` |

### Assets

| Field | What it does |
|---|---|
| `images.cornerCat` | Top-right cat (question + success screens) |
| `images.cryingCat` | GIF shown after the first "No" click |
| `images.huggingCat` | GIF shown on the success screen |
| `backgroundMusic` | Path to MP3, or `null` to hide the music toggle |

Place all assets in `public/` and reference them with a leading slash (e.g. `/crying_cat.gif`).

## 3. URL parameters

You don't need separate deployments per recipient — use query strings:

| Param | Example | Effect |
|---|---|---|
| `name` | `?name=Jane` | Recipient name in headline, success line, and metadata |
| `sender` | `?sender=Rushi` | Overrides `senderName` for this link |

Combine them: `/valentines?name=Jane&sender=Rushi`.

## 4. Theming

Theme colour tokens live in `app/globals.css` under `:root` and `.dark`. Edit those CSS variables to rebrand without hunting through components.

| Token | Used for |
|---|---|
| `--background` / `--foreground` | Body bg + text |
| `--surface` | Card backgrounds (where used via tokens) |
| `--primary` / `--primary-soft` | Brand colour (Icon primitive, theme accents) |
| `--secondary`, `--success`, `--danger`, `--warning` | Icon variant colours |

The theme picker writes `light` or `dark` to `<html>` and persists in `localStorage["valentine-theme"]`. First-paint colours are set by an inline script in `app/layout.tsx`, so there's no flash on refresh.

## 5. Adding a real occasion (replacing a "Coming soon" stub)

The 6 non-Valentine routes are stub pages today. To upgrade one:

1. **Create the config:** `config/{slug}.ts`. The simplest path is to copy `config/valentine.ts` and adapt copy + assets.
2. **Replace the page:** Edit `app/{slug}/page.tsx` so it renders a real card. The easiest pattern is to clone `components/ValentinePage.tsx` into `components/{Slug}Page.tsx` and have it read from your new config.
3. **Mark it live:** In `config/occasions.ts`, flip `implemented: true` for that slug — the tile's CTA changes from "Coming soon" to "Create card".

If you build several occasions, factor the shared card UI into a generic `OccasionPage` component that accepts the occasion's config as a prop, and reduce per-occasion files to thin wrappers.

## 6. Reselling

Hand buyers `config/occasions.ts` + `config/{occasion}.ts` files + this CUSTOMIZATION.md. They never need to touch components or routes.

No need to pay attribution — MIT license, see `LICENSE`.
