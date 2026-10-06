"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  attachReactiveMotion,
  chapterPose,
  collectHorizontalScenes,
  measureHorizontalScene,
  resetHorizontalScenes,
  REST_POSE,
} from "./motion-vocabulary";

export function editorialTitleScale(title: string) {
  return title.length > 45 ? "technical" : title.length > 22 ? "balanced" : "large";
}

export function StoryMotion({
  children,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (disabled) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    let disposed = false;
    let epoch = 0;
    let cleanup: (() => void) | undefined;
    let reflowAnchor: { node: HTMLElement; top: number } | undefined;
    async function setup() {
      const version = ++epoch;
      cleanup?.();
      cleanup = undefined;
      if (disposed || media.matches || document.documentElement.dataset.motion === "quiet") return;
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (disposed || version !== epoch || media.matches || document.documentElement.dataset.motion === "quiet" || !scope.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const node = scope.current;
        const scenes = collectHorizontalScenes(node);
        scenes.forEach((item) => measureHorizontalScene(item, "scroll"));
        const anchor = reflowAnchor;
        reflowAnchor = undefined;
        if (anchor?.node.isConnected && !document.documentElement.dataset.galleryOpen) {
          const item = scenes.find(({ travel, track }) => travel && track.contains(anchor.node));
          let top = anchor.node.getBoundingClientRect().top + scrollY - Math.max(28, Math.min(innerHeight - 110, anchor.top));
          if (item) {
            const card = anchor.node.closest<HTMLElement>(".work-card") || anchor.node;
            const bounds = card.getBoundingClientRect();
            const track = item.track.getBoundingClientRect();
            const center = bounds.left - track.left + bounds.width / 2;
            const leftward = Math.max(0, Math.min(1, (center - item.viewport.clientWidth / 2) / item.travel));
            const progress = item.scene.dataset.scrollDirection === "right" ? 1 - leftward : leftward;
            top = item.scene.getBoundingClientRect().top + scrollY - innerHeight * 0.1 + progress * item.distance;
          }
          window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
        }
        const stopReactive = attachReactiveMotion(node);
        const chapter = pathname.split("/")[1] || "foreword";
        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>("[data-reveal], [data-paper], [data-book-leaf]").forEach((element, index) => {
            if (element.closest('[data-scroll-scene][data-scene-ready="scroll"]')) return;
            if (anchor?.node && element.contains(anchor.node)) return;
            gsap.fromTo(element, chapterPose(element, index, chapter, innerWidth < 760), {
              ...REST_POSE,
              duration: 1.15,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 96%", once: true },
            });
          });
          gsap.utils.toArray<HTMLElement>("[data-ink-rule]").forEach((element) => {
            gsap.fromTo(element, { scaleX: 0.03, transformOrigin: "0% 50%" }, {
              scaleX: 1, ease: "none",
              scrollTrigger: { trigger: element, start: "top 96%", end: "top 50%", scrub: true },
            });
          });
          gsap.utils.toArray<HTMLElement>("[data-motion-parallax]").forEach((element) => {
            const amount = Number(element.dataset.motionParallax) || 54;
            gsap.fromTo(element, { y: amount * 0.5 }, {
              y: -amount * 0.5, ease: "none",
              scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
          gsap.utils.toArray<HTMLElement>("[data-title-travel]").forEach((element) => {
            gsap.fromTo(element, { xPercent: -12 }, {
              xPercent: 10, ease: "none",
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
          scenes.forEach((item) => {
            if (!item.travel) return;
            const rightward = item.scene.dataset.scrollDirection === "right";
            gsap.fromTo(item.track, { x: () => rightward ? -item.travel : 0 }, {
              x: () => rightward ? 0 : -item.travel, ease: "none",
              scrollTrigger: {
                trigger: item.scene, start: "top 10%", end: () => `+=${item.distance}`,
                scrub: true, invalidateOnRefresh: true,
              },
            });
          });
        }, node);
        let resizeFrame = 0;
        let focusFrame = 0;
        let pendingRefresh = false;
        const onFocus = (event: FocusEvent) => {
          const target = event.target as HTMLElement;
          const item = scenes.find(({ travel, track }) => travel && track.contains(target));
          if (!item) return;
          cancelAnimationFrame(focusFrame);
          focusFrame = requestAnimationFrame(() => {
            item.viewport.scrollLeft = 0;
            const bounds = target.getBoundingClientRect();
            const view = item.viewport.getBoundingClientRect();
            if (bounds.left >= view.left + 12 && bounds.right <= view.right - 12 && bounds.top >= 0 && bounds.bottom <= innerHeight) return;
            const track = item.track.getBoundingClientRect();
            const center = bounds.left - track.left + bounds.width / 2;
            const leftward = Math.max(0, Math.min(1, (center - item.viewport.clientWidth / 2) / item.travel));
            const progress = item.scene.dataset.scrollDirection === "right" ? 1 - leftward : leftward;
            window.scrollTo({ top: item.scene.getBoundingClientRect().top + scrollY - innerHeight * 0.1 + progress * item.distance, behavior: "instant" });
            ScrollTrigger.update();
          });
        };
        const refresh = () => {
          if (document.documentElement.dataset.galleryOpen) { pendingRefresh = true; return; }
          pendingRefresh = false;
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(() => {
            if (disposed || version !== epoch) return;
            if (document.documentElement.dataset.galleryOpen) { pendingRefresh = true; return; }
            scenes.forEach((item) => measureHorizontalScene(item, "scroll"));
            ScrollTrigger.refresh();
          });
        };
        const onGallery = (event: Event) => {
          if (!(event as CustomEvent<{ open: boolean }>).detail.open && pendingRefresh) refresh();
        };
        const beforeToggle = (event: Event) => {
          const summary = (event.target as Element).closest<HTMLElement>("summary");
          if (summary?.closest("[data-scroll-scene]"))
            reflowAnchor = { node: summary, top: summary.getBoundingClientRect().top };
        };
        const onToggle = (event: Event) => {
          const detail = event.target as HTMLElement;
          if (!detail.closest("[data-scroll-scene]")) return;
          const summary = detail.querySelector<HTMLElement>("summary");
          if (summary && reflowAnchor?.node !== summary)
            reflowAnchor = { node: summary, top: summary.getBoundingClientRect().top };
          void setup();
        };
        addEventListener("resize", refresh);
        addEventListener("notebook:gallery", onGallery);
        node.addEventListener("focusin", onFocus);
        node.addEventListener("click", beforeToggle, true);
        node.addEventListener("toggle", onToggle, true);
        const observer = new ResizeObserver(refresh);
        scenes.forEach(({ track }) => observer.observe(track));
        void document.fonts.ready.then(refresh);
        cleanup = () => {
          cancelAnimationFrame(resizeFrame);
          cancelAnimationFrame(focusFrame);
          removeEventListener("resize", refresh);
          removeEventListener("notebook:gallery", onGallery);
          node.removeEventListener("focusin", onFocus);
          node.removeEventListener("click", beforeToggle, true);
          node.removeEventListener("toggle", onToggle, true);
          observer.disconnect();
          stopReactive();
          context.revert();
          resetHorizontalScenes(scenes);
        };
      } catch {
        // The server-rendered reading edition remains visible if motion cannot load.
        cleanup?.();
      }
    }
    void setup();
    media.addEventListener("change", setup);
    desktop.addEventListener("change", setup);
    const preference = new MutationObserver(() => void setup());
    preference.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      disposed = true;
      ++epoch;
      cleanup?.();
      media.removeEventListener("change", setup);
      desktop.removeEventListener("change", setup);
      preference.disconnect();
    };
  }, [disabled, pathname]);
  return <div ref={scope} className={className}>{children}</div>;
}

export function PageSignal({ room, title, note }: { room: string; title: string; note: string }) {
  return (
    <section className="page-heading">
      <p className="eyebrow">{room}</p>
      <h1>{title}</h1>
      <p className="page-lead">{note}</p>
      <div className="ink-rule" data-ink-rule />
    </section>
  );
}
