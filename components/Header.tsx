"use client";

import Link from "next/link";
import { memo } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

// Add new page routes here as they are created
const NAV_LINKS: readonly { href: string; label: string }[] = [
  // { href: "/about", label: "About" },
  // { href: "/gallery", label: "Gallery" },
];

type HeaderProps = {
  senderName?: string | null;
  recipientName?: string | null;
  label?: string | null;
  /** Minimal mode: heart icon only + ThemeToggle. Used on card routes to avoid breaking immersion. */
  minimal?: boolean;
};

function HeaderComponent({ senderName, recipientName, label, minimal }: HeaderProps) {
  if (minimal) {
    const centerLabel = recipientName
      ? `For ${recipientName} ♥`
      : "Valentine's Day";
    return (
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-pink-100/40 bg-white/70 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
        <nav className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left: subtle back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-[0.6875rem] font-medium text-stone-400 transition-colors hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
          >
            <ArrowLeft
              className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            <span>Home</span>
          </Link>

          {/* Center: occasion / recipient label */}
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full border border-rose-200/60 bg-white/80 px-3 py-0.5 text-[0.6875rem] font-semibold text-rose-500/80 backdrop-blur-sm dark:border-rose-900/40 dark:bg-slate-900/80 dark:text-rose-400/80">
            {centerLabel}
          </span>

          {/* Right: theme toggle */}
          <ThemeToggle variant="inline" />
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-pink-100/50 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <Heart
            className="h-4 w-4 fill-current transition-transform group-hover:scale-110"
            aria-hidden
          />
          <span>Wishing Cards</span>
        </Link>

        {label && (
          <span className="hidden rounded-full border border-rose-200/70 bg-white px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-rose-600 sm:inline-block dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300">
            {label}
          </span>
        )}

        <div className="flex items-center gap-3">
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

          {senderName && (
            <Avatar
              name={senderName}
              size="sm"
              className="hidden sm:inline-flex"
            />
          )}
          {recipientName && (
            <Avatar
              name={recipientName}
              size="sm"
              className="hidden sm:inline-flex"
            />
          )}
          <ThemeToggle variant="inline" />
        </div>
      </nav>
    </header>
  );
}

export const Header = memo(HeaderComponent);
