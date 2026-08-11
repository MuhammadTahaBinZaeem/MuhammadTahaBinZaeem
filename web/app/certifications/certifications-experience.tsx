"use client";

/* The rail deliberately uses native images: these previews are pre-compressed,
   dimensioned evidence documents and must never be cropped by an image loader. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CERTIFICATES } from "../portfolio-data";
import { PageSignal, StoryMotion, editorialTitleScale } from "../components/story-motion";

type Institution = "duke" | "stanford" | "google" | "coursera" | "lablab";

function institutionFor(issuer: string): Institution {
  if (issuer.includes("Duke")) return "duke";
  if (issuer.includes("Google")) return "google";
  if (issuer.includes("Coursera")) return "coursera";
  if (issuer.toLowerCase().includes("lablab")) return "lablab";
  return "stanford";
}

const INSTITUTION_COPY: Record<
  Institution,
  { code: string; title: string; place: string; banner: string; architecture: string }
> = {
  duke: {
    code: "DU",
    title: "The argument cloister",
    place: "Duke University",
    banner: "ERUDITIO ET RELIGIO · 1838",
    architecture: "Premise / inference / conclusion",
  },
  stanford: {
    code: "ST",
    title: "The cardinal laboratory",
    place: "Stanford research lineage",
    banner: "RESEARCH · STRATEGY · LEARNING",
    architecture: "Model / test / generalize",
  },
  google: {
    code: "GO",
    title: "The protected exchange",
    place: "Google security curriculum",
    banner: "IDENTIFY · PROTECT · CONNECT",
    architecture: "Asset / perimeter / response",
  },
  coursera: {
    code: "CO",
    title: "The publishing atelier",
    place: "Coursera Project Network",
    banner: "BUILD · REVIEW · RELEASE",
    architecture: "Structure / interface / publish",
  },
  lablab: {
    code: "AG",
    title: "The genesis foundry",
    place: "AI Genesis build chamber",
    banner: "VINCERO · PROTOTYPE · SHIP",
    architecture: "Debate / pressure / proof",
  },
};

function focusIndexFromLocation() {
  const queryId = new URLSearchParams(window.location.search).get("focus");
  const hashId = window.location.hash.replace(/^#certificate-/, "");
  const requestedId = queryId || hashId;
  return CERTIFICATES.findIndex((certificate) => certificate.id === requestedId);
}

export function CertificationsExperience() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const travelToRef = useRef<(index: number, animate?: boolean) => void>(() => undefined);
  const syncPanelInteractivityRef = useRef<(index: number) => void>(() => undefined);
  const [activeIndex, setActiveIndex] = useState(0);

  const setActive = (index: number) => {
    const bounded = Math.max(0, Math.min(CERTIFICATES.length - 1, index));
    if (bounded === activeIndexRef.current) return;
    activeIndexRef.current = bounded;
    syncPanelInteractivityRef.current(bounded);
    setActiveIndex(bounded);
  };

  useEffect(() => {
    const scope = scopeRef.current;
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!scope || !viewport || !rail) return;

    gsap.registerPlugin(ScrollTrigger);
    const panels = gsap.utils.toArray<HTMLElement>(".certificate-panel", rail);
    const requestedIndex = focusIndexFromLocation();
    let initialStateFrame = 0;
    if (requestedIndex >= 0) {
      activeIndexRef.current = requestedIndex;
      initialStateFrame = requestAnimationFrame(() => setActiveIndex(requestedIndex));
    }

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 761px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion) return;

        const synchronizeDesktopPanels = (currentIndex: number) => {
          panels.forEach((panel, panelIndex) => {
            const isCurrent = panelIndex === currentIndex;
            panel.toggleAttribute("inert", !isCurrent);
            if (isCurrent) panel.removeAttribute("aria-hidden");
            else panel.setAttribute("aria-hidden", "true");
          });

          /* A transformed rail must never acquire a second, invisible native scroll position. */
          viewport.scrollLeft = 0;
          rail.scrollLeft = 0;
        };
        syncPanelInteractivityRef.current = synchronizeDesktopPanels;
        synchronizeDesktopPanels(activeIndexRef.current);

        const travel = () => Math.max(1, rail.scrollWidth - viewport.clientWidth);
        const railTween = gsap.to(rail, {
          x: () => -travel(),
          ease: "none",
          overwrite: true,
          scrollTrigger: {
            trigger: viewport,
            start: "top top",
            end: () => `+=${travel()}`,
            pin: true,
            scrub: 0.82,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (progress) =>
                Math.round(progress * (CERTIFICATES.length - 1)) / (CERTIFICATES.length - 1),
              duration: { min: 0.16, max: 0.52 },
              delay: 0.06,
              ease: "power2.inOut",
            },
            onUpdate: (self) => setActive(Math.round(self.progress * (CERTIFICATES.length - 1))),
          },
        });

        const trigger = railTween.scrollTrigger;
        if (!trigger) return;

        travelToRef.current = (index, animate = true) => {
          const bounded = Math.max(0, Math.min(CERTIFICATES.length - 1, index));
          const destination = trigger.start +
            (trigger.end - trigger.start) * (bounded / (CERTIFICATES.length - 1));
          setActive(bounded);
          if (animate) {
            window.scrollTo({ top: destination, behavior: "smooth" });
          } else {
            trigger.scroll(destination);
            viewport.scrollLeft = 0;
            rail.scrollLeft = 0;
          }
        };

        panels.forEach((panel, index) => {
          const preview = panel.querySelector<HTMLElement>(".certificate-panel__preview");
          const dossier = panel.querySelector<HTMLElement>(".certificate-panel__dossier");
          const architecture = panel.querySelector<HTMLElement>(".certificate-scene__architecture");

          if (preview) {
            gsap.fromTo(
              preview,
              { xPercent: 15, rotateY: -9, scale: 0.9 },
              {
                xPercent: -12,
                rotateY: 6,
                scale: 1.03,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: railTween,
                  start: index === 0 ? "left left" : "left right",
                  end: index === panels.length - 1 ? "right right" : "right left",
                  scrub: true,
                },
              },
            );
          }

          if (dossier) {
            gsap.fromTo(
              dossier,
              { xPercent: -9, yPercent: 4 },
              {
                xPercent: 10,
                yPercent: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: railTween,
                  start: index === 0 ? "left left" : "left right",
                  end: index === panels.length - 1 ? "right right" : "right left",
                  scrub: true,
                },
              },
            );
          }

          if (architecture) {
            gsap.fromTo(
              architecture,
              { xPercent: 9 },
              {
                xPercent: -9,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: railTween,
                  start: index === 0 ? "left left" : "left right",
                  end: index === panels.length - 1 ? "right right" : "right left",
                  scrub: true,
                },
              },
            );
          }
        });

        ScrollTrigger.refresh();
        if (requestedIndex >= 0) {
          requestAnimationFrame(() => travelToRef.current(requestedIndex, false));
        }

        return () => {
          panels.forEach((panel) => {
            panel.removeAttribute("inert");
            panel.removeAttribute("aria-hidden");
          });
          viewport.scrollLeft = 0;
          rail.scrollLeft = 0;
          syncPanelInteractivityRef.current = () => undefined;
          travelToRef.current = () => undefined;
          railTween.kill();
          gsap.set(rail, { clearProps: "transform" });
        };
      },
    );

    media.add("(max-width: 760px), (prefers-reduced-motion: reduce)", () => {
      gsap.set(rail, { clearProps: "transform" });
      panels.forEach((panel) => {
        panel.removeAttribute("inert");
        panel.removeAttribute("aria-hidden");
      });
      viewport.scrollLeft = 0;
      rail.scrollLeft = 0;
      syncPanelInteractivityRef.current = () => undefined;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      travelToRef.current = (index, animate = true) => {
        panels[index]?.scrollIntoView({
          block: "start",
          behavior: animate && !reduced ? "smooth" : "auto",
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const mostVisible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!mostVisible) return;
          const index = panels.indexOf(mostVisible.target as HTMLElement);
          if (index >= 0) setActive(index);
        },
        { threshold: [0.3, 0.55, 0.8] },
      );
      panels.forEach((panel) => observer.observe(panel));

      if (requestedIndex >= 0) {
        requestAnimationFrame(() => requestAnimationFrame(() => travelToRef.current(requestedIndex, false)));
      }

      return () => observer.disconnect();
    });

    const onHashChange = () => {
      const index = focusIndexFromLocation();
      if (index >= 0) {
        travelToRef.current(index, true);
      }
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      if (initialStateFrame) cancelAnimationFrame(initialStateFrame);
      window.removeEventListener("hashchange", onHashChange);
      media.revert();
      panels.forEach((panel) => {
        panel.removeAttribute("inert");
        panel.removeAttribute("aria-hidden");
      });
      syncPanelInteractivityRef.current = () => undefined;
      travelToRef.current = () => undefined;
    };
  }, []);

  const moveToCertificate = (index: number) => {
    const certificate = CERTIFICATES[index];
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("focus", certificate.id);
    nextUrl.hash = `certificate-${certificate.id}`;
    history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    travelToRef.current(index, true);
  };

  const active = CERTIFICATES[activeIndex];
  const activeInstitution = institutionFor(active.issuer);

  return (
    <div
      className="certificate-field"
      data-institution={activeInstitution}
      ref={scopeRef}
      style={active.theme as CSSProperties}
    >
      <StoryMotion>
        <PageSignal
          room="02 / HALL OF INSTITUTIONS"
          title="PROOF DOES NOT HANG STILL. WALK THE RECORD."
          note="Fourteen credentials form one moving architecture. Scroll vertically; the archive travels laterally through every institution and every earned record."
        />
      </StoryMotion>

      <section className="certificate-journey" aria-label="Certificate archive">
        <div className="certificate-rail__viewport" ref={viewportRef}>
          <nav className="certificate-progress" aria-label="Certificate progress">
            <div className="certificate-progress__readout" aria-live="polite">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
              <span>{String(CERTIFICATES.length).padStart(2, "0")}</span>
              <strong>{active.issuer}</strong>
            </div>
            <div className="certificate-progress__track">
              {CERTIFICATES.map((certificate, index) => (
                <button
                  aria-label={`Open ${certificate.title}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                  key={certificate.id}
                  onClick={() => moveToCertificate(index)}
                  title={`${String(index + 1).padStart(2, "0")} · ${certificate.title}`}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="certificate-rail" ref={railRef}>
            {CERTIFICATES.map((certificate, index) => {
              const institution = institutionFor(certificate.issuer);
              const copy = INSTITUTION_COPY[institution];
              return (
                <article
                  className="certificate-panel"
                  data-institution={institution}
                  id={`certificate-${certificate.id}`}
                  key={certificate.id}
                  onFocusCapture={() => {
                    if (index === activeIndexRef.current) return;
                    setActive(index);
                    travelToRef.current(index, true);
                  }}
                  style={certificate.theme as CSSProperties}
                >
                  <div className="certificate-scene" aria-hidden="true">
                    <div className="certificate-scene__architecture">
                      {Array.from({ length: 9 }, (_, beam) => <i key={beam} />)}
                    </div>
                    <div className="certificate-scene__standard">
                      <span>{copy.code}</span>
                      <strong>{copy.banner}</strong>
                    </div>
                    <div className="certificate-scene__floor" />
                  </div>

                  <header className="certificate-panel__chapter">
                    <span>{String(index + 1).padStart(2, "0")} / {String(CERTIFICATES.length).padStart(2, "0")}</span>
                    <strong>{copy.title}</strong>
                    <small>{copy.place}</small>
                  </header>

                  <figure className="certificate-panel__preview">
                    <div className="certificate-panel__mat">
                      <img
                        alt={certificate.preview.alt}
                        height={certificate.preview.height}
                        loading={index < 2 ? "eager" : "lazy"}
                        src={certificate.preview.src}
                        width={certificate.preview.width}
                      />
                    </div>
                    <figcaption>
                      <span>ORIGINAL RECORD</span>
                      <strong>{certificate.issued}</strong>
                    </figcaption>
                  </figure>

                  <div className="certificate-panel__dossier">
                    <p className="certificate-panel__issuer">
                      <span>ISSUING BODY</span>
                      <strong>{certificate.issuer}</strong>
                    </p>
                    <h2 data-title-scale={editorialTitleScale(certificate.title)}>{certificate.title}</h2>
                    <blockquote>{certificate.scene}</blockquote>
                    <dl>
                      <div><dt>Issued</dt><dd>{certificate.issued}</dd></div>
                      <div><dt>Credential</dt><dd>{certificate.credentialId ?? "Archive certificate"}</dd></div>
                      <div><dt>Architecture</dt><dd>{copy.architecture}</dd></div>
                    </dl>
                    <div className="certificate-panel__actions">
                      {certificate.documentUrl && (
                        <a href={certificate.documentUrl} rel="noreferrer" target="_blank">OPEN FULL PDF ↗</a>
                      )}
                      {certificate.credentialUrl && (
                        <a href={certificate.credentialUrl} rel="noreferrer" target="_blank">VERIFY RECORD ↗</a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
