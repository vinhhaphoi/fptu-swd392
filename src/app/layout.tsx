import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/hooks/useAuth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VSTEP Master - Vietnamese English Proficiency Test Preparation",
  description:
    "Comprehensive VSTEP exam preparation platform with practice tests for Listening, Reading, Writing, and Speaking skills. Achieve your B1, B2, or C1 certification.",
  keywords: [
    "VSTEP",
    "English test",
    "Vietnamese",
    "B1",
    "B2",
    "C1",
    "English proficiency",
    "exam preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-slate-900 text-white antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
