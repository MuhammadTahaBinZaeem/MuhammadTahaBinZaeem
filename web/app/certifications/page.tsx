/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
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
export const metadata: Metadata = {
  title: "Certifications — The learning record",
  description:
    "Original credentials of Muhammad Taha Bin Zaeem: machine learning, Duke logic and critical thinking, Stanford / UBC game theory, cybersecurity, and AI hackathons.",
  alternates: { canonical: "/certifications" },
};
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
export default function CertificationsPage() {
  return (
    <StoryMotion>
      <main className="page-width">
        <CollectionStructuredData
          name="Muhammad Taha Bin Zaeem credentials"
          description="Original certificates with issuer, date, document and verification links."
          path="/certifications"
          items={CERTIFICATES.map((c) => ({
            name: c.title,
            description: c.issuer + " · " + c.issued,
            url: SITE_ORIGIN + "/certifications#certificate-" + c.id,
            type: "EducationalOccupationalCredential",
          }))}
        />
        <ChapterHeading
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
                    <a
                      href={c.documentUrl || c.preview.src}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={"View original " + c.title}
                    >
                      <img
                        src={c.preview.src}
                        alt={c.preview.alt}
                        width={c.preview.width}
                        height={c.preview.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
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
        <NextChapter href="/achievements" />
      </main>
    </StoryMotion>
  );
}
