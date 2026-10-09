/* eslint-disable @next/next/no-img-element */
import type { MediaAsset } from "../portfolio-data";

export type GalleryAsset = MediaAsset & { caption?: string };

/** Optional evidence works on every content record without presentation edits. */
export function EntryGallery({ entry, title, className = "entry-evidence" }: {
  entry: object;
  title: string;
  className?: string;
}) {
  const media = (entry as { media?: readonly GalleryAsset[] }).media;
  if (!media?.length) return null;
  return <figure className={className} data-paper>
    <GalleryImage image={media[0]} images={media} title={title} />
    {media[0].caption && <figcaption>{media[0].caption}</figcaption>}
  </figure>;
}

// Keep the complete group in HTML, even when the book parks offscreen img.src
// or hides the remaining evidence inside a collapsed details element.
export function GalleryImage({ image, images = [image], title, className = "", eager = false }: {
  image: GalleryAsset;
  images?: readonly GalleryAsset[];
  title: string;
  className?: string;
  eager?: boolean;
}) {
  // An explicit library owns its membership. A decorative cover must not add
  // itself to a collection of photographs or certificates behind it.
  const group = images.length ? images : [image];
  const items = Array.from(new Map(group.map((item) => [item.src, item])).values());
  const selected = items.find((item) => item.src === image.src) || items[0];
  return (
    <a className={`gallery-trigger ${className}`} href={selected.src}
      data-gallery={JSON.stringify({ title, items })} data-gallery-src={selected.src}
      aria-label={`View ${title} gallery · ${items.length} ${items.length === 1 ? "image" : "images"}`}
      aria-haspopup="dialog">
      <img src={image.src} width={image.width} height={image.height} alt={image.alt}
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        loading={eager ? "eager" : "lazy"} decoding="async" />
      <span className="gallery-image-hint" aria-hidden="true">
        <span className="gallery-hint-icon">↗</span>
        <span>{items.length > 1 ? "View gallery" : "View image"}</span>
        <span className="gallery-hint-count">{String(items.length).padStart(2, "0")}</span>
      </span>
    </a>
  );
}
