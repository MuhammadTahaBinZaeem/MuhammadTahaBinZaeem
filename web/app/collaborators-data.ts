import type { MediaAsset } from "./portfolio-data";

export type Collaborator = Readonly<{
  id: string;
  name: string;
  profile: string | null;
  platform: string | null;
  note: string;
  projects: readonly Readonly<{ name: string; href: string }>[];
  source: string;
  media?: readonly MediaAsset[];
}>;

// Array order is the on-screen order. Names follow the owner's preferred
// spelling; project relationships and profile URLs retain their public sources.
// New photographs can be added as media without editing presentation code.
export const COLLABORATORS: readonly Collaborator[] = [
  {
    id: "hamiz-kashif",
    name: "Muhammad Hamiz bin Kashif",
    profile: "https://lablab.ai/u/%40Hamiz_Kashif",
    platform: "lablab.ai",
    note: "Type2Learn co-founder and Engineering Lead, building dependable systems, accessible delivery, and protected learner progress.",
    projects: [{ name: "Type2Learn", href: "/projects#type2learn" }],
    source: "https://type2learn.tech/team/",
  },
  {
    id: "alizay-hassan",
    name: "Alizay Hassan",
    profile: "https://github.com/alizay-debug",
    platform: "GitHub",
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
    note: "Type2Learn co-founder and AI Lead, focusing on model evaluation, responsible AI support, and useful human oversight.",
    projects: [{ name: "Type2Learn", href: "/projects#type2learn" }],
    source: "https://type2learn.tech/team/",
  },
  {
    id: "tooba-fatima",
    name: "Tooba Fatima",
    profile: null,
    platform: null,
    note: "On the vector CPU: ALU, flags, register files, operand selection, and write-back. Also a Debate Club teammate.",
    projects: [
      { name: "20-bit Vector CPU", href: "/projects#project-vector-cpu" },
      { name: "Debate Club", href: "/projects#project-debate-club" },
    ],
    source: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors",
  },
];
