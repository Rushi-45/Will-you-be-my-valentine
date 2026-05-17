import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { occasions } from "@/config/occasions";
import { Header } from "@/components/Header";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Wishing Cards — Make Every Moment Special",
    description: "Create beautiful, personalized wishing cards for any occasion. Valentine's, birthdays, anniversaries, graduations, and more.",
    openGraph: {
      title: "Wishing Cards — Make Every Moment Special",
      description: "Create beautiful, personalized wishing cards for any occasion.",
    },
    twitter: {
      title: "Wishing Cards — Make Every Moment Special",
      description: "Create beautiful, personalized wishing cards for any occasion.",
    },
  };
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-stone-50 pt-14 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      {/* Hero Section */}
      <header className="w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="bg-linear-to-br from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Make Every Moment Special
          </h1>
          <p className="max-w-2xl text-balance text-lg text-stone-600 dark:text-slate-400 sm:text-xl">
            Create beautiful, personalized wishing cards for life&apos;s most meaningful moments.
            Just pick an occasion, personalize it, and share the love.
          </p>
        </div>
      </header>

      {/* Occasions Grid */}
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => {
            const Icon = occasion.icon;
            return (
              <Link
                key={occasion.slug}
                href={`/${occasion.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${occasion.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0 dark:group-hover:opacity-20`}
                />
                <div className="relative z-10 flex flex-col gap-4">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${occasion.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-slate-100">
                      {occasion.name}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">
                      {occasion.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                    <span>{occasion.implemented ? "Create card" : "Coming soon"}</span>
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200/60 bg-white/80 py-8 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6">
          <p className="text-sm text-stone-600 dark:text-slate-400">
            © {new Date().getFullYear()} Wishing Cards. Made with love.
          </p>
          <a
            href="https://www.instagram.com/rushiii.js"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          >
            <Heart className="h-4 w-4 fill-current" aria-hidden />
            <span>DM me on Instagram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
