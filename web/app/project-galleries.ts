import type { GalleryAsset } from "./components/gallery-image";

// Archived, actual application captures. Append related media here without
// changing the gallery, scroll engine, or the project's hand-drawn cover.
export const PROJECT_GALLERIES: Record<string, readonly GalleryAsset[]> = {
  progeneda: [{ src: "/media/ventures/progeneda-live.webp", width: 1440, height: 900, alt: "ProGenEDA · archived capture of the actual application" }],
  type2learn: [{ src: "/media/ventures/type2learn-live.webp", width: 1440, height: 900, alt: "Type2Learn · archived capture of the actual website" }],
  "debate-club": [{ src: "/media/ventures/debate-club-live.webp", width: 1440, height: 900, alt: "Debate Club · archived capture of the live application" }],
};
