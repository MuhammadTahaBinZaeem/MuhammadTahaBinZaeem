"use client";

/* Pre-compressed, dimensioned WebP evidence intentionally bypasses image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACHIEVEMENTS } from "../portfolio-data";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";

export function AchievementsExperience() {
  const [activeId, setActiveId] = useState<string>(ACHIEVEMENTS[0].id);
  const active = useMemo(
    () => ACHIEVEMENTS.find((achievement) => achievement.id === activeId) ?? ACHIEVEMENTS[0],
    [activeId],
  );
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get("focus");
    if (!focus || !ACHIEVEMENTS.some((achievement) => achievement.id === focus)) return;
    const timer = window.setTimeout(
      () => {
        setActiveId(focus);
        document.getElementById(`achievement-${focus}`)?.scrollIntoView({ block: "start" });
      },
      180,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const scope = field.current;
    if (!scope) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".achievement-moment").forEach((moment, index) => {
          const glow = moment.querySelector<HTMLElement>(".achievement-moment__glow");
          const gallery = moment.querySelector<HTMLElement>("[data-achievement-gallery]");
          const evidence = moment.querySelector<HTMLElement>(".achievement-evidence");
          const title = moment.querySelector<HTMLElement>("h2");

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: moment,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          });

          if (glow) timeline.fromTo(glow, { scale: 0.45, xPercent: 18, yPercent: 10, opacity: 0.18 }, { scale: 1.3, xPercent: -14, yPercent: -12, opacity: 0.92, ease: "none" }, 0);
          if (gallery) timeline.fromTo(gallery, { yPercent: 14, rotate: index % 2 ? -2.8 : 2.8 }, { yPercent: -10, rotate: index % 2 ? 1.8 : -1.8, ease: "none" }, 0);
          if (title) timeline.fromTo(title, { letterSpacing: "-0.015em" }, { letterSpacing: "-0.065em", ease: "none" }, 0);
          if (evidence) timeline.fromTo(evidence, { xPercent: -8, opacity: 0.38 }, { xPercent: 6, opacity: 1, ease: "none" }, 0);
        });
      }, scope);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const moments = field.current?.querySelectorAll<HTMLElement>("[data-achievement]");
    if (!moments?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (winner?.target as HTMLElement | undefined)?.dataset.achievementId;
        if (id) setActiveId(id);
      },
      { threshold: [0.38, 0.58, 0.72] },
    );
    moments.forEach((moment) => observer.observe(moment));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="achievement-field" ref={field} style={active.theme as CSSProperties}>
      <StoryMotion>
        <PageSignal
          room="03 / TROPHY VOLTAGE"
          title="THE MOMENT THE WORK LEFT THE SCREEN."
          note="An award only matters because something happened before it. Scroll through pressure, teams, prototypes, public judgment, and the evidence left behind."
        />

        <aside className="achievement-meter" aria-hidden="true">
          <span>ACTIVE MEMORY</span>
          <strong>{String(ACHIEVEMENTS.findIndex((item) => item.id === activeId) + 1).padStart(2, "0")}</strong>
          <i />
          <small>{active.title}</small>
        </aside>

        <div className="achievement-storyline">
          {ACHIEVEMENTS.map((achievement, index) => (
            <section
              className={`achievement-moment achievement-moment--${index % 3}`}
              data-achievement
              data-achievement-id={achievement.id}
              id={`achievement-${achievement.id}`}
              key={achievement.id}
              style={achievement.theme as CSSProperties}
            >
              <div className="achievement-moment__glow" aria-hidden="true" />
              <header data-reveal>
                <span>{String(index + 1).padStart(2, "0")} / {achievement.dateLabel}</span>
                <small>{achievement.kind === "honor" ? "RECORDED HONOR" : "ARCHIVE MOMENT"}</small>
                <h2 data-title-scale={editorialTitleScale(achievement.title)}>{achievement.title}</h2>
                <p>{achievement.summary}</p>
              </header>

              <div className="achievement-gallery" data-achievement-gallery>
                {achievement.media.map((asset, mediaIndex) => (
                  <figure key={asset.src} style={{ "--media-index": mediaIndex } as CSSProperties}>
                    <img
                      alt={asset.alt}
                      height={asset.height}
                      loading="lazy"
                      src={asset.src}
                      width={asset.width}
                    />
                    <figcaption>{String(mediaIndex + 1).padStart(2, "0")} · {asset.alt}</figcaption>
                  </figure>
                ))}
              </div>

              <div className="achievement-evidence" data-reveal>
                <span>EVIDENCE LOG</span>
                <ul>
                  {achievement.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </StoryMotion>
    </div>
  );
}
