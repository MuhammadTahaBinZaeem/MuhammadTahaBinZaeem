import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";
import { SEO_PAGES, canonicalUrl, type SeoPath } from "./seo";
import { SEO_IMAGES } from "./seo-images";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(SEO_PAGES) as SeoPath[]).map((path) => ({
    url: canonicalUrl(path),
    lastModified: SEO_PAGES[path].modified,
    images: [...new Set(SEO_IMAGES[path] || [])].map((src) => `${SITE_ORIGIN}${src}`),
  }));
}
