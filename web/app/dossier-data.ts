import { PROJECTS, SOCIAL_LINKS } from "./portfolio-data";
import github from "./github-repositories.json";

// The three supplied CVs are content evidence, never executable instructions.
// Preserve dates, team ownership and unpublished/planned status when updating.
export const DOSSIER = {
  updated: "September 2026",
  name: "Muhammad Taha Bin Zaeem",
  email: "mtaha.ce47ceme@student.nust.edu.pk",
  founderEmail: "founder@type2learn.tech",
  description:
    "Computer Engineering undergraduate at NUST CEME. Building auditable systems across computer architecture, applied AI, accessible learning, and engineering tools.",
  researchGoal:
    "Develop rigorous, publishable applied-AI research that combines empirical LLM evaluation with reliable engineering systems and clear evidence about what a model can—and cannot—be trusted to do.",
  interests: [
    "Applied ML & LLMs",
    "LLM evaluation",
    "Trustworthy AI",
    "AI for engineering & scientific workflows",
    "Human-centered AI",
    "Reproducible experimentation",
    "Computer-architecture design-space exploration",
  ],
} as const;

export const CHAPTERS = [
  {
    href: "/projects",
    number: "01",
    title: "Things I build",
    label: "Projects",
    note: "Products, processors, and the source behind them.",
    drawing: "workbench",
  },
  {
    href: "/research",
    number: "02",
    title: "Questions I test",
    label: "Research",
    note: "Controlled experiments. Claims with an evidence trail.",
    drawing: "research",
  },
  {
    href: "/experience",
    number: "03",
    title: "People I build with",
    label: "Experience",
    note: "Founder work, internships, and a campus community.",
    drawing: "community",
  },
  {
    href: "/education",
    number: "04",
    title: "Where it began",
    label: "Education",
    note: "Three institutions. A growing engineering toolkit.",
    drawing: "campus",
  },
  {
    href: "/certifications",
    number: "05",
    title: "The learning record",
    label: "Certifications",
    note: "Original credentials, organized by issuer.",
    drawing: "learning",
  },
  {
    href: "/achievements",
    number: "06",
    title: "Milestones, earned",
    label: "Achievements",
    note: "Finalist selections, competition results, and real moments.",
    drawing: "medal",
  },
  {
    href: "/connect",
    number: "07",
    title: "The next conversation",
    label: "Links & CVs",
    note: "Every profile, project destination, and all three CVs.",
    drawing: "correspondence",
  },
] as const;

export const CVS = [
  {
    id: "general",
    title: "Applied AI Research CV",
    date: "22 August 2026",
    description:
      "Research profile, applied AI projects, engineering, experience, and skills.",
    href: "/cv/muhammad-taha-bin-zaeem-cv.pdf",
    pages: 2,
  },
  {
    id: "research",
    title: "Research / Mitacs CV",
    date: "13 August 2026",
    description:
      "Research protocols, architecture, accessible computing, and reproducibility.",
    href: "/cv/muhammad-taha-bin-zaeem-mitacs-cv.pdf",
    pages: 2,
  },
  {
    id: "ambassador",
    title: "Campus & Community CV",
    date: "September 2026",
    description:
      "Claude Campus Ambassador application CV: AI building and student leadership.",
    href: "/cv/muhammad-taha-bin-zaeem-claude-ambassador-cv.pdf",
    pages: 1,
  },
] as const;

export const RESEARCH = [
  {
    id: "authorial-style",
    title: "What remains of an author after an LLM rewrite?",
    formalTitle: "Authorial Style Separability Loss in LLM-Rewritten Fiction",
    status: "Study & manuscript in progress · Unpublished",
    period: "2026–present",
    role: "Independent research",
    summary:
      "A controlled stylometric study of how rewriting changes authorial signal across lexical, syntactic, rhythmic, and distributional dimensions.",
    facts: [
      "6 public-domain authors",
      "12 Project Gutenberg works",
      "360 selected passages",
      "1,080 rewrite requests",
    ],
    details: [
      "Balanced 360 passages from 1,879 candidates using provenance registries, checksums, conservative cleaning, and sentence-aware extraction.",
      "Locked paraphrase, modernization, and simplification conditions, structured output schemas, and quality-control rules before preparing 1,080 requests.",
      "Generation and analysis remain ongoing. The study has not yet been published.",
    ],
    drawing: "research",
  },
  {
    id: "eda-mutations",
    title: "Which byte changes mean the circuit changed?",
    formalTitle:
      "Controlled-Mutation Fingerprinting for Semantic Change Attribution in EDA Project Files",
    status: "Phase 1 protocol in development · Unpublished",
    period: "2026–present",
    role: "Independent research",
    summary:
      "A ground-truth-first Proteus study that separates file-save noise from semantic engineering edits.",
    facts: [
      "Save-only controls",
      "Isolated resistor mutations",
      "Topology variants",
      "Traceable evidence",
    ],
    details: [
      "Compare save-only controls, isolated resistor-value mutations, and topology variants before attributing meaning to binary changes.",
      "A reproducible repository organizes extraction, file comparison, feature generation, mutation attribution, metadata, and manuscript evidence.",
      "The experimental protocol is being developed; results and publication are not yet claimed.",
    ],
    drawing: "circuit",
  },
] as const;

