"use client";

import { motion, type Variants } from "framer-motion";

const lineEase = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: lineEase },
  },
};

const line1 = ["Make", "Every", "Moment"];

export function HeroHeadline() {
  return (
    <motion.h1
      className="bg-linear-to-br from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-4xl font-extrabold leading-[1.05] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-[4.25rem]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Make Every Moment Special"
    >
      <span className="block">
        {line1.map((word) => (
          <motion.span
            key={word}
            variants={wordVariants}
            className="mr-[0.25em] inline-block"
            aria-hidden
          >
            {word}
          </motion.span>
        ))}
      </span>
      <motion.span
        variants={wordVariants}
        className="mt-1 block bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent"
        aria-hidden
      >
        Special
      </motion.span>
    </motion.h1>
  );
}
