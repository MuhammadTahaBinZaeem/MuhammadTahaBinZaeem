import type { Metadata } from "next";
import { PROJECTS } from "../portfolio-data";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { ProjectsExperience } from "./projects-experience";

export const metadata: Metadata = {
  title: "Projects · The Engine Room",
  description:
    "Eight project worlds by Muhammad Taha Bin Zaeem, spanning Verilog, MIPS assembly, AI, reverse engineering, C++, robotics, and analog electronics.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <CollectionStructuredData
        description="Real engineering projects by Muhammad Taha Bin Zaeem: a custom vector CPU, AI debate platform, reverse-engineering workflow, MIPS chess engine, robotics, and analog systems."
        items={PROJECTS.map((project) => ({
          name: project.title,
          description: project.logline,
          url: `${SITE_ORIGIN}/projects#project-${project.id}`,
          type: "SoftwareSourceCode",
          sameAs: [project.links.github, project.links.live, project.links.showcase]
            .flatMap((url) => (url ? [url] : [])),
        }))}
        name="Muhammad Taha Bin Zaeem Engineering Projects"
        path="/projects"
      />
      <ProjectsExperience />
    </>
  );
}
