"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import type { GalleryAsset } from "./gallery-image";
import "./image-gallery.css";

type Gallery = { title: string; items: GalleryAsset[]; opener: HTMLAnchorElement; token: string };
const HISTORY_KEY = "notebookGallery";

export function ImageGallery() {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState<{ width: number; height: number } | null>(null);
  const [direction, setDirection] = useState<"previous" | "next">("next");
  const dialog = useRef<HTMLDialogElement>(null);
  const imageArea = useRef<HTMLDivElement>(null);
  const close = useRef(() => {});
  const touch = useRef<{ x: number; y: number } | null>(null);
  const zoomed = useRef(false);
  useEffect(() => { zoomed.current = !!zoom; }, [zoom]);

  useEffect(() => {
    const open = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const opener = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-gallery]") : null;
      if (!opener || opener.closest("[inert]")) return;
      try {
        const data = JSON.parse(opener.dataset.gallery!) as Pick<Gallery, "title" | "items">;
        if (!Array.isArray(data.items) || !data.items.length || !data.items.every((item) => item.src && item.alt && item.width > 0 && item.height > 0)) return;
        event.preventDefault();
        event.stopPropagation();
        setIndex(Math.max(0, data.items.findIndex((item) => item.src === opener.dataset.gallerySrc)));
        setFailed(false);
        setZoom(null);
        setGallery({ ...data, opener, token: crypto.randomUUID() });
      } catch { /* A normal image link remains a working fallback. */ }
    };
    document.addEventListener("click", open, true);
    return () => document.removeEventListener("click", open, true);
  }, []);

  useEffect(() => {
    if (!gallery) return;
    const element = dialog.current!;
    const root = document.documentElement;
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    // Stop wheel inertia before recording the position; do not reset the book.
    root.dataset.galleryOpen = "true";
    dispatchEvent(new CustomEvent("notebook:gallery", { detail: { open: true } }));
    const position = { x: scrollX, y: scrollY };
    const originalOverflow = root.style.overflow;
    const pageUrl = location.href;
    root.style.overflow = "hidden";
    // Match Vinext's existing scroll-state contract. Its earlier window-level
    // popstate listener can start a restore before our modal listener runs.
    // Give that restore the precise reading position instead of its hash fallback.
    history.replaceState({ ...history.state, __vinext_scrollX: position.x, __vinext_scrollY: position.y }, "", pageUrl);
    history.pushState({ ...history.state, [HISTORY_KEY]: gallery.token }, "", location.href);
    element.showModal();
    element.querySelector<HTMLButtonElement>(".gallery-close")?.focus({ preventScroll: true });
    let closing = false;
    close.current = () => {
      if (closing) return;
      closing = true;
      if (history.state?.[HISTORY_KEY] === gallery.token) history.back();
      else setGallery(null);
    };
    const pop = (event: PopStateEvent) => {
      if (history.state?.[HISTORY_KEY] !== gallery.token) {
        // This same-URL history entry belongs to the modal, not the router.
        // A route handler would otherwise re-run hash navigation on close.
        if (location.href === pageUrl) event.stopImmediatePropagation();
        setGallery(null);
      }
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // Preserve browser pinch-to-zoom.
      // The modal owns scroll gestures. A zoomed photograph and thumbnails
      // retain their native scrolling; the page behind them stays still.
      if ((event.target as Element).closest(".gallery-thumbnails, .gallery-caption") || zoomed.current) return;
      event.preventDefault();
    };
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const controls = Array.from(element.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
          .filter((control) => control.getBoundingClientRect().width > 0);
        const first = controls[0], last = controls.at(-1);
        // Native dialog makes the page inert; explicitly wrap the endpoints
        // as well so keyboard navigation doesn't drop into browser chrome.
        if (first && last && ((event.shiftKey && document.activeElement === first)
          || (!event.shiftKey && document.activeElement === last))) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus({ preventScroll: true });
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close.current();
        return;
      }
      if (gallery.items.length > 1 && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        setFailed(false);
        setZoom(null);
        setDirection(event.key === "ArrowLeft" || event.key === "Home" ? "previous" : "next");
        setIndex((current) => event.key === "Home" ? 0 : event.key === "End" ? gallery.items.length - 1
          : (current + (event.key === "ArrowRight" ? 1 : -1) + gallery.items.length) % gallery.items.length);
      }
    };
    addEventListener("popstate", pop, true);
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("keydown", keys);
    return () => {
      removeEventListener("popstate", pop, true);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("keydown", keys);
      element.close();
      root.style.overflow = originalOverflow;
      if (location.href === pageUrl) scrollTo({ left: position.x, top: position.y, behavior: "instant" });
      // Focus with scroll prevention while the book is still paused.
      if (gallery.opener.isConnected) gallery.opener.focus({ preventScroll: true });
      delete root.dataset.galleryOpen;
      dispatchEvent(new CustomEvent("notebook:gallery", { detail: { open: false } }));
      // The browser finishes history traversal *after* popstate. Keep manual
      // restoration through that frame so a reader-edition hash cannot snap
      // back to its section heading after we restored the reading position.
      requestAnimationFrame(() => {
        if (!root.dataset.galleryOpen) {
          if (location.href === pageUrl) scrollTo({ left: position.x, top: position.y, behavior: "instant" });
          history.scrollRestoration = previousRestoration;
        }
      });
      close.current = () => {};
    };
  }, [gallery]);

  useEffect(() => {
    if (!gallery) return;
    dialog.current?.querySelector<HTMLButtonElement>('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    // Only warm the adjacent image, not every gallery across the whole site.
    if (gallery.items.length > 1) {
      const next = new Image();
      next.src = gallery.items[(index + 1) % gallery.items.length].src;
    }
  }, [gallery, index]);

  const item = gallery?.items[index];
  const select = (next: number, movement: "previous" | "next" = next < index ? "previous" : "next") => {
    setFailed(false);
    setZoom(null);
    setDirection(movement);
    setIndex(next);
  };
  const toggleZoom = () => {
    if (zoom) { setZoom(null); return; }
    if (!item || !imageArea.current) return;
    const area = imageArea.current;
    const fit = Math.min(area.clientWidth / item.width, area.clientHeight / item.height);
    setZoom({ width: Math.round(item.width * fit * 2), height: Math.round(item.height * fit * 2) });
  };
  return (
    <dialog ref={dialog} className="image-gallery" aria-labelledby="gallery-title" aria-describedby="gallery-help"
      onCancel={(event) => { event.preventDefault(); close.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close.current(); }}>
      {gallery && item && <div className="gallery-surface">
        <header className="gallery-header">
          <div className="gallery-heading"><p className="eyebrow">The evidence / image archive</p><h2 id="gallery-title">{gallery.title}</h2></div>
          <div className="gallery-header-actions">
            <span className="gallery-header-count" aria-hidden="true">{String(index + 1).padStart(2, "0")} <i>/</i> {String(gallery.items.length).padStart(2, "0")}</span>
            <button type="button" className="gallery-close" onClick={() => close.current()} aria-label="Close gallery">Close <span aria-hidden="true">×</span></button>
          </div>
        </header>
        <div className="gallery-stage" onTouchStart={(event) => {
          touch.current = !zoomed.current && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
        }} onTouchMove={(event) => {
          if (event.touches.length !== 1) touch.current = null;
        }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={(event) => {
          if (!touch.current) return;
          const dx = event.changedTouches[0].clientX - touch.current.x;
          const dy = event.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (gallery.items.length > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) select((index + (dx < 0 ? 1 : -1) + gallery.items.length) % gallery.items.length, dx < 0 ? "next" : "previous");
          else if (dy > 120 && dy > Math.abs(dx) * 1.4) close.current();
        }}>
          {gallery.items.length > 1 && <button type="button" className="gallery-arrow gallery-previous" aria-label="Previous image" onClick={() => select((index - 1 + gallery.items.length) % gallery.items.length, "previous")}>←</button>}
          <div ref={imageArea} className="gallery-image-area" data-zoomed={zoom ? "true" : undefined} data-direction={direction}>
            {failed ? <p className="gallery-error">This image could not load. <a href={item.src} target="_blank" rel="noreferrer">Try the original ↗</a></p>
              : <img key={item.src} className="gallery-full-image" src={item.src} alt={item.alt} width={item.width} height={item.height}
                style={zoom ? { width: zoom.width, height: zoom.height } : undefined}
                decoding="async" onError={() => setFailed(true)} onDoubleClick={toggleZoom} />}
          </div>
          {gallery.items.length > 1 && <button type="button" className="gallery-arrow gallery-next" aria-label="Next image" onClick={() => select((index + 1) % gallery.items.length)}>→</button>}
        </div>
        <div className="gallery-caption"><p aria-live="polite" aria-atomic="true"><span className="gallery-count">{index + 1} / {gallery.items.length}</span>{item.caption || item.alt}</p>
          <div className="gallery-image-actions">
            {!failed && <button type="button" className="gallery-zoom" aria-pressed={!!zoom} onClick={toggleZoom}>{zoom ? "Fit image −" : "Zoom image +"}</button>}
            <a href={item.src} target="_blank" rel="noreferrer">Full resolution ↗</a>
          </div>
        </div>
        {gallery.items.length > 1 && <nav className="gallery-thumbnails" aria-label="Gallery images">
          {gallery.items.map((image, i) => <button type="button" key={image.src} aria-label={`Image ${i + 1}: ${image.alt}`} aria-current={i === index ? "true" : undefined} onClick={() => select(i)}>
            <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" /><span>{String(i + 1).padStart(2, "0")}</span>
          </button>)}
        </nav>}
        <p id="gallery-help" className="gallery-help"><span>← → to explore · Esc to close · Double-click to zoom</span><span>Swipe to explore · Swipe down to return</span></p>
      </div>}
    </dialog>
  );
}
