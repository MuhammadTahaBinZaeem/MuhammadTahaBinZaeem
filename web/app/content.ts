/**
 * PORTFOLIO CONTENT CONTROL PANEL
 * --------------------------------
 * Replace the values in this file to personalize the entire site.
 * No layout or animation code needs to change.
 */

export const PROFILE = {
  name: "YOUR NAME",
  shortName: "YN",
  role: "COMPUTER ENGINEER",
  specialty: "HARDWARE × SOFTWARE × INTELLIGENCE",
  location: "YOUR CITY // YOUR COUNTRY",
  email: "hello@your-domain.dev",
  availability: "AVAILABLE FOR HARD PROBLEMS",
  headline: "I build where software becomes signal.",
  intro:
    "A computer engineer designing testable systems across silicon, assembly, AI, and the web. I turn ambiguous ideas into artifacts you can run, probe, and ship.",
  statement:
    "The best systems make invisible thinking tangible — as a waveform, a binary, a board, a model, or a product someone can actually use.",
  github: "https://github.com/your-handle",
  linkedin: "https://www.linkedin.com/in/your-handle",
  resume: "/resume.pdf",
} as const;

export const SIGNALS = [
  { value: "06", label: "SYSTEMS SHIPPED" },
  { value: "20b", label: "CUSTOM ISA" },
  { value: "∞", label: "CURIOSITY LOOP" },
] as const;

export const PROJECTS = [
  {
    id: "01",
    title: "ProGenEDA",
    kicker: "AI × ELECTRONIC DESIGN AUTOMATION",
    summary:
      "A natural-language engineering pipeline that turns supported circuit intent into validated, editable native EDA project files.",
    artifact: "PROMPT → CIRCUIT IR → .PDSprj",
    outcome: "Simulator-ready engineering artifacts, not chatbot prose.",
    evidence: [
      { label: "CONSTRAINT", value: "Free-form requests cannot safely mutate native EDA files." },
      { label: "BUILD", value: "Typed circuit IR, deterministic compilation, and validation gates." },
      { label: "PROOF", value: "Editable project output with explicit unsupported-part failures." },
    ],
    stack: ["FastAPI", "CircuitIR", "Proteus", "MongoDB", "Docker"],
    href: "https://github.com/your-handle/progeneda",
    accent: "orange",
    visual: "circuit",
  },
  {
    id: "02",
    title: "MIPS Chess Engine",
    kicker: "ASSEMBLY × GAME SYSTEMS",
    summary:
      "A functional chess engine written in MIPS assembly, with compact board state, legal-move validation, special rules, and a lightweight AI opponent.",
    artifact: "64 SQUARES / 32 REGISTERS / 1 ENGINE",
    outcome: "Assembly stops being theory when it must protect a king.",
    evidence: [
      { label: "CONSTRAINT", value: "Full chess rules inside a small register and memory budget." },
      { label: "BUILD", value: "Compact board state, legal-move routines, and bounded search." },
      { label: "PROOF", value: "A playable engine whose state can be inspected instruction by instruction." },
    ],
    stack: ["MIPS", "SPIM", "Memory Layout", "Search", "Game Logic"],
    href: "https://github.com/your-handle/mips-chess-engine",
    accent: "ivory",
    visual: "chess",
  },
  {
    id: "03",
    title: "20-bit Vector CPU",
    kicker: "VERILOG × COMPUTER ARCHITECTURE",
    summary:
      "A single-cycle CPU with a custom 20-bit instruction set supporting scalar operations and SIMD-style vector execution.",
    artifact: "FETCH → DECODE → EXECUTE → PROVE",
    outcome: "A custom architecture made visible through waveforms and tests.",
    evidence: [
      { label: "CONSTRAINT", value: "Scalar and vector behavior share one compact instruction word." },
      { label: "BUILD", value: "Custom datapath, ALU, register file, controller, and testbench." },
      { label: "PROOF", value: "Instruction traces and waveforms expose every state transition." },
    ],
    stack: ["Verilog", "Custom ISA", "SIMD", "GTKWave", "Digital Logic"],
    href: "https://github.com/your-handle/custom-cpu",
    accent: "lime",
    visual: "pipeline",
  },
  {
    id: "04",
    title: "Project Infinity",
    kicker: "LOCAL-FIRST × CONTEXT SYSTEMS",
    summary:
      "A local-first workspace for searchable project context, explicit approvals, redaction, provider routing, and reproducible AI handoffs.",
    artifact: "CONTEXT + CONSENT + TRACEABILITY",
    outcome: "Memory for AI workflows without surrendering user control.",
    evidence: [
      { label: "CONSTRAINT", value: "Long-running AI work loses context, provenance, and consent." },
      { label: "BUILD", value: "Local context graph, approval gates, redaction, and provider routing." },
      { label: "PROOF", value: "Reproducible handoffs that keep sensitive state on the user’s machine." },
    ],
    stack: ["Electron", "SQLite", "TypeScript", "Local AI", "Security"],
    href: "https://github.com/your-handle/project-infinity",
    accent: "blue",
    visual: "context",
  },
  {
    id: "05",
    title: "AutoDecomp",
    kicker: "REVERSE ENGINEERING × AUTOMATION",
    summary:
      "A repeatable local workflow that maps entire binary directories into structured, readable analysis while preserving their original hierarchy.",
    artifact: "BINARY TREE → TECHNICAL MAP",
    outcome: "Black-box software becomes an inspectable evidence trail.",
    evidence: [
      { label: "CONSTRAINT", value: "Bulk binary analysis usually destroys useful directory context." },
      { label: "BUILD", value: "Type-aware dispatch, deterministic naming, and mirrored output trees." },
      { label: "PROOF", value: "Every generated artifact maps back to its exact original relative path." },
    ],
    stack: ["Python", "Ghidra", "PE/ELF", "Automation", "Static Analysis"],
    href: "https://github.com/your-handle/autodecomp",
    accent: "orange",
    visual: "decompile",
  },
] as const;

