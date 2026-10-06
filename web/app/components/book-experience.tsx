"use client";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { BOOK_WORLDS } from "../book-data";
import { HOME_COVER } from "../homepage-data";
import {
  attachReactiveMotion,
  chapterPose,
  collectHorizontalScenes,
  measureHorizontalScene,
  resetHorizontalScenes,
  REST_POSE,
} from "./motion-vocabulary";

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
const hashId = () => {
  try { return decodeURIComponent(location.hash.slice(1)); }
  catch { return location.hash.slice(1); }
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
      saved = localStorage.getItem("mtbz:book-reader") === "true" || localStorage.getItem("mtbz:quiet-motion") === "true";
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
      if (id === "chapters") id = "atlas";
      const target = document.getElementById(id === "cover" ? "book-cover" : id);
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
      const destination = hashId();
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
        const [{ default: gsap }, { ScrollTrigger }] =
          await Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
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
        let pendingMeasure = false;
        let reflowAnchor: { node: HTMLElement; top: number } | undefined;
        let origin = 0;
        element.dataset.smoothing = "native";
        // The browser owns wheel, trackpad, touch and keyboard input. GSAP only
        // paints the paper at the browser's current vertical scroll position.
        const moveTo = (top: number, immediate = false) => {
          window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
        };
        const scenes = bodies.map(collectHorizontalScenes);
        const stopReactive = attachReactiveMotion(element);
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
          resetHorizontalScenes(scenes.flat());
          gsap.set(scenes.flatMap((items) => items.flatMap(({ viewport, track }) => [viewport, track])), { clearProps: "transform" });
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
          if (document.documentElement.dataset.galleryOpen) { pendingMeasure = true; return; }
          pendingMeasure = false;
          scenes.flat().forEach((item) => measureHorizontalScene(item, "book"));
          const signature = [
            innerHeight,
            innerWidth,
            ...bodies.map((body) => body.offsetHeight),
          ].join(":");
          if (signature === sizeSignature) { reflowAnchor = undefined; return; }
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
              if (node.hasAttribute("data-book-drift") || node.closest("[data-scroll-scene]")) return;
              const top = node.getBoundingClientRect().top - base;
              const at = Math.max(0, top - vh * 0.94);
              const duration = Math.max(1, Math.min(vh * 0.74, read - at));
              const pose = chapterPose(node, i, BOOK_WORLDS[index].id, innerWidth < 760);
              timeline.fromTo(
                node,
                pose,
                { ...REST_POSE, duration, ease: "power3.out", immediateRender: false },
                Math.min(read - 1, at),
              );
            });
            // Within the book, a counter-translation holds the rail in place
            // while vertical scroll moves its contents horizontally. The outer
            // document still scrolls normally in every direction and device.
            scenes[index].forEach((item) => {
              if (!item.travel) return;
              const pinTop = Math.max(40, (vh - item.viewport.offsetHeight) / 2 - 40);
              const at = Math.max(0, item.viewport.getBoundingClientRect().top - base - pinTop);
              const rightward = item.scene.dataset.scrollDirection === "right";
              timeline.fromTo(item.viewport, { y: 0 }, {
                y: item.distance, duration: item.distance, ease: "none", immediateRender: false,
              }, at);
              timeline.fromTo(item.track, { x: rightward ? -item.travel : 0 }, {
                x: rightward ? 0 : -item.travel, duration: item.distance, ease: "none", immediateRender: true,
              }, at);
            });
            body.querySelectorAll<HTMLElement>("[data-motion-parallax]").forEach((node) => {
              const top = node.getBoundingClientRect().top - base;
              const at = Math.max(0, top - vh);
              const amount = Number(node.dataset.motionParallax) || 54;
              timeline.fromTo(node, { y: amount * 0.5 }, {
                y: -amount * 0.5,
                duration: Math.min(vh + node.offsetHeight, Math.max(1, read - at)),
                ease: "none", immediateRender: false,
              }, Math.min(read - 1, at));
            });
            body.querySelectorAll<HTMLElement>("[data-title-travel]").forEach((node) => {
              const top = node.getBoundingClientRect().top - base;
              timeline.fromTo(node, { xPercent: -12 }, {
                xPercent: 10, duration: Math.min(read, vh * 1.5), ease: "none", immediateRender: false,
              }, Math.max(0, top - vh));
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
          } else if (reflowAnchor?.node.isConnected) {
            const anchor = reflowAnchor;
            const panel = anchor.node.closest<HTMLElement>(".book-world");
            const index = panel ? panels.indexOf(panel) : -1;
            if (index >= 0) {
              const top = anchor.node.getBoundingClientRect().top - bodies[index].getBoundingClientRect().top;
              const screenTop = Math.max(28, Math.min(vh - 110, anchor.top));
              const cinematic = scenes[index].some((item) => item.travel && item.track.contains(anchor.node));
              const local = Math.max(0, Math.min(segments[index].read, cinematic ? targetPosition(anchor.node, index) : top - screenTop));
              moveTo(startTop() + segments[index].start + local, true);
            }
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
          reflowAnchor = undefined;
          paint(Math.max(0, scrollY - startTop()));
        }
        function paint(position: number) {
          if (disposed || printing || document.documentElement.dataset.galleryOpen || !segments.length) return;
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
            offset = targetPosition(target, index);
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
        const initialHash = hashId();
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
          resized();
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
          // Cancel a browser-animated chapter jump when a visitor takes over.
          // Ordinary wheel/touch/key scrolling never passes through this API.
        };
        function targetPosition(target: HTMLElement, index: number) {
          const rail = scenes[index].find((item) => item.travel && item.track.contains(target));
          if (rail) {
            const bounds = target.getBoundingClientRect();
            const trackBounds = rail.track.getBoundingClientRect();
            const center = bounds.left - trackBounds.left + bounds.width / 2;
            const leftward = clamp((center - rail.viewport.clientWidth / 2) / rail.travel);
            const progress = rail.scene.dataset.scrollDirection === "right" ? 1 - leftward : leftward;
            const pinTop = Math.max(40, (vh - rail.viewport.offsetHeight) / 2 - 40);
            const naturalTop = rail.scene.getBoundingClientRect().top - bodies[index].getBoundingClientRect().top + rail.viewport.offsetTop;
            return Math.max(0, naturalTop - pinTop) + progress * rail.distance;
          }
          return Math.max(0, target.getBoundingClientRect().top - bodies[index].getBoundingClientRect().top - 70);
        }
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
          if (document.documentElement.dataset.galleryOpen) return;
          const target = e.target as HTMLElement;
          const panel = target.closest<HTMLElement>(".book-world");
          if (!panel || jump) return;
          const index = panels.indexOf(panel);
          const rail = scenes[index].find((item) => item.travel && item.track.contains(target));
          if (rail) {
            const targetBounds = target.getBoundingClientRect();
            const viewportBounds = rail.viewport.getBoundingClientRect();
            if (targetBounds.left >= viewportBounds.left + 12 && targetBounds.right <= viewportBounds.right - 12 && targetBounds.top >= 28 && targetBounds.bottom <= vh - 90) return;
            moveTo(startTop() + segments[index].start + targetPosition(target, index), true);
            paint(Math.max(0, scrollY - startTop()));
            return;
          }
          const bounds = target.getBoundingClientRect();
          if (bounds.top >= 28 && bounds.bottom <= vh - 90) return;
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
        const onHistory = () => {
          if (!document.documentElement.dataset.galleryOpen)
            go(hashId() || "cover", false);
        };
        const onGallery = (event: Event) => {
          if ((event as CustomEvent<{ open: boolean }>).detail.open) {
            resumeNativeInput();
            moveTo(scrollY, true);
          } else {
            if (pendingMeasure) measure();
            moveTo(scrollY, true);
            paint(Math.max(0, scrollY - startTop()));
          }
        };
        addEventListener("notebook:gallery", onGallery);
        addEventListener("resize", resized);
        addEventListener("wheel", stopJump, { passive: true, capture: true });
        addEventListener("touchstart", resumeNativeInput, { passive: true });
        addEventListener("keydown", onKey);
        addEventListener("popstate", onHistory);
        addEventListener("beforeprint", preparePrint);
        addEventListener("afterprint", finishPrint);
        element.addEventListener("focusin", onFocus);
        element.addEventListener("click", beforeToggle, true);
        element.addEventListener("toggle", onToggle, true);
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
          stopReactive();
          trigger.current?.kill();
          motions.forEach((m) => m.revert());
          resetHorizontalScenes(scenes.flat());
          observer.disconnect();
          removeEventListener("resize", resized);
          removeEventListener("wheel", stopJump, { capture: true });
          removeEventListener("touchstart", resumeNativeInput);
          removeEventListener("keydown", onKey);
          removeEventListener("popstate", onHistory);
          removeEventListener("notebook:gallery", onGallery);
          removeEventListener("beforeprint", preparePrint);
          removeEventListener("afterprint", finishPrint);
          element.removeEventListener("focusin", onFocus);
          element.removeEventListener("click", beforeToggle, true);
          element.removeEventListener("toggle", onToggle, true);
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
          <div className="closed-book" ref={cover} data-reactive>
            <div className="book-page-stack" aria-hidden="true" />
            <div className="cover-spine" aria-hidden="true">
              {HOME_COVER.spine}
            </div>
            <div className="cover-face">
              <div className="cover-orbit" aria-hidden="true">
                <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g className="cover-orbit-rings" stroke="currentColor">
                    <circle cx="300" cy="300" r="264" strokeOpacity=".22" />
                    <circle cx="300" cy="300" r="216" strokeOpacity=".4" strokeDasharray="2 13" />
                    <circle cx="300" cy="300" r="170" strokeOpacity=".22" />
                    <ellipse cx="300" cy="300" rx="260" ry="94" transform="rotate(-32 300 300)" strokeOpacity=".6" />
                    <ellipse cx="300" cy="300" rx="260" ry="94" transform="rotate(42 300 300)" strokeOpacity=".4" />
                    <path d="M300 16v50m0 468v50M16 300h50m468 0h50" strokeOpacity=".6" />
                    <path d="M98 98l28 28m348 348 28 28M98 502l28-28m348-348 28-28" strokeOpacity=".22" />
                  </g>
                  <g className="cover-orbit-core" stroke="currentColor" strokeWidth="1.5">
                    <rect x="228" y="228" width="144" height="144" rx="20" strokeOpacity=".6" />
                    <rect x="243" y="243" width="114" height="114" rx="12" strokeOpacity=".22" />
                    <path d="M266 208v20m22-20v20m24-20v20m22-20v20M266 372v20m22-20v20m24-20v20m22-20v20M208 266h20m-20 22h20m-20 24h20m-20 22h20M372 266h20m-20 22h20m-20 24h20m-20 22h20" strokeOpacity=".6" />
                    <path d="M264 316v-35l18 22 18-22v35m10-34h27m-13 0v34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <g className="cover-orbit-nodes" fill="currentColor">
                    <circle cx="113" cy="116" r="5" />
                    <circle cx="530" cy="235" r="6" />
                    <circle cx="390" cy="548" r="4" />
                    <circle cx="66" cy="420" r="3" />
                  </g>
                </svg>
              </div>
              <span className="cover-edition">
                {HOME_COVER.edition}
              </span>
              <span className="cover-subtitle">{HOME_COVER.subtitle}</span>
              <h1 id="book-title">
                {HOME_COVER.title}
                <em>{HOME_COVER.titleAccent}</em>
              </h1>
              <p className="cover-author">
                {HOME_COVER.authorLines.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}
              </p>
              <p className="cover-foot">
                {HOME_COVER.foot}
              </p>
              <button
                className="cover-open-hit"
                onClick={() => api.current.go("foreword")}
                disabled={!ready}
                aria-label="Open Muhammad Taha Bin Zaeem’s field book"
              />
              <div className="cover-invitation">
                <span className="cover-status" role="status">
                  {ready ? HOME_COVER.invitation : "Binding the pages…"}
                </span>
                <p>{HOME_COVER.instructions}</p>
                <button onClick={changeReader}>
                  {reader
                    ? HOME_COVER.animatedLabel
                    : HOME_COVER.quietLabel}
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
