"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function editorialTitleScale(title: string) {
  return title.length > 45
    ? "technical"
    : title.length > 22
      ? "balanced"
      : "large";
}
export function StoryMotion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      epoch = 0;
    let cleanup: (() => void) | undefined;
    async function setup() {
      const version = ++epoch;
      cleanup?.();
      cleanup = undefined;
      if (
        disposed ||
        media.matches ||
        document.documentElement.dataset.motion === "quiet"
      )
        return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (
        disposed ||
        version !== epoch ||
        media.matches ||
        document.documentElement.dataset.motion === "quiet" ||
        !scope.current
      )
        return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 36 },
            {
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 94%", once: true },
            },
          );
        });
        gsap.utils
          .toArray<HTMLElement>("[data-ink-rule]")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { scaleX: 0.08 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: "top 95%",
                  end: "top 55%",
                  scrub: true,
                },
              },
            );
          });
        gsap.utils.toArray<HTMLElement>("[data-paper]").forEach((element) => {
          gsap.fromTo(
            element,
            { rotate: 2, y: 25 },
            {
              rotate: 0,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 95%",
                end: "top 36%",
                scrub: 0.35,
              },
            },
          );
        });
      }, scope);
      cleanup = () => context.revert();
    }
    void setup();
    media.addEventListener("change", setup);
    const preference = new MutationObserver(() => void setup());
    preference.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => {
      disposed = true;
      cleanup?.();
      media.removeEventListener("change", setup);
      preference.disconnect();
    };
  }, []);
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
export function PageSignal({
  room,
  title,
  note,
}: {
  room: string;
  title: string;
  note: string;
}) {
  return (
    <section className="page-heading">
      <p className="eyebrow">{room}</p>
      <h1>{title}</h1>
      <p className="page-lead">{note}</p>
      <div className="ink-rule" data-ink-rule />
    </section>
  );
}
