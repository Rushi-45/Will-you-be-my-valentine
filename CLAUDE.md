# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Multi-Occasion Wishing Platform** — Create beautiful, personalized wishing cards for any occasion.
Started as a Valentine's Day template, now expanded to support birthdays, anniversaries, graduations,
and more. Each occasion has its own route with config-driven content, animated cards, and celebration effects.

### Supported Occasions
- `/valentines` — Valentine's Day proposals (original page)
- `/birthday` — Birthday wishes
- `/anniversary` — Relationship anniversaries
- `/graduation` — Congratulatory wishes
- `/thank-you` — Gratitude messages
- `/get-well` — Get well soon wishes
- `/congratulations` — General celebrations (new job, baby, etc.)

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Config-Driven Design

All user-facing content, branding, and assets are controlled via **`config/valentine.ts`**. This is the single customization point for rebranding. When modifying content or adding features, ensure they read from this config.

URL parameters for personalization:
- `?name=Jane` — Personalizes the recipient name in headline/success screen
- `?sender=Rushi` — Overrides sender name in success message

### Component Structure

```
app/
  layout.tsx          # Root layout, metadata, fonts (Geist)
  page.tsx            # Landing page — occasion selector grid
  valentines/
    page.tsx          # Valentine's Day route (original page)
  globals.css         # Tailwind imports

components/
  ValentinePage.tsx       # Main client component — all page logic, state, interactions
  FloatingHearts.tsx      # Background animated hearts
  CelebrationOverlay.tsx  # Full-screen overlay shown on "Yes" click

config/
  valentine.ts   # Single source of truth for Valentine's content/assets
```

### Route Pattern

Each occasion follows the same pattern:
- **Route**: `app/{occasion}/page.tsx` — Server component with metadata generation
- **Config**: `config/{occasion}.ts` — All content, branding, assets for that occasion
- **URL params**: `?name={recipient}` and `?sender={sender}` for personalization

### Key Patterns

- **Client Components**: `ValentinePage`, `FloatingHearts`, `CelebrationOverlay` use `"use client"` and Framer Motion
- **Server Component**: `page.tsx` handles dynamic metadata generation
- **Asset Paths**: Images/audio in `public/` are referenced with leading slash (e.g., `/crying_cat.gif`)
- **Animation Constants**: `MOTION` object in `ValentinePage.tsx` centralizes timing/easing values

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion (animations)
- canvas-confetti (celebration effect)
- TypeScript

No environment variables required.