import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Wishing Cards",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fdf2f8",
    theme_color: "#be185d",
    orientation: "portrait",
    icons: [
      { src: "/intro-DzUiguR4.webp", sizes: "192x192", type: "image/webp" },
      { src: "/intro-DzUiguR4.webp", sizes: "512x512", type: "image/webp" },
    ],
    categories: ["entertainment", "social", "lifestyle"],
    screenshots: [],
  };
}
