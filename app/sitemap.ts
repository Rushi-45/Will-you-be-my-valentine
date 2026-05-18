import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { seoLandingPageSlugs } from "@/config/seo-landing-pages";

const base = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const occasionPages: MetadataRoute.Sitemap = [
    { url: `${base}/valentines`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/birthday`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/anniversary`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/graduation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/thank-you`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/get-well`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/congratulations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  const landingPages: MetadataRoute.Sitemap = seoLandingPageSlugs.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...occasionPages,
    ...landingPages,
  ];
}