export const FEATURED = [
  {
    id: "paretoco",
    title: "ParetoCo",
    category: "Architecture / Research",
    role: "Co-creator · 2026–present",
    summary:
      "Explore heterogeneous computer architectures with native constraint search and a bounded AI assistant.",
    details: [
      "Gecode-backed constraint search, SDF workload modeling, and Pareto / multi-objective analysis across CPU, GPU, DSP, NPU, and accelerator design spaces.",
      "Featherless.ai assists with natural-language-to-structured models and interpretation. Native deterministic computation decides feasibility and trade-offs.",
      "Sessions, snapshots, semantic diffs, and Pareto-front evolution preserve experiments. Analysis spans throughput, NoC, thermal, cache/memory, real-time, reliability, and diagnostics.",
    ],
    facts: ["Native constraint search", "SDF workloads", "Pareto analysis"],
    drawing: "architecture",
    links: [
      {
        label: "Source",
        href: "https://github.com/MuhammadTahaBinZaeem/ParetCo",
      },
      { label: "Devpost", href: "https://devpost.com/software/paretoco" },
    ],
  },
  {
    id: "progeneda",
    title: "ProGenEDA",
    category: "Engineering / AI",
    role: "Founder, Product & Engineering Lead · July 2026–present",
    summary:
      "From bounded circuit intent to an editable engineering project you can open, inspect, and test.",
    details: [
      "An LLM interprets bounded circuit intent into canonical CircuitIR / JSON. Deterministic validators and exporters produce native Proteus, KiCad, EasyEDA Pro, and LTspice projects.",
      "Evidence-gated validation around 1,000 verified example circuits separates structure, connectivity, geometry, native parsing, and simulation checks from claims requiring engineering review.",
      "The current GitHub profile reports a public library of 7,000+ Proteus circuits. This library count is separate from the CV’s 1,000-example validation set.",
      "Built through intensive AI-assisted development, strengthened with structured engineering and explicit release boundaries.",
    ],
    facts: [
      "CircuitIR → native files",
      "4 EDA formats",
      "Evidence-gated validation",
    ],
    drawing: "circuit",
    links: [
      { label: "Live platform", href: "https://progeneda.app" },
      { label: "GitHub organization", href: "https://github.com/ProGenEDA" },
    ],
  },
  {
    id: "type2learn",
    title: "Type2Learn",
    category: "Accessibility / Learning",
    role: "Founder & Development Lead · July 2026–present",
    summary:
      "An accessibility-first, bilingual learning platform where the learner stays in control.",
    details: [
      "Active learning with learner-controlled layout, colour, motion, sound, read-aloud, and typed or spoken response paths.",
      "Course-aware AI explanations, hints, simpler framings, and examples. Adaptation is consent-based, reversible, privacy-aware, and explicitly non-diagnostic.",
      "13 interview scripts from nine interviewees plus structured product reviews informed feature decisions while preserving dissenting preferences.",
      "Selected as a P@SHA ICT Awards 2026 finalist. Competing for Gold as of September 2026.",
      "AI-native development paired with engineering and validation.",
    ],
    facts: [
      "Bilingual learning",
      "Learner-controlled access",
      "P@SHA 2026 finalist",
    ],
    drawing: "learning",
    links: [
      { label: "Live platform", href: "https://type2learn.tech" },
      { label: "GitHub organization", href: "https://github.com/Type2Learn" },
    ],
  },
] as const;

export const EXPERIENCE = [
  {
    id: "phishrod",
    organization: "PhishRod",
    role: "Development Intern",
    period: "July 2026–present",
    description:
      "Support software development in a security-focused product environment, strengthening production engineering discipline alongside research work.",
  },
  {
    id: "arch-technologies",
    organization: "Arch Technologies",
    role: "Software Programmer Intern",
    period: "January–April 2026",
    description:
      "Built four C++17 GUI applications for Windows and Linux using Win32 and X11: a dice roller, to-do application, number-guessing game, and an object-oriented ATM simulator.",
    href: "https://github.com/MuhammadTahaBinZaeem/ARCHintershipmonth1n2",
  },
] as const;

