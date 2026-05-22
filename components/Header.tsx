"use client";

import Link from "next/link";
import { memo } from "react";
import { Heart } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip } from "@/components/ui/Tooltip";

// Add new page routes here as they are created
const NAV_LINKS: readonly { href: string; label: string }[] = [
  // { href: "/about", label: "About" },
  // { href: "/gallery", label: "Gallery" },
];

type HeaderProps = {
  senderName?: string | null;
  recipientName?: string | null;
  label?: string | null;
};

function HeaderComponent({ senderName, recipientName, label }: HeaderProps) {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-pink-100/50 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-rose-600 transition-all duration-150 hover:-translate-y-px hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
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
            <Tooltip label={`From ${senderName}`} placement="bottom">
              <Avatar
                name={senderName}
                size="sm"
                className="hidden sm:inline-flex"
              />
            </Tooltip>
          )}
          {recipientName && (
            <Tooltip label={`For ${recipientName}`} placement="bottom">
              <Avatar
                name={recipientName}
                size="sm"
                className="hidden sm:inline-flex"
              />
            </Tooltip>
          )}
          <ThemeToggle variant="inline" />
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-stone-700 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign in
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && <UserButton />}
        </div>
      </nav>
    </header>
  );
}

export const Header = memo(HeaderComponent);
