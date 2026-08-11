"use client";

/* Transparent animation frames are hand-optimized WebPs and must not be transformed. */
/* eslint-disable @next/next/no-img-element */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import { SOCIAL_LINKS } from "../portfolio-data";

const ROOMS = [
  { href: "/", label: "Threshold", code: "00" },
  { href: "/projects", label: "Projects", code: "01" },
  { href: "/certifications", label: "Certifications", code: "02" },
  { href: "/achievements", label: "Achievements", code: "03" },
  { href: "/education", label: "Education", code: "04" },
] as const;

type PortalContextValue = {
  travel: (href: string, label: string) => void;
  closeMenu: () => void;
  moving: boolean;
};

const PortalContext = createContext<PortalContextValue | null>(null);

type PortalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  portalLabel?: string;
};

export function PortalLink({
  href,
  portalLabel,
  children,
  onClick,
  ...props
}: PortalLinkProps) {
  const context = useContext(PortalContext);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      !context
    ) {
      return;
    }

    event.preventDefault();
    context.closeMenu();
    context.travel(href, portalLabel ?? String(children));
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function SignalEmblem({
  animated = false,
  className = "",
}: {
  animated?: boolean;
  className?: string;
}) {
  if (!animated) {
    return (
      <span className={`signal-emblem signal-emblem--still ${className}`.trim()}>
        <img
          src="/media/identity/mtbz-signal-mark.webp"
          alt="Muhammad Taha Bin Zaeem signal emblem"
          width="720"
          height="720"
          decoding="async"
        />
      </span>
    );
  }

  return (
    <span
      className={`signal-emblem signal-emblem--animated ${className}`.trim()}
      role="img"
      aria-label="An original engineering signal assembling into Muhammad Taha Bin Zaeem's emblem"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <img
          alt=""
          aria-hidden="true"
          className="signal-emblem__frame"
          decoding={index < 2 ? "sync" : "async"}
          height="640"
          key={index}
          loading={index < 2 ? "eager" : "lazy"}
          src={`/media/identity/signal-frame-${String(index + 1).padStart(2, "0")}.webp`}
          style={{ "--frame-index": index } as React.CSSProperties}
          width="520"
        />
      ))}
    </span>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function ExperienceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const [destination, setDestination] = useState("Threshold");
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);
  const mobileMenu = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const travelTimer = useRef<number | null>(null);
  const resetTimer = useRef<number | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const seen = sessionStorage.getItem("mtbz:threshold-opened");
    const delay = reducedMotion ? 90 : seen ? 420 : 1280;
    const timer = window.setTimeout(() => {
      setBooting(false);
      sessionStorage.setItem("mtbz:threshold-opened", "true");
    }, delay);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const remembered = localStorage.getItem("mtbz:dominant-project-theme");
    if (remembered) document.documentElement.dataset.affinity = remembered;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let animationFrame = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(frame);
    };
    const syncVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(frame);
      }
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, [pathname, reducedMotion]);

  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(1, window.scrollY / available) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const stage = document.querySelector<HTMLElement>(".site-stage");
    const toggle = menuToggle.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stage?.setAttribute("inert", "");

    const firstLink = mobileMenu.current?.querySelector<HTMLAnchorElement>("a");
    window.setTimeout(() => firstLink?.focus(), 20);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        toggle,
        ...Array.from(mobileMenu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
      ].filter((element): element is HTMLButtonElement | HTMLAnchorElement => element !== null);
      if (!focusable.length) return;
      const currentIndex = focusable.findIndex((element) => element === document.activeElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex === focusable.length - 1 ? 0 : currentIndex + 1);
      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1101px)").matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      stage?.removeAttribute("inert");
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.requestAnimationFrame(() => {
        if (toggle && getComputedStyle(toggle).display !== "none") {
          toggle.focus();
        }
      });
    };
  }, [menuOpen]);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    if (!dot || !ring) return;

    let cursorX = -100;
    let cursorY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;
    const move = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      if (!raf && !document.hidden) raf = window.requestAnimationFrame(draw);
    };
    const draw = () => {
      ringX += (cursorX - ringX) * 0.16;
      ringY += (cursorY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      if (Math.abs(cursorX - ringX) + Math.abs(cursorY - ringY) > 0.35) {
        raf = window.requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const travel = useCallback(
    (href: string, label: string) => {
      if (moving || href === pathname) return;
      setDestination(label);
      setMoving(true);
      if (travelTimer.current) window.clearTimeout(travelTimer.current);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);

      travelTimer.current = window.setTimeout(
        () => {
          router.push(href);
          window.scrollTo({ top: 0, behavior: "instant" });
        },
        reducedMotion ? 30 : 620,
      );
      resetTimer.current = window.setTimeout(
        () => setMoving(false),
        reducedMotion ? 90 : 1180,
      );
    },
    [moving, pathname, reducedMotion, router],
  );

  useEffect(
    () => () => {
      if (travelTimer.current) window.clearTimeout(travelTimer.current);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const context = useMemo(
    () => ({ travel, closeMenu, moving }),
    [travel, closeMenu, moving],
  );

  return (
    <PortalContext.Provider value={context}>
      <a className="skip-link" href="#main-content">
        Skip to the story
      </a>

      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <div className="scroll-meter" aria-hidden="true">
        <i style={{ transform: `scaleY(${progress})` }} />
      </div>

      <div className="boot-veil" data-visible={booting} aria-hidden={!booting}>
        <div className="boot-veil__readout">
          <span>MTBZ / FIELD SYSTEM 00</span>
          <span>PAKISTAN · 33.6844° N</span>
        </div>
        <SignalEmblem animated />
        <div className="boot-veil__command">
          <code>JAL&nbsp; TAHA.ENTRY</code>
          <span>turning evidence into signal</span>
        </div>
      </div>

      <div className="portal-warp" data-visible={moving} aria-hidden={!moving}>
        <div className="portal-warp__rings" />
        <SignalEmblem animated />
        <p>
          ENTERING <strong>{destination}</strong>
        </p>
      </div>
      <span className="sr-only" aria-live="polite">
        {moving ? `Entering ${destination}` : ""}
      </span>

      <header className="site-header">
        <PortalLink className="site-brand" href="/" portalLabel="Threshold" aria-label="Return to the threshold">
          <SignalEmblem />
          <span>
            <strong>MUHAMMAD TAHA</strong>
            <small>BIN ZAEEM · COMPUTER ENGINEER</small>
          </span>
        </PortalLink>

        <nav className="desktop-rooms" aria-label="Portfolio rooms">
          {ROOMS.map((room) => (
            <PortalLink
              aria-current={pathname === room.href ? "page" : undefined}
              href={room.href}
              key={room.href}
              portalLabel={room.label}
            >
              <span>{room.code}</span>
              {room.label}
            </PortalLink>
          ))}
        </nav>

        <button
          aria-controls="mobile-rooms"
          aria-expanded={menuOpen}
          className="room-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuToggle}
          type="button"
        >
          <span>{menuOpen ? "Close" : "Rooms"}</span>
          <i aria-hidden="true" />
        </button>
      </header>

      <nav
        aria-hidden={!menuOpen}
        aria-label="Mobile portfolio rooms"
        className="mobile-rooms"
        data-open={menuOpen}
        id="mobile-rooms"
        ref={mobileMenu}
      >
        <p>Choose a chamber. The entire field changes with you.</p>
        {ROOMS.map((room) => (
          <PortalLink
            aria-current={pathname === room.href ? "page" : undefined}
            href={room.href}
            key={room.href}
            portalLabel={room.label}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span>{room.code}</span>
            <strong>{room.label}</strong>
            <em>enter ↘</em>
          </PortalLink>
        ))}
        <div className="mobile-rooms__signal">
          <span>BUILD FILE</span>
          <span>PROVE ARTIFACT</span>
          <span>KEEP EDITABLE</span>
        </div>
      </nav>

      <div className="site-stage">
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div>
            <span>THE FIELD REMAINS OPEN</span>
            <strong>tahabinzaeem.tech</strong>
          </div>
          <div className="site-footer__links">
            {SOCIAL_LINKS.filter((link) => link.href).map((link) => (
              <a
                href={link.href ?? undefined}
                key={link.id}
                rel={link.kind === "product" ? "noreferrer" : "me noreferrer"}
                target="_blank"
              >
                {link.label} ↗
              </a>
            ))}
            <span className="is-pending" aria-label="Devpost profile link pending verification">
              Devpost · verified profile URL pending
            </span>
          </div>
          <p>Designed as a living evidence system. Every room is independently replaceable.</p>
        </footer>
      </div>
    </PortalContext.Provider>
  );
}
