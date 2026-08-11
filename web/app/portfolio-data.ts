/**
 * PORTFOLIO CONTENT CONTROL PANEL
 *
 * Replace copy, links, dates, media paths, and scene colors here. Route and
 * animation components should consume this file so personalizing the entire
 * experience never requires editing presentation code.
 */

export type NullableUrl = string | null;

export type StoryTheme = Readonly<{
  "--story-bg": string;
  "--story-surface": string;
  "--story-ink": string;
  "--story-muted": string;
  "--story-accent": string;
  "--story-accent-2": string;
  "--story-glow": string;
  "--story-overlay": string;
}>;

export type MediaAsset = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
}>;

export type Profile = Readonly<{
  name: string;
  shortName: string;
  role: string;
  headline: string;
  location: string;
  domain: string;
  email: string | null;
  intro: string;
  thesis: string;
  currentRoles: readonly string[];
  portrait: MediaAsset;
}>;

export type SocialLinkKind =
  | "github"
  | "linkedin"
  | "lablab"
  | "devpost"
  | "product";

export type SocialLink = Readonly<{
  id: string;
  label: string;
  kind: SocialLinkKind;
  href: NullableUrl;
  handle: string | null;
  note: string;
}>;

export type PortalId = "projects" | "certifications" | "achievements" | "education";

export type Portal = Readonly<{
  id: PortalId;
  index: string;
  href: string;
  eyebrow: string;
  title: string;
  invitation: string;
  transition: string;
  cover: MediaAsset;
  theme: StoryTheme;
}>;

export type ProjectStory = Readonly<{
  id: string;
  index: string;
  slug: string;
  route: string;
  title: string;
  shortTitle: string;
  association: string | null;
  discipline: string;
  logline: string;
  story: string;
  proof: readonly string[];
  stack: readonly string[];
  links: Readonly<{
    github: NullableUrl;
    live: NullableUrl;
    video: NullableUrl;
    showcase: NullableUrl;
  }>;
  media: readonly MediaAsset[];
  theme: StoryTheme;
}>;

export type Certificate = Readonly<{
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId: string | null;
  credentialUrl: NullableUrl;
  documentUrl: NullableUrl;
  preview: MediaAsset;
  scene: string;
  theme: StoryTheme;
}>;

export type AchievementKind = "honor" | "photo-story";

export type Achievement = Readonly<{
  id: string;
  kind: AchievementKind;
  title: string;
  dateLabel: string;
  summary: string;
  evidence: readonly string[];
  media: readonly MediaAsset[];
  theme: StoryTheme;
}>;

export type EducationEntry = Readonly<{
  id: string;
  institution: string;
  qualification: string;
  period: string;
  grade: string | null;
  story: string;
  activities: readonly string[];
  media: readonly MediaAsset[];
  theme: StoryTheme;
}>;

function makeTheme(
  background: string,
  surface: string,
  ink: string,
  muted: string,
  accent: string,
  accent2: string,
): StoryTheme {
  return {
    "--story-bg": background,
    "--story-surface": surface,
    "--story-ink": ink,
    "--story-muted": muted,
    "--story-accent": accent,
    "--story-accent-2": accent2,
    "--story-glow": `color-mix(in srgb, ${accent} 22%, transparent)`,
    "--story-overlay": `color-mix(in srgb, ${background} 60%, transparent)`,
  };
}

// Carbon, ceramic, copper, brass, and phosphor: physical-computing colors,
// deliberately kept away from the electric cyan/purple shorthand of AI sites.
const THEMES = {
  threshold: makeTheme("#0b0c0a", "#171812", "#ede2c8", "#b5ac97", "#d9853e", "#a7b56c"),
  projects: makeTheme("#0c0f0d", "#171b16", "#efe4cd", "#b9b09c", "#d1843f", "#aab36a"),
  certificates: makeTheme("#17120d", "#261d14", "#f3e7ce", "#c6b69a", "#d6a85f", "#8e6a43"),
  achievements: makeTheme("#1a0c08", "#2a140d", "#f4e5c8", "#c8ae8d", "#e2b44e", "#a64a32"),
  education: makeTheme("#111315", "#1d2020", "#f0e7d6", "#b8b0a2", "#d19a46", "#8b9a72"),
  cpu: makeTheme("#0c0c0b", "#191814", "#efe8d8", "#b9b09e", "#c8833c", "#a8b15f"),
  debate: makeTheme("#f2e7cf", "#fff9ea", "#191713", "#625d52", "#7a2f29", "#a16f2c"),
  decompile: makeTheme("#10120b", "#1b1f12", "#ece3ca", "#b6ae92", "#d1a33f", "#a24f35"),
  chess: makeTheme("#12100c", "#211c14", "#f0e4cc", "#b8ac93", "#d6c8a7", "#758764"),
  algebra: makeTheme("#101511", "#1c241b", "#ece8d6", "#b8b5a4", "#d9c86e", "#b65c4b"),
  robot: makeTheme("#17130a", "#292111", "#f4e9cd", "#c2b692", "#e1b93f", "#83939a"),
  analog: makeTheme("#0d150e", "#19231a", "#eae4cf", "#b3ae93", "#cc7438", "#8fa36c"),
  water: makeTheme("#101413", "#1a2220", "#edf0e3", "#b2bab0", "#d3d9b4", "#c4703e"),
  duke: makeTheme("#0b1632", "#152447", "#f5ebd7", "#b5bdd0", "#d3b36c", "#7890b7"),
  stanford: makeTheme("#1b0b08", "#2a1510", "#f4e5d2", "#c9ad9e", "#d5ac68", "#b8493e"),
  google: makeTheme("#f1eee6", "#fcfaf5", "#182026", "#5c6463", "#315e45", "#8d552f"),
  coursera: makeTheme("#101a2b", "#1a2a42", "#f1e7d4", "#b7bed0", "#d2aa63", "#7184a6"),
  lablab: makeTheme("#15110d", "#241c15", "#f2e5ce", "#baaa91", "#d57b3c", "#9eaf66"),
} satisfies Record<string, StoryTheme>;

