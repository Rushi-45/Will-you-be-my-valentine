export const birthdayConfig = {
  senderName: "Rushi",

  eyebrow: "It's Your Special Day",

  subtext: "Tap each candle to blow it out",

  candleCount: 5,

  message:
    "Wishing you a birthday as bright and wonderful as you are. May this year bring you endless joy, laughter, and everything your heart desires!",

  success: {
    headline: "Happy Birthday",
    message:
      "From {senderName}, with all the love in the world. You deserve every single bit of happiness today — and every day that follows. Here's to you!",
    signature: "With love, {senderName}",
  },

  backgroundMusic: null as string | null,
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
