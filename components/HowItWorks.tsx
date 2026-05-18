"use client";

import { motion, type Variants } from "framer-motion";
import { MousePointerClick, Sparkles, Share2 } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

const steps = [
  {
    number: "01",
    title: "Pick an occasion",
    description:
      "Choose from Valentine's, birthdays, anniversaries, and more on the home grid.",
    icon: MousePointerClick,
    color: "from-rose-500 to-pink-500",
  },
  {
    number: "02",
    title: "Personalize it",
    description:
      "Drop a name or sender into the URL, edit the config file for deeper changes.",
    icon: Sparkles,
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    number: "03",
    title: "Share the link",
    description:
      "Copy the URL or share to WhatsApp. They open it, smile, and say yes.",
    icon: Share2,
    color: "from-fuchsia-500 to-rose-500",
  },
] as const;

export function HowItWorks() {
  return (
    <motion.section
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        variants={stepVariants}
        className="mb-10 flex flex-col items-center gap-3 text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/70 bg-white px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300">
          How it works
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-4xl">
          Three steps. That&apos;s it.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="group relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-linear-to-br ${step.color} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${step.color} shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" aria-hidden />
                  </div>
                  <span className="text-3xl font-extrabold text-rose-200/80 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800 dark:text-slate-100">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