export const PROFILE = {
  name: "Muhammad Taha Bin Zaeem",
  shortName: "Taha",
  role: "Computer Engineer",
  headline:
    "Founder @ Type2Learn & ProGenEDA | Computer Engineering @ NUST | Building AI, Education & Technology Solutions",
  location: "Lahore, Punjab, Pakistan",
  domain: "https://tahabinzaeem.tech",
  email: null,
  intro:
    "I build across the boundary where software becomes signal: processors, assembly systems, engineering tools, AI products, and learning experiences.",
  thesis:
    "The work is the biography. Enter a room, inspect the artifact, and follow the evidence from first circuit to shipped system.",
  currentRoles: [
    "Founder, ProGenEDA",
    "Founder, Type2Learn",
    "B.E. Computer Engineering, NUST",
  ],
  portrait: {
    src: "/media/identity/muhammad-taha-studio-portrait.webp",
    alt: "Studio portrait of Muhammad Taha Bin Zaeem",
    width: 988,
    height: 970,
    objectPosition: "50% 50%",
  },
} as const satisfies Profile;

export const SOCIAL_LINKS = [
  {
    id: "github",
    label: "GitHub",
    kind: "github",
    href: "https://github.com/MuhammadTahaBinZaeem",
    handle: "MuhammadTahaBinZaeem",
    note: "Source, systems, and project history.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    kind: "linkedin",
    href: "https://www.linkedin.com/in/tahabinzaeem/",
    handle: "tahabinzaeem",
    note: "Education, experience, honors, and public project record.",
  },
  {
    id: "lablab",
    label: "lablab.ai",
    kind: "lablab",
    href: "https://lablab.ai/u/%40taha_zaeem65",
    handle: "@taha_zaeem65",
    note: "AI Genesis profile and Debate Club submission history.",
  },
  {
    id: "devpost",
    label: "Devpost",
    kind: "devpost",
    href: "https://devpost.com/MuhammadTahaBinZaeem",
    handle: "MuhammadTahaBinZaeem",
    note: "Public hackathon profile and shipped submission record.",
  },
  {
    id: "type2learn",
    label: "Type2Learn",
    kind: "product",
    href: "https://type2learn.tech",
    handle: "type2learn.tech",
    note: "Accessible active learning built around typing and learner agency.",
  },
  {
    id: "progeneda",
    label: "ProGenEDA",
    kind: "product",
    href: "https://progeneda.app",
    handle: "progeneda.app",
    note: "EDA automation for validated, editable engineering artifacts.",
  },
] as const satisfies readonly SocialLink[];

