import type { Metadata } from "next";
import { ACHIEVEMENTS } from "../portfolio-data";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { AchievementsExperience } from "./achievements-experience";

export const metadata: Metadata = {
  title: "Achievements · The Trophy Voltage",
  description:
    "Competition, award, and leadership evidence from Muhammad Taha Bin Zaeem, told as an animated chronology rather than a trophy grid.",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsPage() {
  return (
    <>
      <CollectionStructuredData
        description="Competition, leadership, and project recognition evidence for Muhammad Taha Bin Zaeem."
        items={ACHIEVEMENTS.map((achievement) => ({
          name: achievement.title,
          description: achievement.summary,
          url: `${SITE_ORIGIN}/achievements#achievement-${achievement.id}`,
          type: "CreativeWork",
        }))}
        name="Muhammad Taha Bin Zaeem Achievements"
        path="/achievements"
      />
      <AchievementsExperience />
    </>
  );
}
