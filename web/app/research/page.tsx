import type { Metadata } from "next";
import { DOSSIER, RESEARCH } from "../dossier-data";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  SectionHeading,
} from "../components/notebook-ui";
import { StoryMotion } from "../components/story-motion";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
export const metadata: Metadata = {
  title: "Research — LLM evaluation & trustworthy engineering",
  description:
    "Independent research by Muhammad Taha Bin Zaeem: authorial style in LLM-rewritten fiction and semantic change attribution in EDA files. Work in progress, not published results.",
  alternates: { canonical: "/research" },
};
export default function ResearchPage() {
  return (
    <StoryMotion>
      <main className="page-width">
        <CollectionStructuredData
          path="/research"
          name="Research in progress"
          description={DOSSIER.researchGoal}
          items={RESEARCH.map((r) => ({
            name: r.formalTitle,
            description: r.summary + " " + r.status,
            url: SITE_ORIGIN + "/research#" + r.id,
            type: "CreativeWork",
          }))}
        />
        <ChapterHeading
          number="02 / Research"
          title="Questions I test."
          lead="Useful AI begins where confident claims end: with a controlled experiment, a clear baseline, and evidence someone else can inspect."
          note="Show your working."
        />
        {RESEARCH.map((r) => (
          <article className="research-story" id={r.id} key={r.id}>
            <div data-reveal>
              <p className="eyebrow">
                {r.role} / {r.period}
              </p>
              <h2>{r.title}</h2>
              <p className="formal-title">{r.formalTitle}</p>
              <span className="status">{r.status}</span>
              <p>{r.summary}</p>
              <div className="facts">
                {r.facts.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
              <ul className="project-details">
                {r.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <figure data-paper>
              <InkDrawing
                name={r.drawing}
                alt="Pen-and-ink notes on controlled research and engineering experiments"
              />
            </figure>
          </article>
        ))}
        <section className="research-methods">
          <SectionHeading
            eyebrow="The method / before the result"
            title="Make the evidence travel."
          />
          <p>{DOSSIER.researchGoal}</p>
          <div className="note-grid">
            {[
              [
                "01 / Control the change",
                "Dataset design, balanced sampling, experimental controls, and locked output schemas make comparisons interpretable.",
              ],
              [
                "02 / Preserve the trail",
                "Provenance metadata, checksums, reproducible pipelines, and technical writing connect each claim to its evidence.",
              ],
              [
                "03 / Bound the assistant",
                "In ParetoCo and ProGenEDA, AI proposes or interprets; deterministic solvers, validators, and native engineering tools remain the authority.",
              ],
            ].map(([title, copy]) => (
              <article className="note-card" key={title} data-reveal>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="research-methods">
          <SectionHeading
            eyebrow="Open questions / research interests"
            title="Where I want to go next."
          />
          <div className="skill-tags">
            {DOSSIER.interests.map((i) => (
              <span className="skill-tag" key={i}>
                {i}
              </span>
            ))}
          </div>
          <p>
            Open to research collaboration at the intersection of empirical LLM
            evaluation, scientific workflows, accessible computing, and
            architecture design-space exploration.
          </p>
        </section>
        <NextChapter href="/experience" />
      </main>
    </StoryMotion>
  );
}
