"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS, DOSSIER } from "../dossier-data";

export function PortalLink({
  href,
  portalLabel: _label,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  portalLabel?: string;
}) {
  void _label;
  return <Link href={href} prefetch={false} {...props} />;
}
export function SignalEmblem({
  className = "",
  animated: _animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  void _animated;
  return (
    <span className={className}>
      <img
        src="/art/notebook/architecture.svg"
        alt="Ink drawing of an architecture trade-off study"
        width={960}
        height={760}
        loading="lazy"
      />
    </span>
  );
}
export function ExperienceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem("mtbz:quiet-motion") === "true";
    } catch {}
    document.documentElement.dataset.motion = stored ? "quiet" : "full";
    if (stored) requestAnimationFrame(() => setQuiet(true));
  }, []);
  useEffect(() => {
    if (menu) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  function changeMotion() {
    const next = !quiet;
    setQuiet(next);
    document.documentElement.dataset.motion = next ? "quiet" : "full";
    try {
      localStorage.setItem("mtbz:quiet-motion", String(next));
    } catch {}
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="notebook-header">
        {/* A document reload is intentional for the original home control. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          className="site-brand"
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              window.location.reload();
            }
          }}
          aria-label="Muhammad Taha Bin Zaeem — return home and reload"
        >
          <strong>MUHAMMAD TAHA</strong>
          <span>BIN ZAEEM / ENGINEERING NOTEBOOK</span>
        </a>
        <nav className="quick-nav" aria-label="Primary">
          <Link
            href="/projects"
            prefetch={false}
            aria-current={pathname === "/projects" ? "page" : undefined}
          >
            Work
          </Link>
          <Link
            href="/research"
            prefetch={false}
            aria-current={pathname === "/research" ? "page" : undefined}
          >
            Research
          </Link>
          <Link
            href="/connect"
            prefetch={false}
            aria-current={pathname === "/connect" ? "page" : undefined}
          >
            Say hello ↗
          </Link>
        </nav>
        <button
          className="index-toggle"
          ref={toggle}
          onClick={() => setMenu(true)}
          aria-expanded={menu}
          aria-controls="chapter-dialog"
        >
          Index <span aria-hidden="true">＋</span>
        </button>
      </header>
      <dialog
        ref={dialog}
        id="chapter-dialog"
        className="chapter-dialog"
        onCancel={() => setMenu(false)}
        onClose={() => {
          setMenu(false);
          toggle.current?.focus();
        }}
      >
        <div className="index-heading">
          <p className="eyebrow">The notebook / contents</p>
          <button
            autoFocus
            onClick={() => setMenu(false)}
            aria-label="Close section index"
          >
            Close ×
          </button>
        </div>
        <nav aria-label="All sections">
          <Link href="/" onClick={() => setMenu(false)}>
            00 <span>Home</span> ↗
          </Link>
          {CHAPTERS.map((ch) => (
            <Link
              href={ch.href}
              key={ch.href}
              prefetch={false}
              onClick={() => setMenu(false)}
              aria-current={pathname === ch.href ? "page" : undefined}
            >
              {ch.number}
              <span>{ch.label}</span>↗
            </Link>
          ))}
        </nav>
        <p className="hand-note">Follow your curiosity.</p>
      </dialog>
      <div className="reading-progress" aria-hidden="true" />
      <div
        className="site-stage"
        id="main-content"
        tabIndex={-1}
        key={pathname}
      >
        {children}
      </div>
      <footer className="notebook-footer">
        <div>
          <p className="eyebrow">An open line</p>
          <Link href="/connect" className="footer-invitation">
            Let’s make
            <br />
            <em>something matter.</em> ↗
          </Link>
        </div>
        <div className="footer-directory">
          <a href={"mailto:" + DOSSIER.email}>{DOSSIER.email}</a>
          <a
            href="https://github.com/MuhammadTahaBinZaeem"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/tahabinzaeem/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://devpost.com/MuhammadTahaBinZaeem"
            target="_blank"
            rel="noreferrer"
          >
            Devpost ↗
          </a>
          <a
            href="https://lablab.ai/u/%40taha_zaeem65"
            target="_blank"
            rel="noreferrer"
          >
            lablab.ai ↗
          </a>
        </div>
        <div className="footer-bottom">
          <span>Muhammad Taha Bin Zaeem · Pakistan · {DOSSIER.updated}</span>
          <button onClick={changeMotion} aria-pressed={quiet}>
            Motion: {quiet ? "reduced" : "scroll-driven"}
          </button>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </>
  );
}
