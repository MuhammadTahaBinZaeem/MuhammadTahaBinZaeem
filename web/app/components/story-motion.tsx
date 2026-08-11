"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function editorialTitleScale(title: string) {
  const length = title.replace(/[^A-Z0-9]/gi, "").length;
  const longestWord = Math.max(
    0,
    ...title
      .split(/[^A-Z0-9]+/gi)
      .filter(Boolean)
      .map((word) => word.length),
  );

  if (longestWord >= 13) return "technical";
  if (longestWord >= 9 && length <= 18) return "balanced";
  if (length <= 12) return "monumental";
  if (length <= 18) return "large";
  if (length <= 26) return "balanced";
  return "technical";
}

export function StoryMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-intro]",
        { opacity: 0, yPercent: 18, rotateX: -8 },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.08,
          delay: 0.18,
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 84, clipPath: "inset(18% 0 0 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { yPercent: index % 2 ? -4 : 4 },
          {
            yPercent: index % 2 ? 5 : -5,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
    }, scope);

    return () => context.revert();
  }, []);

  return (
    <div className={className} ref={scope}>
      {children}
    </div>
  );
}

export function PageSignal({ room, title, note }: { room: string; title: string; note: string }) {
  return (
    <section className="page-signal" data-room={room.split("/")[0]}>
      <div className="page-signal__index" data-intro>
        <span>{room}</span>
        <i />
        <span>ROOM ONLINE</span>
      </div>
      <h1 data-intro data-title-scale={editorialTitleScale(title)}>{title}</h1>
      <p data-intro>{note}</p>
      <div className="page-signal__instruction" data-intro>
        <span>SCROLL TO MOVE</span>
        <i aria-hidden="true" />
      </div>
    </section>
  );
}
