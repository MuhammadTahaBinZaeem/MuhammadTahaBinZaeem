// Names and project relationships are explicitly credited in the linked sources.
// A commit account alone is not treated as a verified real-world identity.
export const COLLABORATORS = [
  {
    name: "Alizay Hasan", profile: "https://github.com/alizay-debug", platform: "GitHub",
    note: "Co-creator of ParetoCo.",
    projects: [{ name: "ParetoCo", href: "/projects#paretoco" }],
    source: "https://github.com/MuhammadTahaBinZaeem/ParetCo#team",
  },
  {
    name: "Lameea Mubashir Khan", profile: "https://github.com/rosseaaq", platform: "GitHub",
    note: "ParetoCo co-creator. On the vector CPU: control logic, instruction handling, and the program-counter path.",
    projects: [{ name: "ParetoCo", href: "/projects#paretoco" }, { name: "20-bit Vector CPU", href: "/projects#project-vector-cpu" }],
    source: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors",
  },
  {
    name: "Idrees Babar", profile: "https://github.com/meidreesbabar-crypto", platform: "GitHub",
    note: "Co-creator of ParetoCo.",
    projects: [{ name: "ParetoCo", href: "/projects#paretoco" }],
    source: "https://github.com/MuhammadTahaBinZaeem/ParetCo#team",
  },
  {
    name: "Tooba Fatima", profile: null, platform: null,
    note: "On the vector CPU: ALU, flags, register files, operand selection, and write-back. Also a Debate Club teammate.",
    projects: [{ name: "20-bit Vector CPU", href: "/projects#project-vector-cpu" }, { name: "Debate Club", href: "/projects#project-debate-club" }],
    source: "https://github.com/MuhammadTahaBinZaeem/CS-117-Project#project-authors",
  },
  {
    name: "Abdullah Ikram", profile: "https://www.linkedin.com/in/abdullah-ikram-", platform: "LinkedIn",
    note: "Debate Club teammate and collaborator on the autonomous, remote-controlled Arduino robot car.",
    projects: [{ name: "Debate Club", href: "/projects#project-debate-club" }, { name: "Robot Car", href: "/projects#project-arduino-robot-car" }],
    source: "https://www.linkedin.com/in/abdullah-ikram-",
  },
] as const;
