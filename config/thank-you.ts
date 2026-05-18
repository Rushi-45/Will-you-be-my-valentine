export const thankYouConfig = {
  senderName: "Rushi",

  eyebrow: "A Little Thank You",

  headline: "Thank you",

  message:
    "Words can barely express how grateful I am for everything you do. You make a real difference — and I want you to know it.",

  success: {
    headline: "With so much gratitude",
    message:
      "Thank you for being exactly who you are. It means more than you know — from {senderName}, with all the appreciation in the world.",
    signature: "Gratefully yours, {senderName}",
  },
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
