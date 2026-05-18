"use client";

import { motion, type Variants } from "framer-motion";
import { Moon, Code2, Sparkles, type LucideIcon } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClass: string;
};

const features: readonly Feature[] = [
  {
    icon: Moon,
    title: "Dark mode, done right",
    description:
      "Anti-FOUC bootstrap. No flash, no jank. System preference respected.",
    iconClass:
      "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    icon: Code2,
    title: "Config-driven",
    description:
      "One file per occasion. No environment variables. Deploy anywhere.",
    iconClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
  },
  {
    icon: Sparkles,
    title: "Animated by default",
    description:
      "Framer Motion entrance + confetti + runaway buttons. Polish included.",
    iconClass:
      "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/50 dark:text-fuchsia-400",
  },
];

export function FeatureHighlights() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="flex items-start gap-3 rounded-xl border border-stone-200/60 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.iconClass}`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-stone-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
