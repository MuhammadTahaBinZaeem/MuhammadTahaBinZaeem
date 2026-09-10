import type { Metadata } from "next";
import { EDUCATION } from "../portfolio-data";
import { SKILLS } from "../dossier-data";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  SectionHeading,
} from "../components/notebook-ui";
export const metadata: Metadata = {
  title: "Education & skills — Where it began",
  description:
    "Muhammad Taha Bin Zaeem: B.E. Computer Engineering at NUST CEME, GCU Lahore, Qazi Grammar, and a complete engineering and research skill set.",
  alternates: { canonical: "/education" },
};
export function EducationChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="04 / Education"
          title="Where it began."
          lead="From the first computer-science classroom to processor design, circuits, and machine-learning foundations."
          note="The foundations keep growing."
        />
        <InkDrawing name="campus" className="education-cover" />
        {EDUCATION.map((e) => (
          <article
            className="education-story"
            id={"education-" + e.id}
            key={e.id}
            data-reveal
          >
            <div>
              <p className="timeline-date">
                {e.period}
                {e.id === "nust" ? " (expected graduation)" : ""}
              </p>
              {e.grade && <span className="hand-note">Grade {e.grade}</span>}
            </div>
            <div>
              <h2>
                {e.institution}
                {e.id === "nust" ? " · CEME" : ""}
              </h2>
              <h3>{e.qualification}</h3>
              {e.id === "nust" && (
                <p>
                  Third semester, as recorded in the September 2026 CV. Selected
                  focus: computer architecture, digital logic, algorithms,
                  programming, circuits, electronics, and machine-learning
                  foundations.
                </p>
              )}
              <p>{e.story}</p>
              <ul>
                {e.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
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
        <NextChapter href="/certifications" />
      </Frame>
    </StoryMotion>
  );
}

export default function EducationPage() {
  return <EducationChapter />;
}
