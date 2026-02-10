"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const HEARTS = ["💕", "💖", "💗", "❤️", "💝"] as const;

const FLOAT_CONFIG = [
  {
    x: "10%",
    y: "15%",
    delay: 0,
    duration: 9,
    driftY: 20,
    driftX: 6,
    size: "text-xl",
    opacity: 0.18,
  },
  {
    x: "85%",
    y: "18%",
    delay: 1,
    duration: 8.5,
    driftY: -18,
    driftX: -5,
    size: "text-lg",
    opacity: 0.2,
  },
  {
    x: "22%",
    y: "72%",
    delay: 0.5,
    duration: 9.5,
    driftY: -16,
    driftX: 8,
    size: "text-2xl",
    opacity: 0.16,
  },
  {
    x: "72%",
    y: "68%",
    delay: 2,
    duration: 8,
    driftY: 18,
    driftX: -6,
    size: "text-lg",
    opacity: 0.2,
  },
  {
    x: "48%",
    y: "38%",
    delay: 0.8,
    duration: 9.2,
    driftY: 14,
    driftX: 10,
    size: "text-xl",
    opacity: 0.14,
  },
  {
    x: "12%",
    y: "52%",
    delay: 1.4,
    duration: 8.8,
    driftY: -20,
    driftX: -8,
    size: "text-lg",
    opacity: 0.18,
  },
  {
    x: "88%",
    y: "48%",
    delay: 0.3,
    duration: 8.2,
    driftY: 16,
    driftX: 5,
    size: "text-xl",
    opacity: 0.17,
  },
  {
    x: "38%",
    y: "88%",
    delay: 2.2,
    duration: 9,
    driftY: -14,
    driftX: -7,
    size: "text-lg",
    opacity: 0.19,
  },
  {
    x: "58%",
    y: "10%",
    delay: 1.2,
    duration: 8.6,
    driftY: 18,
    driftX: -6,
    size: "text-2xl",
    opacity: 0.15,
  },
  {
    x: "6%",
    y: "76%",
    delay: 1.8,
    duration: 8.4,
    driftY: -18,
    driftX: 8,
    size: "text-lg",
    opacity: 0.18,
  },
  {
    x: "76%",
    y: "90%",
    delay: 0.6,
    duration: 9.4,
    driftY: 14,
    driftX: -5,
    size: "text-xl",
    opacity: 0.16,
  },
  {
    x: "44%",
    y: "58%",
    delay: 2.4,
    duration: 8.2,
    driftY: -16,
    driftX: 6,
    size: "text-lg",
    opacity: 0.14,
  },
];

function FloatingHeartsComponent() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {FLOAT_CONFIG.map((config, i) => (
        <motion.span
          key={i}
          className={`absolute select-none text-rose-300 ${config.size}`}
          style={{
            left: config.x,
            top: config.y,
            opacity: config.opacity,
          }}
          animate={{
            y: [0, config.driftY, 0],
            x: [0, config.driftX, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: [0.45, 0, 0.55, 1],
          }}
        >
          {HEARTS[i % HEARTS.length]}
        </motion.span>
      ))}
    </div>
  );
}

export const FloatingHearts = memo(FloatingHeartsComponent);
