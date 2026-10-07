import { ACHIEVEMENTS, ACHIEVEMENT_SPOTLIGHTS, CERTIFICATES, EDUCATION, PROFILE, PROJECTS, type MediaAsset } from "./portfolio-data";
import { CVS, EXPERIENCE, FEATURED, LEADERSHIP, RESEARCH } from "./dossier-data";
import { COLLABORATORS } from "./collaborators-data";
import { HOME_INTRO } from "./homepage-data";
import { PROJECT_GALLERIES } from "./project-galleries";
import { CHAPTER_ARTWORK, CHAPTER_AUTHOR, type IllustratedChapter } from "./chapter-artwork";
import type { SeoPath } from "./seo";

// Displayed media, including related images opened in the overlay.
// Sitemap discovery does not preload or download any of these in the browser.
function mediaSources(record: object): string[] {
  return "media" in record && Array.isArray(record.media)
    ? (record.media as readonly MediaAsset[]).map((image) => image.src)
    : [];
}
const projects = [
  ...FEATURED.flatMap((project) => project.image ? [project.image.src] : []),
  ...FEATURED.flatMap(mediaSources),
  ...PROJECTS.flatMap((project) => project.media.map((image) => image.src)),
  ...Object.values(PROJECT_GALLERIES).flatMap((images) => images.map((image) => image.src)),
];
const certificates = CERTIFICATES.flatMap((certificate) => [certificate.preview.src, ...mediaSources(certificate)]);
const achievements = [...ACHIEVEMENTS.flatMap(mediaSources), ...ACHIEVEMENT_SPOTLIGHTS.flatMap(mediaSources)];
const education = EDUCATION.flatMap((item) => [...(item.campus ? [item.campus.src] : []), ...mediaSources(item)]);
const research = RESEARCH.flatMap(mediaSources);
const experience = [
  ...[...EXPERIENCE, ...LEADERSHIP].flatMap(mediaSources),
  ...COLLABORATORS.flatMap((person) => [
    ...(person.portrait ? [person.portrait.src] : []),
    ...(person.background ? [person.background.src] : []),
    ...mediaSources(person),
  ]),
];
const connect = CVS.flatMap(mediaSources);
const portraits = [PROFILE.portrait.src, ...HOME_INTRO.portraits.map((image) => image.src)];
function chapterImages(chapter: IllustratedChapter): string[] {
  const artwork = CHAPTER_ARTWORK[chapter];
  return artwork ? [artwork.image.src, ...mediaSources(artwork), CHAPTER_AUTHOR.image.src, ...CHAPTER_AUTHOR.portraits.map((image) => image.src)] : [];
}
const illustratedChapters = (Object.keys(CHAPTER_ARTWORK) as IllustratedChapter[]).flatMap(chapterImages);

export const SEO_IMAGES: Partial<Record<SeoPath, readonly string[]>> = {
  "/": [...portraits, ...illustratedChapters, ...projects, ...certificates, ...achievements, ...education, ...research, ...experience, ...connect],
  "/projects": [...chapterImages("projects"), ...projects],
  "/certifications": [...chapterImages("certifications"), ...certificates],
  "/achievements": [...chapterImages("achievements"), ...achievements],
  "/education": education,
  "/research": [...chapterImages("research"), ...research],
  "/experience": [...chapterImages("experience"), ...experience],
  "/connect": [...chapterImages("connect"), ...connect],
};
