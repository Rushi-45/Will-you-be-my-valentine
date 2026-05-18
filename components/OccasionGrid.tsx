"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { occasions } from "@/config/occasions";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease },
  },
};

export function OccasionGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {occasions.map((occasion) => {
        const Icon = occasion.icon;
        const isLive = occasion.implemented;

        return (
          <motion.div
            key={occasion.slug}
            variants={tileVariants}
            whileHover={isLive ? { y: -6 } : { y: -3 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <Link
              href={`/${occasion.slug}`}
              className={`group relative block h-full overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-shadow duration-300 dark:bg-slate-900 ${
                isLive
                  ? "border-rose-200/80 hover:shadow-[0_12px_32px_-8px_rgba(190,18,60,0.35)] hover:border-rose-300 dark:border-rose-900/40 dark:hover:border-rose-800/60 dark:hover:shadow-[0_12px_32px_-8px_rgba(244,63,94,0.35)]"
                  : "border-stone-200/60 hover:shadow-md dark:border-slate-800"
              }`}
            >
              {/* Hover gradient wash */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${occasion.bgGradient} transition-opacity duration-500 ${
                  isLive
                    ? "opacity-30 group-hover:opacity-70 dark:opacity-10 dark:group-hover:opacity-25"
                    : "opacity-0 group-hover:opacity-50 dark:opacity-0 dark:group-hover:opacity-15"
                }`}
              />

              {/* Diagonal shimmer sweep on live tile.
                  Auto-fires once on entrance via animate-shimmer-once,
                  then resets and replays on hover via the transition. */}
              {isLive && (
                <div
                  className="animate-shimmer-once pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full"
                  aria-hidden
                >
                  <div className="h-full w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
                </div>
              )}

              {/* Status badge */}
              <span
                className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${
                  isLive
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-stone-100 text-stone-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isLive ? (
                  <>
                    <Sparkles className="h-3 w-3" aria-hidden />
                    <span>Live</span>
                  </>
                ) : (
                  <span>Coming soon</span>
                )}
              </span>

              <div className="relative z-10 flex h-full flex-col gap-4">
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${occasion.gradient} shadow-md transition-transform duration-300 ${
                    isLive
                      ? "group-hover:scale-110 group-hover:rotate-3"
                      : "opacity-75 group-hover:scale-105 group-hover:opacity-100"
                  }`}
                >
                  <Icon className="h-7 w-7 text-white" aria-hidden />
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold transition-colors ${
                      isLive
                        ? "text-stone-800 dark:text-slate-100"
                        : "text-stone-700 dark:text-slate-300"
                    }`}
                  >
                    {occasion.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-slate-400">
                    {occasion.description}
                  </p>
                </div>

                <div
                  className={`mt-auto flex items-center gap-2 text-sm font-medium ${
                    isLive
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-stone-500 dark:text-slate-500"
                  }`}
                >
                  <span>{isLive ? "Create card" : "Notify me"}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
