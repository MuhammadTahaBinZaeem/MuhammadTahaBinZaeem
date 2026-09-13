import { PROFILE, SOCIAL_LINKS, CERTIFICATES } from "./portfolio-data";
import { SITE_ORIGIN } from "./site-config";
import { AUTHOR_NAME, IDENTITY_LINKS, NAME_VARIANTS, SEO_PAGES, canonicalUrl, type SeoPath } from "./seo";

type SchemaItem = Readonly<{
  name: string;
  description: string;
  url: string;
  type: string;
  sameAs?: readonly string[];
  issuer?: string;
  image?: string;
}>;

function JsonLd({ value }: { value: unknown }) {
  const json = JSON.stringify(value).replace(/</g, "\\u003c");
  return <script dangerouslySetInnerHTML={{ __html: json }} type="application/ld+json" />;
}

const PERSON_ID = `${SITE_ORIGIN}/#muhammad-taha-bin-zaeem`;
const profileUrls = IDENTITY_LINKS.map((link) => link.href);

export function PortfolioStructuredData() {
  return (
    <JsonLd
      value={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_ORIGIN}/#website`,
            url: SITE_ORIGIN,
            name: "Muhammad Taha Bin Zaeem",
            alternateName: NAME_VARIANTS,
            description:
              "The official portfolio of Muhammad Taha Bin Zaeem, a Computer Engineering undergraduate researching applied AI and building engineering systems.",
            inLanguage: "en-PK",
            publisher: { "@id": PERSON_ID },
          },
          {
            "@type": "Person",
            "@id": PERSON_ID,
            name: PROFILE.name,
            alternateName: NAME_VARIANTS,
            url: SITE_ORIGIN,
            image: `${SITE_ORIGIN}${PROFILE.portrait.src}`,
            jobTitle: "Computer Engineering Undergraduate; Founder",
            description: PROFILE.headline,
            homeLocation: {
              "@type": "Place",
              name: "Lahore, Punjab, Pakistan",
            },
            sameAs: profileUrls,
            mainEntityOfPage: { "@id": `${SITE_ORIGIN}/#webpage` },
            affiliation: {
              "@type": "CollegeOrUniversity",
              name: "National University of Sciences and Technology (NUST) · CEME",
            },
            hasCredential: CERTIFICATES.map((c) => ({
              "@id": `${SITE_ORIGIN}/certifications#certificate-${c.id}`,
            })),
            knowsAbout: [
              "Computer engineering",
              "Verilog",
              "Processor architecture",
              "MIPS assembly",
              "C++",
              "Reverse engineering",
              "Artificial intelligence engineering",
              "Educational technology",
              "Electronics",
              "Robotics",
            ],
            hasOccupation: {
              "@type": "Occupation",
              name: "Software Product Founder",
              occupationLocation: {
                "@type": "Country",
                name: "Pakistan",
              },
            },
          },
          ...SOCIAL_LINKS.filter((link) => link.kind === "product").map((link) => ({
            "@type": "Organization",
            "@id": `${link.href}/#organization`,
            name: link.label,
            url: link.href,
            description: link.note,
            founder: { "@id": PERSON_ID },
          })),
        ],
      }}
    />
  );
}

// One current-page entity per document; embedded book chapters are not new pages.
export function PageStructuredData({ path }: { path: SeoPath }) {
  const page = SEO_PAGES[path];
  const url = canonicalUrl(path);
  const collection = ["/projects", "/research", "/certifications"].includes(path);
  return <JsonLd value={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": path === "/" ? "ProfilePage" : path === "/connect" ? "ContactPage" : collection ? "CollectionPage" : "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        dateModified: page.modified,
        inLanguage: "en-PK",
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": collection ? `${url}#items` : PERSON_ID },
        ...(path === "/" ? {} : { breadcrumb: { "@id": `${url}#breadcrumbs` } }),
      },
      ...(path === "/" ? [] : [{
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: AUTHOR_NAME, item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: page.label, item: url },
        ],
      }]),
    ],
  }} />;
}

export function CollectionStructuredData({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: readonly SchemaItem[];
}) {
  const pageUrl = `${SITE_ORIGIN}${path}`;

  return (
    <JsonLd
      value={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ItemList",
            "@id": `${pageUrl}#items`,
            name,
            description,
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": item.type,
                "@id": item.url,
                name: item.name,
                description: item.description,
                url: item.url,
                ...(item.sameAs?.length ? { sameAs: item.sameAs } : {}),
                ...(item.image ? { image: `${SITE_ORIGIN}${item.image}` } : {}),
                ...(item.type === "EducationalOccupationalCredential"
                  ? {
                    credentialCategory: "Certificate",
                    ...(item.issuer ? { recognizedBy: { "@type": "Organization", name: item.issuer } } : {}),
                  }
                  : { creator: { "@id": PERSON_ID } }),
              },
            })),
          },
        ],
      }}
    />
  );
}
