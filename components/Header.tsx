"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/Avatar";

// Add new page routes here as they are created
const NAV_LINKS: readonly { href: string; label: string }[] = [
  // { href: "/about", label: "About" },
  // { href: "/gallery", label: "Gallery" },
];

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full bg-pink-100/50" />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-200/80 bg-white/90 shadow-sm transition-colors hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-amber-500" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-slate-600" />
      )}
    </motion.button>
  );
});

type HeaderProps = {
  senderName?: string | null;
  recipientName?: string | null;
};

function HeaderComponent({ senderName, recipientName }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-pink-100/50 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2">
          {senderName && (
            <Avatar name={senderName} size="sm" className="hidden sm:inline-flex" />
          )}
          <Link
            href="/"
            className="text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          >
            Valentine
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {NAV_LINKS.length > 0 && (
            <ul className="flex items-center gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-stone-600 transition-colors hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {recipientName && (
            <Avatar name={recipientName} size="sm" className="hidden sm:inline-flex" />
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export const Header = memo(HeaderComponent);