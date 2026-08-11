import type { Metadata, Viewport } from "next";
import { ExperienceShell } from "./components/experience-shell";
import { SITE_ORIGIN } from "./site-config";
import "./globals.css";

const SITE_TITLE = "Muhammad Taha Bin Zaeem — Computer Engineer";
const SITE_DESCRIPTION =
  "The immersive portfolio of Muhammad Taha Bin Zaeem: custom processors, assembly systems, AI products, learning platforms, hardware, and the evidence behind them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: "%s — Muhammad Taha Bin Zaeem",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  applicationName: "Muhammad Taha Bin Zaeem — Field System",
  keywords: [
    "Muhammad Taha Bin Zaeem",
    "computer engineer",
    "NUST CEME",
    "Verilog",
    "MIPS assembly",
    "AI engineering",
    "hardware",
    "software",
  ],
  authors: [{ name: "Muhammad Taha Bin Zaeem", url: SITE_ORIGIN }],
  creator: "Muhammad Taha Bin Zaeem",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Muhammad Taha Bin Zaeem",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      </head>
      <body>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
