/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CHAPTERS } from "../dossier-data";
export function InkDrawing({
  name,
  className = "",
  alt = "",
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={`ink-drawing ${className}`}
      src={`/art/notebook/${name}.svg`}
      width={960}
      height={760}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
export function ChapterHeading({
  number,
  title,
  lead,
  note,
}: {
  number: string;
  title: string;
  lead: string;
  note?: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">The engineering notebook / {number}</p>
      <h1>{title}</h1>
      <div className="heading-tail">
        <p className="page-lead">{lead}</p>
        {note && <span className="hand-note">{note}</span>}
      </div>
      <div className="ink-rule" data-ink-rule />
    </header>
  );
}
export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}
export function NextChapter({ href }: { href: string }) {
  const chapter = CHAPTERS.find((c) => c.href === href)!;
  return (
    <Link href={href} className="next-chapter" prefetch={false}>
      <span className="eyebrow">Keep turning pages / {chapter.number}</span>
      <span>{chapter.title}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
