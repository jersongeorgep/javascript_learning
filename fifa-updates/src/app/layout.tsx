import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/components/QueryProvider";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 - Live Updates, Matches & Standings",
  description:
    "Follow the FIFA World Cup 2026 with live match updates, upcoming fixtures, group standings, team details, and knockout bracket. 48 teams, 104 matches.",
  keywords: [
    "World Cup 2026",
    "FIFA",
    "football",
    "soccer",
    "live scores",
    "matches",
    "standings",
    "Mexico",
    "Canada",
    "USA",
  ],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#006847",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-4 text-center text-xs text-muted-foreground">
              <div className="container mx-auto px-4">
                FIFA World Cup 2026 &middot; Data from openfootball
              </div>
            </footer>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
