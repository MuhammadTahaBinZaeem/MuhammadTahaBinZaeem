import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/certifications", "/achievements", "/education"];

  return routes.map((route, index) => ({
    url: `${SITE_ORIGIN}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "monthly" : "yearly",
    priority: index === 0 ? 1 : 0.85,
  }));
}
