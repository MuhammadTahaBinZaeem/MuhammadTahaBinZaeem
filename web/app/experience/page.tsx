import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
import Link from "next/link";
import type { CSSProperties } from "react";
import { EXPERIENCE, FEATURED, LEADERSHIP } from "../dossier-data";
import { COLLABORATORS } from "../collaborators-data";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  SectionHeading,
  ExternalLink,
} from "../components/notebook-ui";
import { StoryMotion } from "../components/story-motion";
import { EntryGallery, GalleryImage } from "../components/gallery-image";
import "./collaborators.css";
export const metadata = pageMetadata("/experience");
export function ExperienceChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        {!embedded && <PageStructuredData path="/experience" />}
        <ChapterHeading
          chapter="experience"
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
        <section id="project-teammates" className="collaborators-section">
          <SectionHeading eyebrow="Shared work / project collaborators" title="Good work has more than one signature." />
          <p>The people beside me on the build. Follow their work, and explore the projects we made together.</p>
          <div className="collaborators-grid">
            {COLLABORATORS.map((person, i) => <article
              className={`collaborator${person.background ? " collaborator--illustrated" : ""}`}
              id={"person-" + person.id}
              aria-labelledby={"person-name-" + person.id}
              key={person.id}
              style={{ "--person-accent": person.accent || "#9d553d" } as CSSProperties}
              data-reveal
            >
              {person.background && <div className="collaborator-cover">
                <GalleryImage image={person.background} images={[{
                  ...person.background,
                  caption: person.background.caption || `Conceptual artwork inspired by ${person.name}’s ${person.focus || "shared engineering work"}.`,
                }]} title={person.name + " · conceptual profile artwork"} />
                <div className="collaborator-cover__label" aria-hidden="true"><span>Shared work</span><span>Personal study / {String(i + 1).padStart(2, "0")}</span></div>
              </div>}
              <div className="collaborator-body">
                <div className="collaborator-identity">
                  <figure className="collaborator-portrait">
                    {person.portrait ? <GalleryImage image={person.portrait} images={[person.portrait, ...(person.media || [])]} title={person.name + " · profile picture & photographs"} /> :
                      <span className="collaborator-initials" aria-label={person.name + " · initials"}>{person.name.split(/\s+/).filter(Boolean).filter((_, index, words) => index === 0 || index === words.length - 1).map(word => word[0]).join("")}</span>}
                  </figure>
                  <span className="collaborator-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="collaborator-introduction">
                  {person.focus && <p className="collaborator-focus">{person.focus}</p>}
                  <h3 id={"person-name-" + person.id}>{person.name}</h3>
                  <p className="collaborator-note">{person.note}</p>
                  {!person.portrait && <EntryGallery entry={person} title={person.name} className="collaborator-evidence" />}
                </div>
                <div className="collaborator-footer">
                  <p className="collaborator-project-label">Made together</p>
                  <div className="collaborator-projects">{person.projects.map((project) => <Link key={project.href} href={project.href}><span>{project.name}</span><span aria-hidden="true">↗</span></Link>)}</div>
                  <div className="link-row">
                    {person.linkedin && <ExternalLink href={person.linkedin}>LinkedIn profile</ExternalLink>}
                    {person.profile && <ExternalLink href={person.profile}>{person.platform || "Public"} profile</ExternalLink>}
                    <ExternalLink href={person.source}>Project credit</ExternalLink>
                  </div>
                </div>
              </div>
            </article>)}
          </div>
        </section>
        <section id="founder-work">
          <SectionHeading
            eyebrow="01 / Founder work"
            title="From intent to responsibility."
          />
          {FEATURED.filter((p) => p.founderWork).map((p) => (
            <article className="timeline-entry" key={p.id} data-reveal>
              <p className="timeline-date">{p.founderPeriod}</p>
              <div>
                <h2>{p.title}</h2>
                <h3>{p.role.split(" · ")[0]}</h3>
                <p>{p.summary}</p>
                <EntryGallery entry={p} title={p.title} />
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
                <EntryGallery entry={e} title={e.organization} />
                {e.href && (
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
                <EntryGallery entry={e} title={e.organization} />
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
        {!embedded && <NextChapter href="/education" />}
      </Frame>
    </StoryMotion>
  );
}

export default function ExperiencePage() {
  return <ExperienceChapter />;
}
