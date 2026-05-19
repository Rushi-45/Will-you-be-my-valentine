"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center dark:bg-slate-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
          <Heart className="h-4 w-4 fill-current" aria-hidden />
          Wishing Cards
        </Link>

        <div className="flex flex-col items-center gap-2">
          <p className="text-6xl">💔</p>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-slate-100 sm:text-3xl">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-stone-500 dark:text-slate-400">
            An unexpected error occurred. Try refreshing — it usually fixes itself.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-sm font-semibold text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