export const PORTALS = [
  {
    id: "projects",
    index: "01",
    href: "/projects",
    eyebrow: "Eight machines are awake",
    title: "Enter the workshop",
    invitation:
      "Cross from source code into waveforms, terminal traces, sensors, circuits, and systems that can be tested.",
    transition: "A project monitor expands until its pixels become the room.",
    cover: {
      src: "/media/projects/vector-cpu-showcase.webp",
      alt: "Interactive showcase for Muhammad Taha's custom 20-bit vector CPU",
      width: 1600,
      height: 832,
    },
    theme: THEMES.projects,
  },
  {
    id: "certifications",
    index: "02",
    href: "/certifications",
    eyebrow: "Evidence, not decoration",
    title: "Walk the credential archive",
    invitation:
      "Each issuer opens a different place: Duke stone, Stanford cardinal, Google signal, Coursera blue, and lablab copper.",
    transition: "A sealed certificate turns edge-on, opens like a door, and changes the entire scene.",
    cover: {
      src: "/media/certificates/machine-learning-specialization.webp",
      alt: "Machine Learning Specialization certificate issued to Muhammad Taha Bin Zaeem",
      width: 1149,
      height: 888,
    },
    theme: THEMES.certificates,
  },
  {
    id: "achievements",
    index: "03",
    href: "/achievements",
    eyebrow: "Pressure leaves artifacts",
    title: "Step into the hall of proof",
    invitation:
      "Awards, prototypes, teams, and the moments around them form a chronology rather than a trophy grid.",
    transition: "A reflected medal becomes a warm corridor of photographs and suspended evidence.",
    cover: {
      src: "/media/achievements/sempec-award-presentation.webp",
      alt: "Muhammad Taha Bin Zaeem receiving a SEMPEC project award with his team",
      width: 1600,
      height: 1067,
    },
    theme: THEMES.achievements,
  },
  {
    id: "education",
    index: "04",
    href: "/education",
    eyebrow: "Three stations, one trajectory",
    title: "Follow the formation line",
    invitation:
      "Move from early computer science through GCU engineering and student leadership into computer engineering at NUST.",
    transition: "A signal line leaves the control board and becomes a journey through three institutions.",
    cover: {
      src: "/media/achievements/student-society-group.webp",
      alt: "Government College University student science society group",
      width: 1600,
      height: 877,
    },
    theme: THEMES.education,
  },
] as const satisfies readonly Portal[];

