import { GalleryImage, type GalleryAsset } from "./gallery-image";

export function OrbitalPortrait({ images }: { images: readonly GalleryAsset[] }) {
  if (!images.length) return null;
  return (
    <div className="orbital-portrait" data-reactive>
      <svg className="portrait-orbits" viewBox="0 0 640 640" fill="none" aria-hidden="true">
        <circle cx="320" cy="320" r="298" />
        <circle cx="320" cy="320" r="270" strokeDasharray="2 12" />
        <ellipse cx="320" cy="320" rx="302" ry="132" transform="rotate(-35 320 320)" />
        <path d="M320 0v40M320 600v40M0 320h40M600 320h40" />
        <circle className="orbital-node" cx="96" cy="122" r="7" />
        <circle className="orbital-node" cx="566" cy="480" r="5" />
      </svg>
      <figure className="portrait-primary reactive-plane">
        <GalleryImage title="Muhammad Taha Bin Zaeem" eager image={images[0]} images={images} />
        <figcaption><span>01 / The human in the loop</span><b>Muhammad Taha Bin Zaeem</b></figcaption>
      </figure>
      <div className="portrait-coordinate" aria-hidden="true"><span>33.65° N / 73.03° E</span><i /><span>ENGINEERING · IN PROGRESS</span></div>
      {images[1] && <figure className="portrait-satellite">
        <GalleryImage title="Muhammad Taha Bin Zaeem" image={images[1]} images={images} />
        <figcaption>Outside the lab ↗</figcaption>
      </figure>}
      <span className="portrait-signal"><i /> Always asking “what if?”</span>
    </div>
  );
}
