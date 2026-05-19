"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  label: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
  className?: string;
  /** Delay before the tooltip appears in ms. Default 240. */
  delay?: number;
}

type PlacementConfig = {
  pos: string;
  motionStyle: { x: string } | { y: string };
  initial: TargetAndTransition;
  animate: TargetAndTransition;
};

const CONFIG: Record<TooltipPlacement, PlacementConfig> = {
  top: {
    pos: "bottom-full left-1/2 mb-2",
    motionStyle: { x: "-50%" },
    initial: { opacity: 0, y: 5, scale: 0.93 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  bottom: {
    pos: "top-full left-1/2 mt-2",
    motionStyle: { x: "-50%" },
    initial: { opacity: 0, y: -5, scale: 0.93 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  left: {
    pos: "right-full top-1/2 mr-2",
    motionStyle: { y: "-50%" },
    initial: { opacity: 0, x: 5, scale: 0.93 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  right: {
    pos: "left-full top-1/2 ml-2",
    motionStyle: { y: "-50%" },
    initial: { opacity: 0, x: -5, scale: 0.93 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
};

export function Tooltip({
  label,
  placement = "top",
  children,
  className,
  delay = 240,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    timer.current = setTimeout(() => setVisible(true), delay);
  }
  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }

  const cfg = CONFIG[placement];

  return (
    <div
      className={`relative inline-flex${className ? ` ${className}` : ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            className={`pointer-events-none absolute z-[500] whitespace-nowrap rounded-lg bg-slate-800/95 px-2.5 py-1.5 text-[0.6875rem] font-medium leading-none tracking-wide text-white shadow-xl backdrop-blur-sm dark:bg-slate-700/95 ${cfg.pos}`}
            style={cfg.motionStyle}
            initial={cfg.initial}
            animate={cfg.animate}
            exit={cfg.initial}
            transition={{ duration: 0.11, ease: "easeOut" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
