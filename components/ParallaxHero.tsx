"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, ChevronDown, Sparkles } from "lucide-react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeroHeadline } from "@/components/HeroHeadline";

export function ParallaxHero() {
  // Track the raw window scroll position (not element-relative)
  const { scrollY } = useScroll();

  // Blobs are the furthest layer — move slowest (40px up per 400px scroll)
  const blobY = useTransform(scrollY, [0, 400], [0, -120]);
  // Hearts are mid-distance — slightly faster
  const heartsY = useTransform(scrollY, [0, 400], [0, -70]);
  // Content is foreground — fastest (but still slower than the page scroll itself)
  const contentY = useTransform(scrollY, [0, 400], [0, -40]);

  return (
    <header className="relative w-full overflow-hidden border-b border-stone-200/60 bg-linear-to-b from-white via-pink-50/30 to-white/80 dark:border-slate-800 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900/90">

      {/* Hearts — deepest, barely moves */}
      <motion.div
        style={{ y: heartsY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-20"
      >
        <FloatingHearts />
      </motion.div>

      {/* Gradient blobs — mid layer, moves a bit more */}
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-20"
      >
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-900/25" />
        <div className="absolute -right-24 top-4 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl dark:bg-pink-900/25" />
        <div className="absolute bottom-10 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-800/20" />
      </motion.div>

      {/* Content — foreground, moves least */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-7 px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28"
      >
        {/* Eyebrow chip */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/90 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-sm backdrop-blur-sm dark:border-rose-900/50 dark:bg-slate-900/80 dark:text-rose-300">
          <Heart className="animate-heart-pulse h-3 w-3 fill-current" aria-hidden />
          <span>Wishing Cards · v1</span>
        </span>

        <HeroHeadline />

        <p className="max-w-xl text-balance text-base leading-relaxed text-stone-600 dark:text-slate-400 sm:text-lg md:text-xl">
          A polished Next.js template for personalized greeting cards.
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/valentines"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(190,18,60,0.35)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_8px_24px_-4px_rgba(190,18,60,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] dark:focus-visible:ring-offset-slate-950"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Try the Valentine card</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </Link>
          <a
            href="#occasions"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-200 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            Browse all occasions
          </a>
        </div>

        <a
          href="#how"
          aria-label="Scroll to how it works"
          className="animate-slow-bob mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/60 bg-white/80 text-rose-500 backdrop-blur-sm transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-rose-400"
        >
          <ChevronDown className="h-5 w-5" aria-hidden />
        </a>
      </motion.div>
    </header>
  );
}