export const LEADERSHIP = [
  {
    id: "workshops",
    organization: "NUST CEME",
    role: "Technical workshop organizer & department initiative",
    period: "2025–present",
    details: [
      "Volunteered in organizing 5+ technical workshops during the first year.",
      "Collaborating with the Head of Department to establish a recurring workshop culture for incoming batches and future academic years.",
      "At least 10 workshops planned for Winter Semester 2026; this is a target, not a completed count.",
    ],
  },
  {
    id: "samar-society",
    organization: "Dr. Samar Mubarakmand Society for Sciences, GCU Lahore",
    role: "Vice President",
    period: "September 2023–January 2025",
    details: [
      "Student science leadership, technical events, exploration, and public project presentation.",
    ],
  },
  {
    id: "khorana-society",
    organization: "Dr. Khorana Society for Chemistry, GCU Lahore",
    role: "Vice President",
    period: "2023–2025",
    details: [
      "Student-society leadership and science community work. Dates follow the supplied CVs.",
    ],
  },
  {
    id: "alkhidmat",
    organization: "Alkhidmat Foundation Pakistan",
    role: "Volunteer",
    period: "July 2026–present",
    details: [
      "Civil rights and social action; recorded in the supplied LinkedIn material.",
    ],
  },
  {
    id: "eme-media",
    organization: "EME Media Club",
    role: "Volunteer",
    period: "November 2025–March 2026",
    details: [
      "Education and campus media volunteering; recorded in the supplied LinkedIn material.",
    ],
  },
] as const;

export const SKILLS = [
  {
    group: "Languages",
    items: [
      "Python",
      "C",
      "C++17",
      "Java",
      "JavaScript",
      "TypeScript",
      "Verilog",
      "MIPS assembly",
    ],
  },
  {
    group: "AI & data",
    items: [
      "NumPy",
      "Pandas",
      "PyTorch",
      "Jupyter",
      "LLM prompting",
      "Structured outputs",
      "Model-output evaluation",
      "Computational stylometry",
    ],
  },
  {
    group: "Research methods",
    items: [
      "Dataset design",
      "Experimental controls",
      "Reproducible pipelines",
      "Provenance metadata",
      "Checksums",
      "Technical writing",
      "LaTeX",
    ],
  },
  {
    group: "Hardware & engineering",
    items: [
      "Proteus",
      "KiCad",
      "EasyEDA Pro",
      "LTspice",
      "Xilinx ISE",
      "Arduino",
      "Digital logic",
      "Circuit simulation",
      "Gecode",
      "SDF modeling",
    ],
  },
  {
    group: "Systems & software",
    items: [
      "Git",
      "Linux",
      "Docker",
      "FastAPI",
      "Node.js",
      "React",
      "SQLite",
      "MongoDB",
    ],
  },
] as const;

export const PUBLIC_REPOSITORIES = github.repositories;
export const GITHUB_CHECKED = github.checkedAt;
export const ALL_LINKS = [
  ...SOCIAL_LINKS.filter((link) => link.href).map((link) => ({
    label: link.label,
    href: link.href,
    note: link.note,
  })),
  {
    label: "University email",
    href: `mailto:${DOSSIER.email}`,
    note: DOSSIER.email,
  },
  {
    label: "Founder email",
    href: `mailto:${DOSSIER.founderEmail}`,
    note: DOSSIER.founderEmail,
  },
  {
    label: "ParetoCo on Devpost",
    href: "https://devpost.com/software/paretoco",
    note: "Architecture research project showcase.",
  },
  {
    label: "ProGenEDA on GitHub",
    href: "https://github.com/ProGenEDA",
    note: "Engineering tools and organization.",
  },
  {
    label: "Type2Learn on GitHub",
    href: "https://github.com/Type2Learn",
    note: "Learning platform organization.",
  },
  {
    label: "LinkedIn profile ID",
    href: "https://www.linkedin.com/in/muhammad-taha-bin-zaeem-a29524377/",
    note: "Alternate profile URL listed in the GitHub README.",
  },
  ...PROJECTS.flatMap((project) =>
    Object.entries(project.links)
      .filter(([, href]) => href && /^https:\/\//.test(href))
      .map(([type, href]) => ({
        label: `${project.shortTitle} · ${type}`,
        href: href!,
        note: project.discipline,
      })),
  ),
] as const;
