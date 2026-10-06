import { pageMetadata } from "../seo";
import { PageStructuredData } from "../seo-schema";
import type { CSSProperties } from "react";
import { CERTIFICATES, CERTIFICATE_GROUPS } from "../portfolio-data";
import { StoryMotion } from "../components/story-motion";
import {
  ChapterHeading,
  InkDrawing,
  NextChapter,
  ExternalLink,
} from "../components/notebook-ui";
import { CollectionStructuredData } from "../seo-schema";
import { SITE_ORIGIN } from "../site-config";
import { GalleryImage, type GalleryAsset } from "../components/gallery-image";
export const metadata = pageMetadata("/certifications");
const groups = CERTIFICATE_GROUPS;
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
              {g.navLabel || g.name.split(" · ")[0]}{" "}
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
            {g.summary && (
              <div className="credential-summary">
                <h3>
                  {g.summary.title}
                </h3>
                <p>
                  {g.summary.copy}
                </p>
              </div>
            )}
            <div className="certificate-grid">
              {CERTIFICATES.filter((c) => c.groupId === g.id).map((c) => (
                <article
                  className="certificate-sheet"
                  id={"certificate-" + c.id}
                  key={c.id}
                  data-paper
                >
                  <figure>
                    <GalleryImage image={c.preview} title={g.name}
                      images={CERTIFICATES.filter((entry) => entry.groupId === g.id).flatMap((entry) => [
                        { ...entry.preview, caption: `${entry.title} · ${entry.issuer} · ${entry.issued}` },
                        ...((entry as { media?: readonly GalleryAsset[] }).media || []),
                      ])} />
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
