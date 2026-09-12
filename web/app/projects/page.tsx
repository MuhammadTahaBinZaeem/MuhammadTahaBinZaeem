/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PROJECTS } from "../portfolio-data";
import { FEATURED } from "../dossier-data";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  SectionHeading,
  ExternalLink,
} from "../components/notebook-ui";
import { RepositoryIndex } from "./repository-index";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
export const metadata: Metadata = {
  title: "Projects — Products, processors & public source",
  description:
    "Explore every public GitHub repository and engineering project by Muhammad Taha Bin Zaeem, including ParetoCo, ProGenEDA, Type2Learn, a 20-bit CPU, and MIPS chess.",
  alternates: { canonical: "/projects" },
};
export function ProjectsChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        <CollectionStructuredData
          path="/projects"
          name="Engineering projects by Muhammad Taha Bin Zaeem"
          description="Products, architecture, software, and electronics."
          items={[
            ...FEATURED.map((p) => ({
              name: p.title,
              description: p.summary,
              url: SITE_ORIGIN + "/projects#" + p.id,
              type: "CreativeWork",
              sameAs: p.links.map((l) => l.href),
            })),
            ...PROJECTS.map((p) => ({
              name: p.title,
              description: p.logline,
              url: SITE_ORIGIN + "/projects#project-" + p.id,
              type: "CreativeWork",
            })),
          ]}
        />
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="01 / Projects"
          title="Things I build."
          lead="From a circuit on the bench to a platform in someone’s hands. The work, the decisions, and the evidence behind them."
          note="Open the source. Look closer."
        />
        <nav className="section-nav" aria-label="Project sections">
          <a href="#paretoco">Flagship projects ↓</a>
          <a href="#engineering">Engineering projects ↓</a>
          <a href="#repositories">Complete GitHub index ↓</a>
        </nav>
        {FEATURED.map((p, i) => (
          <article
            className="project-feature"
            id={p.id}
            key={p.id}
            style={
              {
                "--title-size": p.title.length > 12 ? "5.5vw" : "7vw",
              } as CSSProperties
            }
          >
            <div data-reveal>
              <p className="eyebrow">
                0{i + 1} / {p.category}
              </p>
              <h2>{p.title}</h2>
              <p className="role">{p.role}</p>
              <p className="project-summary">{p.summary}</p>
              <div className="facts">
                {p.facts.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
            <figure className="feature-art" data-paper>
              <InkDrawing
                name={p.drawing}
                alt={p.title + " illustrated in pen and ink"}
              />
            </figure>
            <div>
              <ul className="project-details">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="link-row">
                {p.links.map((l) => (
                  <ExternalLink href={l.href} key={l.href}>
                    {l.label}
                  </ExternalLink>
                ))}
              </div>
            </div>
          </article>
        ))}
        <section className="small-work" id="engineering">
          <SectionHeading
            eyebrow="On the bench / engineering foundations"
            title="Built at a lower level."
          />
          <p>
            Team ownership matters. On the vector CPU, I owned branch-condition,
            data-memory, immediate-extension, lane load/store, core integration,
            and top-level logic.
          </p>
          <div className="small-work-grid">
            {PROJECTS.map((p) => (
              <article
                className="work-card"
                id={"project-" + p.id}
                key={p.id}
                data-reveal
              >
                <p className="eyebrow">
                  {p.index} / {p.discipline}
                </p>
                <h3
                  style={{ fontSize: p.title.length > 48 ? "23px" : undefined }}
                >
                  {p.title}
                </h3>
                <p>{p.logline}</p>
                <div className="facts">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <details>
                  <summary>Read the build notes & see evidence</summary>
                  <p>{p.story}</p>
                  <ul>
                    {p.proof.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  {p.media.map((m) => (
                    <figure key={m.src}>
                      <img
                        src={m.src}
                        width={m.width}
                        height={m.height}
                        alt={m.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>{m.alt}</figcaption>
                    </figure>
                  ))}
                </details>
                <div className="link-row">
                  {Object.entries(p.links)
                    .filter(([, href]) => href)
                    .map(([label, href]) => (
                      <ExternalLink key={label} href={href!}>
                        {label === "github"
                          ? "Source"
                          : label === "live"
                            ? "Live project"
                            : label}
                      </ExternalLink>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <RepositoryIndex />
        {!embedded && <NextChapter href="/research" />}
      </Frame>
    </StoryMotion>
  );
}

export default function ProjectsPage() {
  return <ProjectsChapter />;
}