export const PROJECTS = [
  {
    id: "vector-cpu",
    index: "01",
    slug: "custom-20-bit-vector-cpu",
    route: "/projects/custom-20-bit-vector-cpu",
    title: "Custom 20-bit Single-Cycle Vector CPU",
    shortTitle: "20-bit Vector CPU",
    association: "National University of Sciences and Technology (NUST)",
    discipline: "Verilog / Computer Architecture",
    logline:
      "A Harvard-architecture processor with a custom 20-bit ISA, scalar execution, and 64-bit SIMD operations across four 16-bit lanes.",
    story:
      "The room follows one instruction through fetch, decode, execute, memory, and write-back. A 9-bit program counter addresses up to 512 instructions while waveforms expose the control flow, register state, and vector-lane behavior.",
    proof: [
      "Single-cycle datapath with separate instruction and data memories.",
      "Scalar and vector arithmetic, logical, memory, branch, and immediate operations.",
      "Repository documents module ownership, integration, testbench verification, and simulation results.",
    ],
    stack: ["Verilog", "Custom ISA", "Harvard architecture", "SIMD", "Xilinx ISE"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project",
      live: null,
      video: null,
      showcase: "https://github.com/MuhammadTahaBinZaeem/Web_CS117",
    },
    media: [
      {
        src: "/media/projects/vector-cpu-showcase.webp",
        alt: "Dark interactive showcase for the custom single-cycle CPU",
        width: 1600,
        height: 832,
      },
      {
        src: "/media/projects/vector-cpu-waveform-simd.webp",
        alt: "SIMD simulation waveform from the custom vector CPU",
        width: 1600,
        height: 834,
      },
      {
        src: "/media/projects/vector-cpu-waveform-scalar.webp",
        alt: "Scalar simulation waveform from the custom CPU",
        width: 1020,
        height: 860,
      },
      {
        src: "/media/projects/vector-cpu-module-tree.webp",
        alt: "Verilog module tree for the custom CPU",
        width: 432,
        height: 602,
      },
    ],
    theme: THEMES.cpu,
  },
  {
    id: "debate-club",
    index: "02",
    slug: "ai-genesis-debate-club",
    route: "/projects/ai-genesis-debate-club",
    title: "AI Genesis Hackathon — Debate Club",
    shortTitle: "Debate Club",
    association: "AI Genesis Hackathon",
    discipline: "Real-time Web / Agentic AI",
    logline:
      "A two-player debate platform combining live rooms, AI topic generation, structured judging, moderation, and cross-session memory.",
    story:
      "Players enter random or private rooms, veto generated topics, receive roles by coin toss, and debate under turn and total timers. A staged judging pipeline reviews the transcript while Qdrant stores arguments for future retrieval.",
    proof: [
      "Flask and Socket.IO backend with a React/Vite client.",
      "Gemini topic generation and judging with deterministic fallbacks.",
      "Moderation, reconnection state, penalties, results, and PDF report export.",
    ],
    stack: ["React", "Vite", "Flask", "Socket.IO", "Gemini", "Qdrant"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/Debate-Club",
      live: "https://debate-club.vercel.app",
      video: null,
      showcase: "https://lablab.ai/ai-hackathons/ai-genesis/vincero/debate-club",
    },
    media: [
      {
        src: "/media/projects/debate-club-dashboard.webp",
        alt: "Debate Club dashboard with room creation, join-by-code, and random matching",
        width: 1162,
        height: 812,
      },
      {
        src: "/media/projects/debate-club-repository.webp",
        alt: "GitHub repository and project overview for Debate Club",
        width: 982,
        height: 682,
      },
    ],
    theme: THEMES.debate,
  },
  {
    id: "autodecomp",
    index: "03",
    slug: "autodecomp",
    route: "/projects/autodecomp",
    title: "AutoDecomp",
    shortTitle: "AutoDecomp",
    association: null,
    discipline: "Reverse Engineering / Automation",
    logline:
      "A Windows terminal workflow that mirrors a source directory and uses Ghidra headless analysis to emit decompiler text for detected native binaries.",
    story:
      "Point the tool at source and destination folders. It preserves the hierarchy, detects PE, ELF, and Mach-O inputs, retains the original filename with a .cpp suffix, isolates temporary projects, records failures, and refuses unsafe memory pressure.",
    proof: [
      "Self-installing Windows launcher and argument-driven batch workflow.",
      "Per-binary timeout, structured failure artifacts, and deterministic output paths.",
      "RAM-aware Ghidra heap sizing preserves an operating-system safety buffer.",
    ],
    stack: ["Python", "Ghidra", "Jython", "PE / ELF / Mach-O", "Windows"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/autodecom",
      live: null,
      video: null,
      showcase: null,
    },
    media: [
      {
        src: "/media/projects/autodecomp-ram-guard.webp",
        alt: "AutoDecomp terminal demonstrating its RAM safety guard",
        width: 1200,
        height: 675,
      },
      {
        src: "/media/projects/autodecomp-self-install.webp",
        alt: "AutoDecomp self-installing terminal workflow",
        width: 1200,
        height: 675,
      },
      {
        src: "/media/projects/autodecomp-batch-workflow.webp",
        alt: "AutoDecomp batch decompilation workflow",
        width: 1200,
        height: 675,
      },
    ],
    theme: THEMES.decompile,
  },
  {
    id: "mips-chess-engine",
    index: "04",
    slug: "mips-chess-engine",
    route: "/projects/mips-chess-engine",
    title: "MIPS Chess Engine",
    shortTitle: "MIPS Chess",
    association: null,
    discipline: "Assembly / Game Systems",
    logline:
      "A complete text-mode chess engine written with basic MIPS instructions and driven through coordinate move input.",
    story:
      "An 8×8 board lives in a 64-byte memory array. Move parsing and validation cover castling, en passant, promotion, check, and checkmate, while a basic opponent plays Black inside SPIM, QtSpim, or MARS.",
    proof: [
      "Complete board representation and legal-move validation.",
      "Special chess rules, check detection, and a functional AI opponent.",
      "A playable terminal session backed by inspectable assembly state.",
    ],
    stack: ["MIPS assembly", "SPIM", "MARS", "Memory layout", "Game logic"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/Mips_Chess_Engine",
      live: null,
      video: null,
      showcase: null,
    },
    media: [
      {
        src: "/media/projects/mips-chess-move-log.webp",
        alt: "Terminal move log from the MIPS chess engine",
        width: 1600,
        height: 1509,
      },
      {
        src: "/media/projects/mips-chess-memory-map.webp",
        alt: "Memory map from the MIPS chess engine",
        width: 800,
        height: 183,
      },
    ],
    theme: THEMES.chess,
  },
  {
    id: "algebraic-expression-solver",
    index: "05",
    slug: "algebraic-expression-solver",
    route: "/projects/algebraic-expression-solver",
    title: "Algebraic Expression Solver",
    shortTitle: "Expression Solver",
    association: "National University of Sciences and Technology (NUST)",
    discipline: "C++ / Symbolic Computation",
    logline:
      "An iterative C++ symbolic solver built like a small compiler: preprocess, lex, normalize, parse, simplify, stabilize, and evaluate.",
    story:
      "Expressions become typed tokens, postfix notation, and an abstract syntax tree before repeated rewrite passes handle powers, roots, trigonometric forms, logarithms, cancellation, compact multiplication, and canonical output.",
    proof: [
      "Compiler-style pipeline using shunting-yard parsing and an AST.",
      "Symbolic simplification remains available alongside numeric evaluation.",
      "The repository documents 21 major refinement waves and generated result artifacts.",
    ],
    stack: ["C++17", "Lexer", "Shunting yard", "AST", "Symbolic rewriting"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/FOP-Project",
      live: null,
      video: null,
      showcase: null,
    },
    media: [
      {
        src: "/media/projects/algebraic-expression-solver-curve-one.webp",
        alt: "First plotted output from the algebraic expression solver",
        width: 1600,
        height: 821,
      },
      {
        src: "/media/projects/algebraic-expression-solver-curve-two.webp",
        alt: "Second plotted output from the algebraic expression solver",
        width: 1600,
        height: 832,
      },
      {
        src: "/media/projects/algebraic-expression-solver-code.webp",
        alt: "Source from the C++ algebraic expression solver",
        width: 1600,
        height: 783,
      },
    ],
    theme: THEMES.algebra,
  },
  {
    id: "arduino-robot-car",
    index: "06",
    slug: "arduino-robot-car",
    route: "/projects/arduino-robot-car",
    title: "Arduino Robot Car — Autonomous & Remote-Controlled",
    shortTitle: "Robot Car",
    association: "National University of Sciences and Technology (NUST)",
    discipline: "Embedded Systems / Robotics",
    logline:
      "A physical Arduino vehicle documented from front, side, and top as an autonomous and remote-controlled engineering build.",
    story:
      "The visual story stays close to the evidence: exposed wiring, sensors, controller, battery pack, chassis, and three real viewpoints that can become a lightweight frame-by-frame orbit.",
    proof: [
      "Completed physical prototype documented from three distinct angles.",
      "LinkedIn records both autonomous and remote-controlled operating modes.",
      "The exposed build makes the hardware architecture inspectable rather than cosmetic.",
    ],
    stack: ["Arduino", "Embedded control", "Sensors", "Motor drive", "Prototype wiring"],
    links: {
      github: "https://github.com/MuhammadTahaBinZaeem/CAR",
      live: null,
      video: null,
      showcase: null,
    },
    media: [
      {
        src: "/media/projects/arduino-robot-car-front.webp",
        alt: "Front view of the Arduino robot car",
        width: 1156,
        height: 521,
      },
      {
        src: "/media/projects/arduino-robot-car-side.webp",
        alt: "Side view of the Arduino robot car",
        width: 1156,
        height: 521,
      },
      {
        src: "/media/projects/arduino-robot-car-top.webp",
        alt: "Top view of the Arduino robot car and exposed electronics",
        width: 1156,
        height: 521,
      },
    ],
    theme: THEMES.robot,
  },
  {
    id: "clap-switch",
    index: "07",
    slug: "clap-switch",
    route: "/projects/clap-switch",
    title: "Sound-Activated Clap Switch",
    shortTitle: "Clap Switch",
    association: "National University of Sciences and Technology (NUST)",
    discipline: "Analog Electronics",
    logline:
      "A sound-triggered momentary switch built around an NE555 timer and transistor switching stages.",
    story:
      "A microphone captures the event, the analog stages condition it, and the timer produces a visible response. The room moves between schematic, idle prototype, and illuminated prototype so cause and effect remain legible.",
    proof: [
      "Circuit schematic preserved with the project archive.",
      "Separate photographs document idle and active states.",
      "The physical prototype exposes every connection on the perfboard.",
    ],
    stack: ["NE555 timer", "Transistor switching", "Microphone input", "LED output"],
    links: { github: null, live: null, video: null, showcase: null },
    media: [
      {
        src: "/media/projects/clap-switch-off.webp",
        alt: "Clap-switch prototype in its idle state",
        width: 720,
        height: 1280,
      },
      {
        src: "/media/projects/clap-switch-on.webp",
        alt: "Clap-switch prototype responding with illuminated LEDs",
        width: 720,
        height: 1280,
      },
      {
        src: "/media/projects/clap-switch-schematic.webp",
        alt: "NE555 clap-switch circuit schematic",
        width: 624,
        height: 262,
      },
    ],
    theme: THEMES.analog,
  },
  {
    id: "water-level-detector",
    index: "08",
    slug: "water-level-detector",
    route: "/projects/water-level-detector",
    title: "Transistor Water-Level Detector",
    shortTitle: "Water-Level Detector",
    association: "National University of Sciences and Technology (NUST)",
    discipline: "Sensors / Discrete Electronics",
    logline:
      "A transistor-based sensing circuit that communicates rising water levels through staged LED indicators.",
    story:
      "The route begins at the probe diagram, then turns the board over to reveal the wiring before returning to the component side. It is a small system, but the signal path remains visible from input threshold to output light.",
    proof: [
      "Archive includes the circuit diagram and both sides of the assembled board.",
      "Multiple transistor stages correspond to visible level indications.",
      "The build demonstrates sensing and communication without hiding the circuitry.",
    ],
    stack: ["Discrete transistors", "Conductive probes", "LED indicators", "Perfboard"],
    links: { github: null, live: null, video: null, showcase: null },
    media: [
      {
        src: "/media/projects/water-level-detector-front.webp",
        alt: "Component side of the transistor water-level detector",
        width: 480,
        height: 853,
      },
      {
        src: "/media/projects/water-level-detector-back.webp",
        alt: "Wiring side of the transistor water-level detector",
        width: 480,
        height: 853,
      },
      {
        src: "/media/projects/water-level-detector-schematic.webp",
        alt: "Transistor water-level detector circuit diagram",
        width: 466,
        height: 466,
      },
    ],
    theme: THEMES.water,
  },
] as const satisfies readonly ProjectStory[];

