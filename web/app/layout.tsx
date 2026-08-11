import type { Metadata, Viewport } from "next";
import { ExperienceShell } from "./components/experience-shell";
import { PortfolioStructuredData } from "./seo-schema";
import { SITE_ORIGIN } from "./site-config";
import "./globals.css";

const SEO_TITLE = "Muhammad Taha Bin Zaeem | Taha Zaeem - Computer Engineer";
const SEO_DESCRIPTION =
  "Official portfolio of Muhammad Taha Bin Zaeem (Muhammad Taha, Taha Zaeem): computer engineer at NUST CEME, founder of Type2Learn and ProGenEDA, building processors, software, AI, hardware, and education systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SEO_TITLE,
    template: "%s — Muhammad Taha Bin Zaeem",
  },
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  applicationName: "Muhammad Taha Bin Zaeem — Field System",
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
        alt: "Muhammad Taha Bin Zaeem — Computer Engineer",
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
  themeColor: "#0b0c0a",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/media/identity/favicon.png" type="image/png" />
        <PortfolioStructuredData />
      </head>
      <body>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
