import type { Metadata } from "next";
import { SOCIAL_LINKS } from "./portfolio-data";
import { SITE_ORIGIN } from "./site-config";

export const AUTHOR_NAME = "Muhammad Taha Bin Zaeem";
export const NAME_VARIANTS = ["Taha Zaeem", "Taha Bin Zaeem", "tahabinzaeem", "MuhammadTahaBinZaeem"];
export const IDENTITY_LINKS = SOCIAL_LINKS.filter((link) => link.kind !== "product");

// Editorial dates: update only when the corresponding page materially changes.
// Never manufacture freshness from the request time or a periodic rebuild.
export const SEO_PAGES = {
  "/": {
    label: "Home",
    title: `${AUTHOR_NAME} | Taha Zaeem — Engineering & Applied AI`,
    description: "Muhammad Taha Bin Zaeem (Taha Zaeem): NUST computer engineering undergraduate, Type2Learn and ProGenEDA founder. Projects, research, credentials and contact.",
    modified: "2026-09-13",
  },
  "/projects": {
    label: "Projects",
    title: `Projects | ${AUTHOR_NAME}`,
    description: "Explore Muhammad Taha Bin Zaeem’s ParetoCo, ProGenEDA, Type2Learn, Pocket Engineer, 20-bit CPU and MIPS chess, with source code and project evidence.",
    modified: "2026-09-13",
  },
  "/research": {
    label: "Research",
    title: `Applied AI Research | ${AUTHOR_NAME}`,
    description: "Muhammad Taha Bin Zaeem’s ongoing research in LLM evaluation, authorial style and EDA change attribution. Read the methods, controls and unpublished status.",
    modified: "2026-09-13",
  },
  "/experience": {
    label: "Experience & community",
    title: `Experience & Community | ${AUTHOR_NAME}`,
    description: "Muhammad Taha Bin Zaeem’s founder work, software internships, project teammates, NUST technical workshops and student-society leadership.",
    modified: "2026-09-13",
  },
  "/education": {
    label: "Education & skills",
    title: `Education & Skills | ${AUTHOR_NAME}`,
    description: "Muhammad Taha Bin Zaeem’s computer engineering studies at NUST CEME, GCU Lahore education, and toolkit spanning software, electronics and applied AI.",
    modified: "2026-09-13",
  },
  "/certifications": {
    label: "Certifications",
    title: `Certifications | ${AUTHOR_NAME}`,
    description: "Muhammad Taha Bin Zaeem’s 14 credentials: machine learning, Duke critical thinking, game theory, cybersecurity and AI. Original certificates and verification.",
    modified: "2026-09-13",
  },
  "/achievements": {
    label: "Achievements",
    title: `Achievements | ${AUTHOR_NAME}`,
    description: "Muhammad Taha Bin Zaeem’s milestones: Type2Learn’s P@SHA 2026 finalist selection, SEMPEC second runner-up, STEM recognition and academic honors, with evidence.",
    modified: "2026-09-13",
  },
  "/connect": {
    label: "Contact, profiles & CVs",
    title: `Contact & CVs | ${AUTHOR_NAME}`,
    description: "Contact Muhammad Taha Bin Zaeem (Taha Zaeem). Official GitHub, LinkedIn, Devpost and lablab.ai profiles, project websites and three downloadable CVs.",
    modified: "2026-09-13",
  },
} as const;

export type SeoPath = keyof typeof SEO_PAGES;
export const canonicalUrl = (path: SeoPath) => new URL(path, SITE_ORIGIN).href;

export function pageMetadata(path: SeoPath): Metadata {
  const page = SEO_PAGES[path];
  const image = {
    url: `${SITE_ORIGIN}/og.png`,
    width: 1200,
    height: 630,
    alt: `${AUTHOR_NAME} — The Engineering Notebook`,
  };
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      type: "website",
      url: canonicalUrl(path),
      siteName: AUTHOR_NAME,
      locale: "en_PK",
      title: page.title,
      description: page.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
