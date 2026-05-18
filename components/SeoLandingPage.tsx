import Link from "next/link";
import type { SeoLandingPage } from "@/config/seo-landing-pages";
import { siteConfig } from "@/config/site";

const colorMap: Record<string, {
  heroBg: string; heroText: string; heroSubtext: string;
  badge: string; heading: string;
  card: string; border: string; dot: string; step: string;
  ctaBg: string; ctaHover: string; ctaShadow: string;
  tagBorder: string; tagText: string;
}> = {
  rose:    { heroBg: "from-rose-50 via-pink-50/60 to-white dark:from-rose-950/50 dark:via-rose-900/20 dark:to-slate-950", heroText: "text-rose-700 dark:text-rose-300", heroSubtext: "text-stone-600 dark:text-slate-400", badge: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50", heading: "text-rose-700 dark:text-rose-300", card: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800/50", dot: "bg-rose-400", step: "bg-rose-500", ctaBg: "from-rose-500 via-pink-500 to-rose-600", ctaHover: "hover:shadow-rose-300/50", ctaShadow: "shadow-rose-300/30", tagBorder: "border-rose-200 dark:border-rose-800", tagText: "text-rose-600 dark:text-rose-400" },
  sky:     { heroBg: "from-sky-50 via-blue-50/60 to-white dark:from-sky-950/50 dark:via-sky-900/20 dark:to-slate-950", heroText: "text-sky-700 dark:text-sky-300", heroSubtext: "text-stone-600 dark:text-slate-400", badge: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50", heading: "text-sky-700 dark:text-sky-300", card: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-200 dark:border-sky-800/50", dot: "bg-sky-400", step: "bg-sky-500", ctaBg: "from-sky-500 via-blue-500 to-sky-600", ctaHover: "hover:shadow-sky-300/50", ctaShadow: "shadow-sky-300/30", tagBorder: "border-sky-200 dark:border-sky-800", tagText: "text-sky-600 dark:text-sky-400" },
  purple:  { heroBg: "from-purple-50 via-fuchsia-50/60 to-white dark:from-purple-950/50 dark:via-purple-900/20 dark:to-slate-950", heroText: "text-purple-700 dark:text-purple-300", heroSubtext: "text-stone-600 dark:text-slate-400", badge: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50", heading: "text-purple-700 dark:text-purple-300", card: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800/50", dot: "bg-purple-400", step: "bg-purple-500", ctaBg: "from-purple-500 via-fuchsia-500 to-purple-600", ctaHover: "hover:shadow-purple-300/50", ctaShadow: "shadow-purple-300/30", tagBorder: "border-purple-200 dark:border-purple-800", tagText: "text-purple-600 dark:text-purple-400" },
  amber:   { heroBg: "from-amber-50 via-yellow-50/60 to-white dark:from-amber-950/50 dark:via-amber-900/20 dark:to-slate-950", heroText: "text-amber-700 dark:text-amber-300", heroSubtext: "text-stone-600 dark:text-slate-400", badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50", heading: "text-amber-700 dark:text-amber-300", card: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800/50", dot: "bg-amber-400", step: "bg-amber-500", ctaBg: "from-amber-500 via-yellow-500 to-amber-600", ctaHover: "hover:shadow-amber-300/50", ctaShadow: "shadow-amber-300/30", tagBorder: "border-amber-200 dark:border-amber-800", tagText: "text-amber-600 dark:text-amber-400" },
  indigo:  { heroBg: "from-indigo-50 via-violet-50/60 to-white dark:from-indigo-950/50 dark:via-indigo-900/20 dark:to-slate-950", heroText: "text-indigo-700 dark:text-indigo-300", heroSubtext: "text-stone-600 dark:text-slate-400", badge: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50", heading: "text-indigo-700 dark:text-indigo-300", card: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800/50", dot: "bg-indigo-400", step: "bg-indigo-500", ctaBg: "from-indigo-500 via-violet-500 to-indigo-600", ctaHover: "hover:shadow-indigo-300/50", ctaShadow: "shadow-indigo-300/30", tagBorder: "border-indigo-200 dark:border-indigo-800", tagText: "text-indigo-600 dark:text-indigo-400" },
};
const fallback = colorMap.rose;

type Props = { page: SeoLandingPage };

