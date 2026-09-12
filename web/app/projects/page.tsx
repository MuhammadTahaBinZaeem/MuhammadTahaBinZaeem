import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PROJECTS, type ProjectStory } from "../portfolio-data";
import { FEATURED } from "../dossier-data";
import { PROJECT_GALLERIES } from "../project-galleries";
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
import { GalleryImage, type GalleryAsset } from "../components/gallery-image";
const ENGINEERING_PROJECTS = PROJECTS.filter((project) =>
  !FEATURED.some((featured) => "legacyId" in featured && featured.legacyId === project.id),
);

function BuildNotes({ project, legacy = false, images = [...(PROJECT_GALLERIES[project.id] || []), ...project.media], title = project.title }: { project: ProjectStory; legacy?: boolean; images?: readonly GalleryAsset[]; title?: string }) {
  return (
    <details className={legacy ? "featured-origin" : undefined}>
      <summary>{legacy ? "From the original FOP solver · build notes & evidence" : "Read the build notes & see evidence"}</summary>
      {legacy && <p className="eyebrow">Archive / the original algebraic expression solver</p>}
      <p>{project.story}</p>
      <ul>{project.proof.map((item) => <li key={item}>{item}</li>)}</ul>
      {project.media.map((media) => (
        <figure key={media.src}>
          <GalleryImage image={media} images={images} title={title} />
          <figcaption>{media.alt}</figcaption>
        </figure>
      ))}
    </details>
  );
}

export const metadata: Metadata = {
  title: "Projects — Products, processors & public source",
  description:
    "Explore Muhammad Taha Bin Zaeem’s projects: ParetoCo, ProGenEDA, Type2Learn, Pocket Engineer, a 20-bit CPU, MIPS chess, and the complete source index.",
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
            ...ENGINEERING_PROJECTS.map((p) => ({
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
        {FEATURED.map((p, i) => {
          const legacy = "legacyId" in p ? PROJECTS.find((project) => project.id === p.legacyId) : undefined;
          const cover = "image" in p ? p.image : { src: `/art/notebook/${p.drawing}.svg`, width: 960, height: 760, alt: p.title + " illustrated in pen and ink" };
          const images = [cover, ...(PROJECT_GALLERIES[p.id] || []), ...(legacy?.media || [])];
          return (
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
            <div data-reveal id={legacy ? "project-" + legacy.id : undefined}>
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
            <figure className={`feature-art${"image" in p ? " project-screenshot" : ""}`} data-paper>
              {"image" in p ? <>
                <GalleryImage image={p.image} images={images} title={p.title} />
                <figcaption>{p.image.caption}</figcaption>
              </> : <InkDrawing name={p.drawing} alt={cover.alt} images={images} title={p.title} />}
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
              {legacy && <BuildNotes project={legacy} legacy images={images} title={p.title} />}
            </div>
          </article>
        );})}
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
            {ENGINEERING_PROJECTS.map((p) => (
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
                <BuildNotes project={p} />
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
