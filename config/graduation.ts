export const graduationConfig = {
  senderName: "Rushi",

  eyebrow: "Congratulations, Graduate",

  headline: "You did it",

  message:
    "Years of hard work, late nights, and endless determination — and now you've done it. We couldn't be more proud of you!",

  success: {
    headline: "Congratulations",
    message:
      "From {senderName}, with so much pride and joy. The world is ready for you — go show them everything you're made of!",
    signature: "So proud of you, {senderName}",
  },
} as const;

export function replaceSenderName(text: string, name: string): string {
  return text.replace(/\{senderName\}/g, name);
}
