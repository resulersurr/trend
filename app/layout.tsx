import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteUrl } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Trend — İçerik Keşif Platformu",
  description: "Etkinlik, mekan, kampanya veya rehber — her türlü içeriği keşfedin, trendleri takip edin.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trend — İçerik Keşif Platformu",
    description: "Etkinlik, mekan, kampanya veya rehber — her türlü içeriği keşfedin, trendleri takip edin.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend — İçerik Keşif Platformu",
    description: "Etkinlik, mekan, kampanya veya rehber — her türlü içeriği keşfedin, trendleri takip edin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
