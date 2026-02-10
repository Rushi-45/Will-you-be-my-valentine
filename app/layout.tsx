import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { valentineConfig } from "@/config/valentine";
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

const siteUrl = valentineConfig.site.url ?? undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: valentineConfig.site.title,
  description: valentineConfig.site.description,
  keywords: [...valentineConfig.site.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: valentineConfig.site.favicon,
  },
  openGraph: {
    title: valentineConfig.site.title,
    description: valentineConfig.site.description,
    type: "website",
    ...(siteUrl && { url: siteUrl }),
    ...(valentineConfig.site.ogImage && {
      images: [
        {
          url: valentineConfig.site.ogImage,
          width: 1200,
          height: 630,
          alt: valentineConfig.site.title,
        },
      ],
    }),
  },
  twitter: {
    card: valentineConfig.site.ogImage ? "summary_large_image" : "summary",
    title: valentineConfig.site.title,
    description: valentineConfig.site.description,
    ...(valentineConfig.site.ogImage && {
      images: [valentineConfig.site.ogImage],
    }),
  },
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
