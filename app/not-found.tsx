import Link from "next/link";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";
import { occasions } from "@/config/occasions";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center dark:bg-slate-950">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Brand */}
        <Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
          <Heart className="h-4 w-4 fill-current" aria-hidden />
          Wishing Cards
        </Link>

        {/* 404 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-8xl font-extrabold tracking-tight text-rose-200 dark:text-rose-900 sm:text-9xl">
            404
          </p>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-slate-100 sm:text-3xl">
            This page doesn&apos;t exist
          </h1>
          <p className="max-w-sm text-sm text-stone-500 dark:text-slate-400">
            Maybe the link expired, or you followed a typo. Either way, there&apos;s a card waiting for someone below.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Browse all cards
          </Link>
          <Link
            href="javascript:history.back()"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-sm font-semibold text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Go back
          </Link>
        </div>

        {/* Quick occasion links */}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {occasions.map((o) => {
            const Icon = o.icon;
            return (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:border-rose-200 hover:shadow-sm hover:text-rose-600 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400"
              >
                <Icon className="h-3 w-3" aria-hidden />
                {o.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
