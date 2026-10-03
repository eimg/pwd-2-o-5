import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { getGenres } from "@/lib/tmdb";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Next Movie — Find your next great watch", template: "%s | Next Movie" },
  description: "Discover great films, explore your favorite genres, and build a watchlist for your next movie night.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const genres = await getGenres().catch(() => []);
  return <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}><body><AppShell genres={genres}>{children}</AppShell></body></html>;
}
