export type SeoLandingPage = {
  slug: string;
  targetKeyword: string;
  cardSlug: string;          // which card to link to
  color: string;             // Tailwind color stem
  emoji: string;
  h1: string;
  tagline: string;
  body: string[];            // paragraphs
  howToSteps: { name: string; text: string }[];
  messageIdeas: { label: string; text: string }[];
  faqs: { q: string; a: string }[];
  relatedPages: { href: string; label: string }[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "free-birthday-card-online",
    targetKeyword: "free birthday card online",
    cardSlug: "birthday",
    color: "sky",
    emoji: "🎂",
    h1: "Free Birthday Card Online — Animated, Personalized & Shareable",
    tagline: "Send a beautiful birthday card in under 60 seconds. No account. No app. Completely free.",
    body: [
      "Sending a memorable birthday card online has never been easier. Wishing Cards offers a fully interactive, animated birthday card you can personalize with the recipient's name and age — for free, with no sign-up required.",
      "Unlike static e-cards or generic digital cards, Wishing Cards features a virtual birthday cake with real candles your recipient blows out one by one. After the last candle, a starfield 'Make a wish' interstitial builds anticipation before the confetti burst and your personal message appear. It's the kind of experience people screenshot and share.",
      "To personalize your free birthday card online, simply add ?name=Jane&age=30 to the card URL. The headline instantly reads 'Happy 30th Birthday, Jane!' and the cake shows exactly 30 candles. Share the personalized link via WhatsApp, iMessage, email, or any messaging app — your recipient opens it in their browser, no download needed.",
      "Whether you're sending to a best friend, parent, colleague, or partner, a personalized online birthday card shows you took the time — even when you're sending it from your couch.",
    ],
    howToSteps: [
      { name: "Open the birthday card", text: "Visit wishingcards.app/birthday in your browser." },
      { name: "Add the birthday person's name", text: "Append ?name=Jane to the URL (e.g., wishingcards.app/birthday?name=Jane) to personalize the headline instantly." },
      { name: "Add their age", text: "Append &age=30 to show 'Happy 30th Birthday' in the headline and display the right number of candles." },
      { name: "Copy the personalized link", text: "Copy the full URL from your browser's address bar — all the personalization is in the link." },
      { name: "Send it", text: "Paste the link into WhatsApp, iMessage, email, or any messaging app. Your recipient opens it in their browser, taps each candle to blow it out, and makes a wish before the confetti drops." },
    ],
    messageIdeas: [
      { label: "Warm & genuine", text: "Wishing you a day as bright as your smile and a year full of everything you deserve." },
      { label: "For a best friend", text: "Happy birthday to the person who knows all my secrets and still picks up the phone." },
      { label: "Milestone birthday", text: "Another trip around the sun — here's to making this one your best yet." },
      { label: "Short & sweet", text: "Older, wiser, and still absolutely incredible. Happy birthday!" },
    ],
    faqs: [
      { q: "Is this birthday card really free?", a: "Yes — completely free, no account, no credit card, no limits on how many you send." },
      { q: "How do I personalize the birthday card with someone's name?", a: "Add ?name=Jane to the URL (e.g., /birthday?name=Jane). The headline immediately personalizes to 'Happy Birthday, Jane!'" },
      { q: "Can I add the person's age to the birthday card?", a: "Yes. Add ?age=30 to the URL and the card will show 'Happy 30th Birthday' and display exactly 30 candles (up to 8 for display purposes)." },
      { q: "How does the candle blow-out mechanic work?", a: "The recipient taps each candle flame to blow it out. Once all candles are out, a 'Make a wish' starfield screen appears before the final message and confetti celebration." },
      { q: "Does the birthday card work on mobile?", a: "Yes — fully optimized for mobile, tablet, and desktop. The candle tap interaction works on touchscreens." },
    ],
    relatedPages: [
      { href: "/animated-birthday-card", label: "Animated Birthday Card" },
      { href: "/personalized-birthday-card-online", label: "Personalized Birthday Card Online" },
      { href: "/birthday", label: "Open the Birthday Card" },
    ],
  },

  {
    slug: "animated-birthday-card",
    targetKeyword: "animated birthday card",
    cardSlug: "birthday",
    color: "sky",
    emoji: "✨",
    h1: "Animated Birthday Card with Interactive Candle Blow-Out",
    tagline: "Not just a card — an experience. Watch the candles flicker, blow them out one by one, make a wish, and celebrate.",
    body: [
      "Most animated birthday cards are just GIFs. Wishing Cards is a fully interactive animated birthday card — built with modern web technology to deliver a real, cinematic birthday moment.",
      "Your recipient opens the link and sees a birthday cake with flickering candle flames. They tap each flame to blow it out — one by one. Once the last flame disappears, a starfield screen fades in: 'Make a wish.' Then the confetti drops and your personal message appears. It's a 30-second experience they'll remember and share.",
      "The animation adapts to any age. Add ?age=30 to the URL and the card shows 30 candles (displayed up to 8 for visual clarity) and reads 'Happy 30th Birthday.' Add ?name=Jane and the entire headline personalizes. No design skills needed — the URL does all the work.",
      "Because the card is a web link, it works on every device — iPhone, Android, desktop, or tablet. No app to download. No account to create. Just share the link and watch them experience it.",
    ],
    howToSteps: [
      { name: "Go to the animated birthday card", text: "Visit wishingcards.app/birthday in your browser." },
      { name: "Add the recipient's name", text: "Append ?name=Jane to the URL to personalize the headline." },
      { name: "Add their age for the full experience", text: "Append &age=30 to display the right number of candles and the correct ordinal birthday in the headline." },
      { name: "Copy the URL", text: "Copy the full personalized URL — this is the link you'll share." },
      { name: "Send it via any messaging app", text: "Paste into WhatsApp, iMessage, email, or anywhere. The animated experience plays directly in their browser." },
    ],
    messageIdeas: [
      { label: "Classic", text: "Wishing you a day as bright as your smile and a year full of everything you deserve." },
      { label: "Funny", text: "Happy birthday! May your day be longer than the time it took to blow out those candles." },
      { label: "Milestone", text: "Another trip around the sun — here's to making this one your best yet." },
      { label: "For a close friend", text: "You've kept getting better every year. Happy birthday, you absolute legend." },
    ],
    faqs: [
      { q: "What makes this an 'animated' birthday card?", a: "It features flickering candle flames, a candle blow-out interaction, a starfield 'Make a wish' screen, and a confetti burst — all running in the browser with no app needed." },
      { q: "How do I send an animated birthday card for free?", a: "Visit wishingcards.app/birthday, add ?name=Jane&age=30 to the URL, and share the link. Free, no account required." },
      { q: "Does the animation work on iPhone and Android?", a: "Yes — fully optimized for mobile. The candle tap interaction works on touchscreens across iOS and Android." },
      { q: "Can I personalize the animated card?", a: "Yes. Add ?name=Jane to personalize the headline and ?age=30 to set the birthday milestone. The card updates instantly with no design tools needed." },
      { q: "Is there a way to preview the animation before sending?", a: "Yes — just open the card link in your own browser first to preview the full animated experience before sharing." },
    ],
    relatedPages: [
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
      { href: "/personalized-birthday-card-online", label: "Personalized Birthday Card" },
      { href: "/birthday", label: "Open the Birthday Card" },
    ],
  },

  {
    slug: "personalized-birthday-card-online",
    targetKeyword: "personalized birthday card online",
    cardSlug: "birthday",
    color: "sky",
    emoji: "🎁",
    h1: "Personalized Birthday Card Online — Add Their Name in Seconds",
    tagline: "A birthday card that says their name feels different. Personalize yours in one step, no design tools needed.",
    body: [
      "A personalized birthday card does something a generic one can't: it makes the recipient feel seen. When someone opens a card that says their name in the headline, the emotional impact is immediate. Wishing Cards makes personalization effortless — just add ?name=Jane to the URL and the entire card instantly reads 'Happy Birthday, Jane!'",
      "You can go even further: add ?age=30 to personalize the age milestone, and ?sender=Rushi to put your name in the signature. The recipient sees a birthday cake with the right number of candles, a headline with their exact birthday milestone, and a message that ends with your name. Everything in the URL, no login needed.",
      "Wishing Cards personalized birthday cards are built for sharing. The card opens in any browser — iPhone, Android, tablet, or desktop — with no app to download. WhatsApp, iMessage, email, a link in a group chat: however you send it, the personalized experience arrives intact.",
      "The result is a card that looks custom-made — because it is. The technology does the design work; you provide the name and the thought behind sending it.",
    ],
    howToSteps: [
      { name: "Navigate to the birthday card", text: "Visit wishingcards.app/birthday." },
      { name: "Personalize with their name", text: "Add ?name=Jane to the URL. The headline changes to 'Happy Birthday, Jane!' instantly." },
      { name: "Add age and sender name", text: "Add &age=30 for the milestone and &sender=Rushi for your signature." },
      { name: "Copy the link", text: "Your personalized link is the full URL. Copy it from the address bar." },
      { name: "Share it", text: "Send via WhatsApp, iMessage, email, or any app. The card arrives personalized and ready to experience." },
    ],
    messageIdeas: [
      { label: "Warm", text: "Wishing you a day as bright as your smile and a year full of everything you deserve." },
      { label: "Short & sweet", text: "Older, wiser, and still absolutely incredible. Happy birthday!" },
      { label: "For a friend", text: "Happy birthday to the person who knows all my secrets and still picks up the phone." },
      { label: "Milestone", text: "Another trip around the sun — here's to making this one your best yet." },
    ],
    faqs: [
      { q: "How do I add someone's name to a birthday card online?", a: "Add ?name=Jane to the URL (e.g., wishingcards.app/birthday?name=Jane). The headline instantly reads 'Happy Birthday, Jane!' — no account or design tools needed." },
      { q: "Can I personalize with their age too?", a: "Yes. Add ?age=30 to the URL to show 'Happy 30th Birthday' in the headline and display the correct number of candles on the cake." },
      { q: "Can I add my own name as the sender?", a: "Yes. Add ?sender=Rushi to the URL to include your name in the card signature." },
      { q: "Is the personalized birthday card free?", a: "Yes — completely free, no account needed, unlimited personalized cards." },
      { q: "Will the personalization show up in the WhatsApp preview?", a: "Yes. When you share a personalized link (with ?name=Jane), the WhatsApp, iMessage, and social media preview shows the personalized title — e.g., 'Happy Birthday, Jane!'" },
    ],
    relatedPages: [
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
      { href: "/animated-birthday-card", label: "Animated Birthday Card" },
      { href: "/birthday", label: "Open the Birthday Card" },
    ],
  },

  {
    slug: "free-valentines-card-online",
    targetKeyword: "free valentines card online",
    cardSlug: "valentines",
    color: "rose",
    emoji: "❤️",
    h1: "Free Valentine's Day Card Online — Personalized, Animated & Unforgettable",
    tagline: "Send the most creative Valentine's card they've ever received. Personalized with their name. Free. No app needed.",
    body: [
      "Valentine's Day cards don't have to be generic. Wishing Cards offers a free, interactive Valentine's Day card that puts your recipient's name in the headline, adds a playful 'Yes or No' moment, and celebrates their answer with rose-colored confetti. It's the kind of card that gets screenshotted and shown to friends.",
      "The experience is simple to create: add ?name=Jane to the URL and the headline instantly reads 'Jane, will you be my Valentine?' Share the link via WhatsApp, iMessage, or any messaging app — your Valentine opens it in their browser with no download required. When they click Yes, the screen erupts in confetti and a full-screen celebration overlay appears.",
      "Want to add a personal touch from both of you? Add ?sender=Rushi to include your name in the card signature. The entire card personalizes from the URL — no design tools, no account, no cost.",
      "Whether you're sending to a partner, a crush, or a best friend, this free Valentine's card online gives you an interactive, memorable experience that no physical card can match — and you can send it in under 60 seconds.",
    ],
    howToSteps: [
      { name: "Open the Valentine's card", text: "Visit wishingcards.app/valentines in your browser." },
      { name: "Add their name", text: "Add ?name=Jane to the URL. The headline instantly reads 'Jane, will you be my Valentine?'" },
      { name: "Add your sender name (optional)", text: "Append &sender=Rushi to include your name in the signature." },
      { name: "Copy the personalized link", text: "Copy the full URL from your browser's address bar." },
      { name: "Send it", text: "Share via WhatsApp, iMessage, email, or any messaging app. When they click Yes, the confetti drops." },
    ],
    messageIdeas: [
      { label: "Classic & sweet", text: "Every moment is better with you in it. Will you be my Valentine?" },
      { label: "Playful", text: "I asked the internet to find me a Valentine. It suggested you. Good call, internet." },
      { label: "Heartfelt", text: "You're the reason I smile at my phone. Happy Valentine's Day." },
      { label: "Funny", text: "I like you a latte. Be my Valentine?" },
    ],
    faqs: [
      { q: "Is this Valentine's card really free?", a: "Yes — completely free. No account, no credit card, unlimited personalized cards." },
      { q: "How do I personalize a free Valentine's card online with their name?", a: "Add ?name=Jane to the URL (e.g., /valentines?name=Jane). The headline instantly reads 'Jane, will you be my Valentine?' — no sign-up needed." },
      { q: "What happens when they click Yes?", a: "The screen erupts with rose-colored heart confetti and a full-screen celebration overlay appears — a moment they'll screenshot and remember." },
      { q: "Can I send this to a friend, not just a romantic partner?", a: "Absolutely. The 'Will you be my Valentine?' card works for friends, family members, crushes, and partners alike." },
      { q: "Does the Valentine's card work on iPhone and Android?", a: "Yes — the card is fully optimized for all devices. No app download needed; it runs in any mobile browser." },
    ],
    relatedPages: [
      { href: "/valentines", label: "Open the Valentine's Card" },
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
      { href: "/anniversary-card-online", label: "Anniversary Card Online" },
    ],
  },

  {
    slug: "anniversary-card-online",
    targetKeyword: "anniversary card online",
    cardSlug: "anniversary",
    color: "purple",
    emoji: "💜",
    h1: "Anniversary Card Online — Animated, Personalized & Free",
    tagline: "Celebrate every year together with an anniversary card that opens like a real envelope. Free, personalized, shareable.",
    body: [
      "An anniversary is one of the most personal milestones you can celebrate, and your card should feel personal too. Wishing Cards offers a free, animated anniversary card online that your partner opens with an envelope-unfold animation — a reveal moment that makes the digital experience feel physical and intimate.",
      "Personalizing is simple: add ?name=Jane to show their name in the headline, ?years=5 to celebrate 'Happy 5th Anniversary,' and ?sender=Rushi to sign it with your name. Share the link via WhatsApp, iMessage, or email and the full personalized experience arrives exactly as you set it up.",
      "The card features a purple and fuchsia palette that fits both romantic and milestone occasions. The envelope flap lifts with a 3D animation, then a floating-hearts interstitial builds the moment before your final message appears. It's designed to feel special — not like another app notification.",
      "Whether it's your first year or your fiftieth, this free anniversary card online gives you an experience worth opening, screenshotting, and remembering.",
    ],
    howToSteps: [
      { name: "Open the anniversary card", text: "Visit wishingcards.app/anniversary in your browser." },
      { name: "Add their name", text: "Append ?name=Jane to the URL. The headline reads 'Happy Anniversary, Jane!'" },
      { name: "Add the years together", text: "Append &years=5 to celebrate the exact milestone — e.g., 'Happy 5th Anniversary.'" },
      { name: "Add your name", text: "Append &sender=Rushi to include your name in the card signature." },
      { name: "Share it", text: "Copy and share the personalized URL via WhatsApp, iMessage, or email." },
    ],
    messageIdeas: [
      { label: "Timeless", text: "Every year with you feels like both a lifetime and a single heartbeat." },
      { label: "Milestone", text: "Ten years of choosing each other, every single day. Here's to ten thousand more." },
      { label: "Playful", text: "Still my favorite person to argue about the thermostat with. Happy anniversary." },
      { label: "Romantic", text: "You are the reason love songs make sense to me now." },
    ],
    faqs: [
      { q: "How do I create a free anniversary card online?", a: "Visit wishingcards.app/anniversary and add ?name=Jane&years=5&sender=Rushi to the URL. The card personalizes instantly — no account needed." },
      { q: "Can I add how many years we've been together?", a: "Yes. Add ?years=5 to the URL and the card says 'Happy 5th Anniversary' in the headline." },
      { q: "Does the anniversary card work for both dating and wedding anniversaries?", a: "Yes — the card works for any anniversary milestone. The personalization is flexible for any type of relationship." },
      { q: "Is the anniversary card free?", a: "Yes — completely free, no sign-up, unlimited shares." },
      { q: "How does the envelope animation work?", a: "The card shows a sealed envelope. Clicking it lifts the flap with a 3D animation, then a floating-hearts interstitial plays before the final message." },
    ],
    relatedPages: [
      { href: "/anniversary", label: "Open the Anniversary Card" },
      { href: "/free-valentines-card-online", label: "Free Valentine's Card Online" },
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
    ],
  },

  {
    slug: "send-birthday-card-online-free",
    targetKeyword: "send birthday card online free",
    cardSlug: "birthday",
    color: "sky",
    emoji: "🎉",
    h1: "Send a Birthday Card Online Free — No Sign-Up, No App, No Catch",
    tagline: "Create and send a personalized birthday card online in under a minute. Free forever.",
    body: [
      "Sending a birthday card online for free sounds simple — but most options make you create an account, pay for premium features, or accept that your card is one of a thousand identical templates. Wishing Cards is different: no account, no payment, no template compromise.",
      "Every birthday card on Wishing Cards is interactive and personalized. Add ?name=Jane&age=30 to the URL and the card instantly becomes 'Happy 30th Birthday, Jane!' — with the right number of candles on the cake and a personalized headline. Copy the URL and send it via WhatsApp, iMessage, email, or any app. The recipient opens it in their browser in seconds.",
      "The interactive candle mechanic is what makes this card worth sending. Your recipient taps each candle flame to blow it out, makes a wish on the starfield screen, then sees the confetti celebration with your personal message. It's a 30-second experience that a generic e-card simply can't deliver.",
      "Need to send multiple birthday cards? You can send as many as you like — each personalized with a different name and age — all completely free and without creating an account.",
    ],
    howToSteps: [
      { name: "Visit the birthday card page", text: "Go to wishingcards.app/birthday in any browser." },
      { name: "Personalize the URL", text: "Add ?name=Jane&age=30 for a fully personalized headline and candle count." },
      { name: "Preview it", text: "The card updates live in your browser — no need to refresh." },
      { name: "Copy the link", text: "Copy the URL from your browser's address bar." },
      { name: "Send for free", text: "Paste into WhatsApp, iMessage, email, or any messaging app. No account, no cost, no download required." },
    ],
    messageIdeas: [
      { label: "Warm", text: "Wishing you a day as bright as your smile and a year full of everything you deserve." },
      { label: "Funny", text: "I got you an experience instead of a present. You're welcome. Happy birthday!" },
      { label: "Close friend", text: "Happy birthday to the person who knows all my secrets and still picks up the phone." },
      { label: "Simple", text: "Older, wiser, and still absolutely incredible. Happy birthday!" },
    ],
    faqs: [
      { q: "Is it really free to send a birthday card online?", a: "Yes — Wishing Cards is completely free. No account, no subscription, no limit on how many cards you send." },
      { q: "Do I need to create an account to send a birthday card online?", a: "No. Everything works from the URL alone. Add ?name=Jane&age=30 to personalize, copy the link, and send." },
      { q: "How do I send a birthday card online to multiple people?", a: "Create a separate personalized link for each person by changing the ?name= and ?age= values. Each link is unique and free." },
      { q: "Will the birthday card work on my recipient's phone?", a: "Yes — the card works in any browser on iPhone, Android, or desktop. No app download needed." },
      { q: "Can I send the card internationally?", a: "Yes. The card is a web link — it works in any country, on any device, with any messaging app." },
    ],
    relatedPages: [
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
      { href: "/animated-birthday-card", label: "Animated Birthday Card" },
      { href: "/birthday", label: "Open the Birthday Card" },
    ],
  },

  {
    slug: "free-graduation-card-online",
    targetKeyword: "free graduation card online",
    cardSlug: "graduation",
    color: "amber",
    emoji: "🎓",
    h1: "Free Graduation Card Online — Personalized with Name & Class Year",
    tagline: "Celebrate their achievement with an animated cap-toss graduation card. Free, personalized, and unforgettable.",
    body: [
      "Graduation is a milestone worth celebrating with more than a stock image and 'Congrats!' A great graduation card should feel earned — just like the degree. Wishing Cards offers a free, animated graduation card online with a cap-toss mechanic that makes the recipient the star of their own celebration.",
      "The experience starts with a graduation cap on screen. The graduate clicks to toss it into the air — the cap animates upward, a golden sparkle interstitial plays, then the confetti drops and your personal message appears. It's designed for the moment, not just the occasion.",
      "Personalizing is instant: add ?name=Jane to the URL for a personalized headline, and ?year=2025 to show 'Class of 2025, Jane!' in the card. Copy the URL and send via WhatsApp, iMessage, email, or text. Free, no account, no download needed.",
      "Works for high school graduation, college graduation, graduate school, trade school, or any educational milestone worth celebrating. One card, fully personalized, for the person who put in the work.",
    ],
    howToSteps: [
      { name: "Open the graduation card", text: "Visit wishingcards.app/graduation in your browser." },
      { name: "Add the graduate's name", text: "Append ?name=Jane to the URL. The headline reads 'Congratulations, Jane!'" },
      { name: "Add the graduation year", text: "Append &year=2025 to show 'Class of 2025' in the card." },
      { name: "Copy the personalized link", text: "Copy the full URL from your browser." },
      { name: "Send the card", text: "Share via WhatsApp, iMessage, or email. The graduate tosses their cap and triggers the celebration." },
    ],
    messageIdeas: [
      { label: "Inspiring", text: "You didn't just cross the finish line — you rewrote what the finish line looks like." },
      { label: "Warm", text: "The hardest part is officially over. The best part? It's just beginning." },
      { label: "Funny", text: "You survived! Now go take a very long nap and then conquer the world." },
      { label: "Personal", text: "I always knew you'd get here. I'm just glad I got to watch." },
    ],
    faqs: [
      { q: "How do I send a free graduation card online?", a: "Visit wishingcards.app/graduation, add ?name=Jane&year=2025 to the URL, copy the link, and share. Free, no account needed." },
      { q: "Can I add the graduation year to the card?", a: "Yes. Add ?year=2025 to the URL and the card will say 'Class of 2025' in the headline." },
      { q: "Does this work for high school and college graduation?", a: "Yes — it works for any graduation milestone. The personalization is flexible for all education levels." },
      { q: "How does the cap-toss interaction work?", a: "The recipient clicks a button to toss their graduation cap. The cap animates upward, a sparkle interstitial plays, then confetti drops and the personal message appears." },
      { q: "Is the graduation card free?", a: "Yes — completely free, no sign-up, unlimited shares." },
    ],
    relatedPages: [
      { href: "/graduation", label: "Open the Graduation Card" },
      { href: "/free-birthday-card-online", label: "Free Birthday Card Online" },
      { href: "/congratulations-card-online", label: "Congratulations Card Online" },
    ],
  },

  {
    slug: "congratulations-card-online",
    targetKeyword: "congratulations card online",
    cardSlug: "congratulations",
    color: "indigo",
    emoji: "🎉",
    h1: "Congratulations Card Online — Animated, Personalized & Free",
    tagline: "Pop the party popper and celebrate their achievement. A congratulations card that matches the moment.",
    body: [
      "Great news deserves a great reaction — not a generic 'Congrats!' message. Wishing Cards offers a free animated congratulations card online with a party-popper interaction that makes the celebration feel real. Your recipient clicks to pop the popper, triggers a star-filled indigo celebration, and then your personal message appears.",
      "Personalize the card in seconds: add ?name=Jane to the URL for a headline like 'Congratulations, Jane!' and ?sender=Rushi to include your name in the signature. Share via WhatsApp, iMessage, or email — the full interactive experience opens in any browser, no app download needed.",
      "The congratulations card works for any achievement worth celebrating: new job, promotion, engagement, new baby, passing an exam, completing a big project, or any personal milestone. The indigo and violet palette fits proud moments without being too formal or too casual.",
      "Send it to one person or a dozen. Each personalized link is unique and free — no account, no subscription, no limits.",
    ],
    howToSteps: [
      { name: "Open the congratulations card", text: "Visit wishingcards.app/congratulations in your browser." },
      { name: "Add their name", text: "Append ?name=Jane to the URL. The headline reads 'Congratulations, Jane!'" },
      { name: "Add your sender name", text: "Append &sender=Rushi to include your name in the signature." },
      { name: "Copy the link", text: "Copy the full personalized URL from your address bar." },
      { name: "Send the celebration", text: "Share via WhatsApp, iMessage, email, or any app. They pop the party popper and the confetti drops." },
    ],
    messageIdeas: [
      { label: "Achievement", text: "You set your sights on this and you went and did it. That's not luck — that's you." },
      { label: "New job", text: "New job, new chapter. They're lucky to have you. Congratulations!" },
      { label: "Personal milestone", text: "Every big thing starts with one brave decision. Congratulations on making yours." },
      { label: "Short & punchy", text: "You did it. We always knew you would. Congratulations!" },
    ],
    faqs: [
      { q: "How do I send a free congratulations card online?", a: "Go to wishingcards.app/congratulations, add ?name=Jane to the URL, copy the link, and share. Free, no sign-up." },
      { q: "What occasions is this congratulations card good for?", a: "Any achievement worth celebrating: new job, promotion, engagement, new baby, passing an exam, or any personal milestone." },
      { q: "How does the party popper interaction work?", a: "The recipient clicks to pop the popper — triggering a recoil animation, an indigo star-field interstitial, and a confetti burst before the final message appears." },
      { q: "Is the congratulations card free?", a: "Yes — free, no account, no limits on how many you send." },
      { q: "Can I use this for a professional congratulations?", a: "Yes. The card's tone is celebratory but not overly personal, making it appropriate for colleagues, clients, and professional contacts." },
    ],
    relatedPages: [
      { href: "/congratulations", label: "Open the Congratulations Card" },
      { href: "/free-graduation-card-online", label: "Free Graduation Card" },
      { href: "/free-birthday-card-online", label: "Free Birthday Card" },
    ],
  },
];

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return seoLandingPages.find((p) => p.slug === slug);
}

export const seoLandingPageSlugs = seoLandingPages.map((p) => p.slug);
