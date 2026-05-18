import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoLandingPage, seoLandingPageSlugs } from "@/config/seo-landing-pages";
import { SeoLandingPageComponent } from "@/components/SeoLandingPage";
import { siteConfig } from "@/config/site";

type PageProps = { params: Promise<{ slug: string }> | { slug: string } };

export function generateStaticParams() {
  return seoLandingPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const page = getSeoLandingPage(slug);
  if (!page) return {};

  const base = siteConfig.url;
  const url = base ? `${base}/${slug}` : undefined;

  return {
    title: page.h1,
    description: page.tagline,
    keywords: [page.targetKeyword, "free", "personalized", "animated", "online", "shareable", "wishing cards"],
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: page.h1,
      description: page.tagline,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: page.h1,
      description: page.tagline,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SeoLandingRoute({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);
  const page = getSeoLandingPage(slug);
  if (!page) notFound();

  return <SeoLandingPageComponent page={page} />;
}
