import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
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
  title: {
    default: "SpotU — Tu spot publicitario ideal",
    template: "%s | SpotU",
  },
  description:
    "Marketplace de publicidad que conecta anunciantes, espacios publicitarios y agencias de marketing. Publica, descubre y conecta.",
  keywords: [
    "publicidad",
    "marketplace",
    "espacios publicitarios",
    "agencias de marketing",
    "anunciantes",
    "advertising",
  ],
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
