import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
import { ACHIEVEMENTS, ACHIEVEMENT_SPOTLIGHTS, type AchievementSpotlight } from "../portfolio-data";
import { EntryGallery, GalleryImage } from "../components/gallery-image";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  ExternalLink,
} from "../components/notebook-ui";
export const metadata = pageMetadata("/achievements");
export function AchievementsChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        {!embedded && <PageStructuredData path="/achievements" />}
        <ChapterHeading
          chapter="achievements"
          level={embedded ? 2 : 1}
          number="06 / Achievements"
          title="Milestones, earned."
          lead="The moments when an idea left the notebook and met a classroom, a judging panel, or a community."
          note="Let the work speak."
        />
        {ACHIEVEMENT_SPOTLIGHTS.map((spotlight) => <article className="honor-feature" id={spotlight.id} key={spotlight.id} data-reveal>
          <div>
            <p className="eyebrow">{spotlight.eyebrow}</p>
            <h2>
              {spotlight.title}
              <br />
              <em>{spotlight.emphasis}</em>
            </h2>
            <p>{spotlight.summary}</p>
            <p className="eyebrow">{spotlight.status}</p>
            <ExternalLink href={spotlight.link.href}>
              {spotlight.link.label}
            </ExternalLink>
          </div>
          {(spotlight as AchievementSpotlight).media?.length
            ? <EntryGallery entry={spotlight} title={spotlight.title} />
            : <InkDrawing name={spotlight.drawing} />}
        </article>)}
        <div className="honor-grid">
          {ACHIEVEMENTS.map((a) => (
            <article
              className="honor-card"
              id={"achievement-" + a.id}
              key={a.id}
              data-reveal
            >
              {a.media[0] && <figure data-paper>
                <GalleryImage image={a.media[0]} images={a.media} title={a.title} />
              </figure>}
              <p className="eyebrow">
                {({ honor: "Recognition", "photo-story": "From the archive" } as const)[a.kind]}{" "}
                / {a.dateLabel}
              </p>
              <h2>{a.title}</h2>
              <p>{a.summary}</p>
              <details>
                <summary>Evidence & context</summary>
                <ul>
                  {a.evidence.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                {a.media[0] && <ExternalLink href={a.media[0].src}>
                  Open original photograph
                </ExternalLink>}
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
