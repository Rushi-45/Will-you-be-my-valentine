export const anniversaryConfig = {
  senderName: "Rushi",

  eyebrow: "Happy Anniversary",

  headline: "A little something for you",

  openHint: "Tap the envelope to open",

  // Each line reveals individually in the success card — write them like a personal letter.
  letterLines: [
    "Every moment with you has been a treasure.",
    "Thank you for being my greatest adventure.",
    "Here's to forever — and every beautiful day in between.",
  ],

  success: {
    headline: "Happy Anniversary",
    message:
      "From {senderName}, with love that only grows deeper with every passing year. You are my favourite chapter.",
    signature: "Forever yours, {senderName}",
  },
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
