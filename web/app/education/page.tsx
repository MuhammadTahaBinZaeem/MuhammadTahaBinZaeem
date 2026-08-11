import type { Metadata } from "next";
import { EducationExperience } from "./education-experience";

export const metadata: Metadata = {
  title: "Education · The Foundry",
  description:
    "The education journey of Muhammad Taha Bin Zaeem from computer science through GCU Lahore to Computer Engineering at NUST CEME.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return <EducationExperience />;
}
