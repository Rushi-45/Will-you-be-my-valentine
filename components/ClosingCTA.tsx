"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export function ClosingCTA() {
  return (
    <motion.div
      className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-rose-200/70 bg-linear-to-br from-rose-50 via-pink-50 to-rose-50 p-10 text-center shadow-[0_8px_40px_-12px_rgba(190,18,60,0.25)] dark:border-rose-900/40 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-rose-950/40"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-700/30" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-pink-300/40 blur-3xl dark:bg-pink-700/30" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <motion.div variants={itemVariants}>
          <Heart
            className="h-10 w-10 fill-rose-500 text-rose-500 drop-shadow-md"
            aria-hidden
          />
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="max-w-xl bg-linear-to-br from-rose-700 via-pink-600 to-rose-700 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl"
        >
          Ready to make someone&apos;s day?
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="max-w-md text-balance text-sm leading-relaxed text-stone-700 dark:text-slate-300 sm:text-base"
        >
          The Valentine card is live and waiting. Two minutes to personalize,
          ten seconds to share.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/valentines"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(190,18,60,0.4)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_8px_28px_-4px_rgba(190,18,60,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50 active:scale-[0.98]"
          >
            <span>Open the Valentine card</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
