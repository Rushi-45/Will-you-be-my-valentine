export const valentineConfig = {
  site: {
    title: "Will You Be My Valentine?",
    description: "Send a personalized Valentine's card — animated, shareable, and impossible to say no to.",
    favicon: "/intro-DzUiguR4.webp",
    url: null as string | null,
    ogImage: null as string | null,
    keywords: [
      "valentine",
      "valentines day",
      "proposal",
      "love",
      "valentine page",
    ],
  },

  senderName: "Rushi",

  eyebrow: "February 14 · Just Us",

  headline: {
    line1: "Will you be",
    line2: "my Valentine?",
  },

  promise:
    "I promise endless cuddles, cozy movie nights with our favorite kitties, and a lifetime supply of snacks. So, what do you say?",

  noButtonMessages: [
    "Are you sure?",
    "Really sure?",
    "Think again",
    "Last chance",
    "Please?",
  ] as const,

  success: {
    headline: "You said yes!",
    message:
      "Consider this your official invite from {senderName} to a Valentine's date filled with laughter, warmth, kitties, and way too many sweet moments.",
    signature: "With love, {senderName}",
  },

  images: {
    cornerCat: "/intro-DzUiguR4.webp",
    cryingCat: "/crying_cat.gif",
    huggingCat: "/hugging_cat.gif",
  },

  backgroundMusic: "/valentine-music.mp3",

  // Drop your photos into /public and list them here.
  // Each entry shows in the carousel after the recipient says Yes.
  gallery: [
    { src: "/intro-DzUiguR4.webp", caption: "Always the cutest" },
    { src: "/intro-DzUiguR4.webp", caption: "That cozy evening" },
    { src: "/intro-DzUiguR4.webp", caption: "Us, always" },
  ] as { src: string; caption?: string }[],
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
