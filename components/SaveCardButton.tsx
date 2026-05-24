"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Bookmark, Check, LogIn, Link2, Copy } from "lucide-react";
import { saveCard } from "@/app/actions/cards";

type Props = {
  occasion: string;
  recipientName?: string | null;
  senderName?: string | null;
};

const baseClass =
  "inline-flex min-h-[48px] shrink-0 cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl border px-5 py-3 text-[0.9375rem] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:cursor-default disabled:opacity-60 sm:px-6";

export function SaveCardButton({ occasion, recipientName, senderName }: Props) {
  const { isLoaded, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          type="button"
          className={`${baseClass} border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`}
        >
          <LogIn className="h-5 w-5 shrink-0" aria-hidden />
          <span>Sign in to save</span>
        </button>
      </SignInButton>
    );
  }

  if (savedId) {
    const trackableUrl =
      typeof window !== "undefined" ? `${window.location.origin}/c/${savedId}` : `/c/${savedId}`;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(trackableUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // best-effort
      }
    };

    return (
      <div className="flex w-full flex-col items-stretch gap-2 sm:items-center">
        <div className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          <span>Saved!</span>
          <Link
            href="/dashboard/cards"
            className="ml-1 cursor-pointer underline-offset-2 hover:underline"
          >
            View dashboard
          </Link>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="group inline-flex w-full max-w-md cursor-pointer items-center gap-2 rounded-xl border border-rose-200/70 bg-white/80 px-3 py-2.5 text-left transition-all duration-200 hover:border-rose-300 hover:shadow-sm dark:border-rose-900/40 dark:bg-slate-900/80 dark:hover:border-rose-700"
          aria-label="Copy trackable link"
        >
          <Link2 className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" aria-hidden />
          <span className="flex-1 truncate font-mono text-xs text-stone-600 dark:text-slate-400">
            {trackableUrl}
          </span>
          {copied ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <Check className="h-3.5 w-3.5" aria-hidden />
              Copied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition-colors group-hover:text-rose-700 dark:text-rose-400 dark:group-hover:text-rose-300">
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copy
            </span>
          )}
        </button>
        <p className="text-[0.6875rem] text-stone-500 dark:text-slate-500">
          Share this link to see who opens it on your dashboard.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const card = await saveCard({ occasion, recipientName, senderName });
        setSavedId(card.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className={`${baseClass} border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950/70`}
      >
        <Bookmark className="h-5 w-5 shrink-0" aria-hidden />
        <span>{isPending ? "Saving…" : "Save to dashboard"}</span>
      </button>
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
