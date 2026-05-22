import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Instagram } from "lucide-react";
import { OccasionGrid } from "@/components/OccasionGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParallaxHero } from "@/components/ParallaxHero";
import { CigaretteScroll } from "@/components/CigaretteScroll";
import { AuthControls } from "@/components/AuthControls";
import { occasions } from "@/config/occasions";
import { Tooltip } from "@/components/ui/Tooltip";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Make Every Moment Special",
    description:
      "Beautiful, personalized wishing cards for every occasion — Valentine's Day, birthdays, anniversaries, graduations, and more. Animated, shareable, and free.",
    keywords: [
      "wishing cards",
      "personalized greeting cards",
      "digital cards online",
      "animated greeting cards",
      "free digital greeting cards",
      "send a card online",
    ],
    openGraph: {
      title: "Wishing Cards — Make Every Moment Special",
      description:
        "Beautiful, personalized wishing cards for every occasion. Animated, shareable, and free.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Wishing Cards — Make Every Moment Special",
      description:
        "Beautiful, personalized wishing cards for every occasion. Animated, shareable, and free.",
    },
  };
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Floating auth + theme toggle (landing only) */}
      <div className="fixed right-4 top-4 z-40 flex items-center gap-3 sm:right-6 sm:top-6">
        <AuthControls />
        <ThemeToggle variant="floating" />
      </div>

      {/* Cigarette scroll indicator */}
      <CigaretteScroll />

      {/* Hero */}
      <ParallaxHero />

      {/* How it works */}
      <section
        id="how"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
      >
        <HowItWorks />
      </section>

      {/* Occasions Grid */}
      <section
        id="occasions"
        className="mx-auto w-full max-w-6xl scroll-mt-24 border-t border-stone-200/60 px-4 py-16 sm:px-6 sm:py-20 dark:border-slate-800"
      >
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/70 bg-white px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300">
            Browse occasions
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-4xl">
            Every moment deserves a card
          </h2>
          <p className="max-w-xl text-balance text-sm text-stone-600 dark:text-slate-400 sm:text-base">
            Seven handcrafted occasions, each personalized with a name and built to share.
          </p>
        </div>
        <OccasionGrid />
      </section>

      {/* Feature highlights row */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <FeatureHighlights />
      </section>

      {/* Closing CTA */}
      <section className="w-full border-t border-stone-200/60 bg-linear-to-b from-white to-pink-50/40 px-4 py-20 dark:border-slate-800 dark:from-slate-900 dark:to-rose-950/20">
        <ClosingCTA />
      </section>

      {/* Footer */}
      <footer className="relative w-full overflow-hidden bg-slate-950">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-20 h-96 w-96 rounded-full bg-rose-900/20 blur-3xl" />
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-pink-900/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-rose-950/30 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

          {/* Brand hero */}
          <div className="flex flex-col items-center gap-4 border-b border-white/10 py-14 text-center">
            <span className="inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white">
              <Heart className="h-6 w-6 fill-rose-500 text-rose-500" aria-hidden />
              Wishing Cards
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Beautiful, animated greeting cards for every moment —
              personalized with a name and free to share forever.
            </p>
            {/* Feature pills */}
            <div className="mt-1 flex flex-wrap justify-center gap-2">
              {["Free forever", "No sign-up", "Personalized", "Works on all devices"].map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Occasions row */}
          <div className="border-b border-white/10 py-7">
            <div className="flex flex-wrap justify-center gap-2">
              {occasions.map((occasion) => {
                const Icon = occasion.icon;
                return (
                  <Link
                    key={occasion.slug}
                    href={`/${occasion.slug}`}
                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-3 w-3" aria-hidden />
                    {occasion.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Wishing Cards · MIT licensed
            </p>
            <Tooltip label="Follow on Instagram" placement="top">
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Instagram className="h-3.5 w-3.5" aria-hidden />
                @rushiii.js
              </a>
            </Tooltip>
            <p className="text-xs text-slate-500">
              Made with <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" aria-hidden /> for every occasion
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
