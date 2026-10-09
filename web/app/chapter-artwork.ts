import type { GalleryAsset } from "./components/gallery-image";
import type { BookWorldId } from "./book-data";

export type IllustratedChapter = Exclude<BookWorldId, "foreword" | "atlas" | "education">;
export type ChapterArtwork = Readonly<{
  image: GalleryAsset;
  media?: readonly GalleryAsset[];
  atmosphere: string;
  voice: string;
}>;

// Change a cover, add related artwork, or remove an entry here. The heading
// retains its ordinary readable layout when its illustration is omitted.
export const CHAPTER_ARTWORK: Partial<Record<IllustratedChapter, ChapterArtwork>> = {
  projects: {
    image: { src: "/media/chapters/projects-atelier.webp", width: 1800, height: 600, alt: "Conceptual illustration of an engineering atelier in copper and emerald light", caption: "The workshop · an original conceptual illustration." },
    atmosphere: "The workshop / ideas with fingerprints",
    voice: "I build across layers — from a circuit on the bench to a product in someone's hands.",
  },
  research: {
    image: { src: "/media/chapters/research-observatory.webp", width: 1800, height: 600, alt: "Conceptual illustration of a quiet teal and gold research observatory", caption: "The observatory · an original conceptual illustration." },
    atmosphere: "The observatory / stay with the question",
    voice: "I stay with a question until the evidence becomes clearer than the claim.",
  },
  experience: {
    image: { src: "/media/chapters/experience-studio.webp", width: 1800, height: 600, alt: "Conceptual illustration of a warmly lit collaborative engineering studio", caption: "The gathering · an original conceptual illustration." },
    atmosphere: "The gathering / shared work",
    voice: "The work carries my fingerprints, and the names of the people who built beside me.",
  },
  certifications: {
    image: { src: "/media/chapters/certifications-reading-room.webp", width: 1800, height: 600, alt: "Conceptual illustration of a magnificent intimate reading room in warm golden light", caption: "The reading room · an original conceptual illustration." },
    atmosphere: "The reading room / curiosity, kept",
    voice: "These are the ideas I've spent time with — and the original records behind that learning.",
  },
  achievements: {
    image: { src: "/media/chapters/achievements-constellation.webp", width: 1800, height: 600, alt: "Conceptual illustration of a burnished brass milestone gallery beneath distant constellations", caption: "The constellation · an original conceptual illustration." },
    atmosphere: "The constellation / moments that remain",
    voice: "A result is one moment. I keep the work, the people, and the evidence around it.",
  },
  connect: {
    image: { src: "/media/chapters/connect-atelier.webp", width: 1800, height: 600, alt: "Conceptual illustration of an emerald writing atelier opening toward sunlit trees", caption: "The unwritten page · an original conceptual illustration." },
    atmosphere: "The unwritten page / the next conversation",
    voice: "If a question, a project, or an idea brought you here, I'd like to hear about it.",
  },
};

// This photograph is published by the owner's official company websites.
export const CHAPTER_AUTHOR = {
  name: "Muhammad Taha Bin Zaeem",
  label: "The person behind the work",
  image: { src: "/media/projects/muhammad-taha-founder-headshot.webp", width: 988, height: 970, alt: "Muhammad Taha Bin Zaeem · official founder portrait", caption: "Official founder portrait · ProGenEDA and Type2Learn." } satisfies GalleryAsset,
  // The foreword owns the personal photo library; each chapter stamp opens
  // only this founder portrait unless related author images are added here.
  portraits: [] as readonly GalleryAsset[],
} as const;