export const CERTIFICATES = [
  {
    id: "machine-learning-specialization",
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI / Stanford Online",
    issued: "Dec 14, 2025",
    credentialId: "30V81D3V8760",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/specialization/30V81D3V8760",
    documentUrl: "/certificates/machine-learning-specialization.pdf",
    preview: {
      src: "/media/certificates/machine-learning-specialization.webp",
      alt: "Machine Learning Specialization certificate",
      width: 1149,
      height: 888,
    },
    scene: "A cardinal research hall where three course panels resolve into one specialization record.",
    theme: THEMES.stanford,
  },
  {
    id: "advanced-learning-algorithms",
    title: "Advanced Learning Algorithms",
    issuer: "DeepLearning.AI / Stanford Online",
    issued: "Dec 14, 2025",
    credentialId: "8ZHENGWACR32",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/8ZHENGWACR32",
    documentUrl: "/certificates/advanced-learning-algorithms.pdf",
    preview: {
      src: "/media/certificates/advanced-learning-algorithms.webp",
      alt: "Advanced Learning Algorithms certificate",
      width: 1149,
      height: 888,
    },
    scene: "Layers of decision boundaries and network nodes move through a warm Stanford-red room.",
    theme: THEMES.stanford,
  },
  {
    id: "supervised-machine-learning",
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI / Stanford Online",
    issued: "Dec 14, 2025",
    credentialId: "UN6NWCNOP9UZ",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/UN6NWCNOP9UZ",
    documentUrl: "/certificates/supervised-machine-learning-regression-and-classification.pdf",
    preview: {
      src: "/media/certificates/supervised-machine-learning-regression-and-classification.webp",
      alt: "Supervised Machine Learning certificate",
      width: 1149,
      height: 888,
    },
    scene: "Regression lines sweep across cardinal glass before settling into the signed credential.",
    theme: THEMES.stanford,
  },
  {
    id: "unsupervised-learning",
    title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
    issuer: "DeepLearning.AI / Stanford Online",
    issued: "Nov 26, 2025",
    credentialId: "93SD9OFLPMT2",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/93SD9OFLPMT2",
    documentUrl: "/certificates/unsupervised-learning-recommenders-reinforcement-learning.pdf",
    preview: {
      src: "/media/certificates/unsupervised-learning-recommenders-reinforcement-learning.webp",
      alt: "Unsupervised Learning, Recommenders, Reinforcement Learning certificate",
      width: 1149,
      height: 888,
    },
    scene: "Unlabeled points cluster in the dark, then a reward path illuminates the final certificate.",
    theme: THEMES.stanford,
  },
  {
    id: "game-theory",
    title: "Game Theory",
    issuer: "Stanford University / University of British Columbia",
    issued: "Sep 10, 2024",
    credentialId: "SRG23IUFFG8D",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/SRG23IUFFG8D",
    documentUrl: "/certificates/game-theory.pdf",
    preview: {
      src: "/media/certificates/game-theory.webp",
      alt: "Game Theory certificate",
      width: 1149,
      height: 888,
    },
    scene: "A strategy table redraws itself around every choice before the equilibrium becomes still.",
    theme: THEMES.stanford,
  },
  {
    id: "think-again-i",
    title: "Think Again I: How to Understand Arguments",
    issuer: "Duke University",
    issued: "Jul 5, 2026",
    credentialId: "RBP895KPYNTI",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/RBP895KPYNTI",
    documentUrl: "/certificates/think-again-i-how-to-understand-arguments.pdf",
    preview: {
      src: "/media/certificates/think-again-i-how-to-understand-arguments.webp",
      alt: "Think Again I certificate from Duke University",
      width: 1149,
      height: 888,
    },
    scene: "A Duke-blue stone hall turns claims and premises into illuminated architectural lines.",
    theme: THEMES.duke,
  },
  {
    id: "think-again-ii",
    title: "Think Again II: How to Reason Deductively",
    issuer: "Duke University",
    issued: "Jul 5, 2026",
    credentialId: "IAK48NVGGDIK",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/IAK48NVGGDIK",
    documentUrl: "/certificates/think-again-ii-how-to-reason-deductively.pdf",
    preview: {
      src: "/media/certificates/think-again-ii-how-to-reason-deductively.webp",
      alt: "Think Again II certificate from Duke University",
      width: 1149,
      height: 888,
    },
    scene: "Deductive steps lock together like vaulted ribs beneath deep-blue banners.",
    theme: THEMES.duke,
  },
  {
    id: "think-again-iii",
    title: "Think Again III: How to Reason Inductively",
    issuer: "Duke University",
    issued: "Jul 6, 2026",
    credentialId: "CVHZ2B3IRHSK",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/CVHZ2B3IRHSK",
    documentUrl: "/certificates/think-again-iii-how-to-reason-inductively.pdf",
    preview: {
      src: "/media/certificates/think-again-iii-how-to-reason-inductively.webp",
      alt: "Think Again III certificate from Duke University",
      width: 1149,
      height: 888,
    },
    scene: "Individual observations gather like windows until a larger pattern fills the Duke hall.",
    theme: THEMES.duke,
  },
  {
    id: "think-again-iv",
    title: "Think Again IV: How to Avoid Fallacies",
    issuer: "Duke University",
    issued: "Jul 6, 2026",
    credentialId: "CJ59QYVPNE0O",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/CJ59QYVPNE0O",
    documentUrl: "/certificates/think-again-iv-how-to-avoid-fallacies.pdf",
    preview: {
      src: "/media/certificates/think-again-iv-how-to-avoid-fallacies.webp",
      alt: "Think Again IV certificate from Duke University",
      width: 1149,
      height: 888,
    },
    scene: "False paths collapse from the floor, leaving one defensible route to the credential.",
    theme: THEMES.duke,
  },
  {
    id: "foundations-of-cybersecurity",
    title: "Foundations of Cybersecurity",
    issuer: "Google",
    issued: "Jul 5, 2026",
    credentialId: "NCYBMLTJZAUI",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/NCYBMLTJZAUI",
    documentUrl: "/certificates/foundations-of-cybersecurity.pdf",
    preview: {
      src: "/media/certificates/foundations-of-cybersecurity.webp",
      alt: "Foundations of Cybersecurity certificate",
      width: 1149,
      height: 888,
    },
    scene: "A bright security operations floor maps assets, threats, safeguards, and responsibility.",
    theme: THEMES.google,
  },
  {
    id: "play-it-safe",
    title: "Play It Safe: Manage Security Risks",
    issuer: "Google",
    issued: "Jul 5, 2026",
    credentialId: "Q8QZ26AFF1LP",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/Q8QZ26AFF1LP",
    documentUrl: "/certificates/play-it-safe-manage-security-risks.pdf",
    preview: {
      src: "/media/certificates/play-it-safe-manage-security-risks.webp",
      alt: "Play It Safe: Manage Security Risks certificate",
      width: 1149,
      height: 888,
    },
    scene: "Risk tiles change color as controls close the gaps and reveal the signed record.",
    theme: THEMES.google,
  },
  {
    id: "connect-and-protect",
    title: "Connect and Protect: Networks and Network Security",
    issuer: "Google",
    issued: "Jul 5, 2026",
    credentialId: "EZJ85UFOPFBA",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/EZJ85UFOPFBA",
    documentUrl: "/certificates/connect-and-protect-networks-and-network-security.pdf",
    preview: {
      src: "/media/certificates/connect-and-protect-networks-and-network-security.webp",
      alt: "Connect and Protect: Networks and Network Security certificate",
      width: 1149,
      height: 888,
    },
    scene: "Packets travel through a clean network map while guarded routes remain illuminated.",
    theme: THEMES.google,
  },
  {
    id: "wordpress-project",
    title: "Build a Full Website using WordPress",
    issuer: "Coursera Project Network",
    issued: "Aug 19, 2024",
    credentialId: "BZ4JCH0I28PS",
    credentialUrl: "https://www.coursera.org/account/accomplishments/records/BZ4JCH0I28PS",
    documentUrl: "/certificates/build-a-full-website-using-wordpress.pdf",
    preview: {
      src: "/media/certificates/build-a-full-website-using-wordpress.webp",
      alt: "Build a Full Website using WordPress project certificate",
      width: 1149,
      height: 888,
    },
    scene: "A cobalt publishing workshop assembles page blocks around the project certificate.",
    theme: THEMES.coursera,
  },
  {
    id: "ai-genesis-completion",
    title: "AI Genesis — Certificate of Completion",
    issuer: "lablab.ai",
    issued: "Nov 2025",
    credentialId: null,
    credentialUrl: null,
    documentUrl: null,
    preview: {
      src: "/media/achievements/ai-completion-certificate.webp",
      alt: "AI Genesis certificate of completion awarded to Taha Zaeem",
      width: 1130,
      height: 1600,
    },
    scene: "An etched copper star field collapses into the vertical AI Genesis completion certificate.",
    theme: THEMES.lablab,
  },
] as const satisfies readonly Certificate[];

