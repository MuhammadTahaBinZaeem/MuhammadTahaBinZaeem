import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIENCE, FEATURED, LEADERSHIP } from "../dossier-data";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  SectionHeading,
  ExternalLink,
} from "../components/notebook-ui";
import { StoryMotion } from "../components/story-motion";
export const metadata: Metadata = {
  title: "Experience & Community — Founder work, internships, leadership",
  description:
    "Muhammad Taha Bin Zaeem’s founder roles at Type2Learn and ProGenEDA, software internships, NUST workshops, and student-society leadership.",
  alternates: { canonical: "/experience" },
};
export function ExperienceChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="03 / Experience & community"
          title="People I build with."
          lead="Engineering is not a solitary activity. It is interviews, code reviews, workshop rooms, and people trusting you to make something useful."
          note="Build it. Share what you learn."
        />
        <div className="experience-cover">
          <p className="lead-statement">
            A founder’s ownership.
            <br />A researcher’s questions.
            <br />A student’s curiosity.
          </p>
          <InkDrawing
            name="community"
            alt="Hand-drawn workshop table with a shared circuit, tools, and notebooks"
          />
        </div>
        <section id="founder-work">
          <SectionHeading
            eyebrow="01 / Founder work"
            title="From intent to responsibility."
          />
          {FEATURED.filter((p) => p.id !== "paretoco").map((p) => (
            <article className="timeline-entry" key={p.id} data-reveal>
              <p className="timeline-date">July 2026–present</p>
              <div>
                <h2>{p.title}</h2>
                <h3>{p.role.split(" · ")[0]}</h3>
                <p>{p.summary}</p>
                <Link className="text-link" href={"/projects#" + p.id}>
                  Read the project and validation record ↗
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section id="internships">
          <SectionHeading
            eyebrow="02 / Professional experience"
            title="Learning inside real teams."
          />
          {EXPERIENCE.map((e) => (
            <article className="timeline-entry" key={e.id} data-reveal>
              <p className="timeline-date">{e.period}</p>
              <div>
                <h2>{e.organization}</h2>
                <h3>{e.role}</h3>
                <p>{e.description}</p>
                {"href" in e && (
                  <ExternalLink href={e.href}>
                    Internship source archive
                  </ExternalLink>
                )}
              </div>
            </article>
          ))}
        </section>
        <section id="community">
          <SectionHeading
            eyebrow="03 / Leadership & volunteering"
            title="Make room for the next person."
          />
          {LEADERSHIP.map((e) => (
            <article className="timeline-entry" key={e.id} data-reveal>
              <p className="timeline-date">{e.period}</p>
              <div>
                <h2>{e.organization}</h2>
                <h3>{e.role}</h3>
                <ul>
                  {e.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
        <aside className="big-note" data-reveal>
          <p className="eyebrow">A proposed next chapter / campus initiative</p>
          <h2>A community for responsible AI building.</h2>
          <p>
            My Claude Campus Ambassador application proposes a student-led
            Claude community: hands-on prompting workshops, no-code buildathons,
            responsible experimentation, and peer learning. This is an
            application and an initiative I want to build—not a claim of
            appointment as an ambassador. The full campus/community CV is
            available in <Link href="/connect#cvs">Links & CVs</Link>.
          </p>
        </aside>
        <NextChapter href="/education" />
      </Frame>
    </StoryMotion>
  );
}

export default function ExperiencePage() {
  return <ExperienceChapter />;
}
