import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AppModePill } from "@/components/AppModePill";
import { Providers } from "@/components/Providers";
import { RecordingModeBanner } from "@/components/RecordingModeBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Talk2Buy Storefront";
const description =
  "An AI voice storefront that turns conversations into Stripe-powered sales.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <header className="border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-gradient">
              Talk2Buy
            </Link>
            <nav className="flex flex-wrap items-center gap-3 md:gap-6 text-sm text-slate-400">
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                Store
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-cyan-400 transition-colors"
              >
                Dashboard
              </Link>
              <AppModePill />
            </nav>
          </div>
        </header>
        <RecordingModeBanner />
        <main className="flex-1">
          <Providers>{children}</Providers>
        </main>
        <footer className="border-t border-cyan-500/10 py-6 text-center text-sm text-slate-500">
          Voice is not just content. Voice is the sales interface.
        </footer>
      </body>
    </html>
  );
}