export const ACHIEVEMENTS = [
  {
    id: "matriculation-top-performer",
    kind: "honor",
    title: "Matriculation Top Performer",
    dateLabel: "Matriculation",
    summary:
      "LinkedIn records a top-performer honor at the close of Muhammad Taha's matriculation in Computer Science.",
    evidence: [
      "Listed in the exported LinkedIn Honors record.",
      "Qazi Grammar Boys High School: Matriculation, Computer Science, grade A+.",
    ],
    media: [
      {
        src: "/media/identity/muhammad-taha-medals-portrait.webp",
        alt: "Muhammad Taha Bin Zaeem wearing competition medals",
        width: 1339,
        height: 1069,
      },
    ],
    theme: THEMES.achievements,
  },
  {
    id: "sempec-junior-hardware-runner-up",
    kind: "honor",
    title: "Second Runner-Up — SEMPEC Junior Hardware",
    dateLabel: "During NUST",
    summary:
      "The custom single-cycle CPU was recognized in the Junior Hardware category at the SEMPEC semester project exhibition.",
    evidence: [
      "LinkedIn Honors records the placement and documents the CPU architecture and browser-accessible showcase.",
      "The archive includes the presentation, certificate collection, and award-ceremony photographs.",
    ],
    media: [
      {
        src: "/media/achievements/sempec-award-presentation.webp",
        alt: "Muhammad Taha and teammates at the SEMPEC prize presentation",
        width: 1600,
        height: 1067,
      },
      {
        src: "/media/achievements/project-award-ceremony.webp",
        alt: "SEMPEC project award ceremony",
        width: 1600,
        height: 1200,
      },
    ],
    theme: THEMES.cpu,
  },
  {
    id: "uet-all-pakistan-stem-competition",
    kind: "honor",
    title: "1st All-Pakistan STEM Project Competition",
    dateLabel: "2025",
    summary:
      "Muhammad Taha's record documents participation and recognition at the inaugural 2025 All-Pakistan STEM Project Competition at UET Lahore.",
    evidence: [
      "Listed as a distinct honor in the exported LinkedIn record.",
      "The archive preserves the project judging environment from the competition.",
    ],
    media: [
      {
        src: "/media/achievements/stem-judging-session.webp",
        alt: "Muhammad Taha's project during a STEM judging session",
        width: 1182,
        height: 1331,
      },
    ],
    theme: THEMES.achievements,
  },
  {
    id: "stem-2024-runner-up-photo-story",
    kind: "photo-story",
    title: "The 2024 STEM Runner-Up Table",
    dateLabel: "Mar 13, 2024",
    summary:
      "A separate archive photograph preserves two trophies, a cup, and a PKR 20,000 runner-up cheque from STEM 2024.",
    evidence: [
      "The date, runner-up wording, prize amount, and event year are visible in the photograph.",
    ],
    media: [
      {
        src: "/media/achievements/stem-2024-runner-up-awards.webp",
        alt: "STEM 2024 runner-up trophies and prize cheque",
        width: 1600,
        height: 942,
      },
    ],
    theme: THEMES.achievements,
  },
  {
    id: "meeting-dr-samar-mubarakmand",
    kind: "photo-story",
    title: "Meeting Dr. Samar Mubarakmand",
    dateLabel: "During GCU leadership",
    summary:
      "Muhammad Taha's LinkedIn volunteering record and supplied photograph document the meeting during his student-society leadership at GCU Lahore.",
    evidence: [
      "Vice President, Dr. Samar Mubarakmand Society for Sciences — Sep 2023 to Jan 2025.",
      "The meeting is named in the LinkedIn media record and preserved in the archive.",
    ],
    media: [
      {
        src: "/media/achievements/meeting-dr-samar-mubarakmand.webp",
        alt: "Muhammad Taha Bin Zaeem meeting Dr. Samar Mubarakmand",
        width: 1450,
        height: 1085,
      },
    ],
    theme: THEMES.education,
  },
] as const satisfies readonly Achievement[];

