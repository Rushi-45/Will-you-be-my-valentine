import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const base = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/valentines`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/birthday`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/anniversary`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/graduation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/thank-you`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/get-well`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/congratulations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
