import Link from "next/link";
import { CHAPTERS } from "../dossier-data";
import { GalleryImage, type GalleryAsset } from "./gallery-image";
import { CHAPTER_ARTWORK, CHAPTER_AUTHOR, type IllustratedChapter } from "../chapter-artwork";
export function InkDrawing({
  name,
  className = "",
  alt = "",
  images,
  title,
}: {
  name: string;
  className?: string;
  alt?: string;
  images?: readonly GalleryAsset[];
  title?: string;
}) {
  return (
    <GalleryImage
      className={`ink-drawing ${className}`}
      image={{ src: `/art/notebook/${name}.svg`, width: 960, height: 760, alt: alt || `${name} · pen-and-ink study` }}
      images={images}
      title={title || `${name.charAt(0).toUpperCase() + name.slice(1)} · notebook study`}
    />
  );
}
export function ChapterHeading({
  level = 1,
  number,
  title,
  lead,
  note,
  chapter,
}: {
  level?: 1 | 2;
  number: string;
  title: string;
  lead: string;
  note?: string;
  chapter?: IllustratedChapter;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const artwork = chapter ? CHAPTER_ARTWORK[chapter] : undefined;
  return (
    <header className={`page-heading${artwork ? " chapter-heading--illustrated" : ""}`}>
      {artwork && <div className="chapter-atmosphere">
        <GalleryImage image={artwork.image} images={[artwork.image, ...(artwork.media || [])]} title={artwork.atmosphere} />
      </div>}
      <div className={artwork ? "chapter-heading__copy" : undefined}>
      <p className="eyebrow">The engineering notebook / {number}</p>
      <Heading>{title}</Heading>
      <div className="heading-tail">
        <p className="page-lead">{lead}</p>
        {note && <span className="hand-note">{note}</span>}
      </div>
      <div className="ink-rule" data-ink-rule />
      </div>
      {artwork && <div className="chapter-heading__personal">
        <figure className="chapter-author">
          <GalleryImage image={CHAPTER_AUTHOR.image} images={[CHAPTER_AUTHOR.image, ...CHAPTER_AUTHOR.portraits]} title={CHAPTER_AUTHOR.name} />
          <figcaption><span>{CHAPTER_AUTHOR.label}</span><strong>{CHAPTER_AUTHOR.name}</strong></figcaption>
        </figure>
        <p className="chapter-author__voice">{artwork.voice}</p>
      </div>}
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
  const chapter = CHAPTERS.find((c) => c.href === href);
  if (!chapter) return null;
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