export const EDUCATION = [
  {
    id: "nust",
    institution: "National University of Sciences and Technology (NUST)",
    qualification: "Bachelor of Engineering — Computer Engineering",
    period: "Aug 2025 — Oct 2029",
    grade: null,
    story:
      "Computer engineering becomes the convergence point: architecture, digital logic, electronics, assembly, algorithms, and software tested against physical constraints.",
    activities: [
      "Custom 20-bit scalar and SIMD-style vector CPU",
      "Arduino robot car",
      "Analog sensing and switching projects",
      "C++ symbolic algebra solver",
    ],
    media: [
      {
        src: "/media/achievements/certificates-collection.webp",
        alt: "Engineering competition certificates from Muhammad Taha's NUST work",
        width: 1600,
        height: 1200,
      },
    ],
    theme: THEMES.cpu,
  },
  {
    id: "gcu-lahore",
    institution: "Government College University (GCU), Lahore",
    qualification: "Intermediate — Engineering",
    period: "Sep 2023 — Sep 2025",
    grade: "A",
    story:
      "Engineering study expanded into public presentation and society leadership, including vice-presidential roles in the Dr. Samar Mubarakmand and Dr. Khorana societies.",
    activities: [
      "Vice President, Dr. Samar Mubarakmand Society for Sciences",
      "Vice President, Dr. Khorana Society for Chemistry",
      "Student science events and project competitions",
    ],
    media: [
      {
        src: "/media/achievements/student-society-group.webp",
        alt: "Government College University student science society group",
        width: 1600,
        height: 877,
      },
    ],
    theme: THEMES.education,
  },
  {
    id: "qazi-grammar",
    institution: "Qazi Grammar Boys High School",
    qualification: "Matriculation — Computer Science",
    period: "Apr 2021 — Apr 2023",
    grade: "A+",
    story:
      "The first formal station in the record: computer science, an A+ result, and the top-performer honor that precedes the later engineering work.",
    activities: ["Matriculation Top Performer"],
    media: [],
    theme: THEMES.threshold,
  },
] as const satisfies readonly EducationEntry[];
