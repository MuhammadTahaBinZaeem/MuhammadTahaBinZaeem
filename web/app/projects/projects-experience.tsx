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

function focusedProjectIndex() {
  const queryId = new URLSearchParams(window.location.search).get("focus");
  const hashId = window.location.hash.replace(/^#project-/, "");
  return PROJECTS.findIndex((project) => project.id === (queryId || hashId));
}

function MediaSequence({ project }: { project: ProjectStory }) {
  const media = LIVE_MEDIA[project.id]
    ? [LIVE_MEDIA[project.id], ...project.media]
    : [...project.media];

  return (
    <div className={`project-media project-media--${Math.min(media.length, 4)}`} data-frame-count={media.length}>
      {media.map((asset, index) => (
        <figure className="project-media__frame" key={asset.src} style={{ "--media-index": index } as CSSProperties}>
          <img
            alt={asset.alt}
            height={asset.height}
            loading={project.index === "01" && index === 0 ? "eager" : "lazy"}
            src={asset.src}
            width={asset.width}
          />
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{asset.alt}</figcaption>
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
  const field = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const travelToRef = useRef<(index: number, animate?: boolean) => void>(() => undefined);
  const syncPanelsRef = useRef<(index: number) => void>(() => undefined);

  const setActive = (index: number) => {
    const bounded = Math.max(0, Math.min(PROJECTS.length - 1, index));
    activeIndexRef.current = bounded;
    syncPanelsRef.current(bounded);
    setActiveId((current) => current === PROJECTS[bounded].id ? current : PROJECTS[bounded].id);
  };

  useEffect(() => {
    const scope = field.current;
    const stage = journey.current;
    if (!scope || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const panels = gsap.utils.toArray<HTMLElement>(".project-panel", scope);
    const requestedIndex = focusedProjectIndex();
    if (requestedIndex >= 0) activeIndexRef.current = requestedIndex;

    const media = gsap.matchMedia();
    media.add(
      { desktop: "(min-width: 761px)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion) return;

        const syncDesktopPanels = (index: number) => {
          panels.forEach((panel, panelIndex) => {
            const isCurrent = panelIndex === index;
            panel.toggleAttribute("inert", !isCurrent);
            panel.toggleAttribute("data-active", isCurrent);
            if (isCurrent) panel.removeAttribute("aria-hidden");
            else panel.setAttribute("aria-hidden", "true");
          });
        };
        syncPanelsRef.current = syncDesktopPanels;
        syncDesktopPanels(activeIndexRef.current);

        // The machine rooms do not simply fade through each other. Each build is a
        // physical plate travelling through an assembly cyclotron: the outgoing
        // plate is thrown behind the viewer while the next one arrives from the
        // opposite side of the rig. This stays entirely 2D media/CSS — no 3D model.
        gsap.set(panels, {
          autoAlpha: 0,
          xPercent: 88,
          yPercent: 12,
          z: -720,
          rotateX: 7,
          rotateY: 54,
          rotateZ: 8,
          scale: 0.64,
          transformPerspective: 1800,
        });
        gsap.set(panels[0], { autoAlpha: 1, xPercent: 0, yPercent: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (PROJECTS.length - 1) * 0.92)}`,
            pin: true,
            scrub: 0.72,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (progress) => Math.round(progress * (PROJECTS.length - 1)) / (PROJECTS.length - 1),
              delay: 0.06,
              duration: { min: 0.16, max: 0.5 },
              ease: "power2.inOut",
            },
            onUpdate: (self) => setActive(Math.round(self.progress * (PROJECTS.length - 1))),
          },
        });

        for (let index = 1; index < panels.length; index += 1) {
          const step = index - 1;
          timeline
            .to(panels[index - 1], {
              autoAlpha: 0,
              xPercent: -86,
              yPercent: -10,
              z: -760,
              rotateX: -8,
              rotateY: -58,
              rotateZ: -8,
              scale: 0.62,
              duration: 0.54,
              ease: "none",
            }, step + 0.4)
            .to(panels[index], {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1,
              duration: 0.66,
              ease: "none",
            }, step + 0.14);
        }

        const grid = scope.querySelector<HTMLElement>(".project-assembly-grid");
        if (grid) timeline.fromTo(grid, { rotate: -16, scale: 1.22, xPercent: -10 }, { rotate: 42, scale: 0.84, xPercent: 12, ease: "none", duration: PROJECTS.length - 1 }, 0);
        panels.forEach((panel, index) => {
          // The first machine must be legible at the moment the room opens; every
          // later machine completes its internal motion just before its snap point.
          if (index === 0) return;
          const at = Math.max(0, index - 0.8);
          const heading = panel.querySelector<HTMLElement>(".project-panel__heading");
          const visual = panel.querySelector<HTMLElement>(".project-panel__visual");
          const story = panel.querySelector<HTMLElement>(".project-panel__story");
          const scene = panel.querySelector<HTMLElement>(".project-panel__scene");
          if (heading) timeline.fromTo(heading, { xPercent: -32, z: 120, rotateY: -12 }, { xPercent: 12, z: 0, rotateY: 5, ease: "none", duration: 0.76 }, at);
          if (visual) timeline.fromTo(visual, { yPercent: 24, z: 180, rotateY: index % 2 ? -18 : 18, rotateZ: index % 2 ? -7 : 7 }, { yPercent: -13, z: -70, rotateY: index % 2 ? 8 : -8, rotateZ: index % 2 ? 2 : -2, ease: "none", duration: 0.78 }, at);
          if (story) timeline.fromTo(story, { yPercent: 26, z: 90 }, { yPercent: -7, z: -30, ease: "none", duration: 0.7 }, at + 0.03);
          if (scene) timeline.fromTo(scene, { scale: 1.32, xPercent: 14, rotate: -8 }, { scale: 0.8, xPercent: -16, rotate: 10, ease: "none", duration: 0.8 }, at);
        });

        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        travelToRef.current = (index, animate = true) => {
          const bounded = Math.max(0, Math.min(PROJECTS.length - 1, index));
          const destination = trigger.start + (trigger.end - trigger.start) * (bounded / (PROJECTS.length - 1));
          setActive(bounded);
          if (animate) window.scrollTo({ top: destination, behavior: "smooth" });
          else trigger.scroll(destination);
        };

        ScrollTrigger.refresh();
        if (requestedIndex >= 0) requestAnimationFrame(() => travelToRef.current(requestedIndex, false));

        return () => {
          panels.forEach((panel) => {
            panel.removeAttribute("inert");
            panel.removeAttribute("aria-hidden");
            panel.removeAttribute("data-active");
          });
          syncPanelsRef.current = () => undefined;
          travelToRef.current = () => undefined;
          timeline.kill();
          gsap.set(panels, { clearProps: "all" });
        };
      },
    );

    media.add("(max-width: 760px), (prefers-reduced-motion: reduce)", () => {
      panels.forEach((panel) => {
        panel.removeAttribute("inert");
        panel.removeAttribute("aria-hidden");
        panel.removeAttribute("data-active");
      });
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      travelToRef.current = (index, animate = true) => {
        panels[index]?.scrollIntoView({ block: "start", behavior: animate && !reduced ? "smooth" : "auto" });
      };
      const observer = new IntersectionObserver(
        (entries) => {
          const winner = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const index = panels.indexOf(winner?.target as HTMLElement);
          if (index >= 0) setActive(index);
        },
        { threshold: [0.35, 0.58, 0.78] },
      );
      panels.forEach((panel) => observer.observe(panel));
      if (requestedIndex >= 0) requestAnimationFrame(() => travelToRef.current(requestedIndex, false));
      return () => observer.disconnect();
    });

    const onHashChange = () => {
      const index = focusedProjectIndex();
      if (index >= 0) travelToRef.current(index, true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      media.revert();
    };
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      const key = "mtbz:project-dwell-scores";
      let scores: Record<string, number> = {};
      try { scores = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, number>; } catch { scores = {}; }
      scores[activeId] = (scores[activeId] ?? 0) + 1;
      localStorage.setItem(key, JSON.stringify(scores));
      const favorite = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? activeId;
      localStorage.setItem("mtbz:dominant-project-theme", favorite);
      document.documentElement.dataset.affinity = favorite;
    }, 1000);
    return () => window.clearInterval(tick);
  }, [activeId]);

  const moveToProject = (index: number) => {
    const project = PROJECTS[index];
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("focus", project.id);
    nextUrl.hash = `project-${project.id}`;
    history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    travelToRef.current(index, true);
  };

  return (
    <div className="project-field" ref={field} style={themeStyle(activeProject)}>
      <StoryMotion>
        <PageSignal room="01 / ENGINE ROOM" title="EIGHT MACHINES. EIGHT LAWS OF PHYSICS." note="One console. Eight independent systems. Scroll the assembly line and the machine in front of you takes the entire field." />
      </StoryMotion>

      <section className="project-journey" aria-label="Engineering project assembly line" ref={journey}>
        <nav className="project-console" aria-label="Project assembly index">
          <div className="project-console__readout" aria-live="polite">
            <span>ACTIVE BUILD</span>
            <strong>{activeProject.index}</strong>
            <i aria-hidden="true" />
            <small>{activeProject.shortTitle}</small>
          </div>
          <div className="project-console__track">
            {PROJECTS.map((project, index) => (
              <button aria-current={activeId === project.id ? "step" : undefined} key={project.id} onClick={() => moveToProject(index)} type="button">
                <span>{project.index}</span><strong>{project.shortTitle}</strong>
              </button>
            ))}
          </div>
        </nav>

        <div className="project-deck">
          <div className="project-assembly-grid" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          {PROJECTS.map((project, projectIndex) => (
            <article
              className="project-panel"
              data-active={activeId === project.id ? "true" : undefined}
              id={`project-${project.id}`}
              key={project.id}
              onFocusCapture={() => {
                if (projectIndex !== activeIndexRef.current) travelToRef.current(projectIndex, true);
              }}
              style={themeStyle(project)}
            >
              <div className="project-panel__scene" aria-hidden="true"><span>{project.index}</span><i /><i /><i /></div>
              <header className="project-panel__heading">
                <p><span>{project.index}</span>{project.discipline}</p>
                <h2 data-title-scale={editorialTitleScale(project.title)}>{project.title}</h2>
                <strong>{project.logline}</strong>
              </header>
              <div className="project-panel__visual"><MediaSequence project={project} /></div>
              <div className="project-panel__story">
                <div><span>THE BUILD</span><p>{project.story}</p></div>
                <ol>{project.proof.map((proof, index) => <li key={proof}><span>{String(index + 1).padStart(2, "0")}</span>{proof}</li>)}</ol>
              </div>
              <footer className="project-panel__footer">
                <ul aria-label="Technology stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                <div>
                  {project.links.github && <a href={project.links.github} rel="noreferrer" target="_blank">SOURCE ↗</a>}
                  {project.links.live && <a href={project.links.live} rel="noreferrer" target="_blank">LIVE SYSTEM ↗</a>}
                  {project.links.showcase && <a href={project.links.showcase} rel="noreferrer" target="_blank">SHOWCASE ↗</a>}
                  {!project.links.github && !project.links.live && !project.links.showcase && <span>PHYSICAL ARTIFACT / ARCHIVE EVIDENCE</span>}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
