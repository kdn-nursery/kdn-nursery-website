import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Tamil, Source_Sans_3 } from "next/font/google";
import "../globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });
const tamil = Noto_Sans_Tamil({ subsets: ["tamil"], variable: "--font-tamil" });

export const instant = false;

export const metadata: Metadata = {
  title: "KDN admin",
  robots: { index: false, follow: false },
};

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${tamil.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
