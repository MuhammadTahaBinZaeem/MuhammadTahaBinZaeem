"use client";

/* Pre-compressed, dimensioned WebP story frames intentionally bypass image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";
import { PROJECTS, type ProjectStory } from "../portfolio-data";

const LIVE_MEDIA: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "debate-club": {
    src: "/media/ventures/debate-club-live.webp",
    alt: "Live Debate Club application interface",
    width: 1440,
    height: 900,
  },
};

function themeStyle(project: ProjectStory): CSSProperties {
  return project.theme as CSSProperties;
}

function MediaSequence({ project }: { project: ProjectStory }) {
  const media = LIVE_MEDIA[project.id]
    ? [LIVE_MEDIA[project.id], ...project.media]
    : [...project.media];

  return (
    <div
      className={`project-media project-media--${Math.min(media.length, 4)}`}
      data-frame-count={media.length}
    >
      {media.map((asset, index) => (
        <figure
          className="project-media__frame"
          key={asset.src}
          style={{ "--media-index": index } as CSSProperties}
        >
          <img
            alt={asset.alt}
            height={asset.height}
            loading={project.index === "01" && index === 0 ? "eager" : "lazy"}
            src={asset.src}
            width={asset.width}
          />
          <figcaption>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {asset.alt}
          </figcaption>
        </figure>
      ))}
      <div className="motion-slot" aria-hidden="true">
        <span>06 SEC MOTION SLOT</span>
        <strong>HOVER FILM READY</strong>
        <small>drop /media/clips/{project.id}.webm later</small>
      </div>
    </div>
  );
}

export function ProjectsExperience() {
  const [activeId, setActiveId] = useState<string>(PROJECTS[0].id);
  const activeProject = useMemo(
    () => PROJECTS.find((project) => project.id === activeId) ?? PROJECTS[0],
    [activeId],
  );
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get("focus");
    if (!focus || !PROJECTS.some((project) => project.id === focus)) return;
    const timer = window.setTimeout(
      () => {
        setActiveId(focus);
        document.getElementById(`project-${focus}`)?.scrollIntoView({ block: "start" });
      },
      180,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const worlds = page.current?.querySelectorAll<HTMLElement>("[data-project-world]");
    if (!worlds?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (winner?.target as HTMLElement | undefined)?.dataset.projectId;
        if (id) setActiveId(id);
      },
      { threshold: [0.35, 0.55, 0.72] },
    );
    worlds.forEach((world) => observer.observe(world));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      const key = "mtbz:project-dwell-scores";
      let scores: Record<string, number> = {};
      try {
        scores = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, number>;
      } catch {
        scores = {};
      }
      scores[activeId] = (scores[activeId] ?? 0) + 1;
      localStorage.setItem(key, JSON.stringify(scores));

      const favorite = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? activeId;
      localStorage.setItem("mtbz:dominant-project-theme", favorite);
      document.documentElement.dataset.affinity = favorite;
    }, 1000);
    return () => window.clearInterval(tick);
  }, [activeId]);

  useEffect(() => {
    const scope = page.current;
    if (!scope) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".project-world").forEach((world, index) => {
          const backdrop = world.querySelector<HTMLElement>(".project-world__backdrop");
          const number = world.querySelector<HTMLElement>(".project-world__number");
          const visual = world.querySelector<HTMLElement>("[data-project-visual]");
          const mediaStack = world.querySelector<HTMLElement>(".project-media");

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: world,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.85,
            },
          });

          if (backdrop) {
            timeline.fromTo(
              backdrop,
              { scale: 1.13, transformOrigin: index % 2 ? "90% 20%" : "10% 80%" },
              { scale: 1.01, ease: "none" },
              0,
            );
          }
          if (number) {
            timeline.fromTo(number, { xPercent: 18, opacity: 0.12 }, { xPercent: -22, opacity: 0.42, ease: "none" }, 0);
          }
          if (visual) {
            timeline.fromTo(visual, { yPercent: 12, rotate: index % 2 ? -2.4 : 2.4 }, { yPercent: -10, rotate: index % 2 ? 1.3 : -1.3, ease: "none" }, 0);
          }
          if (mediaStack) {
            timeline.fromTo(mediaStack, { scale: 0.94 }, { scale: 1.04, ease: "none" }, 0);
          }
        });
      }, scope);
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  function jumpTo(id: string) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`project-${id}`)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="project-field" ref={page} style={themeStyle(activeProject)}>
      <StoryMotion>
        <PageSignal
          room="01 / ENGINE ROOM"
          title="EIGHT MACHINES. EIGHT LAWS OF PHYSICS."
          note="Stay with a project and the field remembers. The world you inspect longest becomes the site's dominant signal until another earns more time."
        />

        <nav className="project-index" aria-label="Jump to a project">
          <span>ACTIVE / {activeProject.index}</span>
          <div>
            {PROJECTS.map((project) => (
              <button
                aria-current={activeId === project.id ? "true" : undefined}
                key={project.id}
                onClick={() => jumpTo(project.id)}
                type="button"
              >
                <i>{project.index}</i>
                <strong>{project.shortTitle}</strong>
              </button>
            ))}
          </div>
        </nav>

        <div className="project-worlds">
          {PROJECTS.map((project, projectIndex) => (
            <section
              className={`project-world project-world--${projectIndex % 4}`}
              data-project-id={project.id}
              data-project-world
              id={`project-${project.id}`}
              key={project.id}
            >
              <div className="project-world__backdrop" style={themeStyle(project)} />
              <div className="project-world__number" aria-hidden="true">{project.index}</div>

              <div className="project-world__heading" data-reveal>
                <p>
                  <span>{project.index}</span>
                  {project.discipline}
                </p>
                <h2 data-title-scale={editorialTitleScale(project.title)}>{project.title}</h2>
                <strong>{project.logline}</strong>
              </div>

              <div className="project-world__visual" data-project-visual>
                <MediaSequence project={project} />
              </div>

              <div className="project-world__story" data-reveal>
                <div>
                  <span>THE BUILD</span>
                  <p>{project.story}</p>
                </div>
                <ol>
                  {project.proof.map((proof, index) => (
                    <li key={proof}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {proof}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="project-world__footer" data-reveal>
                <ul aria-label="Technology stack">
                  {project.stack.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div>
                  {project.links.github && (
                    <a href={project.links.github} rel="noreferrer" target="_blank">SOURCE ↗</a>
                  )}
                  {project.links.live && (
                    <a href={project.links.live} rel="noreferrer" target="_blank">LIVE SYSTEM ↗</a>
                  )}
                  {project.links.showcase && (
                    <a href={project.links.showcase} rel="noreferrer" target="_blank">SHOWCASE ↗</a>
                  )}
                  {!project.links.github && !project.links.live && !project.links.showcase && (
                    <span>PHYSICAL ARTIFACT / ARCHIVE EVIDENCE</span>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </StoryMotion>
    </div>
  );
}
