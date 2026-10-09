import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
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
import { CPUArchitectureStudy } from "../components/cpu-architecture-study";
const ENGINEERING_PROJECTS = PROJECTS.filter((project) =>
  !FEATURED.some((featured) => featured.legacyId === project.id),
);

function BuildNotes({ project, legacy = false, images = [...(PROJECT_GALLERIES[project.id] || []), ...project.media], title = project.title }: { project: ProjectStory; legacy?: boolean; images?: readonly GalleryAsset[]; title?: string }) {
  return (
    <details className={legacy ? "featured-origin" : undefined}>
      <summary>{legacy ? "From the original FOP solver · build notes & evidence" : "Read the build notes & see evidence"}</summary>
      {legacy && <p className="eyebrow">Archive / the original algebraic expression solver</p>}
      <p>{project.story}</p>
      <ul>{project.proof.map((item) => <li key={item}>{item}</li>)}</ul>
      {images.length > 0 && <p className="evidence-reference">{legacy
        ? "The original solver’s graphs and C++ source are labeled as archival evidence in the project gallery above."
        : `${title} photographs and technical evidence are available in the image gallery above.`}</p>}
    </details>
  );
}

export const metadata = pageMetadata("/projects");
export function ProjectsChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width projects-premium">
        {!embedded && <PageStructuredData path="/projects" />}
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
          chapter="projects"
          level={embedded ? 2 : 1}
          number="01 / Projects"
          title="Things I build."
          lead="From a circuit on the bench to a platform in someone’s hands. The work, the decisions, and the evidence behind them."
          note="Open the source. Look closer."
        />
        <nav className="section-nav" aria-label="Project sections">
          {FEATURED[0] && <a href={"#" + FEATURED[0].id}>Flagship projects ↓</a>}
          {ENGINEERING_PROJECTS.length > 0 && <a href="#engineering">Engineering projects ↓</a>}
          <a href="#repositories">Complete GitHub index ↓</a>
        </nav>
        <div className="project-plates">
        {FEATURED.map((p, i) => {
          const legacy = p.legacyId ? PROJECTS.find((project) => project.id === p.legacyId) : undefined;
          const cover = p.image || { src: `/art/notebook/${p.drawing}.svg`, width: 960, height: 760, alt: p.title + " illustrated in pen and ink" };
          const archive = (legacy?.media || []).map((image) => ({ ...image, caption: `Original FOP solver archive · ${image.caption || image.alt}` }));
          const related = [...((p as { media?: readonly GalleryAsset[] }).media || []), ...(PROJECT_GALLERIES[p.id] || []), ...archive];
          const images = p.image ? [p.image, ...related] : related.length ? related : [cover];
          const displayImage = images.find((image) => image.src === p.displayImageSrc) || p.image;
          const imageCount = new Set(images.map((image) => image.src)).size;
          return (
          <article
            className={`project-feature project-plate${i % 2 ? " project-plate--reverse" : ""}${p.image ? " project-plate--product" : " project-plate--concept"}`}
            id={p.id}
            key={p.id}
          >
            <div className="project-plate__intro" data-reveal id={legacy ? "project-" + legacy.id : undefined}>
              <div className="project-plate__title">
              <p className="eyebrow">
                <span className="project-plate__number">{String(i + 1).padStart(2, "0")}</span> {p.category}
              </p>
              <h2>{p.title}</h2>
              <p className="role">{p.role}</p>
              </div>
              <div className="project-plate__brief">
              <p className="project-summary">{p.summary}</p>
              <div className="facts">
                {p.facts.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
              </div>
            </div>
            <figure className={`feature-art project-plate__media${p.image ? " project-screenshot" : ""}`} data-paper>
              {displayImage ? <>
                <GalleryImage image={displayImage} images={images} title={p.title} />
                <figcaption><span>{displayImage.caption}</span><span>{String(imageCount).padStart(2, "0")} images / open the archive ↗</span></figcaption>
              </> : <InkDrawing name={p.drawing || "workbench"} alt={cover.alt} images={images} title={p.title} />}
            </figure>
            <div className="project-plate__footer">
              <div className="link-row project-plate__links">
                {p.links.map((l) => (
                  <ExternalLink href={l.href} key={l.href}>
                    {l.label}
                  </ExternalLink>
                ))}
              </div>
              {p.details.length > 0 && <details className="project-plate__details">
                <summary><span>Inside the build</span><span aria-hidden="true">+</span></summary>
              <ul className="project-details">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              </details>}
              {legacy && <BuildNotes project={legacy} legacy images={images} title={p.title} />}
            </div>
          </article>
        );})}
        </div>
        {ENGINEERING_PROJECTS.length > 0 && <section className="small-work" id="engineering">
          <SectionHeading
            eyebrow="On the bench / engineering foundations"
            title="Built at a lower level."
          />
          <p>
            Team ownership matters. On the vector CPU, I owned branch-condition,
            data-memory, immediate-extension, lane load/store, core integration,
            and top-level logic.
          </p>
          <CPUArchitectureStudy />
          <div className="engineering-rail" data-scroll-scene="horizontal" data-scroll-direction="right">
          <p className="rail-instruction">Scroll down. The work moves sideways.</p>
          <div className="engineering-rail__viewport" data-scroll-viewport>
          <div className="small-work-grid" data-scroll-track>
            {ENGINEERING_PROJECTS.map((p) => {
              const images = [...(PROJECT_GALLERIES[p.id] || []), ...p.media];
              return (
              <article
                className="work-card"
                id={"project-" + p.id}
                key={p.id}
                data-reveal
              >
                {images[0] && <figure className="work-card__cover" data-paper>
                  <GalleryImage image={images[0]} images={images} title={p.title} />
                </figure>}
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
            );})}
          </div>
          </div>
          </div>
        </section>}
        <RepositoryIndex />
        {!embedded && <NextChapter href="/research" />}
      </Frame>
    </StoryMotion>
  );
}

export default function ProjectsPage() {
  return <ProjectsChapter />;
}
