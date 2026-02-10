# Will You Be My Valentine? — Premium Template

A **production-ready, animated Valentine’s Day landing page** built for resale or your own proposal. One question, two buttons, and a memorable “Yes” moment—fully customizable from a single config file. No design or coding required to rebrand.

---

## Why this template

- **One-file customization** — All copy, names, images, and SEO live in `config/valentine.ts`. Your buyers (or you) never need to touch components.
- **Built to sell** — Clean structure, clear docs, and optional background music and SEO so you can offer it as a product or a custom-order service.
- **Modern stack** — Next.js (App Router), Tailwind CSS, Framer Motion. Fast, maintainable, and easy to deploy on Vercel or Netlify.

---

## Features

| Feature | Description |
|--------|-------------|
| **Animated question card** | Smooth entrance, floating hearts background, and soft shadows. |
| **Yes / No buttons** | No button runs away on hover (desktop) and on touch (mobile). Yes button grows with each “No” click; card can expand to fit. |
| **Crying cat** | Optional GIF above the promise text when they click “No.” |
| **Celebration overlay** | Full-screen overlay with floating cats and confetti when they click “Yes.” |
| **Success screen** | Hugging cat GIF, custom headline, message, and signature (e.g. “With love” or “With love, {senderName}”). |
| **Optional background music** | Toggle (off by default). Set an MP3 path in config or `null` to hide. |
| **Personalized links** | Use `?name=Jane` so the headline and success text use the recipient’s name. |
| **SEO & sharing** | Meta title/description, Open Graph, Twitter cards, optional canonical URL and OG image. Dynamic metadata for `?name=` links. |
| **Responsive & touch-friendly** | Layout and tap targets tuned for small screens; No button movement works with touch events. |
| **No env vars** | Everything is driven by the config file—ideal for static or serverless deploy. |

---

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **canvas-confetti** (celebration effect)
- **TypeScript**

---

## Setup

**Requirements:** Node.js 18+

```bash
# Clone or download the template
git clone <your-repo-url>
cd will-you-be-my-valentine

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Use [http://localhost:3000?name=Jane](http://localhost:3000?name=Jane) to see the personalized version.

---

## Customization guide

All customer-facing content and assets are controlled from **one file:** `config/valentine.ts`.

### 1. Copy and branding

| Config field | Purpose |
|-------------|--------|
| `site.title` | Browser tab and default SEO title |
| `site.description` | Meta description |
| `site.favicon` | Favicon path (e.g. `/favicon.ico`) |
| `site.url` | Full site URL for canonical and Open Graph (e.g. `"https://yoursite.com"`) |
| `site.ogImage` | Share image path or URL for social previews |
| `site.keywords` | SEO keywords array |
| `senderName` | Your name (used where `{senderName}` appears in message/signature) |
| `eyebrow` | Short line under the main headline |
| `headline.line1` / `headline.line2` | Main question (e.g. “Will you be” / “my Valentine?”) |
| `promise` | Paragraph above the Yes/No buttons |
| `noButtonMessages` | Array of 5 messages when the user clicks “No” (e.g. “Are you sure?”, “Really sure?”, …) |
| `success.headline` | Title on the success screen |
| `success.message` | Body text (use `{senderName}` to insert your name) |
| `success.signature` | Sign-off, e.g. `"With love"` or `"With love, {senderName}"` |

### 2. Images and music

| Config field | Purpose |
|-------------|--------|
| `images.cornerCat` | Image path for the top-right cat (question + success screens) |
| `images.cryingCat` | GIF shown when the user clicks “No” |
| `images.huggingCat` | GIF shown when the user clicks “Yes” (success screen) |
| `backgroundMusic` | Path to MP3 (e.g. `"/valentine-music.mp3"`) or `null` to hide the music toggle |

Place all assets in the **`public/`** folder and reference them with a leading slash (e.g. `/crying_cat.gif`).

### 3. Personalized links (query params)

Share a link with optional query parameters to personalize the page:

| Parameter | Example | Effect |
|-----------|---------|--------|
| `name` | `?name=Jane` | Recipient’s name: headline “Jane, will you be my Valentine?”, success “You said yes, Jane!”, and meta title/description. |
| `sender` | `?sender=Rushi` | Overrides the sender name for the success message and signature (e.g. “With love, Rushi”). Falls back to `senderName` in config when omitted. |

Examples: `https://yoursite.com?name=Jane`, `https://yoursite.com?sender=Rushi`, or `https://yoursite.com?name=Jane&sender=Rushi`. No code changes needed.

For a **full field-by-field reference**, see **CUSTOMIZATION.md**.

---

## Deployment

### Build

```bash
npm run build
```

No environment variables are required; all settings come from `config/valentine.ts`.

### Deploy to Vercel

1. Push the repo to GitHub (or connect your Git provider).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Leave build command as `npm run build` and output as default.
4. Deploy. Your site will be live at `https://your-project.vercel.app`.

Optional: set **site.url** in config to your production URL and add **site.ogImage** for better link previews.

### Deploy to Netlify

1. In [Netlify](https://netlify.com), **Add new site** → **Import an existing project** and connect the repo.
2. Build command: `npm run build`
3. Publish directory: `.next` (or use the Next.js runtime; follow Netlify’s Next.js docs).
4. Deploy.

Same as above: set **site.url** and **site.ogImage** in config for production.

### Other hosts

Any host that supports **Next.js** (Node or static export, depending on your setup) will work. Run `npm run build` and use the framework’s recommended run or export steps.

---

## Project structure

```
├── app/
│   ├── layout.tsx      # Root layout, metadata, fonts
│   ├── page.tsx        # Home page, dynamic metadata for ?name=
│   └── globals.css     # Global styles
├── components/
│   ├── ValentinePage.tsx   # Main page logic (question, buttons, success)
│   ├── FloatingHearts.tsx  # Background hearts
│   └── CelebrationOverlay.tsx  # Full-screen celebration (floating cats + confetti)
├── config/
│   └── valentine.ts    # Single file to customize for resale or use
├── public/             # Favicon, images, GIFs, optional MP3
├── CUSTOMIZATION.md    # Detailed config reference
└── README.md           # This file
```

---

## License

MIT (or your chosen license for resale). Use and sell as you like; no attribution required.

---

## Support

For detailed config options and reselling tips, see **CUSTOMIZATION.md**.
