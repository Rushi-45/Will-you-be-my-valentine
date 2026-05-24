import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, ArrowLeft, ExternalLink, Sparkles, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { DeleteCardButton } from "@/components/DeleteCardButton";
import { getOrCreateUser } from "@/lib/db/users";
import { listUserCardsWithStats } from "@/app/actions/cards";
import { occasions } from "@/config/occasions";

export const metadata: Metadata = {
  title: "Saved Cards",
  description: "Your saved Wishing Cards.",
  robots: { index: false, follow: false },
};

function cardUrlFor(occasion: string, recipientName: string | null, senderName: string | null) {
  const params = new URLSearchParams();
  if (recipientName) params.set("name", recipientName);
  if (senderName) params.set("sender", senderName);
  const q = params.toString();
  return `/${occasion}${q ? `?${q}` : ""}`;
}

function relativeTime(date: Date | null): string {
  if (!date) return "never";
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

export default async function CardsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");
  const cards = await listUserCardsWithStats();

  return (
    <main className="relative min-h-screen bg-stone-50 pt-24 pb-16 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      <Header />

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 px-4 sm:px-6">
        <header className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-stone-500 transition-colors hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to dashboard
          </Link>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/90 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-rose-600 dark:border-rose-900/50 dark:bg-slate-900/80 dark:text-rose-300">
            <Bookmark className="h-3 w-3" aria-hidden />
            Saved cards
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-slate-100 sm:text-4xl">
            {cards.length === 0 ? "No saved cards yet" : `${cards.length} saved card${cards.length === 1 ? "" : "s"}`}
          </h1>
        </header>

        {cards.length === 0 ? (
          <section className="rounded-2xl border border-stone-200/70 bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50">
              <Sparkles className="h-5 w-5 text-rose-500 dark:text-rose-400" aria-hidden />
            </div>
            <p className="mt-4 text-stone-600 dark:text-slate-400">
              Personalize a card with someone&apos;s name, then click &ldquo;Save to dashboard&rdquo;.
            </p>
            <Link
              href="/valentines?name=Friend"
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Try the Valentine card
            </Link>
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card) => {
              const meta = occasions.find((o) => o.slug === card.occasion);
              const Icon = meta?.icon;
              return (
                <li
                  key={card.id}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {Icon && (
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br ${meta?.gradient ?? "from-rose-400 to-pink-500"}`}
                        >
                          <Icon className="h-4 w-4 text-white" aria-hidden />
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
                          {meta?.name ?? card.occasion}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-slate-500">
                          {card.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <DeleteCardButton cardId={card.id} />
                  </div>
                  <p className="text-sm text-stone-700 dark:text-slate-300">
                    For{" "}
                    <span className="font-semibold text-stone-900 dark:text-slate-100">
                      {card.recipientName ?? "—"}
                    </span>
                    {card.senderName && (
                      <>
                        {" "}from{" "}
                        <span className="font-semibold text-stone-900 dark:text-slate-100">
                          {card.senderName}
                        </span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-[0.6875rem] font-medium text-stone-500 dark:text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" aria-hidden />
                      {card.viewCount} {card.viewCount === 1 ? "view" : "views"}
                    </span>
                    {card.lastViewedAt && (
                      <span>· last opened {relativeTime(card.lastViewedAt)}</span>
                    )}
                  </div>
                  <Link
                    href={cardUrlFor(card.occasion, card.recipientName, card.senderName)}
                    className="mt-auto inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    Open card
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
