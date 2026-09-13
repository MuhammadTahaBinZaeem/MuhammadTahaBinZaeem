import type { Metadata, Viewport } from "next";
import { ExperienceShell } from "./components/experience-shell";
import { ImageGallery } from "./components/image-gallery";
import { PortfolioStructuredData } from "./seo-schema";
import { SITE_ORIGIN } from "./site-config";
import { pageMetadata } from "./seo";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: new URL(SITE_ORIGIN),
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
        <ImageGallery />
      </body>
    </html>
  );
}
