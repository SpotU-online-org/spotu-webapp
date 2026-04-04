import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spotu.online"),
  title: {
    default: "SpotU — Tu spot publicitario ideal",
    template: "%s | SpotU",
  },
  description:
    "Marketplace de publicidad que conecta anunciantes, espacios publicitarios y agencias de marketing. Publica tu espacio, descubre oportunidades y contacta directo.",
  keywords: [
    "publicidad", "marketplace", "espacios publicitarios",
    "agencias de marketing", "anunciantes", "advertising",
    "vallas publicitarias", "publicidad digital", "Colombia", "México", "Florida",
  ],
  authors: [{ name: "SpotU", url: "https://spotu.online" }],
  creator: "SpotU",
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: "en_US",
    url: "https://spotu.online",
    siteName: "SpotU",
    title: "SpotU — Tu spot publicitario ideal",
    description:
      "Marketplace de publicidad que conecta anunciantes, espacios publicitarios y agencias de marketing.",
    images: [{ url: "/logos/logo-full.webp", width: 1200, height: 630, alt: "SpotU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpotU — Tu spot publicitario ideal",
    description: "Marketplace de publicidad. Publica, descubre y conecta.",
    images: ["/logos/logo-full.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logos/icon.webp", type: "image/webp" },
    ],
    apple: "/logos/icon.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <Providers>{children}</Providers>
        </body>
    </html>
  );
}
