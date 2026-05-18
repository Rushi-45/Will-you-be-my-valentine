"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { occasions, type Occasion } from "@/config/occasions";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.52, ease } },
};

// ─── Featured hero card ───────────────────────────────────────────────────────

function FeaturedCard({ occasion }: { occasion: Occasion }) {
  const Icon = occasion.icon;
  return (
    <Link
      href={`/${occasion.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-rose-200/80 bg-white shadow-[0_4px_20px_-4px_rgba(190,18,60,0.12)] transition-all duration-300 hover:border-rose-300/80 hover:shadow-[0_20px_56px_-8px_rgba(190,18,60,0.28)] dark:border-rose-900/40 dark:bg-slate-900 dark:hover:border-rose-800/60 dark:hover:shadow-[0_20px_56px_-8px_rgba(244,63,94,0.22)]"
    >
      {/* Background gradient wash — always soft, intensifies on hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${occasion.bgGradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-20 dark:group-hover:opacity-35`}
      />

      {/* Shimmer sweep */}
      <div
        className="animate-shimmer-once pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full"
        aria-hidden
      >
        <div className="h-full w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
      </div>

      {/* Decorative sparkles */}
      <span className="pointer-events-none absolute right-8 top-5 select-none text-xl text-rose-300/50 dark:text-rose-700/40" aria-hidden>✦</span>
      <span className="pointer-events-none absolute bottom-7 right-24 select-none text-sm text-pink-300/40 dark:text-pink-700/30" aria-hidden>✦</span>
      <span className="pointer-events-none absolute right-16 top-1/2 select-none text-xs text-rose-200/40 dark:text-rose-800/30" aria-hidden>·</span>

      {/* Live badge */}
      <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-white shadow-sm">
        <Sparkles className="h-3 w-3" aria-hidden />
        Live
      </span>

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:gap-10">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${occasion.gradient} shadow-[0_8px_24px_-4px_rgba(190,18,60,0.38)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
          >
            <Icon className="h-10 w-10 text-white" aria-hidden />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-2.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-3xl">
            {occasion.name}
          </h2>
          <p className="text-base leading-relaxed text-stone-600 dark:text-slate-400">
            {occasion.description}
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200/70 transition-all duration-200 group-hover:bg-rose-500 group-hover:text-white group-hover:ring-rose-500 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-800/50 dark:group-hover:bg-rose-500 dark:group-hover:text-white">
              Create your card
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Regular card ─────────────────────────────────────────────────────────────

function RegularCard({ occasion }: { occasion: Occasion }) {
  const Icon = occasion.icon;
  return (
    <Link
      href={`/${occasion.slug}`}
      className="group relative block h-full overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm transition-all duration-300 hover:border-stone-300/80 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      {/* Tinted background — always a hint of the occasion color, deepens on hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${occasion.bgGradient} opacity-40 transition-opacity duration-500 group-hover:opacity-80 dark:opacity-10 dark:group-hover:opacity-22`}
      />

      {/* Shimmer on hover only */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden
      >
        <div className="h-full w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent dark:via-white/8" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-3.5 p-5">
        {/* Icon */}
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${occasion.gradient} shadow-md transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden />
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="text-lg font-bold text-stone-800 dark:text-slate-100">
            {occasion.name}
          </h2>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-slate-400">
            {occasion.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors duration-200 group-hover:text-stone-800 dark:text-slate-500 dark:group-hover:text-slate-200">
          <span>Open card</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

// ─── OccasionGrid ─────────────────────────────────────────────────────────────

export function OccasionGrid() {
  const [featured, ...rest] = occasions;

  return (
    <div className="flex flex-col gap-4">
      {/* Featured hero card */}
      <motion.div
        variants={tileVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <FeaturedCard occasion={featured} />
      </motion.div>

      {/* 6-card grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {rest.map((occasion) => (
          <motion.div
            key={occasion.slug}
            variants={tileVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <RegularCard occasion={occasion} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
