import type { Metadata } from "next";
<<<<<<< HEAD
import Link from "next/link";
import { Heart, Cake, Gift, GraduationCap, MessageCircleHeart, Stethoscope, Star } from "lucide-react";

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

const occasions = [
  {
    name: "Valentine's Day",
    slug: "valentines",
    description: "Ask someone to be your Valentine",
    icon: Heart,
    gradient: "from-rose-500 via-pink-500 to-rose-600",
    bgGradient: "from-rose-50 to-pink-50",
  },
  {
    name: "Birthday",
    slug: "birthday",
    description: "Celebrate their special day",
    icon: Cake,
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    description: "Celebrate your love story",
    icon: Gift,
    gradient: "from-purple-500 via-fuchsia-500 to-purple-600",
    bgGradient: "from-purple-50 to-fuchsia-50",
  },
  {
    name: "Graduation",
    slug: "graduation",
    description: "Congratulate their achievement",
    icon: GraduationCap,
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    name: "Thank You",
    slug: "thank-you",
    description: "Show your gratitude",
    icon: MessageCircleHeart,
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    name: "Get Well",
    slug: "get-well",
    description: "Wish them a speedy recovery",
    icon: Stethoscope,
    gradient: "from-green-500 via-lime-500 to-green-600",
    bgGradient: "from-green-50 to-lime-50",
  },
  {
    name: "Congratulations",
    slug: "congratulations",
    description: "Celebrate their big news",
    icon: Star,
    gradient: "from-indigo-500 via-violet-500 to-indigo-600",
    bgGradient: "from-indigo-50 to-violet-50",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-stone-50 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Hero Section */}
      <header className="w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="bg-linear-to-br from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Make Every Moment Special
          </h1>
          <p className="max-w-2xl text-balance text-lg text-stone-600 dark:text-slate-400 sm:text-xl">
            Create beautiful, personalized wishing cards for life's most meaningful moments.
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
                    <span>Create card</span>
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
=======
import { Suspense } from "react";
import { ValentinePage } from "@/components/ValentinePage";
import { valentineConfig } from "@/config/valentine";

type PageProps = {
  searchParams: Promise<{ name?: string }> | { name?: string };
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const name = params?.name?.trim();
  if (!name) return {};
  const title = `${capitalize(name)}, will you be my Valentine?`;
  const description = `A special Valentine's request for ${capitalize(name)}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ValentinePage />
    </Suspense>
>>>>>>> e188e05b6affeb9b869d1aaf38723e2d239ecfa1
  );
}
