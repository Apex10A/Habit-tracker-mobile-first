import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/shared/ServiceWorkerRegister";

const acorn = localFont({
  src: [
    { path: "./fonts/acorn-regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/acorn-medium.woff", weight: "500", style: "normal" },
    { path: "./fonts/acorn-7.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-acorn",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build streaks",
  manifest: "/manifest.json",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('habit-tracker-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${acorn.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
