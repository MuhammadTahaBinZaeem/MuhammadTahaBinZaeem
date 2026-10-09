import type { GalleryAsset } from "./components/gallery-image";

type HomeIntroduction = Readonly<{
  kicker: string;
  note: string;
  title: readonly string[];
  lead: string;
  signature: string;
  manifesto: readonly [string, string];
  biography: string;
  links: readonly Readonly<{ label: string; href: string; role: string }>[];
  process: readonly string[];
  portraits: readonly GalleryAsset[];
}>;

export const HOME_COVER = {
  edition: "A LIVING PORTFOLIO / VOL. 01",
  subtitle: "The engineering",
  title: "FIELD",
  titleAccent: "BOOK.",
  authorLines: ["MUHAMMAD TAHA", "BIN ZAEEM"],
  foot: "Hardware · Software · Human curiosity",
  invitation: "Open the field book ↗",
  instructions: "Scroll to read. Reverse to return.",
  quietLabel: "Read without animation",
  animatedLabel: "Enter the animated book",
  spine: "MUHAMMAD TAHA BIN ZAEEM · FIELD NOTES",
} as const;

// Edit these values and reorder these arrays to update the introduction.
// Each image opens the same portrait collection. The first image is the cover.
export const HOME_INTRO: HomeIntroduction = {
  kicker: "Foreword / Muhammad Taha Bin Zaeem",
  note: "Curiosity, put to work.",
  title: ["A mind", "between", "worlds."],
  lead: "Hardware. Software. The very human question of what if?",
  signature: "Taha.",
  manifesto: ["Build something.", "Then question it."],
  biography: "I’m Muhammad Taha Bin Zaeem — Taha Zaeem for short. A Computer Engineering undergraduate at NUST CEME, working across processors, applied AI, accessible learning, and the evidence that makes a system worth trusting.",
  links: [
    { label: "ProGenEDA", href: "https://progeneda.app", role: "Founder" },
    { label: "Type2Learn", href: "https://type2learn.tech", role: "Founder" },
    { label: "ParetoCo", href: "https://github.com/MuhammadTahaBinZaeem/ParetCo", role: "Co-creator" },
  ],
  process: ["fetch curiosity", "decode possibility", "execute an idea", "repeat."],
  portraits: [
    { src: "/media/identity/muhammad-taha-studio-portrait.webp", width: 988, height: 970, alt: "Muhammad Taha Bin Zaeem · studio portrait", caption: "The person behind the work." },
    { src: "/media/identity/muhammad-taha-mountain-field-note.webp", width: 1058, height: 1086, alt: "Muhammad Taha Bin Zaeem · in the mountains", caption: "Curiosity goes beyond the workbench." },
    { src: "/media/identity/muhammad-taha-formal-portrait.webp", width: 1067, height: 1600, alt: "Muhammad Taha Bin Zaeem · formal portrait" },
  ] satisfies readonly GalleryAsset[],
} as const;
