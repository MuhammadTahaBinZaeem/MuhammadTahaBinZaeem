import type { Metadata, Viewport } from "next";
import { ExperienceShell } from "./components/experience-shell";
import { PortfolioStructuredData } from "./seo-schema";
import { SITE_ORIGIN } from "./site-config";
import "./globals.css";

const SEO_TITLE =
  "Muhammad Taha Bin Zaeem | Taha Zaeem — Engineering & Applied AI";
const SEO_DESCRIPTION =
  "Official portfolio of Muhammad Taha Bin Zaeem (Taha Zaeem): Computer Engineering undergraduate at NUST CEME, founder of Type2Learn and ProGenEDA, working on applied AI, research, and computer architecture.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SEO_TITLE,
    template: "%s — Muhammad Taha Bin Zaeem",
  },
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  applicationName: "Muhammad Taha Bin Zaeem — The Engineering Notebook",
  keywords: [
    "Muhammad Taha Bin Zaeem",
    "Muhammad Taha",
    "Taha Zaeem",
    "Taha Bin Zaeem",
    "tahabinzaeem",
    "computer engineer",
    "NUST CEME",
    "Type2Learn",
    "ProGenEDA",
    "Verilog",
    "MIPS assembly",
    "AI engineering",
    "hardware",
    "software",
  ],
  authors: [{ name: "Muhammad Taha Bin Zaeem", url: SITE_ORIGIN }],
  creator: "Muhammad Taha Bin Zaeem",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Muhammad Taha Bin Zaeem",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Taha Bin Zaeem — The Engineering Notebook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3eedf",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/art/favicon.png" type="image/png" />
        <link
          rel="preload"
          href="/fonts/big-shoulders-stencil-display-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <PortfolioStructuredData />
      </head>
      <body>
        <noscript>
          <style>{`.sequence-chapter{height:auto!important}.sequence-sticky{position:relative!important;top:0!important;min-height:0!important;height:auto!important;padding-block:60px!important}.sequence-art canvas{display:none!important}.sequence-art>img{visibility:visible!important}`}</style>
        </noscript>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