export function SeoLandingPageComponent({ page }: Props) {
  const c = colorMap[page.color] ?? fallback;
  const baseUrl = siteConfig.url || "https://wishingcards.app";
  const pageUrl = `${baseUrl}/${page.slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.h1,
    description: page.tagline,
    step: page.howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: [{ "@type": "HowToTool", name: "A web browser" }],
    totalTime: "PT1M",
    url: pageUrl,
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.h1,
    url: `${baseUrl}/${page.cardSlug}`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: "Free, personalized, animated, shareable",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wishing Cards", item: baseUrl },
      { "@type": "ListItem", position: 2, name: page.h1, item: pageUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <header className={`w-full bg-linear-to-b ${c.heroBg} border-b border-stone-200/60 dark:border-slate-800`}>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone-500 dark:text-slate-500">
            <Link href="/" className="hover:underline">Wishing Cards</Link>
            <span aria-hidden>›</span>
            <Link href={`/${page.cardSlug}`} className="hover:underline capitalize">{page.cardSlug.replace(/-/g, " ")}</Link>
            <span aria-hidden>›</span>
            <span aria-current="page" className="truncate max-w-[180px] text-stone-700 dark:text-slate-300">{page.targetKeyword}</span>
          </nav>

          <span className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.15em] ${c.badge}`}>
            {page.emoji} Free · Animated · Personalized
          </span>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-4xl dark:text-slate-50">
            {page.h1}
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-slate-400">
            {page.tagline}
          </p>

          {/* Primary CTA */}
          <Link
            href={`/${page.cardSlug}`}
            className={`inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-linear-to-r ${c.ctaBg} px-8 py-3.5 text-sm font-semibold text-white shadow-lg ${c.ctaShadow} transition-all duration-200 hover:scale-[1.03] ${c.ctaHover} hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            <span className="text-base">{page.emoji}</span>
            Open the card — it&apos;s free
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <p className="mt-3 text-xs text-stone-500 dark:text-slate-500">No sign-up required · Works on all devices · Share instantly</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">

        {/* Body content */}
        <section className="mb-12" aria-label="About">
          <div className="space-y-4">
            {page.body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-stone-700 sm:text-base dark:text-slate-300">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* How to send */}
        <section className="mb-12" aria-label="How to send">
          <h2 className={`mb-5 text-xl font-bold sm:text-2xl ${c.heading}`}>
            How to send this card (step by step)
          </h2>
          <ol className="space-y-4">
            {page.howToSteps.map((step, i) => (
              <li key={step.name} className="flex items-start gap-3.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${c.step}`}>
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-stone-800 dark:text-slate-200">{step.name}</p>
                  <p className="mt-0.5 text-sm text-stone-600 dark:text-slate-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Message ideas */}
        <section className="mb-12" aria-label="Message ideas">
          <h2 className={`mb-5 text-xl font-bold sm:text-2xl ${c.heading}`}>
            What to write — message ideas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {page.messageIdeas.map((idea) => (
              <div key={idea.label} className={`rounded-xl border p-4 ${c.card} ${c.border}`}>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${c.heading}`}>{idea.label}</p>
                <p className="text-sm italic leading-relaxed text-stone-600 dark:text-slate-400">
                  &ldquo;{idea.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Wishing Cards */}
        <section className={`mb-12 rounded-2xl border p-6 ${c.card} ${c.border}`} aria-label="Why use Wishing Cards">
          <h2 className={`mb-4 text-xl font-bold sm:text-2xl ${c.heading}`}>
            Why Wishing Cards?
          </h2>
          <ul className="space-y-3">
            {[
              { title: "Completely free", desc: "No account, no subscription, no hidden costs. Create unlimited personalized cards." },
              { title: "Personalized with their name", desc: "Add ?name=Jane to the URL — the card updates instantly without any design tools." },
              { title: "Interactive animations", desc: "Each card has a unique interaction mechanic. Not just a static image — a real experience." },
              { title: "Works on every device", desc: "Opens in any browser on iPhone, Android, tablet, or desktop. No app download needed." },
              { title: "Share in seconds", desc: "Copy the link and send via WhatsApp, iMessage, email, or any messaging app." },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} aria-hidden />
                <div>
                  <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">{item.title} — </span>
                  <span className="text-sm text-stone-600 dark:text-slate-400">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className={`mb-5 text-xl font-bold sm:text-2xl ${c.heading}`}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {page.faqs.map((faq) => (
              <details key={faq.q} className={`group rounded-xl border ${c.border} ${c.card}`}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 text-sm font-medium text-stone-800 marker:content-none dark:text-slate-200">
                  {faq.q}
                  <svg
                    className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 ${c.heading}`}
                    viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-stone-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className={`rounded-2xl border p-8 text-center ${c.card} ${c.border}`}>
          <p className="mb-2 text-2xl">{page.emoji}</p>
          <h2 className="mb-2 text-xl font-bold text-stone-900 dark:text-slate-50">
            Ready to send?
          </h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-slate-400">
            Open the card, personalize the URL with their name, and share the link. Takes less than a minute.
          </p>
          <Link
            href={`/${page.cardSlug}`}
            className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-linear-to-r ${c.ctaBg} px-7 py-3 text-sm font-semibold text-white shadow-lg ${c.ctaShadow} transition-all hover:scale-[1.03] ${c.ctaHover} hover:shadow-xl`}
          >
            Open the {page.cardSlug.replace(/-/g, " ")} card — free
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </section>

        {/* Related pages */}
        {page.relatedPages.length > 0 && (
          <section className="mt-10" aria-label="Related">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-500">
              Related guides
            </h3>
            <div className="flex flex-wrap gap-2">
              {page.relatedPages.map((rel) => (
                <Link
                  key={rel.href}
                  href={rel.href}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-stone-100 dark:hover:bg-slate-800 ${c.tagBorder} ${c.tagText}`}
                >
                  {rel.label}
                </Link>
              ))}
              <Link
                href="/"
                className="rounded-full border border-stone-200 px-4 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                All occasions →
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
