import type { Metadata } from "next";
import { ACHIEVEMENTS } from "../portfolio-data";
import { GalleryImage } from "../components/gallery-image";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  ExternalLink,
} from "../components/notebook-ui";
export const metadata: Metadata = {
  title: "Achievements — Milestones, earned",
  description:
    "Muhammad Taha Bin Zaeem: P@SHA ICT Awards 2026 finalist with Type2Learn, SEMPEC second runner-up for the vector CPU, STEM 2024 runner-up, and academic honors.",
  alternates: { canonical: "/achievements" },
};
export function AchievementsChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="06 / Achievements"
          title="Milestones, earned."
          lead="The moments when an idea left the notebook and met a classroom, a judging panel, or a community."
          note="Let the work speak."
        />
        <article className="honor-feature" id="pasha-2026" data-reveal>
          <div>
            <p className="eyebrow">Type2Learn / P@SHA ICT Awards 2026</p>
            <h2>
              Finalist.
              <br />
              <em>Still building.</em>
            </h2>
            <p>
              Type2Learn reached the finalist stage of the P@SHA ICT Awards
              2026. An accessibility-first learning platform, built around the
              people who use it—and still getting better.
            </p>
            <p className="eyebrow">
              2026 finalist · Accessibility-first learning
            </p>
            <ExternalLink href="https://type2learn.tech">
              Explore Type2Learn
            </ExternalLink>
          </div>
          <InkDrawing name="medal" />
        </article>
        <div className="honor-grid">
          {ACHIEVEMENTS.map((a) => (
            <article
              className="honor-card"
              id={"achievement-" + a.id}
              key={a.id}
              data-reveal
            >
              <figure data-paper>
                <GalleryImage image={a.media[0]} images={a.media} title={a.title} />
              </figure>
              <p className="eyebrow">
                {a.kind === "photo-story" ? "From the archive" : "Recognition"}{" "}
                / {a.dateLabel}
              </p>
              <h2>
                {a.id === "stem-2024-runner-up-photo-story"
                  ? "Runner-Up · STEM 2024"
                  : a.title}
              </h2>
              <p>
                {a.id === "stem-2024-runner-up-photo-story"
                  ? "Runner-up recognition at STEM 2024, with a PKR 20,000 prize. The original photograph preserves the trophies, cheque, and event date."
                  : a.summary}
              </p>
              <details>
                <summary>Evidence & context</summary>
                <ul>
                  {a.evidence.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <ExternalLink href={a.media[0].src}>
                  Open original photograph
                </ExternalLink>
              </details>
            </article>
          ))}
        </div>
        {!embedded && <NextChapter href="/connect" />}
      </Frame>
    </StoryMotion>
  );
}

export default function AchievementsPage() {
  return <AchievementsChapter />;
}
