import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
import type { CSSProperties } from "react";
import { CERTIFICATES } from "../portfolio-data";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  ExternalLink,
} from "../components/notebook-ui";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { GalleryImage } from "../components/gallery-image";
export const metadata = pageMetadata("/certifications");
const groups = [
  {
    id: "stanford",
    name: "Stanford Online & DeepLearning.AI",
    color: "#8e342c",
    filter: (s: string) => /learning/.test(s),
  },
  {
    id: "duke",
    name: "Duke University",
    color: "#374e68",
    filter: (s: string) => s.startsWith("think-again"),
  },
  {
    id: "game-theory",
    name: "Stanford University & UBC",
    color: "#74512e",
    filter: (s: string) => s === "game-theory",
  },
  {
    id: "google",
    name: "Google · Cybersecurity",
    color: "#376045",
    filter: (s: string) =>
      [
        "foundations-of-cybersecurity",
        "play-it-safe",
        "connect-and-protect",
      ].includes(s),
  },
  {
    id: "coursera",
    name: "Coursera · Guided project",
    color: "#5b5740",
    filter: (s: string) => s === "wordpress-project",
  },
  {
    id: "lablab",
    name: "lablab.ai · AI Genesis",
    color: "#995235",
    filter: (s: string) => s === "ai-genesis-completion",
  },
];
export function CertificationsChapter({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width">
        {!embedded && <PageStructuredData path="/certifications" />}
        <CollectionStructuredData
          name="Muhammad Taha Bin Zaeem credentials"
          description="Original certificates with issuer, date, document and verification links."
          path="/certifications"
          items={CERTIFICATES.map((c) => ({
            name: c.title,
            description: c.issuer + " · " + c.issued,
            url: SITE_ORIGIN + "/certifications#certificate-" + c.id,
            type: "EducationalOccupationalCredential",
            issuer: c.issuer,
            image: c.preview.src,
            sameAs: c.credentialUrl ? [c.credentialUrl] : [],
          }))}
        />
        <ChapterHeading
          level={embedded ? 2 : 1}
          number="05 / Certifications"
          title="The learning record."
          lead="The concepts, the practice, and the original credentials. Filed by institution, with room to actually read them."
          note="Keep learning. Keep the proof."
        />
        <nav className="section-nav" aria-label="Certificate issuers">
          {groups.map((g) => (
            <a key={g.id} href={"#issuer-" + g.id}>
              {g.id === "game-theory" ? "Game theory" : g.name.split(" · ")[0]}{" "}
              ↓
            </a>
          ))}
        </nav>
        <div className="credential-hero">
          <p>
            Machine learning. Critical thinking. Game theory. A foundation that
            stretches beyond any one tool.
          </p>
          <InkDrawing name="learning" />
        </div>
        {groups.map((g) => (
          <section
            className="credential-group"
            id={"issuer-" + g.id}
            key={g.id}
            style={{ "--group-ink": g.color } as CSSProperties}
          >
            <h2>{g.name}</h2>
            {g.id === "duke" && (
              <div className="credential-summary">
                <h3>
                  Introduction to Logic and Critical Thinking Specialization
                </h3>
                <p>
                  Completed July 2026. Explore the four individual Think Again
                  course certificates below.
                </p>
              </div>
            )}
            <div className="certificate-grid">
              {CERTIFICATES.filter((c) => g.filter(c.id)).map((c) => (
                <article
                  className="certificate-sheet"
                  id={"certificate-" + c.id}
                  key={c.id}
                  data-paper
                >
                  <figure>
                    <GalleryImage image={c.preview} title={g.name}
                      images={CERTIFICATES.filter((entry) => g.filter(entry.id)).map((entry) => ({ ...entry.preview, caption: `${entry.title} · ${entry.issuer} · ${entry.issued}` }))} />
                  </figure>
                  <h3>{c.title}</h3>
                  <p>
                    {c.issuer}
                    <br />
                    {c.issued}
                    {c.credentialId && (
                      <>
                        <br />
                        Credential: {c.credentialId}
                      </>
                    )}
                  </p>
                  <div className="link-row">
                    {c.documentUrl && (
                      <ExternalLink href={c.documentUrl}>
                        Open certificate PDF
                      </ExternalLink>
                    )}
                    {c.credentialUrl && (
                      <ExternalLink href={c.credentialUrl}>
                        Verify credential
                      </ExternalLink>
                    )}
                    {!c.documentUrl && (
                      <ExternalLink href={c.preview.src}>
                        Full-size certificate
                      </ExternalLink>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {!embedded && <NextChapter href="/achievements" />}
      </Frame>
    </StoryMotion>
  );
}

export default function CertificationsPage() {
  return <CertificationsChapter />;
}
