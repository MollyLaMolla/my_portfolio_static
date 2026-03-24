import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000319",
};

export const metadata: Metadata = {
  title: {
    default: "Alessandro Slyusar — Full Stack Web Developer",
    template: "%s | Alessandro Slyusar",
  },
  description:
    "Portfolio of Alessandro Slyusar — Full Stack Web Developer based in Italy. Building modern, performant web applications with Next.js, React, and Node.js.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Node.js",
    "Portfolio",
    "Alessandro Slyusar",
  ],
  authors: [{ name: "Alessandro Slyusar" }],
  creator: "Alessandro Slyusar",
  metadataBase: new URL("https://alessandroslyusar.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Alessandro Slyusar — Full Stack Web Developer",
    description:
      "Building modern, performant web applications with Next.js, React, and Node.js.",
    siteName: "Alessandro Slyusar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alessandro Slyusar — Full Stack Web Developer",
    description:
      "Building modern, performant web applications with Next.js, React, and Node.js.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
