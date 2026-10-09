import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
import { EDUCATION, type EducationEntry } from "../portfolio-data";
import { SKILLS } from "../dossier-data";
import { GalleryImage } from "../components/gallery-image";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  NextChapter,
  SectionHeading,
} from "../components/notebook-ui";
export const metadata = pageMetadata("/education");
export function EducationChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        {!embedded && <PageStructuredData path="/education" />}
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="04 / Education"
          title="Where it began."
          lead="From the first computer-science classroom to processor design, circuits, and machine-learning foundations."
          note="The foundations keep growing."
        />
        {EDUCATION.map((e) => {
          const campus = (e as EducationEntry).campus;
          const images = e.media;
          const entry = e as EducationEntry;
          return (
          <article
            className="education-story"
            id={"education-" + e.id}
            key={e.id}
            data-reveal
          >
            {campus && <div className="campus-banner" data-reactive>
              <GalleryImage image={campus} images={[campus]} title={(e.campusLabel || e.institution) + " · campus illustration"} />
              <div className="campus-banner__copy" aria-hidden="true">
                <span>Where the foundations grew</span>
                <strong>{(e as EducationEntry).campusLabel || e.institution}</strong>
                <span>View the campus illustration ↗</span>
              </div>
            </div>}
            <div>
              <p className="timeline-date">
                {e.period}
                {entry.periodNote ? ` (${entry.periodNote})` : ""}
              </p>
              {e.grade && <span className="hand-note">Grade {e.grade}</span>}
            </div>
            <div>
              <h2>
                {e.institution}
                {entry.institutionNote ? ` · ${entry.institutionNote}` : ""}
              </h2>
              <h3>{e.qualification}</h3>
              {entry.focus && <p>{entry.focus}</p>}
              <p>{e.story}</p>
              <ul>
                {e.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              {e.media[0] && <figure className="education-evidence" data-paper>
                <GalleryImage image={e.media[0]} images={images} title={e.institution + " · education archive"} />
                <figcaption>{e.media[0].alt}</figcaption>
              </figure>}
            </div>
          </article>
        );})}
        <section id="skills" className="research-methods">
          <SectionHeading
            eyebrow="The toolkit / across disciplines"
            title="Comfortable between layers."
          />
          <div className="skill-grid">
            {SKILLS.map((g) => (
              <div className="skill-group" key={g.group} data-reveal>
                <h3>{g.group}</h3>
                <div className="skill-tags">
                  {g.items.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        {!embedded && <NextChapter href="/certifications" />}
      </Frame>
    </StoryMotion>
  );
}

export default function EducationPage() {
  return <EducationChapter />;
}
