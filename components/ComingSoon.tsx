import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Occasion } from "@/config/occasions";
import { Header } from "@/components/Header";

type Props = {
  occasion: Occasion;
};

export function ComingSoon({ occasion }: Props) {
  const Icon = occasion.icon;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 pt-20 pb-16 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      <Header label={occasion.name} />
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${occasion.bgGradient} opacity-60 dark:opacity-20`}
      />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <div
          className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${occasion.gradient} shadow-lg`}
        >
          <Icon className="h-10 w-10 text-white" aria-hidden />
        </div>

        <h1 className="bg-linear-to-br from-rose-700 via-pink-600 to-rose-800 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {occasion.name}
        </h1>

        <p className="text-base text-stone-600 dark:text-slate-400 sm:text-lg">
          {occasion.description}
        </p>

        <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">
          Coming soon
        </p>

        <p className="max-w-md text-balance text-[0.9375rem] leading-relaxed text-stone-600 dark:text-slate-400">
          We&apos;re putting the finishing touches on this card. In the
          meantime, check out our Valentine&apos;s page or come back soon.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>Back to all occasions</span>
          </Link>
          <Link
            href="/valentines"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(190,18,60,0.35)] transition-shadow hover:shadow-[0_6px_18px_-2px_rgba(190,18,60,0.45)]"
          >
            See the Valentine card
          </Link>
        </div>
      </div>
    </main>
  );
}
