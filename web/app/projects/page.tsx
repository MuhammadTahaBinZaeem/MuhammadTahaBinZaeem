import type { Metadata } from "next";
import { ProjectsExperience } from "./projects-experience";

export const metadata: Metadata = {
  title: "Projects · The Engine Room",
  description:
    "Eight project worlds by Muhammad Taha Bin Zaeem, spanning Verilog, MIPS assembly, AI, reverse engineering, C++, robotics, and analog electronics.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsExperience />;
}
