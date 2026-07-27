import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Palm Reading | astrologer.ai",
  description:
    "Upload your palm and receive an AI-powered personalized palm reading in minutes.",
  openGraph: {
    title: "AI Palm Reading | astrologer.ai",
    description:
      "Upload your palm and receive an AI-powered personalized palm reading in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#090B16] text-white antialiased">{children}</body>
    </html>
  );
}
