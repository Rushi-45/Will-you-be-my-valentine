export type HowToStep = { name: string; text: string };

export type OccasionSeoContent = {
  slug: string;
  color: string; // Tailwind accent color class stem
  pageHeading: string;
  intro: string;
  useCases: string[];
  howToSteps: HowToStep[];
  messageIdeas: { label: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const occasionSeoContent: Record<string, OccasionSeoContent> = {
  valentines: {
    slug: "valentines",
    color: "rose",
    pageHeading: "How to Send a Personalized Valentine's Card Online",
    intro:
      "Sending a Valentine's card has never been easier — or more memorable. Wishing Cards lets you create a free, animated Valentine's card personalized with your recipient's name, complete with a playful 'Yes or No' experience they won't forget. No printing, no postage, just share a link.",
    useCases: [
      "Send to a partner, crush, or best friend",
      "Personalize with their name in the headline",
      "Share instantly via WhatsApp, iMessage, or copy link",
      "Works on every device — mobile, tablet, and desktop",
    ],
    howToSteps: [
      { name: "Open the card page", text: "Visit wishingcards.app/valentines in your browser." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL (e.g., wishingcards.app/valentines?name=Jane). The headline instantly reads 'Jane, will you be my Valentine?'" },
      { name: "Add your sender name (optional)", text: "Also add &sender=Rushi to include your name in the card signature." },
      { name: "Copy the link", text: "Copy the full personalized URL from your browser's address bar." },
      { name: "Share it", text: "Paste the link in WhatsApp, iMessage, email, or any messaging app. Your recipient opens it in their browser — no download needed." },
    ],
    messageIdeas: [
      {
        label: "Classic & sweet",
        text: "Every moment is better with you in it. Will you be my Valentine?",
      },
      {
        label: "Playful",
        text: "I asked the internet to find me a Valentine. It suggested you. Good call, internet.",
      },
      {
        label: "Heartfelt",
        text: "You're the reason I smile at my phone. Happy Valentine's Day.",
      },
      {
        label: "Funny",
        text: "I like you a latte. Be my Valentine?",
      },
    ],
    faqs: [
      {
        q: "How do I personalize a Valentine's card with someone's name?",
        a: "Add ?name=Jane to the URL (e.g. /valentines?name=Jane) and the headline will automatically read 'Jane, will you be my Valentine?' — no account or login required.",
      },
      {
        q: "Is this Valentine's card free to use?",
        a: "Yes, completely free. Create and share as many personalized Valentine's cards as you like.",
      },
      {
        q: "How do I share the Valentine's card?",
        a: "After creating your card, copy the link and send it via WhatsApp, iMessage, email, or any messaging app. The recipient opens it in their browser — no app download needed.",
      },
      {
        q: "What happens when they click Yes?",
        a: "The screen erupts into rose-colored confetti and a full-screen celebration overlay — it's a moment they'll screenshot and remember.",
      },
      {
        q: "Can I send the Valentine's card on behalf of someone else?",
        a: "Yes. Add ?sender=Rushi to the URL to personalize the sender's name in the card signature.",
      },
    ],
  },

  birthday: {
    slug: "birthday",
    color: "sky",
    pageHeading: "How to Send a Free Personalized Birthday Card Online",
    intro:
      "Make someone's birthday unforgettable with an animated birthday card they can actually interact with. Wishing Cards features a virtual birthday cake with real candles they blow out one by one — then a wishing screen before the confetti drops. Personalize it with their name and age in seconds.",
    useCases: [
      "Personalize with name and age for a fully custom card",
      "Recipient blows out the candles by tapping each one",
      "A 'Make a wish' interstitial adds drama before the reveal",
      "Share via WhatsApp or copy the link — no app download needed",
    ],
    howToSteps: [
      { name: "Open the birthday card", text: "Visit wishingcards.app/birthday in your browser." },
      { name: "Add their name", text: "Append ?name=Jane to the URL. The headline personalizes instantly." },
      { name: "Add their age", text: "Append &age=30 to show '30th Birthday' in the headline and display the correct number of candles." },
      { name: "Copy the personalized link", text: "Copy the full URL from your browser's address bar — it contains all the personalization." },
      { name: "Send it", text: "Share via WhatsApp, iMessage, email, or any app. The recipient opens it in their browser, taps each candle to blow it out, and makes a wish." },
    ],
    messageIdeas: [
      {
        label: "Warm & genuine",
        text: "Wishing you a day as bright as your smile and a year full of everything you deserve.",
      },
      {
        label: "Milestone birthday",
        text: "Another trip around the sun — here's to making this one your best yet.",
      },
      {
        label: "For a best friend",
        text: "Happy birthday to the person who knows all my secrets and still picks up the phone.",
      },
      {
        label: "Short & sweet",
        text: "Older, wiser, and still absolutely incredible. Happy birthday!",
      },
    ],
    faqs: [
      {
        q: "How do I create a free personalized birthday card online?",
        a: "Go to wishingcards.app/birthday and add ?name=Jane&age=30 to the URL. The card instantly personalizes with their name and the correct number of candles for their age — no sign-up required.",
      },
      {
        q: "Can I add the person's age to the birthday card?",
        a: "Yes. Add ?age=30 to the URL and the card will show '30th Birthday' in the headline and display exactly 30 candles (up to 8 for display purposes).",
      },
      {
        q: "How does the candle interaction work?",
        a: "The recipient taps each candle flame to blow it out. Once all candles are out, a 'Make a wish' starfield screen appears before the confetti celebration.",
      },
      {
        q: "Is the birthday card free?",
        a: "Yes — completely free, no account needed, unlimited shares.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes. The birthday card is fully optimized for mobile touch interactions, including the candle blow-out mechanic.",
      },
    ],
  },

  anniversary: {
    slug: "anniversary",
    color: "purple",
    pageHeading: "How to Send a Personalized Anniversary Card Online",
    intro:
      "Celebrate your love with an animated anniversary card that feels as special as the moment itself. Recipients open a sealed envelope, revealing a heartfelt message — then a sending interstitial with floating hearts before the final reveal. Perfect for partners, spouses, and anyone celebrating a milestone together.",
    useCases: [
      "Personalize with both names and number of years together",
      "Envelope unfold animation creates a reveal moment",
      "Purple and fuchsia palette fits romantic occasions",
      "Share the link privately or post it as a surprise",
    ],
    howToSteps: [
      { name: "Go to the anniversary card", text: "Visit wishingcards.app/anniversary in your browser." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL so the headline reads 'Happy Anniversary, Jane!'" },
      { name: "Add the years together", text: "Append &years=5 to the URL to display 'Happy 5th Anniversary.'" },
      { name: "Add your name", text: "Append &sender=Rushi so your name appears in the card signature." },
      { name: "Share the link", text: "Copy and paste the URL into WhatsApp, iMessage, or email. The recipient opens the card in their browser — no app needed." },
    ],
    messageIdeas: [
      {
        label: "Timeless",
        text: "Every year with you feels like both a lifetime and a single heartbeat.",
      },
      {
        label: "Milestone",
        text: "Ten years of choosing each other, every single day. Here's to ten thousand more.",
      },
      {
        label: "Playful",
        text: "Still my favorite person to argue about the thermostat with. Happy anniversary.",
      },
      {
        label: "Romantic",
        text: "You are the reason love songs make sense to me now.",
      },
    ],
    faqs: [
      {
        q: "How do I personalize an anniversary card with both names?",
        a: "Add ?name=Jane&sender=Rushi to the URL. The recipient's name appears in the headline and the sender's name appears in the signature at the bottom of the card.",
      },
      {
        q: "Can I add how many years we've been together?",
        a: "Yes. Add ?years=5 to the URL and the card will say 'Happy 5th Anniversary' in the headline.",
      },
      {
        q: "How does the envelope animation work?",
        a: "The card shows a sealed envelope. The recipient clicks to open it — the flap lifts with a 3D animation, then transitions to a romantic interstitial before the final message card.",
      },
      {
        q: "Is the anniversary card free?",
        a: "Yes — free, no account needed, shareable instantly.",
      },
      {
        q: "Can I use this for a wedding anniversary as well as a dating anniversary?",
        a: "Absolutely. The card works for any anniversary milestone — dating, marriage, work anniversaries, or any special date worth celebrating.",
      },
    ],
  },

  graduation: {
    slug: "graduation",
    color: "amber",
    pageHeading: "How to Send a Free Personalized Graduation Card Online",
    intro:
      "Celebrate a graduate's achievement with an animated card they'll actually interact with. Wishing Cards features a cap-toss mechanic — they toss their graduation cap into the air — followed by a golden interstitial and confetti burst before the final message. Perfect for high school, college, and graduate school milestones.",
    useCases: [
      "Personalize with name and graduation year",
      "Cap-toss interaction makes the reveal feel earned",
      "Gold and amber palette fits the graduation aesthetic",
      "Works for high school, college, or any educational milestone",
    ],
    howToSteps: [
      { name: "Open the graduation card", text: "Visit wishingcards.app/graduation in your browser." },
      { name: "Personalize with the graduate's name", text: "Add ?name=Jane to the URL. The headline will read 'Congratulations, Jane!'" },
      { name: "Add the graduation year", text: "Append &year=2025 to show 'Class of 2025' in the card headline." },
      { name: "Copy the link", text: "Copy the full personalized URL from your browser." },
      { name: "Send the card", text: "Share via WhatsApp, iMessage, or email. The graduate clicks to toss their cap and trigger the celebration." },
    ],
    messageIdeas: [
      {
        label: "Inspiring",
        text: "You didn't just cross the finish line — you rewrote what the finish line looks like.",
      },
      {
        label: "Warm",
        text: "The hardest part is officially over. The best part? It's just beginning.",
      },
      {
        label: "Funny",
        text: "You survived! Now go take a very long nap and then conquer the world.",
      },
      {
        label: "For a close friend",
        text: "I always knew you'd get here. I'm just glad I got to watch.",
      },
    ],
    faqs: [
      {
        q: "How do I send a personalized graduation card for free?",
        a: "Visit /graduation and add ?name=Jane&year=2025 to the URL. The card will show 'Class of 2025, Jane!' in the headline — no account required.",
      },
      {
        q: "How does the cap toss interaction work?",
        a: "The recipient clicks a button to toss their graduation cap. The cap animates upward, then a sparkle-filled walking interstitial plays before the confetti celebration and final message.",
      },
      {
        q: "Can I use this for high school and college graduation?",
        a: "Yes — the card works for any graduation milestone. Just personalize the year with ?year=2025 and it will read 'Class of 2025.'",
      },
      {
        q: "Is the graduation card free?",
        a: "Yes — completely free, no sign-up, unlimited shares.",
      },
      {
        q: "How do I share the card with the graduate?",
        a: "Copy the personalized link and send it via WhatsApp, iMessage, email, or any app. The recipient opens it in any browser — no download needed.",
      },
    ],
  },

  "thank-you": {
    slug: "thank-you",
    color: "emerald",
    pageHeading: "How to Send a Heartfelt Thank-You Card Online",
    intro:
      "A great thank-you card does more than say 'thanks' — it makes the person feel seen. Wishing Cards lets you send a personalized, animated thank-you card in seconds. The recipient watches a flower bloom as the message builds — a small moment that shows you took the time.",
    useCases: [
      "For anyone who showed up when it mattered",
      "Personalize with name and your own sender name",
      "Flower bloom interaction makes the delivery feel special",
      "Emerald and teal palette works for any heartfelt occasion",
    ],
    howToSteps: [
      { name: "Open the thank-you card", text: "Visit wishingcards.app/thank-you in your browser." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL. The headline reads 'Thank You, Jane!'" },
      { name: "Add your name", text: "Append &sender=Rushi to include your name in the signature." },
      { name: "Copy the personalized link", text: "Copy the URL from your browser's address bar." },
      { name: "Send it", text: "Share via WhatsApp, iMessage, email, or any messaging app. The recipient watches the flower bloom as your message unfolds." },
    ],
    messageIdeas: [
      {
        label: "Sincere",
        text: "What you did for me wasn't small. I want you to know I see it and I'm grateful.",
      },
      {
        label: "For a friend",
        text: "You showed up without being asked. That's the kind of person you are, and I'm lucky to know you.",
      },
      {
        label: "Professional",
        text: "Thank you for going above and beyond. It made a real difference.",
      },
      {
        label: "Simple & warm",
        text: "Saying thank you doesn't feel like enough, but I mean it with everything I have.",
      },
    ],
    faqs: [
      {
        q: "How do I send a personalized thank-you card online for free?",
        a: "Go to /thank-you and add ?name=Jane to the URL. The card personalizes instantly with their name — no account or download needed.",
      },
      {
        q: "How does the flower bloom interaction work?",
        a: "The card shows a wilted or budding flower. As the recipient interacts, it blooms fully — a symbolic moment that matches the message of gratitude.",
      },
      {
        q: "Can I use this as a professional thank-you card?",
        a: "Absolutely. The card's tone is warm but not overly personal, making it appropriate for colleagues, managers, teachers, and anyone who helped you professionally.",
      },
      {
        q: "Is the thank-you card free?",
        a: "Yes — free, no account, unlimited uses.",
      },
      {
        q: "How do I share the thank-you card?",
        a: "Copy the personalized link and send via WhatsApp, iMessage, email, or any messaging app. The card opens in any browser — no app needed.",
      },
    ],
  },

  "get-well": {
    slug: "get-well",
    color: "green",
    pageHeading: "How to Send a Free Personalized Get-Well Card Online",
    intro:
      "When someone you care about isn't feeling well, the right words — sent at the right moment — can genuinely lift their spirits. Wishing Cards offers an animated, personalized get-well card featuring a sunflower healing interaction. Warm, hopeful, and easy to share in seconds.",
    useCases: [
      "For someone recovering from illness, surgery, or a hard week",
      "Personalize with name to make it feel intentional",
      "Sunflower healing interaction matches the hopeful tone",
      "Green and lime palette feels bright and restorative",
    ],
    howToSteps: [
      { name: "Open the get-well card", text: "Visit wishingcards.app/get-well in your browser." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL. The headline will read 'Get Well Soon, Jane!'" },
      { name: "Add your name (optional)", text: "Append &sender=Rushi to show your name in the card signature." },
      { name: "Copy the link", text: "Copy the full personalized URL from your browser." },
      { name: "Send it", text: "Share via WhatsApp, iMessage, or email. The recipient sees the sunflower heal as they interact with the card." },
    ],
    messageIdeas: [
      {
        label: "Hopeful",
        text: "Tough days don't last forever — but tough people like you absolutely do.",
      },
      {
        label: "Light-hearted",
        text: "Get well soon. I miss your face and I need you back at full strength.",
      },
      {
        label: "Warm",
        text: "Rest, heal, and know that someone is thinking of you every single day.",
      },
      {
        label: "For a close friend",
        text: "The world is a little duller without you at your best. Heal fast.",
      },
    ],
    faqs: [
      {
        q: "How do I send a personalized get-well card online for free?",
        a: "Go to /get-well and add ?name=Jane to the URL. The card instantly personalizes with their name — free, no account required.",
      },
      {
        q: "How does the sunflower healing interaction work?",
        a: "The card displays a wilted sunflower. As the recipient interacts with the card, the sunflower gradually heals and blooms — a visual metaphor for recovery.",
      },
      {
        q: "Is this appropriate for serious illness or surgery recovery?",
        a: "Yes. The tone of the card is warm and hopeful without being overly cheerful, making it appropriate for someone going through a genuinely difficult health period.",
      },
      {
        q: "Is the get-well card free?",
        a: "Yes — completely free, no sign-up, unlimited shares.",
      },
      {
        q: "How do I share the card with someone who is ill?",
        a: "Copy the personalized link and send via WhatsApp, iMessage, or any messaging app. The card opens in any browser — the recipient doesn't need to download anything.",
      },
    ],
  },

  congratulations: {
    slug: "congratulations",
    color: "indigo",
    pageHeading: "How to Send a Free Personalized Congratulations Card Online",
    intro:
      "Great news deserves a great reaction. Wishing Cards lets you send an animated congratulations card with a party-popper interaction — the recipient pops the popper, triggering a star-filled celebration and confetti before the final message. Perfect for promotions, new jobs, engagements, new babies, and any achievement worth celebrating.",
    useCases: [
      "New job, promotion, or career milestone",
      "Engagement, new baby, or life achievement",
      "Party-popper mechanic makes the celebration feel real",
      "Indigo and violet palette fits any proud moment",
    ],
    howToSteps: [
      { name: "Open the congratulations card", text: "Visit wishingcards.app/congratulations in your browser." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL. The headline reads 'Congratulations, Jane!'" },
      { name: "Add your sender name", text: "Append &sender=Rushi to include your name in the signature." },
      { name: "Copy the personalized link", text: "Copy the full URL from your browser's address bar." },
      { name: "Share the celebration", text: "Send via WhatsApp, iMessage, email, or any app. The recipient pops the party popper and triggers the star-field celebration." },
    ],
    messageIdeas: [
      {
        label: "Achievement",
        text: "You set your sights on this and you went and did it. That's not luck — that's you.",
      },
      {
        label: "New job",
        text: "New job, new chapter. They're lucky to have you. Congratulations!",
      },
      {
        label: "Personal milestone",
        text: "Every big thing starts with one brave decision. Congratulations on making yours.",
      },
      {
        label: "Short & punchy",
        text: "You did it. We always knew you would. Congratulations!",
      },
    ],
    faqs: [
      {
        q: "How do I send a free personalized congratulations card online?",
        a: "Go to /congratulations and add ?name=Jane to the URL. The card personalizes with their name instantly — no account or sign-up needed.",
      },
      {
        q: "How does the party popper interaction work?",
        a: "The card shows a party popper. The recipient clicks to pop it — triggering a recoil animation, an indigo star-field interstitial, and a confetti burst before the final message card appears.",
      },
      {
        q: "What occasions is the congratulations card good for?",
        a: "Any achievement worth celebrating: new job, promotion, engagement, new baby, passing an exam, completing a project, or any personal milestone.",
      },
      {
        q: "Is the congratulations card free?",
        a: "Yes — free, no account, no limits on how many you send.",
      },
      {
        q: "How do I share the congratulations card?",
        a: "Copy the personalized link and send via WhatsApp, iMessage, email, or any messaging app. Opens in any browser — no download required.",
      },
    ],
  },
};
