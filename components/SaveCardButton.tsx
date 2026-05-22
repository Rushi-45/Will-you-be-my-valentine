"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Bookmark, Check, LogIn } from "lucide-react";
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
  const [saved, setSaved] = useState(false);
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

  if (saved) {
    return (
      <Link
        href="/dashboard/cards"
        className={`${baseClass} border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60`}
      >
        <Check className="h-5 w-5 shrink-0" aria-hidden />
        <span>Saved — view in dashboard</span>
      </Link>
    );
  }

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await saveCard({ occasion, recipientName, senderName });
        setSaved(true);
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
