import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Vint'ART — Maison de Collection & Carnets de Voyage",
  description: "Carnets tunisiens en éditions limitées. Retrait VIP à l'Aéroport Tunis-Carthage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${cinzel.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}>
    <CurrencyProvider>
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </CurrencyProvider>
      </body>
    </html>
  );
}