export const getWellConfig = {
  senderName: "Rushi",

  eyebrow: "Sending You Healing Vibes",

  headline: "Get well soon",

  message:
    "Rest up, take it easy, and know that you are in my thoughts every single day. You'll be back to your wonderful self in no time!",

  success: {
    headline: "Wishing you a speedy recovery",
    message:
      "Sending all the healing energy your way — from {senderName}, with so much care and warmth.",
    signature: "Thinking of you, {senderName}",
  },
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
