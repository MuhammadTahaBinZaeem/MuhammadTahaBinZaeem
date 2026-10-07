import type { MediaAsset } from "./portfolio-data";

export type Collaborator = Readonly<{
  id: string;
  name: string;
  profile: string | null;
  platform: string | null;
  linkedin?: string;
  note: string;
  projects: readonly Readonly<{ name: string; href: string }>[];
  source: string;
  media?: readonly MediaAsset[];
  portrait?: MediaAsset;
  background?: MediaAsset;
  focus?: string;
  accent?: string;
}>;

// Array order is the on-screen order. Names follow the owner's preferred
// spelling; project relationships and profile URLs retain their public sources.
// Portraits, personal artwork, related photographs and focus labels are optional.
// Edit these records to change images, profile links or the display order.
export const COLLABORATORS: readonly Collaborator[] = [
  {
    id: "hamiz-kashif",
    name: "Muhammad Hamiz bin Kashif",
    profile: "https://lablab.ai/u/%40Hamiz_Kashif",
    platform: "lablab.ai",
    focus: "Dependable systems & engineering",
    accent: "#2f6680",
    portrait: { src: "/media/people/hamiz-kashif-portrait.webp", width: 900, height: 1439, alt: "Muhammad Hamiz bin Kashif · portrait published by Type2Learn", caption: "Official Type2Learn team photo · published supplied image.", objectPosition: "50% 18%" },
    background: { src: "/media/people/hamiz-kashif-background.webp", width: 1500, height: 1000, alt: "Conceptual systems-engineering atelier with modular computers and orderly circuit pathways", caption: "Dependable engineering · an original conceptual illustration inspired by Hamiz's documented work." },
    media: [{ src: "/media/people/hamiz-kashif-devpost-profile.webp", width: 1254, height: 1254, alt: "The illustrated profile picture published on Hamiz's confirmed Devpost account", caption: "Hamiz's chosen public Devpost profile illustration." }],
    note: "Type2Learn co-founder and Engineering Lead, building dependable systems, accessible delivery, and protected learner progress.",
    projects: [{ name: "Type2Learn", href: "/projects#type2learn" }],
    source: "https://type2learn.tech/team/",
  },
  {
    id: "alizay-hassan",
    name: "Alizay Hassan",
    profile: "https://github.com/alizay-debug",
    platform: "GitHub",
    focus: "Product strategy & co-design",
    accent: "#9b4962",
    background: { src: "/media/people/alizay-hassan-background.webp", width: 1500, height: 1000, alt: "Conceptual product-design atelier with tactile storyboards and connected learning pathways", caption: "Product and co-design · an original conceptual illustration inspired by Alizay's documented work." },
    note: "Co-creator of ParetoCo. Type2Learn co-founder and Product Lead, connecting product strategy, co-design, and clear learning journeys.",
    projects: [
      { name: "ParetoCo", href: "/projects#paretoco" },
      { name: "Type2Learn", href: "/projects#type2learn" },
    ],
    source: "https://github.com/MuhammadTahaBinZaeem/ParetCo#team",
  },
  {
    id: "lameea-mubashir-khan",
    name: "Lameea Mubashir Khan",
    profile: "https://github.com/rosseaaq",
    platform: "GitHub",
    linkedin: "https://www.linkedin.com/in/lameea-khan-745b04385",
    focus: "Accessible interface design",
    accent: "#3e765f",
    portrait: { src: "/media/people/lameea-mubashir-khan-portrait.webp", width: 460, height: 460, alt: "Lameea Mubashir Khan · public GitHub profile photo", caption: "Portrait from Lameea's confirmed public GitHub profile." },
    background: { src: "/media/people/lameea-mubashir-khan-background.webp", width: 1500, height: 1000, alt: "Conceptual jade design atelier with interface grids and carefully aligned translucent panels", caption: "Interface clarity · an original conceptual illustration inspired by Lameea's documented work." },
    note: "ParetoCo co-creator and Type2Learn UI/UX Design Lead. On the vector CPU: control logic, instruction handling, and the program-counter path.",
    projects: [
      { name: "ParetoCo", href: "/projects#paretoco" },
      { name: "Type2Learn", href: "/projects#type2learn" },
      { name: "20-bit Vector CPU", href: "/projects#project-vector-cpu" },
    ],
    source: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors",
  },
  {
    id: "idrees-babar",
    name: "Idrees Babar",
    profile: "https://github.com/meidreesbabar-crypto",
    platform: "GitHub",
    linkedin: "https://www.linkedin.com/in/idrees-babar-23833339a",
    focus: "Research, evidence & measurement",
    accent: "#397979",
    portrait: { src: "/media/people/idrees-babar-github-profile.webp", width: 460, height: 460, alt: "Idrees Babar · public GitHub profile photo", caption: "Profile photo from Idrees's confirmed public GitHub account." },
    background: { src: "/media/people/idrees-babar-background.webp", width: 1500, height: 1000, alt: "Conceptual research observatory with notebooks, measuring instruments and a magnifying lens", caption: "Research and evidence · an original conceptual illustration inspired by Idrees's documented work." },
    media: [{ src: "/media/people/idrees-babar-portrait.webp", width: 720, height: 1466, alt: "Idrees Babar · portrait published by Type2Learn", caption: "Official Type2Learn team photo · published supplied image." }],
    note: "Co-creator of ParetoCo. Type2Learn co-founder and Research Lead, connecting evidence review, study design, and measurable product decisions.",
    projects: [
      { name: "ParetoCo", href: "/projects#paretoco" },
      { name: "Type2Learn", href: "/projects#type2learn" },
    ],
    source: "https://github.com/MuhammadTahaBinZaeem/ParetCo#team",
  },
  {
    id: "fahad-younus",
    name: "Muhammad Fahad Younus",
    profile: "https://lablab.ai/u/%40fahadyounus62",
    platform: "lablab.ai",
    focus: "AI evaluation & computer vision",
    accent: "#77619c",
    portrait: { src: "/media/people/fahad-younus-portrait.webp", width: 960, height: 1200, alt: "Muhammad Fahad Younus · official Type2Learn team portrait", caption: "Official Type2Learn team portrait · prepared from a supplied image.", objectPosition: "50% 22%" },
    background: { src: "/media/people/fahad-younus-background.webp", width: 1500, height: 1000, alt: "Conceptual AI studio with luminous model networks and balanced comparison panels", caption: "AI and model evaluation · an original conceptual illustration inspired by Fahad's documented work." },
    note: "Type2Learn co-founder and AI Lead, focusing on model evaluation, responsible AI support, and useful human oversight.",
    projects: [{ name: "Type2Learn", href: "/projects#type2learn" }],
    source: "https://type2learn.tech/team/",
  },
  {
    id: "tooba-fatima",
    name: "Tooba Fatima",
    profile: "https://lablab.ai/u/@toobaafatima",
    platform: "lablab.ai",
    linkedin: "https://www.linkedin.com/in/tooba-fatimaa/",
    focus: "CPU datapaths & clear reasoning",
    accent: "#b86942",
    background: { src: "/media/people/tooba-fatima-background.webp", width: 1500, height: 1000, alt: "Conceptual digital-hardware atelier with a copper processor die and ordered logic circuits", caption: "Hardware and reasoning · an original conceptual illustration inspired by Tooba's documented work." },
    note: "On the vector CPU: ALU, flags, register files, operand selection, and write-back. Also a Debate Club teammate.",
    projects: [
      { name: "20-bit Vector CPU", href: "/projects#project-vector-cpu" },
      { name: "Debate Club", href: "/projects#project-debate-club" },
    ],
    source: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors",
  },
];
