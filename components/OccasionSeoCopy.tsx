import type { OccasionSeoContent } from "@/config/seo-content";
import { siteConfig } from "@/config/site";

const colorMap: Record<string, { heading: string; badge: string; card: string; border: string; dot: string; step: string }> = {
  rose:    { heading: "text-rose-700 dark:text-rose-300",    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",    card: "bg-rose-50 dark:bg-rose-950/30",    border: "border-rose-200 dark:border-rose-800/50",    dot: "bg-rose-400",    step: "bg-rose-500" },
  sky:     { heading: "text-sky-700 dark:text-sky-300",      badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",        card: "bg-sky-50 dark:bg-sky-950/30",      border: "border-sky-200 dark:border-sky-800/50",      dot: "bg-sky-400",     step: "bg-sky-500" },
  purple:  { heading: "text-purple-700 dark:text-purple-300",badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",card: "bg-purple-50 dark:bg-purple-950/30",border: "border-purple-200 dark:border-purple-800/50",dot: "bg-purple-400",  step: "bg-purple-500" },
  amber:   { heading: "text-amber-700 dark:text-amber-300",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",  card: "bg-amber-50 dark:bg-amber-950/30",  border: "border-amber-200 dark:border-amber-800/50",  dot: "bg-amber-400",   step: "bg-amber-500" },
  emerald: { heading: "text-emerald-700 dark:text-emerald-300",badge:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",card:"bg-emerald-50 dark:bg-emerald-950/30",border:"border-emerald-200 dark:border-emerald-800/50",dot:"bg-emerald-400",step:"bg-emerald-500"},
  green:   { heading: "text-green-700 dark:text-green-300",  badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",  card: "bg-green-50 dark:bg-green-950/30",  border: "border-green-200 dark:border-green-800/50",  dot: "bg-green-400",   step: "bg-green-500" },
  indigo:  { heading: "text-indigo-700 dark:text-indigo-300",badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",card: "bg-indigo-50 dark:bg-indigo-950/30",border: "border-indigo-200 dark:border-indigo-800/50",dot: "bg-indigo-400",  step: "bg-indigo-500" },
};

const fallback = colorMap.rose;

type Props = { content: OccasionSeoContent };

export function OccasionSeoCopy({ content }: Props) {
  const c = colorMap[content.color] ?? fallback;
  const baseUrl = siteConfig.url || "https://wishingcards.app";
  const pageUrl = `${baseUrl}/${content.slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.pageHeading,
    description: content.intro,
    step: content.howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: [{ "@type": "HowToTool", name: "A web browser" }],
    supply: [{ "@type": "HowToSupply", name: "Recipient's name" }],
    totalTime: "PT1M",
    url: pageUrl,
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.pageHeading.replace("How to Send a ", "").replace("How to Send an ", ""),
    url: pageUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: content.useCases.join(", "),
  };

  return (
    <section
      aria-label="About this card"
      className="mx-auto mt-16 w-full max-w-2xl px-4 pb-32 sm:px-6"
    >
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />

      {/* Page heading + intro */}
      <h2 className={`mb-3 text-xl font-semibold sm:text-2xl ${c.heading}`}>
        {content.pageHeading}
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-stone-600 sm:text-base dark:text-slate-400">
        {content.intro}
      </p>

      {/* What you can do */}
      <div className={`mb-8 rounded-xl border p-5 ${c.card} ${c.border}`}>
        <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${c.heading}`}>
          What you can do
        </h3>
        <ul className="space-y-2">
          {content.useCases.map((uc) => (
            <li key={uc} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-slate-300">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} aria-hidden />
              {uc}
            </li>
          ))}
        </ul>
      </div>

      {/* How to send this card */}
      <div className="mb-8">
        <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${c.heading}`}>
          How to send this card
        </h3>
        <ol className="space-y-3">
          {content.howToSteps.map((step, i) => (
            <li key={step.name} className="flex items-start gap-3">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.step}`}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-slate-200">{step.name}</p>
                <p className="mt-0.5 text-sm text-stone-600 dark:text-slate-400">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Message ideas */}
      <div className="mb-8">
        <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${c.heading}`}>
          Message ideas
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.messageIdeas.map((idea) => (
            <div key={idea.label} className={`rounded-xl border p-4 ${c.card} ${c.border}`}>
              <p className={`mb-1.5 text-xs font-medium ${c.heading}`}>{idea.label}</p>
              <p className="text-sm italic leading-relaxed text-stone-600 dark:text-slate-400">
                &ldquo;{idea.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${c.heading}`}>
          Frequently asked questions
        </h3>
        <div className="space-y-3">
          {content.faqs.map((faq) => (
            <details key={faq.q} className={`group rounded-xl border ${c.border} ${c.card}`}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 text-sm font-medium text-stone-800 marker:content-none dark:text-slate-200">
                {faq.q}
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 ${c.heading}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-stone-600 dark:text-slate-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
