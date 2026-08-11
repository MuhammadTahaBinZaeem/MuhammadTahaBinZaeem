import type { Metadata } from "next";
import { AchievementsExperience } from "./achievements-experience";

export const metadata: Metadata = {
  title: "Achievements · The Trophy Voltage",
  description:
    "Competition, award, and leadership evidence from Muhammad Taha Bin Zaeem, told as an animated chronology rather than a trophy grid.",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsPage() {
  return <AchievementsExperience />;
}
