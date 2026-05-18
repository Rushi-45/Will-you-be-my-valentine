export const congratulationsConfig = {
  senderName: "Rushi",

  eyebrow: "Big News Deserves Big Cheers",

  headline: "Congratulations",

  message:
    "This is YOUR moment — you've earned every bit of it. Cheering you on from the sidelines with the biggest smile on my face!",

  success: {
    headline: "So incredibly proud of you",
    message:
      "Here's to your amazing achievement — from {senderName}, with so much joy and excitement for what's ahead.",
    signature: "Cheering you on, {senderName}",
  },
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
