import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, Sparkles, Bookmark, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { getOrCreateUser } from "@/lib/db/users";
import { listUserCards } from "@/app/actions/cards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Wishing Cards dashboard.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");
  const firstName = user.firstName ?? user.email.split("@")[0] ?? "friend";
  const cards = await listUserCards();

  return (
    <main className="relative min-h-screen bg-stone-50 pt-24 pb-16 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      <Header />

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-8 px-4 sm:px-6">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/90 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 dark:border-rose-900/50 dark:bg-slate-900/80 dark:text-rose-300">
            <Heart className="h-3 w-3 fill-current" aria-hidden />
            Dashboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-4xl">
            Welcome, {firstName}!
          </h1>
          <p className="max-w-xl text-balance text-base text-stone-600 dark:text-slate-400">
            Your saved cards and shared-card activity will live here. Stay tuned — this space
            grows with the next release.
          </p>
        </header>

        {/* Saved cards summary */}
        <Link
          href="/dashboard/cards"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex items-center gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50">
              <Bookmark className="h-5 w-5 text-rose-500 dark:text-rose-400" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-800 dark:text-slate-100">
                {cards.length === 0 ? "No saved cards yet" : `${cards.length} saved card${cards.length === 1 ? "" : "s"}`}
              </h2>
              <p className="text-sm text-stone-600 dark:text-slate-400">
                {cards.length === 0
                  ? "Personalize a card and click Save to dashboard."
                  : "Browse, re-open, or share your saved cards."}
              </p>
            </div>
          </div>
          <ArrowRight
            className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-rose-500 dark:text-slate-500 dark:group-hover:text-rose-400"
            aria-hidden
          />
        </Link>

        <p className="text-xs text-stone-400 dark:text-slate-500">
          Account: {user.email} · created {user.createdAt.toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
