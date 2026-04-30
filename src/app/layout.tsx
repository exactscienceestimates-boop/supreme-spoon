import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ExactScience Estimators LLC | AI Roofing Estimates & Insurance Supplements",
  description:
    "AI-powered roofing estimates for homeowners and automated insurance supplemental estimates for contractors. Fort Lauderdale, FL. Get your instant roof quote today.",
  keywords: "roofing estimate, insurance supplement, roof quote, Xactimate, Fort Lauderdale, South Florida, roofing contractor",
  openGraph: {
    title: "ExactScience Estimators LLC",
    description: "AI-powered roofing estimates & insurance supplemental services — Fort Lauderdale, FL",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
