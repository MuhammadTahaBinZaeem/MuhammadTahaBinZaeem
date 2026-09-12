/* eslint-disable @next/next/no-img-element */
import type { MediaAsset } from "../portfolio-data";

export type GalleryAsset = MediaAsset & { caption?: string };

// Keep the complete group in HTML, even when the book parks offscreen img.src
// or hides the remaining evidence inside a collapsed details element.
export function GalleryImage({ image, images = [image], title, className = "", eager = false }: {
  image: GalleryAsset;
  images?: readonly GalleryAsset[];
  title: string;
  className?: string;
  eager?: boolean;
}) {
  const items = Array.from(new Map(images.map((item) => [item.src, item])).values());
  return (
    <a className={`gallery-trigger ${className}`} href={image.src}
      data-gallery={JSON.stringify({ title, items })} data-gallery-src={image.src}
      aria-label={`View ${title} gallery · ${items.length} ${items.length === 1 ? "image" : "images"}`}
      aria-haspopup="dialog">
      <img src={image.src} width={image.width} height={image.height} alt={image.alt}
        loading={eager ? "eager" : "lazy"} decoding="async" />
      <span className="gallery-image-hint" aria-hidden="true">Explore image{items.length > 1 ? `s · ${items.length}` : ""} ↗</span>
    </a>
  );
}
