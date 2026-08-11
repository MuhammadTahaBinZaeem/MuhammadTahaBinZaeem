"use client";

/* Pre-compressed, dimensioned WebP evidence intentionally bypasses image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EDUCATION } from "../portfolio-data";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";

function focusedEducationIndex() {
  const queryId = new URLSearchParams(window.location.search).get("focus");
  const hashId = window.location.hash.replace(/^#education-/, "");
  return EDUCATION.findIndex((entry) => entry.id === (queryId || hashId));
}

export function EducationExperience() {
  const [activeId, setActiveId] = useState<string>(EDUCATION[0].id);
  const active = useMemo(() => EDUCATION.find((entry) => entry.id === activeId) ?? EDUCATION[0], [activeId]);
  const field = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const travelToRef = useRef<(index: number, animate?: boolean) => void>(() => undefined);
  const syncPanelsRef = useRef<(index: number) => void>(() => undefined);

  const setActive = (index: number) => {
    const bounded = Math.max(0, Math.min(EDUCATION.length - 1, index));
    activeIndexRef.current = bounded;
    syncPanelsRef.current(bounded);
    setActiveId((current) => current === EDUCATION[bounded].id ? current : EDUCATION[bounded].id);
  };

  useEffect(() => {
    const scope = field.current;
    const stage = journey.current;
    if (!scope || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const panels = gsap.utils.toArray<HTMLElement>(".education-panel", scope);
    const requestedIndex = focusedEducationIndex();
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
        // Stations fold open like engineered paper rather than sliding through a
        // generic deck. The history becomes a spatial formation map while the
        // evidence remains the real, accessible image layer.
        gsap.set(panels, {
          autoAlpha: 0,
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
          xPercent: 14,
          yPercent: 8,
          z: -680,
          rotateY: -58,
          rotateX: 6,
          scale: 0.72,
          transformPerspective: 1900,
        });
        gsap.set(panels[0], { autoAlpha: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", xPercent: 0, yPercent: 0, z: 0, rotateY: 0, rotateX: 0, scale: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (EDUCATION.length - 1) * 1.1)}`,
            pin: true,
            scrub: 0.82,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: { snapTo: (progress) => Math.round(progress * (EDUCATION.length - 1)) / (EDUCATION.length - 1), delay: 0.08, duration: { min: 0.18, max: 0.58 }, ease: "power2.inOut" },
            onUpdate: (self) => setActive(Math.round(self.progress * (EDUCATION.length - 1))),
          },
        });
        panels.forEach((panel, index) => {
          if (!index) return;
          const at = index - 1;
          timeline
            .to(panels[index - 1], {
              autoAlpha: 0,
              clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
              xPercent: -18,
              yPercent: -8,
              z: -720,
              rotateY: 60,
              rotateX: -7,
              scale: 0.7,
              duration: 0.62,
              ease: "none",
            }, at + 0.38)
            .to(panel, {
              autoAlpha: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              xPercent: 0,
              yPercent: 0,
              z: 0,
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.74,
              ease: "none",
            }, at + 0.1);
        });

        const wire = scope.querySelector<HTMLElement>(".education-atlas__wire");
        if (wire) timeline.fromTo(wire, { xPercent: -24, yPercent: 18, scaleX: 0.52, rotate: -12 }, { xPercent: 24, yPercent: -18, scaleX: 1.36, rotate: 14, ease: "none", duration: EDUCATION.length - 1 }, 0);
        panels.forEach((panel, index) => {
          if (index === 0) return;
          const at = Math.max(0, index - 0.8);
          const heading = panel.querySelector<HTMLElement>("header");
          const mediaPanel = panel.querySelector<HTMLElement>(".education-panel__media, .education-panel__origin");
          const story = panel.querySelector<HTMLElement>(".education-panel__story");
          const architecture = panel.querySelector<HTMLElement>(".education-panel__architecture");
          if (heading) timeline.fromTo(heading, { xPercent: -38, yPercent: 12, z: 160, rotateY: -16 }, { xPercent: 14, yPercent: -8, z: -50, rotateY: 8, ease: "none", duration: 0.76 }, at);
          if (mediaPanel) timeline.fromTo(mediaPanel, { xPercent: 34, yPercent: 18, z: 260, rotateY: index % 2 ? -24 : 24, rotateZ: index % 2 ? -8 : 8, scale: 0.7 }, { xPercent: -14, yPercent: -12, z: -110, rotateY: index % 2 ? 11 : -11, rotateZ: index % 2 ? 3 : -3, scale: 1.1, ease: "none", duration: 0.8 }, at);
          if (story) timeline.fromTo(story, { yPercent: 30, z: 100 }, { yPercent: -10, z: -35, ease: "none", duration: 0.7 }, at + 0.03);
          if (architecture) timeline.fromTo(architecture, { xPercent: 20, yPercent: 10, scale: 1.34, rotate: -10 }, { xPercent: -20, yPercent: -10, scale: 0.74, rotate: 12, ease: "none", duration: 0.82 }, at);
        });

        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        travelToRef.current = (index, animate = true) => {
          const bounded = Math.max(0, Math.min(EDUCATION.length - 1, index));
          const destination = trigger.start + (trigger.end - trigger.start) * (bounded / (EDUCATION.length - 1));
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
      travelToRef.current = (index, animate = true) => panels[index]?.scrollIntoView({ block: "start", behavior: animate && !reduced ? "smooth" : "auto" });
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
      const index = focusedEducationIndex();
      if (index >= 0) travelToRef.current(index, true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      media.revert();
    };
  }, []);

  const moveToStation = (index: number) => {
    const station = EDUCATION[index];
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("focus", station.id);
    nextUrl.hash = `education-${station.id}`;
    history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    travelToRef.current(index, true);
  };

  return (
    <div className="education-field" ref={field} style={active.theme as CSSProperties}>
      <StoryMotion>
        <PageSignal room="04 / THE FOUNDRY" title="FORMATION IS A CIRCUIT, NOT A LADDER." note="Three stations feed one formation line. The architecture changes at each stop; the curiosity remains continuous." />
      </StoryMotion>

      <section className="education-journey" aria-label="Education formation atlas" ref={journey}>
        <nav className="education-route" aria-label="Education stations">
          <span>FORMATION LINE</span>
          <div>
            {EDUCATION.map((entry, index) => <button aria-current={entry.id === activeId ? "step" : undefined} key={entry.id} onClick={() => moveToStation(index)} type="button"><i>{String(index + 1).padStart(2, "0")}</i><strong>{entry.institution.split(" (")[0]}</strong><small>{entry.period}</small></button>)}
          </div>
        </nav>
        <div className="education-atlas">
          <div className="education-atlas__wire" aria-hidden="true"><i /><i /><i /></div>
          {EDUCATION.map((entry, index) => (
            <article className="education-panel" data-active={entry.id === activeId ? "true" : undefined} id={`education-${entry.id}`} key={entry.id} onFocusCapture={() => { if (index !== activeIndexRef.current) travelToRef.current(index, true); }} style={entry.theme as CSSProperties}>
              <div className="education-panel__architecture" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span>{Array.from({ length: 8 }, (_, line) => <i key={line} />)}</div>
              <header>
                <p><span>STATION {String(index + 1).padStart(2, "0")}</span><span>{entry.period}</span></p>
                <h2 data-title-scale={editorialTitleScale(entry.institution)}>{entry.institution}</h2>
                <strong>{entry.qualification}</strong>
                {entry.grade && <em>GRADE / {entry.grade}</em>}
              </header>
              {entry.media.length > 0 ? (
                <figure className="education-panel__media">
                  {entry.media.map((asset) => <img alt={asset.alt} height={asset.height} key={asset.src} loading={index === 0 ? "eager" : "lazy"} src={asset.src} width={asset.width} />)}
                  <figcaption>ARCHIVE EVIDENCE / {entry.institution}</figcaption>
                </figure>
              ) : (
                <div className="education-panel__origin" aria-label="A graph-paper origin field"><span>CS</span><code>01010011 01010100 01000001 01010010 01010100</code><p>Every system begins as a mark on paper and a reason to ask what happens next.</p></div>
              )}
              <div className="education-panel__story"><span>WHAT CHANGED HERE</span><p>{entry.story}</p><ul>{entry.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
