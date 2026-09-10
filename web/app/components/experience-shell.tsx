"use client";
/* eslint-disable @next/next/no-img-element */
import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOSSIER } from "../dossier-data";
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
        alt="Pen drawing of an architecture study"
        width={960}
        height={760}
      />
    </span>
  );
}
export function ExperienceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [quiet, setQuiet] = useState(false);
  useEffect(() => {
    let value = false;
    try {
      value = localStorage.getItem("mtbz:quiet-motion") === "true";
    } catch {}
    document.documentElement.dataset.motion = value ? "quiet" : "full";
    if (value) requestAnimationFrame(() => setQuiet(true));
  }, []);
  function changeMotion() {
    const value = !quiet;
    setQuiet(value);
    document.documentElement.dataset.motion = value ? "quiet" : "full";
    try {
      localStorage.setItem("mtbz:quiet-motion", String(value));
    } catch {}
  }
  if (pathname === "/") return <>{children}</>;
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="reader-edition-link">
        <Link href={"/#" + pathname.slice(1)}>
          ↖ Open this chapter in the living book
        </Link>
        <span>Reader edition</span>
      </div>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <footer className="notebook-footer">
        <div>
          <p className="eyebrow">The story continues</p>
          <Link href="/" className="footer-invitation">
            Return to
            <br />
            <em>the living book.</em> ↗
          </Link>
        </div>
        <div className="footer-directory">
          <a href={"mailto:" + DOSSIER.email}>{DOSSIER.email}</a>
          <a href="https://github.com/MuhammadTahaBinZaeem">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/tahabinzaeem/">LinkedIn ↗</a>
          <a href="https://devpost.com/MuhammadTahaBinZaeem">Devpost ↗</a>
          <a href="https://lablab.ai/u/%40taha_zaeem65">lablab.ai ↗</a>
        </div>
        <div className="footer-bottom">
          <span>Muhammad Taha Bin Zaeem · {DOSSIER.updated}</span>
          <button onClick={changeMotion} aria-pressed={quiet}>
            Motion: {quiet ? "reduced" : "scroll-driven"}
          </button>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </>
  );
}
