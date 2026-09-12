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
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef(() => {});
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const open = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const opener = (event.target as Element).closest<HTMLAnchorElement>("a[data-gallery]");
      if (!opener || opener.closest("[inert]")) return;
      try {
        const data = JSON.parse(opener.dataset.gallery!) as Pick<Gallery, "title" | "items">;
        if (!data.items.length) return;
        event.preventDefault();
        event.stopPropagation();
        setIndex(Math.max(0, data.items.findIndex((item) => item.src === opener.dataset.gallerySrc)));
        setFailed(false);
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
    const openedAt = performance.now();
    let upward = 0, lastWheel = 0, closing = false;
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
      // Let the thumbnail strip / long caption scroll independently.
      if ((event.target as Element).closest(".gallery-thumbnails, .gallery-caption")) return;
      event.preventDefault();
      const now = performance.now();
      if (now - openedAt < 500) return; // Ignore the gesture that opened it.
      if (now - lastWheel > 240 || event.deltaY >= 0) upward = 0;
      lastWheel = now;
      upward += Math.max(0, -event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (upward >= 110 && Math.abs(event.deltaY) > Math.abs(event.deltaX)) close.current();
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
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        setFailed(false);
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
      scrollTo({ left: position.x, top: position.y, behavior: "instant" });
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
  const select = (next: number) => { setFailed(false); setIndex(next); };
  return (
    <dialog ref={dialog} className="image-gallery" aria-labelledby="gallery-title" aria-describedby="gallery-help"
      data-lenis-prevent onCancel={(event) => { event.preventDefault(); close.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close.current(); }}>
      {gallery && item && <div className="gallery-surface">
        <header className="gallery-header">
          <div><p className="eyebrow">From the notebook / image archive</p><h2 id="gallery-title">{gallery.title}</h2></div>
          <button type="button" className="gallery-close" onClick={() => close.current()} aria-label="Close gallery">Close <span aria-hidden="true">×</span></button>
        </header>
        <div className="gallery-stage" onTouchStart={(event) => {
          touch.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
        }} onTouchEnd={(event) => {
          if (!touch.current) return;
          const dx = event.changedTouches[0].clientX - touch.current.x;
          const dy = event.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) select((index + (dx < 0 ? 1 : -1) + gallery.items.length) % gallery.items.length);
          else if (dy > 120 && dy > Math.abs(dx) * 1.4) close.current();
        }}>
          {gallery.items.length > 1 && <button type="button" className="gallery-arrow gallery-previous" aria-label="Previous image" onClick={() => select((index - 1 + gallery.items.length) % gallery.items.length)}>←</button>}
          <div className="gallery-image-area">
            {failed ? <p className="gallery-error">This image could not load. <a href={item.src} target="_blank" rel="noreferrer">Try the original ↗</a></p>
              : <img key={item.src} className="gallery-full-image" src={item.src} alt={item.alt} width={item.width} height={item.height} decoding="async" onError={() => setFailed(true)} />}
          </div>
          {gallery.items.length > 1 && <button type="button" className="gallery-arrow gallery-next" aria-label="Next image" onClick={() => select((index + 1) % gallery.items.length)}>→</button>}
        </div>
        <div className="gallery-caption"><p aria-live="polite" aria-atomic="true"><span className="gallery-count">{index + 1} / {gallery.items.length}</span>{item.caption || item.alt}</p><a href={item.src} target="_blank" rel="noreferrer">Open full resolution ↗</a></div>
        {gallery.items.length > 1 && <nav className="gallery-thumbnails" aria-label="Gallery images">
          {gallery.items.map((image, i) => <button type="button" key={image.src} aria-label={`Image ${i + 1}: ${image.alt}`} aria-current={i === index ? "true" : undefined} onClick={() => select(i)}>
            <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" /><span>{String(i + 1).padStart(2, "0")}</span>
          </button>)}
        </nav>}
        <p id="gallery-help" className="gallery-help">← → to explore · Esc or Close to return · Scroll up / swipe down to return to the book</p>
      </div>}
    </dialog>
  );
}
