import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, ChevronDown, Sparkles, Instagram } from "lucide-react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { OccasionGrid } from "@/components/OccasionGrid";
import { HeroHeadline } from "@/components/HeroHeadline";
import { HowItWorks } from "@/components/HowItWorks";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ThemeToggle } from "@/components/ThemeToggle";
import { occasions } from "@/config/occasions";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Wishing Cards — Make Every Moment Special",
    description:
      "Create beautiful, personalized wishing cards for any occasion. Valentine's, birthdays, anniversaries, graduations, and more.",
    openGraph: {
      title: "Wishing Cards — Make Every Moment Special",
      description:
        "Create beautiful, personalized wishing cards for any occasion.",
    },
    twitter: {
      title: "Wishing Cards — Make Every Moment Special",
      description:
        "Create beautiful, personalized wishing cards for any occasion.",
    },
  };
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Floating theme toggle (landing only) */}
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <ThemeToggle variant="floating" />
      </div>

      {/* Hero */}
      <header className="relative w-full overflow-hidden border-b border-stone-200/60 bg-linear-to-b from-white via-pink-50/30 to-white/80 backdrop-blur-sm dark:border-slate-800 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900/90">
        <FloatingHearts />

        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-900/25" />
          <div className="absolute -right-24 -top-16 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl dark:bg-pink-900/25" />
          <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-800/20" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-7 px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28">
          {/* Eyebrow chip */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/90 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-sm backdrop-blur-sm dark:border-rose-900/50 dark:bg-slate-900/80 dark:text-rose-300">
            <Heart
              className="animate-heart-pulse h-3 w-3 fill-current"
              aria-hidden
            />
            <span>Wishing Cards · v1</span>
          </span>

          <HeroHeadline />

          <p className="max-w-xl text-balance text-base leading-relaxed text-stone-600 dark:text-slate-400 sm:text-lg md:text-xl">
            A polished Next.js template for personalized greeting cards.
          </p>

          {/* CTAs */}
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/valentines"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(190,18,60,0.35)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_8px_24px_-4px_rgba(190,18,60,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] dark:focus-visible:ring-offset-slate-950"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              <span>Try the Valentine card</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <a
              href="#occasions"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-200 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              Browse all occasions
            </a>
          </div>

          {/* Scroll indicator */}
          <a
            href="#how"
            aria-label="Scroll to how it works"
            className="animate-slow-bob mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/60 bg-white/80 text-rose-500 backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-rose-400"
          >
            <ChevronDown className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </header>

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
      <footer className="w-full border-t border-stone-200/60 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 text-base font-extrabold text-rose-600 dark:text-rose-400">
                <Heart className="h-4 w-4 fill-current" aria-hidden />
                Wishing Cards
              </span>
              <p className="max-w-xs text-xs leading-relaxed text-stone-600 dark:text-slate-400">
                A multi-occasion wishing-cards template. Open source, MIT
                licensed, free to remix and resell.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-500">
                Occasions
              </h3>
              <ul className="flex flex-col gap-2">
                {occasions.map((occasion) => (
                  <li key={occasion.slug}>
                    <Link
                      href={`/${occasion.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                    >
                      <span>{occasion.name}</span>
                      {occasion.implemented && (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-500">
                Made by
              </h3>
              <a
                href="https://www.instagram.com/rushiii.js"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-rose-200/60 bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                <span>DM on Instagram</span>
              </a>
              <p className="text-xs text-stone-500 dark:text-slate-500">
                Want a custom card? Just say hi.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-stone-200/60 pt-6 text-xs text-stone-500 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Wishing Cards · MIT licensed</p>
            <p className="inline-flex items-center gap-1.5">
              Built with{" "}
              <Heart
                className="h-3 w-3 fill-rose-500 text-rose-500"
                aria-hidden
              />{" "}
              in Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
