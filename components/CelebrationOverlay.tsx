"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const FLOAT_CATS = [
  {
    src: "cornerCat" as const,
    x: "8%",
    y: "12%",
    size: 56,
    duration: 11,
    delay: 0,
    driftY: 25,
    driftX: 12,
    rotate: [-4, 6, -4],
  },
  {
    src: "huggingCat" as const,
    x: "82%",
    y: "15%",
    size: 64,
    duration: 10,
    delay: 0.5,
    driftY: -20,
    driftX: -10,
    rotate: [5, -5, 5],
  },
  {
    src: "cornerCat" as const,
    x: "15%",
    y: "75%",
    size: 48,
    duration: 12,
    delay: 1,
    driftY: -22,
    driftX: 8,
    rotate: [-6, 4, -6],
  },
  {
    src: "huggingCat" as const,
    x: "78%",
    y: "72%",
    size: 52,
    duration: 9.5,
    delay: 0.3,
    driftY: 18,
    driftX: -14,
    rotate: [3, -7, 3],
  },
  {
    src: "cornerCat" as const,
    x: "45%",
    y: "8%",
    size: 44,
    duration: 10.5,
    delay: 1.2,
    driftY: 20,
    driftX: -8,
    rotate: [2, -4, 2],
  },
  {
    src: "huggingCat" as const,
    x: "52%",
    y: "82%",
    size: 50,
    duration: 11.5,
    delay: 0.8,
    driftY: -24,
    driftX: 10,
    rotate: [-5, 5, -5],
  },
  {
    src: "cornerCat" as const,
    x: "5%",
    y: "42%",
    size: 40,
    duration: 9,
    delay: 1.5,
    driftY: 15,
    driftX: 15,
    rotate: [4, -3, 4],
  },
  {
    src: "huggingCat" as const,
    x: "88%",
    y: "48%",
    size: 46,
    duration: 10,
    delay: 0.2,
    driftY: -18,
    driftX: -12,
    rotate: [-3, 6, -3],
  },
  {
    src: "cornerCat" as const,
    x: "28%",
    y: "28%",
    size: 42,
    duration: 11,
    delay: 0.6,
    driftY: -16,
    driftX: -6,
    rotate: [6, -6, 6],
  },
  {
    src: "huggingCat" as const,
    x: "68%",
    y: "35%",
    size: 48,
    duration: 9.8,
    delay: 1.1,
    driftY: 22,
    driftX: 9,
    rotate: [-4, 4, -4],
  },
];

type ImageKey = "cornerCat" | "huggingCat";

function FloatingCat({
  src,
  alt,
  x,
  y,
  size,
  duration,
  delay,
  driftY,
  driftX,
  rotate,
}: {
  src: string;
  alt: string;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  driftY: number;
  driftX: number;
  rotate: number[];
}) {
  return (
    <motion.div
      className="absolute select-none"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: 0.85,
        scale: 1,
        y: [0, driftY, 0],
        x: [0, driftX, 0],
        rotate,
      }}
      transition={{
        opacity: { duration: 0.6, delay: 0.2 + delay * 0.1 },
        scale: {
          type: "spring",
          stiffness: 200,
          damping: 18,
          delay: delay * 0.08,
        },
        y: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1],
        },
        x: {
          duration: duration * 0.9,
          delay: delay * 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.45, 0, 0.55, 1],
        },
        rotate: {
          duration: duration * 0.7,
          delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </motion.div>
  );
}

type Props = {
  cornerCatSrc: string;
  huggingCatSrc: string;
};

function CelebrationOverlayComponent({ cornerCatSrc, huggingCatSrc }: Props) {
  const srcMap = { cornerCat: cornerCatSrc, huggingCat: huggingCatSrc };

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-rose-400/20 via-pink-300/15 to-rose-500/25"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.4),transparent_60%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.15,
        }}
      >
        <motion.span
          className="bg-linear-to-br from-rose-600 via-pink-500 to-rose-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          YAY!
        </motion.span>
        <motion.span
          className="mt-1 text-lg font-semibold text-rose-600/90 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.35 }}
        >
          You said yes!
        </motion.span>
      </motion.div>
      {FLOAT_CATS.map((config, i) => (
        <FloatingCat
          key={i}
          src={srcMap[config.src]}
          alt=""
          x={config.x}
          y={config.y}
          size={config.size}
          duration={config.duration}
          delay={config.delay}
          driftY={config.driftY}
          driftX={config.driftX}
          rotate={config.rotate}
        />
      ))}
    </motion.div>
  );
}

export const CelebrationOverlay = memo(CelebrationOverlayComponent);
