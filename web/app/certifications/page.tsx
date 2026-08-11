import type { Metadata } from "next";
import { CertificationsExperience } from "./certifications-experience";

export const metadata: Metadata = {
  title: "Certifications · Hall of Institutions",
  description:
    "An immersive, verifiable certificate archive for Muhammad Taha Bin Zaeem, including Duke, Stanford, Google, Coursera, and lablab.ai.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return <CertificationsExperience />;
}