export const CAPABILITIES = [
  {
    index: "A",
    title: "Think in silicon",
    description:
      "Digital logic, custom instruction sets, processor architecture, Verilog, waveforms, and the discipline to test the machine beneath the abstraction.",
    code: "10110_00101_11100",
    icon: "/generated/icons/capability-silicon.png",
  },
  {
    index: "B",
    title: "Ship in software",
    description:
      "C/C++, Python, TypeScript, desktop and web systems, local-first data, APIs, deployment, and product experiences built to survive contact with users.",
    code: "0x7F45A0 → RUN",
    icon: "/generated/icons/capability-software.png",
  },
  {
    index: "C",
    title: "Engineer intelligence",
    description:
      "LLM pipelines, validation loops, research provenance, context systems, and AI that produces artifacts instead of merely sounding plausible.",
    code: "LOSS ↓ / EVIDENCE ↑",
    icon: "/generated/icons/capability-intelligence.png",
  },
] as const;

export const EXPERIENCE = [
  {
    period: "20XX — NOW",
    role: "FOUNDER / LEAD ENGINEER",
    organization: "YOUR PRODUCT STUDIO",
    note: "Building products at the seam between engineering automation and human learning.",
  },
  {
    period: "20XX — 20XX",
    role: "SOFTWARE ENGINEERING INTERN",
    organization: "YOUR COMPANY",
    note: "Delivered production code, worked across constraints, and learned how real systems fail.",
  },
  {
    period: "20XX — 20XX",
    role: "B.E. COMPUTER ENGINEERING",
    organization: "YOUR UNIVERSITY",
    note: "Computer architecture, digital systems, electronics, algorithms, and the curiosity to connect them.",
  },
] as const;

export const CREDENTIALS = [
  "MACHINE LEARNING SPECIALIZATION",
  "GAME THEORY",
  "LOGIC & CRITICAL THINKING",
  "YOUR NEXT CREDENTIAL",
] as const;

export const ASSEMBLY_FEED = [
  "LUI   $sp, 0x7FFF",
  "ORI   $a0, $zero, SIGNAL",
  "JAL   COMPILE_IDEA",
  "BNE   $artifact, $zero, SHIP",
  "NOP   // ambiguity removed",
] as const;
