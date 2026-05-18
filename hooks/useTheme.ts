"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "valentine-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  // Source of truth set by the inline bootstrap script in app/layout.tsx
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

type ToggleOrigin = { x: number; y: number };

type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, theme);

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(
    (origin?: ToggleOrigin) => {
      const doc = document as DocumentWithViewTransition;
      const prefersReducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const flip = () =>
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));

      // Fallback when the API is unavailable or motion is reduced
      if (!doc.startViewTransition || prefersReducedMotion) {
        flip();
        return;
      }

      const transition = doc.startViewTransition(flip);

      // Diagonal wipe always sweeps from the top-right corner (NE → SW).
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              "polygon(100% 0%, 100% 0%, 100% 0%)",
              "polygon(100% 0%, -100% 0%, 100% 200%)",
            ],
          },
          {
            duration: 1100,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [],
  );

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}
