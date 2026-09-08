"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

export function ScrollNotebook() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const caption = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = section.current,
      target = canvas.current;
    if (!element || !target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false,
      wanted = 0,
      request = 0,
      inflight = 0,
      started = false,
      epoch = 0;
    let release: (() => void) | undefined;
    const cache = new Map<number, HTMLImageElement>();
    const pending = new Map<number, Promise<HTMLImageElement>>();
    const context = target.getContext("2d");
    const labels = [
      "01 / Fetch an idea",
      "02 / Decode the question",
      "03 / Build the system",
      "04 / Test the evidence",
    ];
    function load(index: number) {
      const existing = cache.get(index);
      if (existing) return Promise.resolve(existing);
      const loading = pending.get(index);
      if (loading) return loading;
      inflight++;
      const image = new Image();
      image.src = `/art/notebook/processor-${String(index).padStart(2, "0")}.png`;
      const promise = image
        .decode()
        .then(() => {
          if (!disposed) {
            cache.set(index, image);
            while (cache.size > 8) cache.delete(cache.keys().next().value!);
          }
          return image;
        })
        .finally(() => {
          inflight--;
          pending.delete(index);
        });
      pending.set(index, promise);
      return promise;
    }
    function show(index: number) {
      if (
        disposed ||
        !context ||
        reduced.matches ||
        document.documentElement.dataset.motion === "quiet"
      )
        return;
      wanted = index;
      if (caption.current)
        caption.current.textContent =
          labels[Math.min(3, Math.floor(index / 10))];
      const draw = (image: HTMLImageElement) => {
        if (
          disposed ||
          index !== wanted ||
          reduced.matches ||
          document.documentElement.dataset.motion === "quiet"
        )
          return;
        context!.clearRect(0, 0, 960, 760);
        context!.drawImage(image, 0, 0, 960, 760);
        target!.style.opacity = "1";
        target!.dataset.frame = String(index);
      };
      const present = cache.get(index);
      if (present) draw(present);
      else if (inflight < 3)
        void load(index)
          .then((image) => {
            draw(image);
            if (wanted !== index) show(wanted);
          })
          .catch(() => {
            target!.style.opacity = "0";
          });
    }
    async function start() {
      if (
        started ||
        disposed ||
        reduced.matches ||
        document.documentElement.dataset.motion === "quiet"
      )
        return;
      started = true;
      const version = ++epoch;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (
        disposed ||
        version !== epoch ||
        reduced.matches ||
        document.documentElement.dataset.motion === "quiet"
      )
        return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          wanted = Math.round(self.progress * 39);
          cancelAnimationFrame(request);
          request = requestAnimationFrame(() => show(wanted));
        },
      });
      show(Math.round(trigger.progress * 39));
      release = () => trigger.kill();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void start();
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    const onPreference = () => {
      const quiet =
        reduced.matches || document.documentElement.dataset.motion === "quiet";
      if (quiet) {
        epoch++;
        cancelAnimationFrame(request);
        release?.();
        release = undefined;
        started = false;
        target.style.opacity = "0";
        cache.clear();
      } else void start();
    };
    reduced.addEventListener("change", onPreference);
    const preference = new MutationObserver(onPreference);
    preference.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => {
      disposed = true;
      observer.disconnect();
      preference.disconnect();
      reduced.removeEventListener("change", onPreference);
      release?.();
      cancelAnimationFrame(request);
      cache.clear();
      pending.clear();
    };
  }, []);
  return (
    <section
      className="sequence-chapter"
      ref={section}
      aria-labelledby="sequence-title"
    >
      <div className="sequence-sticky">
        <div className="sequence-copy">
          <p className="eyebrow">A way of thinking / scroll to assemble</p>
          <h2 id="sequence-title">
            Ideas are the start.
            <br />
            <em>Evidence is the work.</em>
          </h2>
          <p>
            From a 20-bit instruction to an accessible learning platform: ask a
            precise question, build something testable, and follow what the
            results actually say.
          </p>
          <span className="sequence-caption" ref={caption}>
            01 / Fetch an idea
          </span>
        </div>
        <figure className="sequence-art">
          <img
            src="/art/notebook/processor-39.png"
            width={960}
            height={760}
            alt="An exploded pen drawing of a processor with four vector lanes, assembling as you scroll"
            loading="lazy"
          />
          <canvas ref={canvas} width={960} height={760} aria-hidden="true" />
        </figure>
      </div>
    </section>
  );
}
