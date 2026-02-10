# How to customize this Valentine template

All customer-facing copy, names, and image paths live in **one file** so you or your buyers can rebrand without touching the rest of the code.

## 1. Open the config file

Edit **`config/valentine.ts`**.

## 2. What you can change

| Field | What it does |
|-------|----------------|
| **site.title** | Browser tab title and SEO title |
| **site.description** | Meta description for SEO |
| **site.favicon** | Path to favicon image (e.g. `/my-icon.png`) |
| **site.url** | Full site URL (e.g. `"https://yoursite.com"`) for canonical and Open Graph |
| **site.ogImage** | Absolute or path to share image (e.g. `"/og.png"` or full URL) for social previews |
| **site.keywords** | Array of SEO keywords (e.g. `["valentine", "proposal"]`) |
| **senderName** | Your name — used in the success message and “With love, …” |
| **eyebrow** | Short line under the headline (e.g. `"February 14 · Just Us"`) |
| **headline.line1** | First line of the main question (e.g. `"Will you be"`) |
| **headline.line2** | Second line (e.g. `"my Valentine?"`) |
| **promise** | The paragraph above the Yes/No buttons |
| **noButtonMessages** | Array of 5 messages when the user clicks “No” |
| **success.headline** | Title on the success screen (e.g. `"You said yes!"`) |
| **success.message** | Invite paragraph. Use `{senderName}` and it will be replaced with **senderName** (e.g. “from Rushi”). |
| **success.signature** | Sign-off (e.g. `"With love"` or `"With love, {senderName}"` to include your name) |
| **images.cornerCat** | Image path for the top-right cat (question + success) |
| **images.cryingCat** | GIF shown when the user clicks “No” |
| **images.huggingCat** | GIF shown when the user clicks “Yes” |
| **backgroundMusic** | Path to MP3 (e.g. `"/music.mp3"`) or `null` to hide the music toggle |

## 3. Images

- Put your images in the **`public/`** folder.
- In config, use paths starting with `/`, e.g. `/crying_cat.gif`, `/my-photo.png`.

## 4. URL parameters

You can override the **recipient** and **sender** via the URL so one deployment can serve many links:

- **`?name=Jane`** — Uses “Jane” as the recipient (headline, success headline, and meta).
- **`?sender=Rushi`** — Uses “Rushi” wherever the sender name appears (e.g. in the success message and “With love, {senderName}”). If omitted, the value from **senderName** in config is used.

Example: `https://yoursite.com?name=Jane&sender=Rushi`

## 5. Reselling

- Give buyers **only** `config/valentine.ts` (and optionally this CUSTOMIZATION.md) as the “edit this to customize” surface.
- They don’t need to touch components or layout; everything reads from this config.

No need to pay me more money — just edit the config and sell the template. Good luck.
