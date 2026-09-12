"use client";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { BOOK_WORLDS } from "../book-data";
import "lenis/dist/lenis.css";

type Segment = { start: number; read: number; turn: number; height: number };
type Jump = {
  from: number;
  to: number;
  index: number;
  local: number;
  fromIndex: number;
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const paperEase = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function BookExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const coverScene = useRef<HTMLDivElement>(null);
  const rift = useRef<HTMLDivElement>(null);
  const api = useRef<{ go: (id: string, history?: boolean) => void }>({
    go: () => {},
  });
  const [ready, setReady] = useState(false);
  const [reader, setReader] = useState(false);
  const [active, setActive] = useState(-1);
  const [indexOpen, setIndexOpen] = useState(false);
  const indexToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!indexOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIndexOpen(false);
        indexToggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".book-chapter-menu, .book-dock"))
        setIndexOpen(false);
    };
    addEventListener("keydown", close);
    addEventListener("pointerdown", outside);
    return () => {
      removeEventListener("keydown", close);
      removeEventListener("pointerdown", outside);
    };
  }, [indexOpen]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let saved = false;
    try {
      saved = localStorage.getItem("mtbz:book-reader") === "true";
    } catch {}
    if (saved || media.matches) requestAnimationFrame(() => setReader(true));
    const change = () => setReader(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const element: HTMLElement = node;
    let disposed = false,
      frame = 0,
      resizeFrame = 0;
    let cleanup = () => {};
    let restoreImages = () => {};
    const panels = Array.from(
      element.querySelectorAll<HTMLElement>(".book-world"),
    );
    const bodies = panels.map((p) =>
      p.querySelector<HTMLElement>(".book-content")!,
    );
    const normalGo = (id: string) => {
      const target = document.getElementById(
        id === "cover" ? "book-cover" : id,
      );
      if (!target) return;
      history.replaceState(
        history.state,
        "",
        id === "cover" ? location.pathname : "#" + id,
      );
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    api.current = { go: normalGo };
    if (reader) {
      const destination = decodeURIComponent(location.hash.slice(1));
      element.dataset.mode = "reader";
      element.style.height = "";
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((e) => e.isIntersecting);
          if (entry) {
            const index = panels.indexOf(entry.target as HTMLElement);
            setActive(index);
            element.dataset.chapter = BOOK_WORLDS[index].id;
          }
        },
        { rootMargin: "-5% 0px -80% 0px" },
      );
      panels.forEach((p) => observer.observe(p));
      frame = requestAnimationFrame(() => {
        setReady(true);
        if (destination) normalGo(destination);
      });
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }
    async function setup() {
      try {
        const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] =
          await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
            import("lenis"),
          ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        element.dataset.mode = "book";
        const coverNode = cover.current!,
          sceneNode = coverScene.current!,
          riftNode = rift.current!;
        let vh = innerHeight,
          coverDistance = 0,
          total = 0,
          segments: Segment[] = [],
          lastActive = -2,
          jump: Jump | undefined;
        let sizeSignature = "",
          layoutRevision = 0;
        let origin = 0,
          smoothFrame = 0,
          smoothTime = 0;
        const smoother = new Lenis({
          autoRaf: false,
          autoResize: false,
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.14,
          wheelMultiplier: 0.85,
          prevent: (node) => !!node.closest("[data-lenis-prevent]"),
        });
        // Run only during wheel inertia or an intentional chapter jump.
        // Touch, keyboard, scrollbar dragging and reduced motion stay native.
        const advanceScroll = (time: number) => {
          smoothFrame = 0;
          smoother.raf(time);
          smoothTime = time;
          if (!disposed && smoother.isScrolling === "smooth")
            smoothFrame = requestAnimationFrame(advanceScroll);
          else element.dataset.smoothing = "idle";
        };
        const wakeScroll = () => {
          if (!smoothFrame && !disposed) {
            // An idle gap must not be counted as the first animation delta.
            if (performance.now() - smoothTime > 80)
              smoother.raf(performance.now());
            element.dataset.smoothing = "active";
            smoothFrame = requestAnimationFrame(advanceScroll);
          }
        };
        smoother.on("virtual-scroll", wakeScroll);
        smoother.on("scroll", ScrollTrigger.update);
        const moveTo = (top: number, immediate = false) => {
          if (!immediate) wakeScroll();
          smoother.scrollTo(top, {
            immediate,
            lerp: immediate ? 1 : undefined,
            duration: immediate
              ? 0
              : Math.min(1.35, 0.65 + Math.abs(top - scrollY) / 12000),
            easing: paperEase,
          });
        };
        let motions: ReturnType<typeof gsap.timeline>[] = [];
        const trigger: {
          current: ReturnType<typeof ScrollTrigger.create> | undefined;
        } = { current: undefined };
        const setBodies = bodies.map((body) =>
          gsap.quickSetter(body, "y", "px"),
        );
        const setRotation = panels.map((panel) =>
          gsap.quickSetter(panel, "rotationY", "deg"),
        );
        const setCover = gsap.quickSetter(coverNode, "rotationY", "deg");
        const shades = panels.map((p) =>
          p.querySelector<HTMLElement>(".page-turn-shade")!,
        );
        const left = rift.current!.querySelector<HTMLElement>(".rift-left")!;
        const right = rift.current!.querySelector<HTMLElement>(".rift-right")!;
        const dock = element.querySelector<HTMLElement>(".book-dock")!;
        const riftLabel = riftNode.querySelector<HTMLElement>(".rift-label")!;
        let riftKey = "";
        const riftAt = (
          progress: number,
          from: number,
          to: number,
          isJump: boolean,
        ) => {
          const visible = progress > 0.001 && progress < 0.999;
          riftNode.style.visibility = visible ? "visible" : "hidden";
          if (!visible) return;
          const key = `${from}:${to}:${isJump}`;
          if (riftKey !== key) {
            const paper = BOOK_WORLDS[Math.max(0, from)];
            riftNode.style.setProperty("--rift-paper", paper.paper);
            riftNode.style.setProperty("--rift-ink", paper.ink);
            riftNode.style.setProperty("--rift-accent", paper.accent);
            riftLabel.textContent = BOOK_WORLDS[to].title;
            riftNode.dataset.kind = isJump ? "jump" : "turn";
            riftKey = key;
          }
          const tear = paperEase(progress);
          // A scroll turn introduces its seam gently; reverse scroll seals it.
          riftNode.style.opacity = String(
            isJump ? 1 : Math.min(1, progress / 0.16),
          );
          left.style.transform = `translate3d(${-tear * 112}%,0,0) rotate(${-tear * 5}deg)`;
          right.style.transform = `translate3d(${tear * 112}%,0,0) rotate(${tear * 5}deg)`;
        };
        const visiblePanels = new Set<number>();
        panels.forEach((panel) => {
          panel.inert = true;
          panel.setAttribute("aria-hidden", "true");
        });
        const imageLists = panels.map((panel) =>
          Array.from(panel.querySelectorAll<HTMLImageElement>("img")),
        );
        const parkedImages = imageLists.flat().map((img) => ({
          img,
          src: img.getAttribute("src"),
          ratio: img.style.aspectRatio,
        }));
        const sources = new Map(
          parkedImages.map((item) => [item.img, item.src]),
        );
        let printing = false;
        let printPosition = 0;
        // Absolute book layers all sit at viewport zero. Native lazy loading
        // therefore fetches hidden chapters too. Park their sources only after
        // hydration; the server-rendered/no-JS document retains every real URL.
        for (const { img } of parkedImages) {
          if (img.getAttribute("width") && img.getAttribute("height"))
            img.style.aspectRatio = `${img.getAttribute("width")} / ${img.getAttribute("height")}`;
          img.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
        restoreImages = () => {
          for (const { img, src, ratio } of parkedImages) {
            if (src) img.setAttribute("src", src);
            img.style.aspectRatio = ratio;
          }
        };
        const preparePrint = () => {
          if (printing) return;
          resumeNativeInput();
          printPosition = scrollY;
          printing = true;
          restoreImages();
          // Print is an explicit request for the complete archive, including
          // images in chapters that the visitor has not opened yet.
          parkedImages.forEach(({ img }) => { img.loading = "eager"; });
        };
        const finishPrint = () => {
          if (!printing) return;
          printing = false;
          frame = requestAnimationFrame(() => {
            if (disposed) return;
            measure();
            moveTo(printPosition, true);
            paint(Math.max(0, scrollY - startTop()));
          });
        };
        const warmed = new Set<number>();
        const activated = new Set<number>();
        const warmChapter = (index: number, active = false) => {
          if (
            !panels[index] ||
            (active ? activated.has(index) : warmed.has(index))
          )
            return;
          warmed.add(index);
          if (active) activated.add(index);
          const images = active
            ? imageLists[index]
            : imageLists[index].slice(0, 3);
          images.forEach((img, i) => {
            const src = sources.get(img);
            if (src && img.getAttribute("src") !== src)
              img.setAttribute("src", src);
            if (i < 3) {
              img.loading = "eager";
              void img.decode().catch(() => {});
            }
          });
        };
        const startTop = () => origin;
        function measure() {
          if (disposed || printing) return;
          const signature = [
            innerHeight,
            innerWidth,
            ...bodies.map((body) => body.offsetHeight),
          ].join(":");
          if (signature === sizeSignature) return;
          sizeSignature = signature;
          origin = element.getBoundingClientRect().top + scrollY;
          // Content reflow can interrupt native smooth scrolling. Finish at the
          // intended leaf instead of leaving the tear overlay waiting forever.
          const pendingJump = jump;
          jump = undefined;
          riftNode.style.visibility = "hidden";
          const position = Math.max(0, scrollY - startTop());
          let previousIndex = -1;
          segments.forEach((s, i) => {
            if (position >= s.start) previousIndex = i;
          });
          const previous = segments[previousIndex];
          const previousLocal = previous ? position - previous.start : 0;
          vh = innerHeight;
          coverDistance = Math.round(vh * 1.2);
          motions.forEach((m) => m.revert());
          motions = [];
          // Measure untransformed paper, including when the viewport changes mid-turn.
          gsap.set(panels, { rotationY: 0 });
          gsap.set(bodies, { y: 0 });
          let cursor = coverDistance;
          segments = bodies.map((body, index) => {
            const height = body.offsetHeight;
            const read = Math.ceil(Math.max(vh * 0.5, height - vh + 60));
            const turn = index < panels.length - 1 ? Math.round(vh * 1.15) : 0;
            const segment = { start: cursor, read, turn, height };
            cursor += read + turn;
            const timeline = gsap.timeline({ paused: true });
            timeline.to({}, { duration: read });
            const base = body.getBoundingClientRect().top;
            const targets = Array.from(
              body.querySelectorAll<HTMLElement>(
                "[data-reveal], [data-paper], [data-book-leaf], [data-book-drift]",
              ),
            );
            targets.forEach((node, i) => {
              const top = node.getBoundingClientRect().top - base;
              const at = Math.max(0, top - vh * 0.86);
              const duration = Math.max(1, Math.min(vh * 0.68, read - at));
              const leaf = node.hasAttribute("data-book-leaf");
              const paper = node.hasAttribute("data-paper");
              if (node.hasAttribute("data-book-drift")) return;
              // Each world has its own scroll vocabulary, rather than one reveal preset.
              const world = BOOK_WORLDS[index].id;
              const direction = i % 2 ? -1 : 1;
              let x = 0,
                y = 38,
                rotation = paper ? 3 : 0,
                rotationY = 0,
                scale = 1;
              if (leaf) {
                x = direction * 65;
                y = 80;
                rotation = direction * 4;
                scale = 0.94;
              } else if (world === "projects") {
                x = direction * (paper ? 95 : 38);
                y = 55;
                rotation = paper ? direction * 6 : 0;
              } else if (world === "research") {
                x = direction * 55;
                y = 20;
                scale = paper ? 0.91 : 1;
              } else if (world === "experience") {
                x = -55;
                y = 45;
                rotation = paper ? -4 : 0;
              } else if (world === "education") {
                x = 45;
                y = 70;
                rotation = -2;
              } else if (world === "certifications" && paper) {
                x = direction * 35;
                y = 90;
                rotation = direction * 5;
                rotationY = direction * 18;
              } else if (world === "achievements") {
                x = direction * 45;
                y = 75;
                rotation = paper ? direction * 8 : 0;
                scale = paper ? 0.89 : 1;
              } else if (world === "connect") {
                y = 65;
                rotation = paper ? -3 : 0;
              }
              timeline.fromTo(
                node,
                { y, x, rotation, rotationY, scale },
                {
                  y: 0,
                  x: 0,
                  rotation: 0,
                  rotationY: 0,
                  scale: 1,
                  duration,
                  ease: "power2.out",
                  immediateRender: false,
                },
                Math.min(read - 1, at),
              );
            });
            body
              .querySelectorAll<HTMLElement>("[data-ink-rule]")
              .forEach((node) => {
                const at = Math.max(
                  0,
                  node.getBoundingClientRect().top - base - vh * 0.9,
                );
                timeline.fromTo(
                  node,
                  { scaleX: 0.03 },
                  {
                    scaleX: 1,
                    duration: Math.min(vh * 0.45, read),
                    ease: "none",
                    immediateRender: false,
                  },
                  Math.min(read * 0.7, at),
                );
              });
            // An introductory plate has a separate, slow diagonal drift.
            body
              .querySelectorAll<HTMLElement>("[data-book-drift]")
              .forEach((node) =>
                timeline.to(
                  node,
                  {
                    y: -70,
                    rotation: -3,
                    duration: Math.min(read, vh),
                    ease: "none",
                  },
                  0,
                ),
              );
            motions.push(timeline);
            return segment;
          });
          total = cursor;
          element.style.height = total + vh + "px";
          smoother.resize();
          panels.forEach((panel, i) => {
            panel.dataset.scrollStart = String(segments[i].start);
            panel.dataset.readDistance = String(segments[i].read);
            panel.dataset.turnDistance = String(segments[i].turn);
          });
          element.dataset.coverDistance = String(coverDistance);
          element.dataset.layoutRevision = String(++layoutRevision);
          trigger.current?.refresh();
          if (pendingJump) {
            const destination = segments[pendingJump.index];
            moveTo(
              startTop() +
                destination.start +
                Math.min(pendingJump.local, destination.read),
              true,
            );
          } else if (previous) {
            const next = segments[previousIndex];
            const local =
              previousLocal > previous.read
                ? next.read +
                  clamp(
                    (previousLocal - previous.read) / (previous.turn || 1),
                  ) *
                    next.turn
                : Math.min(previousLocal, next.read);
            moveTo(startTop() + next.start + local, true);
          }
          paint(Math.max(0, scrollY - startTop()));
        }
        function paint(position: number) {
          if (disposed || printing || !segments.length) return;
          const opening = clamp(position / coverDistance);
          const showCover = opening < 1;
          if (sceneNode.inert === showCover) {
            sceneNode.style.visibility = showCover ? "visible" : "hidden";
            sceneNode.style.pointerEvents = showCover ? "auto" : "none";
            sceneNode.inert = !showCover;
          }
          if (showCover) {
            sceneNode.style.opacity = String(
              1 - clamp((opening - 0.76) / 0.24),
            );
            sceneNode.style.backgroundColor = `rgba(36,60,50,${1 - opening})`;
            setCover(-paperEase(opening) * 108);
          }
          let index = 0;
          for (let i = 0; i < segments.length; i++)
            if (position >= segments[i].start) index = i;
          let local = Math.max(0, position - segments[index].start);
          if (jump) {
            const progress = clamp(
              (scrollY - jump.from) / (jump.to - jump.from || 1),
            );
            index = jump.index;
            local = jump.local;
            riftAt(progress, jump.fromIndex, jump.index, true);
            if (Math.abs(scrollY - jump.to) < 3) {
              jump = undefined;
              rift.current!.style.visibility = "hidden";
            }
          }
          const segment = segments[index];
          const turning = segment.turn
            ? clamp((local - segment.read) / segment.turn)
            : 0;
          const current =
            opening < 0.85
              ? -1
              : turning > 0.65
                ? Math.min(index + 1, panels.length - 1)
                : index;
          warmChapter(index, true);
          if (local > segment.read - vh * 0.6) warmChapter(index + 1);
          if (!jump)
            riftAt(
              turning,
              index,
              Math.min(index + 1, panels.length - 1),
              false,
            );
          const nextVisible = [index, ...(turning > 0 ? [index + 1] : [])];
          // Only touch layer visibility when the active spread actually changes.
          for (const i of visiblePanels) {
            if (nextVisible.includes(i)) continue;
            panels[i].style.visibility = "hidden";
            panels[i].style.willChange = "auto";
            bodies[i].style.willChange = "auto";
            panels[i].inert = true;
            panels[i].setAttribute("aria-hidden", "true");
            visiblePanels.delete(i);
          }
          nextVisible.forEach((i) => {
            const panel = panels[i];
            if (!panel) return;
            if (!visiblePanels.has(i)) {
              panel.style.visibility = "visible";
              panel.style.zIndex = String(panels.length - i);
              panel.style.willChange = "transform";
              // The inner paper does the continuous reading movement; promote
              // only visible sheets instead of repainting their entire contents.
              bodies[i].style.willChange = "transform";
              visiblePanels.add(i);
            }
            // Do not tab into a fading/outgoing page during a paper turn.
            const inactive = i !== current || !!jump || turning > 0;
            if (panel.inert !== inactive) panel.inert = inactive;
            if (panel.getAttribute("aria-hidden") !== String(inactive))
              panel.setAttribute("aria-hidden", String(inactive));
            const y = i === index ? -Math.min(local, segment.read) : 0;
            setBodies[i](y);
            setRotation[i](i === index ? -paperEase(turning) * 108 : 0);
            // The incoming page is revealed through the opening seam, rather
            // than tearing away to expose the outgoing chapter a second time.
            panel.style.opacity = String(
              i === index ? 1 - paperEase((turning - 0.05) / 0.23) : 1,
            );
            shades[i].style.opacity = String(
              i === index
                ? Math.sin(turning * Math.PI) * 0.26
                : (1 - turning) * 0.12,
            );
            motions[i].time(i === index ? Math.min(local, segment.read) : 0);
          });
          const world = BOOK_WORLDS[Math.max(0, current)];
          // Keep the changing custom property off the ancestor of the entire
          // archive: only the four controls need this style invalidation.
          dock.style.setProperty(
            "--book-reading",
            String(clamp(local / segment.read)),
          );
          element.dataset.turn = turning.toFixed(3);
          if (current !== lastActive) {
            element.style.setProperty("--book-surround", world.paper);
            element.dataset.chapter = current < 0 ? "cover" : world.id;
            lastActive = current;
            setActive(current);
            if (!jump) {
              const hash = current < 0 ? "" : "#" + world.id;
              history.replaceState(
                history.state,
                "",
                location.pathname + location.search + hash,
              );
            }
          }
        }
        function go(id: string, addHistory = true) {
          if (id === "chapters") id = "atlas";
          if (id === "cover") {
            jump = undefined;
            moveTo(startTop(), !addHistory);
            return;
          }
          let index = BOOK_WORLDS.findIndex((w) => w.id === id);
          let offset = 0;
          if (index < 0) {
            const target = document.getElementById(id);
            const panel = target?.closest<HTMLElement>(".book-world");
            if (!panel || !target) return;
            index = panels.indexOf(panel);
            offset = Math.max(
              0,
              target.getBoundingClientRect().top -
                bodies[index].getBoundingClientRect().top -
                70,
            );
          }
          const local = Math.min(segments[index].read, offset);
          const to = startTop() + segments[index].start + local;
          const from = scrollY;
          if (addHistory) history.pushState(null, "", "#" + id);
          if (Math.abs(to - from) > vh * 1.5) {
            jump = {
              from,
              to,
              index,
              local,
              fromIndex: Math.max(0, lastActive),
            };
          }
          moveTo(to, !addHistory);
          paint(Math.max(0, scrollY - startTop()));
        }
        const initialHash = decodeURIComponent(location.hash.slice(1));
        measure();
        trigger.current = ScrollTrigger.create({
          trigger: element,
          start: "top top",
          end: () => "+=" + total,
          onUpdate: (self) => paint(Math.round(self.progress * total)),
        });
        const resized = () => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(measure);
        };
        const observer = new ResizeObserver(resized);
        bodies.forEach((b) => observer.observe(b));
        const stopJump = () => {
          if (jump) {
            jump = undefined;
            rift.current!.style.visibility = "hidden";
            moveTo(scrollY, true);
            paint(Math.max(0, scrollY - startTop()));
          }
        };
        const resumeNativeInput = () => {
          stopJump();
          // Keyboard/touch must take control immediately, not compete with
          // the tail of a wheel gesture that is still interpolating.
          if (smoother.isScrolling === "smooth") moveTo(scrollY, true);
        };
        const onKey = (e: KeyboardEvent) => {
          if (
            [
              "Escape",
              "ArrowUp",
              "ArrowDown",
              "PageUp",
              "PageDown",
              "Home",
              "End",
              " ",
            ].includes(e.key)
          )
            resumeNativeInput();
        };
        const onFocus = (e: FocusEvent) => {
          const target = e.target as HTMLElement;
          const panel = target.closest<HTMLElement>(".book-world");
          if (!panel || jump) return;
          const bounds = target.getBoundingClientRect();
          if (bounds.top >= 28 && bounds.bottom <= vh - 90) return;
          const index = panels.indexOf(panel);
          const offset = Math.max(
            0,
            bounds.top - bodies[index].getBoundingClientRect().top - 100,
          );
          moveTo(
            startTop() +
              segments[index].start +
              Math.min(segments[index].read, offset),
            true,
          );
          paint(Math.max(0, scrollY - startTop()));
        };
        const onHistory = () =>
          go(decodeURIComponent(location.hash.slice(1)) || "cover", false);
        addEventListener("resize", resized);
        addEventListener("wheel", stopJump, { passive: true, capture: true });
        addEventListener("touchstart", resumeNativeInput, { passive: true });
        addEventListener("keydown", onKey);
        addEventListener("popstate", onHistory);
        addEventListener("beforeprint", preparePrint);
        addEventListener("afterprint", finishPrint);
        element.addEventListener("focusin", onFocus);
        api.current = { go };
        setReady(true);
        if (initialHash)
          requestAnimationFrame(() => {
            if (!disposed) go(initialHash, false);
          });
        void document.fonts.ready.then(() => {
          if (!disposed) resized();
        });
        cleanup = () => {
          cancelAnimationFrame(smoothFrame);
          smoother.destroy();
          trigger.current?.kill();
          motions.forEach((m) => m.revert());
          observer.disconnect();
          removeEventListener("resize", resized);
          removeEventListener("wheel", stopJump, { capture: true });
          removeEventListener("touchstart", resumeNativeInput);
          removeEventListener("keydown", onKey);
          removeEventListener("popstate", onHistory);
          removeEventListener("beforeprint", preparePrint);
          removeEventListener("afterprint", finishPrint);
          element.removeEventListener("focusin", onFocus);
          gsap.set([...panels, ...bodies, coverNode], {
            clearProps:
              "transform,translate,scale,visibility,opacity,willChange",
          });
          panels.forEach((p) => {
            p.inert = false;
            p.removeAttribute("aria-hidden");
          });
          element.style.height = "";
          sceneNode.removeAttribute("style");
          sceneNode.inert = false;
          riftNode.style.visibility = "hidden";
        };
      } catch {
        if (!disposed) {
          restoreImages();
          setReader(true);
          setReady(true);
        }
      }
    }
    void setup();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      cleanup();
      restoreImages();
    };
  }, [reader]);

  function intercept(event: MouseEvent<HTMLElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "a[href]",
    );
    if (!link || link.target === "_blank" || link.hasAttribute("download"))
      return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    let id = url.hash.slice(1) || url.pathname.slice(1) || "cover";
    if (!document.getElementById(id) && id !== "cover" && id !== "chapters")
      return;
    event.preventDefault();
    event.stopPropagation();
    setIndexOpen(false);
    id = decodeURIComponent(id);
    api.current.go(id);
  }
  function changeReader() {
    setIndexOpen(false);
    const next = !reader;
    if (active >= 0)
      history.replaceState(history.state, "", "#" + BOOK_WORLDS[active].id);
    setReader(next);
    try {
      localStorage.setItem("mtbz:book-reader", String(next));
    } catch {}
  }
  return (
    <main
      className="living-book"
      ref={root}
      id="main-content"
      onClickCapture={intercept}
    >
      <a className="skip-link" href="#foreword">
        Skip to the foreword
      </a>
      <div className="book-stage">
        <div className="book-cover-scene" id="book-cover" ref={coverScene}>
          <div className="closed-book" ref={cover}>
            <div className="book-page-stack" aria-hidden="true" />
            <div className="cover-spine" aria-hidden="true">
              MUHAMMAD TAHA BIN ZAEEM · FIELD NOTES
            </div>
            <div className="cover-face">
              <span className="cover-edition">
                A LIVING PORTFOLIO / VOL. 01
              </span>
              <span className="cover-subtitle">The engineering</span>
              <h1 id="book-title">
                FIELD
                <em>BOOK.</em>
              </h1>
              <p className="cover-author">
                MUHAMMAD TAHA
                <br />
                BIN ZAEEM
              </p>
              <p className="cover-foot">
                Hardware · Software · Human curiosity
              </p>
              <button
                className="cover-open-hit"
                onClick={() => api.current.go("foreword")}
                disabled={!ready}
                aria-label="Open Muhammad Taha Bin Zaeem’s field book"
              />
              <div className="cover-invitation">
                <span className="cover-status" role="status">
                  {ready ? "Open the field book ↗" : "Binding the pages…"}
                </span>
                <p>Scroll to read. Reverse to return.</p>
                <button onClick={changeReader}>
                  {reader
                    ? "Enter the animated book"
                    : "Read without animation"}
                </button>
              </div>
              <noscript>
                <style>
                  {".cover-invitation,.cover-open-hit{display:none!important}"}
                </style>
                <div className="cover-static-invitation">
                  <a href="#foreword">Open the story ↓</a>
                </div>
              </noscript>
            </div>
          </div>
        </div>
        <div className="book-paper-edge" aria-hidden="true" />
        {children}
        <div className="book-gutter" aria-hidden="true" />
        <div className="book-rift" ref={rift} aria-hidden="true">
          <div className="rift-half rift-left">
            <span className="rift-label">A new thread.</span>
          </div>
          <div className="rift-half rift-right">
            <span>the story continues ↗</span>
          </div>
        </div>
      </div>
      <nav
        className="book-chapter-menu"
        id="book-chapters"
        aria-label="Book chapters"
        inert={!indexOpen}
        data-open={indexOpen}
        data-lenis-prevent
      >
        {BOOK_WORLDS.map((world, i) => (
          <a
            href={"#" + world.id}
            key={world.id}
            aria-label={world.label}
            aria-current={active === i ? "location" : undefined}
          >
            <span>{world.number}</span>
            <em>{world.label}</em>
          </a>
        ))}
      </nav>
      <div className="book-dock" role="group" aria-label="Book controls">
        <a href="#cover" aria-label="Close the book">
          ↖ <span>Cover</span>
        </a>
        <button
          className="book-location"
          ref={indexToggle}
          onClick={() => setIndexOpen(!indexOpen)}
          aria-expanded={indexOpen}
          aria-controls="book-chapters"
          aria-label="Choose a chapter"
        >
          {active < 0
            ? "Contents"
            : BOOK_WORLDS[active].number + " / " + BOOK_WORLDS[active].label}
          <span aria-hidden="true"> {indexOpen ? "−" : "+"}</span>
        </button>
        <button onClick={changeReader} aria-pressed={reader}>
          {reader ? "Book mode" : "Reader mode"}
        </button>
      </div>
      <noscript>
        <p className="book-no-js">
          Every chapter is available below without JavaScript. The animated
          edition is optional.
        </p>
      </noscript>
    </main>
  );
}
