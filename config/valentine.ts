/**
 * Valentine page config — edit this file to customize the template.
 * All copy, names, and image paths are in one place for easy resale/white-label.
 */

export const valentineConfig = {
  /** Site metadata (tab title, SEO, favicon) */
  site: {
    title: "Will You Be My Valentine?",
    description: "A cute Valentine page.",
    favicon: "/letter-C680mUtz.webp",
  },

  /** Name of the person sending the Valentine (shows in success message & signature) */
  senderName: "Rushi",

  /** Optional: short tagline under the main headline (e.g. "February 14 · Just Us") */
  eyebrow: "February 14 · Just Us",

  /** Main question headline (line 1 and line 2) */
  headline: {
    line1: "Will you be",
    line2: "my Valentine?",
  },

  /** The promise paragraph above the Yes/No buttons */
  promise:
    "I promise endless cuddles, cozy movie nights with our favorite kitties, and a lifetime supply of snacks. So, what do you say?",

  /** Messages shown when the user clicks "No" (in order) */
  noButtonMessages: [
    "Are you sure?",
    "Really sure?",
    "Think again",
    "Last chance",
    "Please?",
  ] as const,

  /** Success screen */
  success: {
    headline: "You said yes!",
    message:
      "Consider this your official invite from {senderName} to a Valentine's date filled with laughter, warmth, kitties, and way too many sweet moments.",
    signature: "With love, {senderName}",
  },

  /** Image paths (place files in /public). Use these paths as in <img src={...} /> or Image src. */
  images: {
    /** Cat in the top-right corner (question + success screens) */
    cornerCat: "/intro-DzUiguR4.webp",
    /** Shown when user clicks "No" */
    cryingCat: "/crying_cat.gif",
    /** Shown when user clicks "Yes" (success screen) */
    huggingCat: "/hugging_cat.gif",
  },
} as const;

/** Helper: replace {senderName} in strings */
export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
