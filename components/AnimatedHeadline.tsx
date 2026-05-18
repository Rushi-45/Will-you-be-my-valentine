"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease },
  },
};

type Props = {
  words: string[];
  secondLine?: string;
  className?: string;
  secondLineClassName?: string;
  ariaLabel?: string;
};

export function AnimatedHeadline({
  words,
  secondLine,
  className = "",
  secondLineClassName = "",
  ariaLabel,
}: Props) {
  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={ariaLabel ?? [words.join(" "), secondLine].filter(Boolean).join(" ")}
    >
      <span className="block" aria-hidden>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className="mr-[0.22em] inline-block last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </span>
      {secondLine && (
        <motion.span
          variants={wordVariants}
          className={`mt-1 block ${secondLineClassName}`}
          aria-hidden
        >
          {secondLine}
        </motion.span>
      )}
    </motion.h1>
  );
}
