"use client";

/* Pre-compressed, dimensioned WebP evidence intentionally bypasses image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACHIEVEMENTS } from "../portfolio-data";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";

function focusedAchievementIndex() {
  const queryId = new URLSearchParams(window.location.search).get("focus");
  const hashId = window.location.hash.replace(/^#achievement-/, "");
  return ACHIEVEMENTS.findIndex((achievement) => achievement.id === (queryId || hashId));
}

export function AchievementsExperience() {
  const [activeId, setActiveId] = useState<string>(ACHIEVEMENTS[0].id);
  const active = useMemo(
    () => ACHIEVEMENTS.find((achievement) => achievement.id === activeId) ?? ACHIEVEMENTS[0],
    [activeId],
  );
  const field = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const travelToRef = useRef<(index: number, animate?: boolean) => void>(() => undefined);
  const syncPanelsRef = useRef<(index: number) => void>(() => undefined);

  const setActive = (index: number) => {
    const bounded = Math.max(0, Math.min(ACHIEVEMENTS.length - 1, index));
    activeIndexRef.current = bounded;
    syncPanelsRef.current(bounded);
    setActiveId((current) => current === ACHIEVEMENTS[bounded].id ? current : ACHIEVEMENTS[bounded].id);
  };

  useEffect(() => {
    const scope = field.current;
    const stage = journey.current;
    if (!scope || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const panels = gsap.utils.toArray<HTMLElement>(".achievement-panel", scope);
    const requestedIndex = focusedAchievementIndex();
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
        // A public result should hit like a cut in a film, not like another card
        // in a carousel. The reel throws each frame upward and pulls the next
        // evidence frame toward the viewer from below.
        gsap.set(panels, {
          autoAlpha: 0,
          xPercent: 16,
          yPercent: 112,
          z: -520,
          rotateX: 64,
          rotateZ: 5,
          scale: 0.64,
          transformPerspective: 1800,
        });
        gsap.set(panels[0], { autoAlpha: 1, xPercent: 0, yPercent: 0, z: 0, rotateX: 0, rotateZ: 0, scale: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (ACHIEVEMENTS.length - 1) * 0.95)}`,
            pin: true,
            scrub: 0.78,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (progress) => Math.round(progress * (ACHIEVEMENTS.length - 1)) / (ACHIEVEMENTS.length - 1),
              duration: { min: 0.18, max: 0.56 },
              delay: 0.06,
              ease: "power3.inOut",
            },
            onUpdate: (self) => setActive(Math.round(self.progress * (ACHIEVEMENTS.length - 1))),
          },
        });

        panels.forEach((panel, index) => {
          if (!index) return;
          const at = index - 1;
          timeline
            .to(panels[index - 1], {
              autoAlpha: 0,
              xPercent: -20,
              yPercent: -108,
              z: -560,
              rotateX: -66,
              rotateZ: index % 2 ? -9 : 9,
              scale: 0.6,
              duration: 0.58,
              ease: "none",
            }, at + 0.4)
            .to(panel, {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              z: 0,
              rotateX: 0,
              rotateZ: 0,
              scale: 1,
              duration: 0.68,
              ease: "none",
            }, at + 0.12);
        });

        const reel = scope.querySelector<HTMLElement>(".achievement-reel");
        if (reel) timeline.fromTo(reel, { rotate: -32, scale: 1.32, yPercent: 18 }, { rotate: 118, scale: 0.72, yPercent: -20, ease: "none", duration: ACHIEVEMENTS.length - 1 }, 0);
        panels.forEach((panel, index) => {
          if (index === 0) return;
          const at = Math.max(0, index - 0.8);
          const heading = panel.querySelector<HTMLElement>("header");
          const gallery = panel.querySelector<HTMLElement>(".achievement-panel__gallery");
          const evidence = panel.querySelector<HTMLElement>(".achievement-panel__evidence");
          const scene = panel.querySelector<HTMLElement>(".achievement-panel__scene");
          if (heading) timeline.fromTo(heading, { xPercent: -36, yPercent: 18, z: 150, rotateY: -16 }, { xPercent: 14, yPercent: -8, z: -40, rotateY: 8, ease: "none", duration: 0.76 }, at);
          if (gallery) timeline.fromTo(gallery, { xPercent: 28, yPercent: 30, z: 240, rotateY: index % 2 ? -22 : 22, rotateZ: index % 2 ? -8 : 8, scale: 0.72 }, { xPercent: -12, yPercent: -16, z: -90, rotateY: index % 2 ? 10 : -10, rotateZ: index % 2 ? 3 : -3, scale: 1.1, ease: "none", duration: 0.8 }, at);
          if (evidence) timeline.fromTo(evidence, { yPercent: 30, z: 90 }, { yPercent: -9, z: -30, ease: "none", duration: 0.68 }, at + 0.03);
          if (scene) timeline.fromTo(scene, { xPercent: 18, yPercent: 8, scale: 1.34, rotate: -12 }, { xPercent: -18, yPercent: -8, scale: 0.78, rotate: 14, ease: "none", duration: 0.82 }, at);
        });

        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        travelToRef.current = (index, animate = true) => {
          const bounded = Math.max(0, Math.min(ACHIEVEMENTS.length - 1, index));
          const destination = trigger.start + (trigger.end - trigger.start) * (bounded / (ACHIEVEMENTS.length - 1));
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
      const index = focusedAchievementIndex();
      if (index >= 0) travelToRef.current(index, true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      media.revert();
    };
  }, []);

  const moveToAchievement = (index: number) => {
    const achievement = ACHIEVEMENTS[index];
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("focus", achievement.id);
    nextUrl.hash = `achievement-${achievement.id}`;
    history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    travelToRef.current(index, true);
  };

  return (
    <div className="achievement-field" ref={field} style={active.theme as CSSProperties}>
      <StoryMotion>
        <PageSignal room="03 / TROPHY VOLTAGE" title="THE MOMENT THE WORK LEFT THE SCREEN." note="A kinetic record of prototypes under public pressure. Each stop is a scene: a team, a room, a result, and the proof that remained." />
      </StoryMotion>

      <section className="achievement-journey" aria-label="Achievement memory reel" ref={journey}>
        <nav className="achievement-dial" aria-label="Achievement memories">
          <div className="achievement-dial__readout" aria-live="polite"><span>RECORDED MOMENT</span><strong>{String(ACHIEVEMENTS.findIndex((item) => item.id === activeId) + 1).padStart(2, "0")}</strong><i /><small>{active.dateLabel}</small></div>
          <div className="achievement-dial__track">
            {ACHIEVEMENTS.map((achievement, index) => (
              <button aria-current={achievement.id === activeId ? "step" : undefined} key={achievement.id} onClick={() => moveToAchievement(index)} type="button"><span>{String(index + 1).padStart(2, "0")}</span></button>
            ))}
          </div>
        </nav>

        <div className="achievement-reel" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="achievement-stage">
          {ACHIEVEMENTS.map((achievement, index) => (
            <article className="achievement-panel" data-active={achievement.id === activeId ? "true" : undefined} id={`achievement-${achievement.id}`} key={achievement.id} onFocusCapture={() => { if (index !== activeIndexRef.current) travelToRef.current(index, true); }} style={achievement.theme as CSSProperties}>
              <div className="achievement-panel__scene" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><i /><i /><i /></div>
              <header>
                <p><span>{String(index + 1).padStart(2, "0")}</span>{achievement.dateLabel}</p>
                <small>{achievement.kind === "honor" ? "RECORDED HONOR" : "ARCHIVE MOMENT"}</small>
                <h2 data-title-scale={editorialTitleScale(achievement.title)}>{achievement.title}</h2>
                <strong>{achievement.summary}</strong>
              </header>
              <div className="achievement-panel__gallery">
                {achievement.media.map((asset, mediaIndex) => (
                  <figure key={asset.src} style={{ "--media-index": mediaIndex } as CSSProperties}>
                    <img alt={asset.alt} height={asset.height} loading={index < 2 ? "eager" : "lazy"} src={asset.src} width={asset.width} />
                    <figcaption>{String(mediaIndex + 1).padStart(2, "0")} / {asset.alt}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="achievement-panel__evidence"><span>EVIDENCE LOG</span><ul>{achievement.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
