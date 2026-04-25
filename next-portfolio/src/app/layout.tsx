import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import CustomCursor from "@/components/CustomCursor";
import IntroOverlay from "@/components/IntroOverlay";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CASE FILE: SHLOK BAM | Digital Forensic Portfolio",
  description: "Investigating the digital footprint and professional experience of Shlok Bam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="bg-background text-foreground selection:bg-primary selection:text-background scanlines">
        <ThemeProvider>
          <div className="scan-line" />
          <IntroOverlay />
          <CustomCursor />
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

