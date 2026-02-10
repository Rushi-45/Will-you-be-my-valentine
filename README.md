# Will You Be My Valentine? — Template

A cute, animated Valentine’s Day landing page. One question, two buttons, confetti when they say yes.

![Valentine template](https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80)

## Features

- **Animated question card** — Smooth entrance, floating hearts background
- **“Yes” / “No” buttons** — No button moves on hover and shrinks on each click; Yes button grows
- **Crying cat GIF** when they click “No”
- **Confetti + success screen** when they click “Yes”, with hugging cat GIF
- **One-file customization** — All copy, names, and image paths in `config/valentine.ts`
- **Responsive** — Works on mobile and desktop
- **Tech** — Next.js (App Router), Tailwind CSS, Framer Motion, canvas-confetti

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize (for you or your customers)

Edit **`config/valentine.ts`** only. No need to touch components.

- **Names & copy** — `senderName`, headline, promise text, success message, “No” button messages
- **Images** — Paths for corner cat, crying cat GIF, hugging cat GIF (put files in `public/`)
- **Site** — Title, description, favicon

See **CUSTOMIZATION.md** for a full field-by-field guide.

## Deploy

Deploy to [Vercel](https://vercel.com) (or any Next.js host):

```bash
npm run build
```

Set no env vars required; config is in code.

## License

MIT (or your chosen license for resale).
