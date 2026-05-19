"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Tooltip } from "@/components/ui/Tooltip";

type Variant = "inline" | "floating";

type Props = {
  variant?: Variant;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  inline:
    "h-9 w-9 border border-pink-200/80 bg-white/90 shadow-sm hover:bg-pink-50 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
  floating:
    "h-11 w-11 border border-rose-200/70 bg-white/90 shadow-[0_4px_16px_-4px_rgba(190,18,60,0.18)] backdrop-blur-sm hover:bg-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:focus-visible:ring-offset-slate-950",
};

const ICON_SIZE: Record<Variant, string> = {
  inline: "h-4.5 w-4.5",
  floating: "h-5 w-5",
};

export const ThemeToggle = memo(function ThemeToggle({
  variant = "inline",
}: Props) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`${variant === "floating" ? "h-11 w-11" : "h-9 w-9"} rounded-full bg-pink-100/40 dark:bg-slate-800/40`}
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Tooltip
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      placement={variant === "floating" ? "left" : "bottom"}
    >
      <motion.button
        type="button"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          toggleTheme({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`inline-flex cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 ${VARIANT_CLASSES[variant]}`}
      >
        {isDark ? (
          <Sun className={`${ICON_SIZE[variant]} text-amber-400`} aria-hidden />
        ) : (
          <Moon
            className={`${ICON_SIZE[variant]} text-slate-600`}
            aria-hidden
          />
        )}
      </motion.button>
    </Tooltip>
  );
});
