import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OMELES — Beyond Products. Into Operations.",
    template: "%s | OMELES",
  },
  description:
    "Structured solutions combining identity, textiles, protection, and guidance — supporting service businesses from brand expression to day-to-day operations for hospitality and maritime services.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OMELES",
    title: "OMELES — Beyond Products. Into Operations.",
    description:
      "Premium textile and brand solutions for hospitality and maritime industries.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main>
          <ClientProviders>{children}</ClientProviders>
        </main>
        <Footer />
      </body>
    </html>
  );
}
