"use client";

import { useEffect, useState } from "react";

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}