import type { Metadata, Viewport } from "next";
import { PROFILE } from "./content";
import { SITE_ORIGIN } from "./site-config";
import "./globals.css";

const SITE_TITLE = "The Machine Remembers — Computer Engineer Portfolio";
const SITE_DESCRIPTION =
  "An immersive computer engineering portfolio spanning hardware, software, assembly, AI, and systems that ship.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_ORIGIN),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    applicationName: "The Machine Remembers",
    keywords: [
      "computer engineer",
      "hardware",
      "software",
      "assembly",
      "Verilog",
      "AI systems",
      "portfolio",
    ],
    authors: [{ name: PROFILE.name }],
    creator: PROFILE.name,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "The Machine Remembers",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Machine Remembers" }],
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
  themeColor: "#0b0b0a",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/generated/icons/favicon-core.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
