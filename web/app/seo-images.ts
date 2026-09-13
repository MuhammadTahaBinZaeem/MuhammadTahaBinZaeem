import { ACHIEVEMENTS, CERTIFICATES, EDUCATION, PROFILE, PROJECTS } from "./portfolio-data";
import { FEATURED } from "./dossier-data";
import { PROJECT_GALLERIES } from "./project-galleries";
import type { SeoPath } from "./seo";

// Actual displayed evidence, including related images opened in the overlay.
// Sitemap discovery does not preload or download any of these in the browser.
const projects = [
  ...FEATURED.flatMap((project) => "image" in project ? [project.image.src] : []),
  ...PROJECTS.flatMap((project) => project.media.map((image) => image.src)),
  ...Object.values(PROJECT_GALLERIES).flatMap((images) => images.map((image) => image.src)),
];
const certificates = CERTIFICATES.map((certificate) => certificate.preview.src);
const achievements = ACHIEVEMENTS.flatMap((item) => item.media.map((image) => image.src));
const education = EDUCATION.flatMap((item) => item.media.map((image) => image.src));
const portraits = [PROFILE.portrait.src, "/media/identity/muhammad-taha-mountain-field-note.webp"];

export const SEO_IMAGES: Partial<Record<SeoPath, readonly string[]>> = {
  "/": [...portraits, ...projects, ...certificates, ...achievements, ...education],
  "/projects": projects,
  "/certifications": certificates,
  "/achievements": achievements,
  "/education": education,
};
