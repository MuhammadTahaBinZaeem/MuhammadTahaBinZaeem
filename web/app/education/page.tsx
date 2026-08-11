import type { Metadata } from "next";
import { EDUCATION } from "../portfolio-data";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { EducationExperience } from "./education-experience";

export const metadata: Metadata = {
  title: "Education · The Foundry",
  description:
    "The education journey of Muhammad Taha Bin Zaeem from computer science through GCU Lahore to Computer Engineering at NUST CEME.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <>
      <CollectionStructuredData
        description="Education record of Muhammad Taha Bin Zaeem, including Computer Engineering at NUST CEME and earlier study at Government College University Lahore and Qazi Grammar Boys High School."
        items={EDUCATION.map((entry) => ({
          name: `${entry.institution} - ${entry.qualification}`,
          description: `${entry.period}. ${entry.story}`,
          url: `${SITE_ORIGIN}/education#education-${entry.id}`,
          type: "EducationalOccupationalCredential",
        }))}
        name="Muhammad Taha Bin Zaeem Education"
        path="/education"
      />
      <EducationExperience />
    </>
  );
}
