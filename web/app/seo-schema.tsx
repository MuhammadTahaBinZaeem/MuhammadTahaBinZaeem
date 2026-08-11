import { PROFILE, SOCIAL_LINKS } from "./portfolio-data";
import { SITE_ORIGIN } from "./site-config";

type SchemaItem = Readonly<{
  name: string;
  description: string;
  url: string;
  type: string;
  sameAs?: readonly string[];
}>;

function JsonLd({ value }: { value: unknown }) {
  const json = JSON.stringify(value).replace(/</g, "\\u003c");
  return <script dangerouslySetInnerHTML={{ __html: json }} type="application/ld+json" />;
}

const PERSON_ID = `${SITE_ORIGIN}/#muhammad-taha-bin-zaeem`;
const profileUrls = SOCIAL_LINKS.flatMap((link) => (link.href ? [link.href] : []));

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
            alternateName: ["Taha Zaeem", "Taha Bin Zaeem", "tahabinzaeem"],
            description:
              "The official portfolio of Muhammad Taha Bin Zaeem, a computer engineer building processor, software, AI, electronics, and education systems.",
            inLanguage: "en-PK",
            publisher: { "@id": PERSON_ID },
          },
          {
            "@type": "ProfilePage",
            "@id": `${SITE_ORIGIN}/#profile`,
            url: SITE_ORIGIN,
            name: "Muhammad Taha Bin Zaeem | Computer Engineer Portfolio",
            mainEntity: { "@id": PERSON_ID },
            isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
          },
          {
            "@type": "Person",
            "@id": PERSON_ID,
            name: PROFILE.name,
            alternateName: ["Muhammad Taha", "Taha Zaeem", "Taha Bin Zaeem", "tahabinzaeem"],
            url: SITE_ORIGIN,
            image: `${SITE_ORIGIN}${PROFILE.portrait.src}`,
            jobTitle: "Computer Engineer",
            description: PROFILE.headline,
            homeLocation: {
              "@type": "Place",
              name: "Lahore, Punjab, Pakistan",
            },
            sameAs: profileUrls,
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
              name: "Computer Engineer",
              occupationLocation: {
                "@type": "Country",
                name: "Pakistan",
              },
            },
          },
        ],
      }}
    />
  );
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
            "@type": "CollectionPage",
            "@id": `${pageUrl}#collection`,
            url: pageUrl,
            name,
            description,
            isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
            about: { "@id": PERSON_ID },
            mainEntity: { "@id": `${pageUrl}#items` },
          },
          {
            "@type": "ItemList",
            "@id": `${pageUrl}#items`,
            name,
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
                creator: { "@id": PERSON_ID },
              },
            })),
          },
        ],
      }}
    />
  );
}
