import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Bookmark,
  Eye,
  TrendingUp,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Header } from "@/components/Header";
import { isAdmin } from "@/lib/auth/admin";
import {
  getAdminStats,
  getTopViewedCards,
  getRecentUsers,
  getRecentCards,
  getOccasionBreakdown,
} from "@/lib/db/admin";
import { occasions } from "@/config/occasions";

export const metadata: Metadata = {
  title: "Admin",
  description: "Wishing Cards admin dashboard.",
  robots: { index: false, follow: false },
};

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return date.toLocaleDateString();
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/dashboard");

  const [stats, topCards, recentUsers, recentCards, occasionBreakdown] = await Promise.all([
    getAdminStats(),
    getTopViewedCards(10),
    getRecentUsers(8),
    getRecentCards(8),
    getOccasionBreakdown(),
  ]);

  const maxOccasionCount = Math.max(...occasionBreakdown.map((o) => o.cardCount), 1);

  const tiles = [
    { label: "Users", value: stats.users, Icon: Users, tint: "from-rose-100 to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50", color: "text-rose-500 dark:text-rose-400" },
    { label: "Saved cards", value: stats.cards, Icon: Bookmark, tint: "from-pink-100 to-fuchsia-100 dark:from-pink-950/50 dark:to-fuchsia-950/50", color: "text-pink-500 dark:text-pink-400" },
    { label: "Total views", value: stats.views, Icon: Eye, tint: "from-violet-100 to-indigo-100 dark:from-violet-950/50 dark:to-indigo-950/50", color: "text-violet-500 dark:text-violet-400" },
    { label: "Avg views/card", value: stats.avgViewsPerCard, Icon: TrendingUp, tint: "from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50", color: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <main className="relative min-h-screen bg-stone-50 pt-24 pb-16 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      <Header />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <header className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-stone-500 transition-colors hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to dashboard
          </Link>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-50/80 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <Shield className="h-3 w-3" aria-hidden />
            Admin
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-4xl">
            Platform overview
          </h1>
        </header>

        {/* Stat tiles */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {tiles.map(({ label, value, Icon, tint, color }) => (
            <div
              key={label}
              className="flex flex-col gap-3 rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${tint}`}>
                <Icon className={`h-4 w-4 ${color}`} aria-hidden />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-50">
                  {value}
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Per-occasion breakdown */}
        {occasionBreakdown.length > 0 && (
          <section className="rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-slate-100">
              Cards by occasion
            </h2>
            <ul className="flex flex-col gap-3">
              {occasionBreakdown.map((row) => {
                const meta = occasions.find((o) => o.slug === row.occasion);
                const pct = (row.cardCount / maxOccasionCount) * 100;
                return (
                  <li key={row.occasion} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm font-medium text-stone-700 dark:text-slate-300">
                      {meta?.name ?? row.occasion}
                    </span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-slate-800">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-rose-400 to-pink-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-stone-800 dark:text-slate-100">
                      {row.cardCount}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Two-column: top cards + recent activity */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top viewed cards */}
          <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-slate-100">
              Top viewed cards
            </h2>
            {topCards.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-slate-400">No cards yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-stone-100 dark:divide-slate-800">
                {topCards.map((card, i) => {
                  const meta = occasions.find((o) => o.slug === card.occasion);
                  return (
                    <li key={card.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600 dark:bg-slate-800 dark:text-slate-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-800 dark:text-slate-100">
                          {meta?.name ?? card.occasion}
                          {card.recipientName && (
                            <span className="ml-1 text-stone-500 dark:text-slate-400">
                              · {card.recipientName}
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-stone-500 dark:text-slate-500">
                          by {card.ownerEmail}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-stone-700 dark:text-slate-300">
                        <Eye className="h-3 w-3" aria-hidden />
                        {card.viewCount}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Recent users */}
          <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-slate-100">
              Recent signups
            </h2>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-slate-400">No users yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-stone-100 dark:divide-slate-800">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-pink-100 text-xs font-semibold text-rose-600 dark:from-rose-950/50 dark:to-pink-950/50 dark:text-rose-300">
                      {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800 dark:text-slate-100">
                        {u.firstName ?? u.email.split("@")[0]}
                      </p>
                      <p className="truncate text-xs text-stone-500 dark:text-slate-500">
                        {u.email}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-stone-400 dark:text-slate-500">
                      {relativeTime(u.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recent cards full-width */}
        <section className="rounded-2xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-slate-100">
            Recently saved cards
          </h2>
          {recentCards.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-slate-400">No cards saved yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-stone-100 dark:divide-slate-800">
              {recentCards.map((card) => {
                const meta = occasions.find((o) => o.slug === card.occasion);
                return (
                  <li key={card.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
                      {meta?.name ?? card.occasion}
                    </span>
                    <span className="text-sm text-stone-700 dark:text-slate-300">
                      For{" "}
                      <span className="font-semibold text-stone-900 dark:text-slate-100">
                        {card.recipientName ?? "—"}
                      </span>
                    </span>
                    <span className="ml-auto truncate text-xs text-stone-500 dark:text-slate-500">
                      {card.ownerEmail} · {relativeTime(card.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
