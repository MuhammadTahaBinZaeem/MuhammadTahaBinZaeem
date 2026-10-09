import type { GalleryAsset } from "./components/gallery-image";

// Supplemental project media. FEATURED.image owns the primary cover; this
// array controls the related gallery sequence. Official sources and the
// distinction between screenshots and artwork live in docs/BRAND-IMAGERY.md.
export const PROJECT_GALLERIES: Record<string, readonly GalleryAsset[]> = {
  progeneda: [
    { src: "/media/projects/progeneda-official-generate-workspace.webp", width: 1600, height: 1000, alt: "The actual ProGenEDA Generate workspace, with circuit-intent input and native target controls", caption: "Generate workspace · screenshot published by ProGenEDA" },
    { src: "/media/projects/progeneda-official-components-catalogue.webp", width: 1600, height: 1000, alt: "The actual ProGenEDA Supported Components workspace and backend-specific component catalogue", caption: "Supported components · screenshot published by ProGenEDA" },
    { src: "/media/projects/progeneda-official-generation-history.webp", width: 1600, height: 1000, alt: "The actual ProGenEDA History workspace, with generation records and export readiness", caption: "Generation history · screenshot published by ProGenEDA" },
    { src: "/media/projects/progeneda-official-proteus-schematic.webp", width: 1600, height: 1000, alt: "A native Proteus schematic example published by ProGenEDA", caption: "Proteus schematic · official native-editor example" },
    { src: "/media/projects/progeneda-official-easyeda-schematic.webp", width: 1608, height: 946, alt: "A native EasyEDA Pro schematic example published by ProGenEDA", caption: "EasyEDA Pro schematic · official native-editor example" },
    { src: "/media/projects/progeneda-official-kicad-board.webp", width: 1293, height: 879, alt: "A KiCad two-layer board example published by ProGenEDA", caption: "KiCad board · official native-editor example" },
    { src: "/media/projects/progeneda-official-ltspice-schematic.webp", width: 1914, height: 1024, alt: "An LTspice schematic example with physical wires published by ProGenEDA", caption: "LTspice schematic · official native-editor example" },
  ],
  type2learn: [
    { src: "/media/projects/type2learn-official-recall-capture.webp", width: 1600, height: 1000, alt: "The actual Type2Learn active-recall interaction, with the current idea, answer field and response check", caption: "Active recall · live website capture, October 2026" },
    { src: "/media/projects/type2learn-official-learning-path-artwork.webp", width: 1672, height: 941, alt: "Type2Learn’s official explanatory artwork of a learning route made from colorful key forms and connecting arrows", caption: "Learning path · official explanatory artwork" },
    { src: "/media/projects/type2learn-official-learner-controls-artwork.webp", width: 1586, height: 992, alt: "Type2Learn’s official explanatory artwork of a dial, slider, pause control and adaptable settings panel", caption: "Learner controls · official explanatory artwork" },
  ],
  "debate-club": [{ src: "/media/ventures/debate-club-live.webp", width: 1440, height: 900, alt: "Debate Club · archived capture of the live application" }],
};
