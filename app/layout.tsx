import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const base = siteConfig.url || undefined;

export const metadata: Metadata = {
  metadataBase: base ? new URL(base) : undefined,
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: siteConfig.favicon },
  openGraph: {
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    ...(base && { url: base }),
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  ...(base && { alternates: { canonical: base } }),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/{search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.favicon}`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteConfig.url}/#webapp`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Personalized greeting cards",
        "Animated interactive cards",
        "Free to use — no account required",
        "Works on all devices",
        "Share via link",
      ].join(", "),
    },
    {
      "@type": "ItemList",
      name: "Wishing Cards — All Occasions",
      description: "Seven animated, personalized greeting cards for every milestone.",
      numberOfItems: 7,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Valentine's Day Card", url: `${siteConfig.url}/valentines` },
        { "@type": "ListItem", position: 2, name: "Birthday Card", url: `${siteConfig.url}/birthday` },
        { "@type": "ListItem", position: 3, name: "Anniversary Card", url: `${siteConfig.url}/anniversary` },
        { "@type": "ListItem", position: 4, name: "Graduation Card", url: `${siteConfig.url}/graduation` },
        { "@type": "ListItem", position: 5, name: "Thank You Card", url: `${siteConfig.url}/thank-you` },
        { "@type": "ListItem", position: 6, name: "Get Well Card", url: `${siteConfig.url}/get-well` },
        { "@type": "ListItem", position: 7, name: "Congratulations Card", url: `${siteConfig.url}/congratulations` },
      ],
    },
  ],
};

const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('valentine-theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
