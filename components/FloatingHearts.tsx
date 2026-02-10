"use client";

import { motion } from "framer-motion";

const HEARTS = ["💕", "💖", "💗", "❤️", "💝"] as const;

const FLOAT_CONFIG = [
  {
    x: "10%",
    y: "15%",
    delay: 0,
    duration: 8,
    driftY: 24,
    driftX: 8,
    size: "text-2xl",
    opacity: 0.2,
  },
  {
    x: "85%",
    y: "20%",
    delay: 1.2,
    duration: 7,
    driftY: -20,
    driftX: -6,
    size: "text-xl",
    opacity: 0.22,
  },
  {
    x: "25%",
    y: "70%",
    delay: 0.4,
    duration: 9,
    driftY: -18,
    driftX: 10,
    size: "text-3xl",
    opacity: 0.18,
  },
  {
    x: "70%",
    y: "65%",
    delay: 2,
    duration: 6.5,
    driftY: 22,
    driftX: -8,
    size: "text-xl",
    opacity: 0.24,
  },
  {
    x: "50%",
    y: "35%",
    delay: 0.8,
    duration: 7.5,
    driftY: 15,
    driftX: 12,
    size: "text-2xl",
    opacity: 0.16,
  },
  {
    x: "15%",
    y: "50%",
    delay: 1.5,
    duration: 8.5,
    driftY: -25,
    driftX: -10,
    size: "text-xl",
    opacity: 0.2,
  },
  {
    x: "90%",
    y: "45%",
    delay: 0.2,
    duration: 6,
    driftY: 20,
    driftX: 6,
    size: "text-2xl",
    opacity: 0.18,
  },
  {
    x: "35%",
    y: "85%",
    delay: 2.2,
    duration: 7.2,
    driftY: -15,
    driftX: -12,
    size: "text-xl",
    opacity: 0.22,
  },
  {
    x: "60%",
    y: "12%",
    delay: 1,
    duration: 8.2,
    driftY: 18,
    driftX: -8,
    size: "text-3xl",
    opacity: 0.17,
  },
  {
    x: "8%",
    y: "78%",
    delay: 1.8,
    duration: 6.8,
    driftY: -22,
    driftX: 10,
    size: "text-xl",
    opacity: 0.21,
  },
  {
    x: "78%",
    y: "88%",
    delay: 0.6,
    duration: 9.2,
    driftY: 16,
    driftX: -6,
    size: "text-2xl",
    opacity: 0.19,
  },
  {
    x: "42%",
    y: "55%",
    delay: 2.4,
    duration: 7.8,
    driftY: -20,
    driftX: 8,
    size: "text-xl",
    opacity: 0.15,
  },
];

export function FloatingHearts() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {FLOAT_CONFIG.map((config, i) => (
        <motion.span
          key={i}
          className={`absolute select-none text-rose-300/90 ${config.size}`}
          style={{
            left: config.x,
            top: config.y,
            opacity: config.opacity,
          }}
          animate={{
            y: [0, config.driftY, 0],
            x: [0, config.driftX, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {HEARTS[i % HEARTS.length]}
        </motion.span>
      ))}
    </div>
  );
}
