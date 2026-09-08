import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/projects",
    "/research",
    "/experience",
    "/certifications",
    "/achievements",
    "/education",
    "/connect",
  ];
  const lastModified = new Date("2026-09-08T00:00:00.000Z");

  return routes.map((route, index) => ({
    url: `${SITE_ORIGIN}${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.85,
  }));
}
