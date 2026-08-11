"use client";

/* Pre-compressed, dimensioned WebP evidence intentionally bypasses image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EDUCATION } from "../portfolio-data";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";

export function EducationExperience() {
  const [activeId, setActiveId] = useState<string>(EDUCATION[0].id);
  const active = useMemo(
    () => EDUCATION.find((entry) => entry.id === activeId) ?? EDUCATION[0],
    [activeId],
  );
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get("focus");
    if (!focus || !EDUCATION.some((entry) => entry.id === focus)) return;
    const timer = window.setTimeout(
      () => {
        setActiveId(focus);
        document.getElementById(`education-${focus}`)?.scrollIntoView({ block: "start" });
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
        const line = scope.querySelector<HTMLElement>(".education-line");
        if (line) {
          gsap.fromTo(
            line,
            { yPercent: 34, opacity: 0.34 },
            {
              yPercent: -34,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: ".education-stations", start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>(".education-station").forEach((station, index) => {
          const architecture = station.querySelector<HTMLElement>(".education-station__architecture");
          const stationMedia = station.querySelector<HTMLElement>("[data-education-media]");
          const story = station.querySelector<HTMLElement>(".education-station__story");
          const heading = station.querySelector<HTMLElement>("header");

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: station,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.88,
            },
          });

          if (architecture) timeline.fromTo(architecture, { xPercent: 14 }, { xPercent: -12, ease: "none" }, 0);
          if (stationMedia) timeline.fromTo(stationMedia, { yPercent: 12, rotate: index % 2 ? -2.4 : 3.2 }, { yPercent: -9, rotate: index % 2 ? 1.4 : -1.1, ease: "none" }, 0);
          if (heading) timeline.fromTo(heading, { yPercent: 8 }, { yPercent: -5, ease: "none" }, 0);
          if (story) timeline.fromTo(story, { xPercent: -7, opacity: 0.45 }, { xPercent: 5, opacity: 1, ease: "none" }, 0);
        });
      }, scope);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const stations = field.current?.querySelectorAll<HTMLElement>("[data-education]");
    if (!stations?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (winner?.target as HTMLElement | undefined)?.dataset.educationId;
        if (id) setActiveId(id);
      },
      { threshold: [0.35, 0.56, 0.72] },
    );
    stations.forEach((station) => observer.observe(station));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="education-field" ref={field} style={active.theme as CSSProperties}>
      <StoryMotion>
        <PageSignal
          room="04 / THE FOUNDRY"
          title="FORMATION IS A CIRCUIT, NOT A LADDER."
          note="Three stations feed the same line. Each one changes the material: first graphite, then crimson public life, then NUST circuitry."
        />

        <nav className="education-map" aria-label="Education stations">
          <span>FORMATION LINE</span>
          {EDUCATION.map((entry, index) => (
            <a
              aria-current={activeId === entry.id ? "location" : undefined}
              href={`#education-${entry.id}`}
              key={entry.id}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <strong>{entry.institution.split(" (")[0]}</strong>
              <small>{entry.period}</small>
            </a>
          ))}
        </nav>

        <div className="education-line" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="education-stations">
          {EDUCATION.map((entry, index) => (
            <section
              className={`education-station education-station--${entry.id}`}
              data-education
              data-education-id={entry.id}
              id={`education-${entry.id}`}
              key={entry.id}
              style={entry.theme as CSSProperties}
            >
              <div className="education-station__architecture" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {Array.from({ length: 6 }, (_, line) => <i key={line} />)}
              </div>

              <header data-reveal>
                <p>
                  <span>STATION {String(index + 1).padStart(2, "0")}</span>
                  <span>{entry.period}</span>
                </p>
                <h2 data-title-scale={editorialTitleScale(entry.institution)}>{entry.institution}</h2>
                <strong>{entry.qualification}</strong>
                {entry.grade && <em>GRADE / {entry.grade}</em>}
              </header>

              {entry.media.length > 0 ? (
                <figure className="education-station__media" data-education-media>
                  {entry.media.map((asset) => (
                    <img
                      alt={asset.alt}
                      height={asset.height}
                      key={asset.src}
                      loading="lazy"
                      src={asset.src}
                      width={asset.width}
                    />
                  ))}
                  <figcaption>ARCHIVE EVIDENCE / {entry.institution}</figcaption>
                </figure>
              ) : (
                <div className="education-station__origin" data-education-media aria-label="A graph-paper origin field">
                  <span>CS</span>
                  <code>01010011 01010100 01000001 01010010 01010100</code>
                  <p>Every system begins as a mark on paper and a reason to ask what happens next.</p>
                </div>
              )}

              <div className="education-station__story" data-reveal>
                <span>WHAT CHANGED HERE</span>
                <p>{entry.story}</p>
                <ul>
                  {entry.activities.map((activity) => <li key={activity}>{activity}</li>)}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </StoryMotion>
    </div>
  );
}
