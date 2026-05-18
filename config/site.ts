// Global brand config — set NEXT_PUBLIC_SITE_URL in your deployment environment
// e.g. https://wishingcards.app

export const siteConfig = {
  name: "Wishing Cards",
  tagline: "Make Every Moment Special",
  description:
    "Beautiful, personalized wishing cards for every occasion — Valentine's Day, birthdays, anniversaries, graduations, and more. Animated, shareable, and free.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  favicon: "/intro-DzUiguR4.webp",
  keywords: [
    "wishing cards",
    "personalized greeting cards",
    "digital cards online",
    "birthday card",
    "anniversary card",
    "valentines day card",
    "graduation card",
    "thank you card",
    "get well soon card",
    "congratulations card",
    "animated greeting cards",
    "free digital greeting cards",
    "shareable cards",
    "custom cards",
    "send a card online",
  ],
} as const;
