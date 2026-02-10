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

export const metadata: Metadata = {
  title: valentineConfig.site.title,
  description: valentineConfig.site.description,
  icons: {
    icon: valentineConfig.site.favicon,
  },
  openGraph: {
    title: valentineConfig.site.title,
    description: valentineConfig.site.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: valentineConfig.site.title,
    description: valentineConfig.site.description,
  },
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
