import { pageMetadata } from "../seo";
import { PageStructuredData, CollectionStructuredData } from "../seo-schema";
import type { CSSProperties } from "react";
import { CERTIFICATES, CERTIFICATE_GROUPS } from "../portfolio-data";
import { StoryMotion } from "../components/story-motion";
import { ChapterHeading, NextChapter, ExternalLink } from "../components/notebook-ui";
import { SITE_ORIGIN } from "../site-config";
import { GalleryImage, type GalleryAsset } from "../components/gallery-image";
import "./certifications.css";

export const metadata = pageMetadata("/certifications");

export function CertificationsChapter({ embedded = false }: { embedded?: boolean } = {}) {
  const Frame = embedded ? "div" : "main";
  const collections = CERTIFICATE_GROUPS.map((group) => {
    const records = CERTIFICATES.filter((certificate) => certificate.groupId === group.id);
    const assets: GalleryAsset[] = records.flatMap((certificate) => [
      { ...certificate.preview, caption: `${certificate.title} · ${certificate.issuer} · ${certificate.issued}` },
      ...(certificate.media || []),
    ]);
    const images = Array.from(new Map(assets.map((image) => [image.src, image])).values());
    return { group, records, images };
  }).filter(({ records }) => records.length > 0);
  const recordCount = collections.reduce((total, collection) => total + collection.records.length, 0);
  const documentCount = CERTIFICATES.filter((certificate) => certificate.documentUrl).length;

  return (
    <StoryMotion disabled={embedded}>
      <Frame className="page-width certifications-archive">
        {!embedded && <PageStructuredData path="/certifications" />}
        <CollectionStructuredData
          name="Muhammad Taha Bin Zaeem credentials"
          description="Original certificates with issuer, date, document and verification links."
          path="/certifications"
          items={CERTIFICATES.map((certificate) => ({
            name: certificate.title,
            description: certificate.issuer + " · " + certificate.issued,
            url: SITE_ORIGIN + "/certifications#certificate-" + certificate.id,
            type: "EducationalOccupationalCredential",
            issuer: certificate.issuer,
            image: certificate.preview.src,
            sameAs: certificate.credentialUrl ? [certificate.credentialUrl] : [],
          }))}
        />
        <ChapterHeading
          chapter="certifications"
          level={embedded ? 2 : 1}
          number="05 / Certifications"
          title="The learning record."
          lead="What I study beyond the classroom: machine learning, clear reasoning, strategy, and secure systems. The original records, collected in one place."
          note="Stay curious. Keep the proof."
        />

        <section className="credential-introduction" aria-label="My learning journey">
          <div>
            <p className="eyebrow">Beyond the syllabus / a continuing education</p>
            <h2>Better questions.<br /><em>Stronger foundations.</em></h2>
            <p>I keep returning to three kinds of questions: how a model learns, how an argument holds up, and how a system stays secure. These are the courses and projects I completed while following them.</p>
          </div>
          <dl className="credential-ledger">
            <div><dt>Completed records</dt><dd>{String(recordCount).padStart(2, "0")}</dd></div>
            <div><dt>Issuer collections</dt><dd>{String(collections.length).padStart(2, "0")}</dd></div>
            <div><dt>Original PDFs</dt><dd>{String(documentCount).padStart(2, "0")}</dd></div>
          </dl>
        </section>

        <nav className="credential-collection-nav" aria-label="Certificate issuers">
          {collections.map(({ group, records }, index) => (
            <a key={group.id} href={"#issuer-" + group.id} style={{ "--collection-color": group.color } as CSSProperties}>
              <span className="credential-nav-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{group.navLabel || group.name.split(" · ")[0]}</span>
              <span className="credential-nav-count">{String(records.length).padStart(2, "0")} <i aria-hidden="true">↘</i></span>
            </a>
          ))}
        </nav>

        <div className="credential-collections">
          {collections.map(({ group, records, images }, collectionIndex) => {
            const cover = records[0];
            const gallery = JSON.stringify({ title: group.name, items: images });
            return (
              <section className="credential-group credential-collection" id={"issuer-" + group.id} key={group.id}
                style={{ "--group-ink": group.color, "--collection-color": group.color } as CSSProperties}
                aria-labelledby={"issuer-title-" + group.id}>
                <header className="credential-collection__header">
                  <span className="credential-collection__number" aria-hidden="true">{String(collectionIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="eyebrow">The collection / {records.length} {records.length === 1 ? "completed record" : "completed records"}</p>
                    <h2 id={"issuer-title-" + group.id}>{group.name}</h2>
                  </div>
                  <span className="credential-collection__seal" aria-hidden="true">LEARNING<br />ON RECORD</span>
                </header>

                {group.summary && <div className="credential-collection__note">
                  <span aria-hidden="true">↳</span>
                  <div><h3>{group.summary.title}</h3><p>{group.summary.copy}</p></div>
                </div>}

                <div className="credential-collection__body">
                  <figure className="credential-collection__cover">
                    <div className="credential-collection__mat">
                      <GalleryImage image={cover.preview} images={images} title={group.name} />
                    </div>
                    <figcaption>
                      <span className="eyebrow">From the original archive</span>
                      <strong>{cover.title}</strong>
                      <span>{cover.issued}</span>
                    </figcaption>
                    <a className="credential-collection__gallery-link" href={cover.preview.src}
                      data-gallery={gallery} data-gallery-src={cover.preview.src} aria-haspopup="dialog">
                      <span>{images.length > 1 ? "Explore the collection" : "Read the original certificate"}</span>
                      <span>{String(images.length).padStart(2, "0")} {images.length === 1 ? "image" : "images"} <i aria-hidden="true">↗</i></span>
                    </a>
                  </figure>

                  <div className="credential-collection__records" aria-label={group.name + " individual credentials"}>
                    <div className="credential-records-heading"><span>Individual records</span><span>Open · read · verify</span></div>
                    {records.map((certificate, index) => (
                      <article className="certificate-sheet" id={"certificate-" + certificate.id} key={certificate.id}>
                        <figure className="credential-record__thumbnail">
                          <GalleryImage image={certificate.preview} images={images} title={group.name} />
                        </figure>
                        <div className="credential-record__content">
                          <p className="credential-record__meta"><span>Record {String(index + 1).padStart(2, "0")}</span><span>{certificate.issued}</span></p>
                          <h3><a href={certificate.preview.src} data-gallery={gallery} data-gallery-src={certificate.preview.src}
                            aria-haspopup="dialog" aria-label={"View certificate: " + certificate.title}>{certificate.title}</a></h3>
                          <p className="credential-record__issuer">{certificate.issuer}</p>
                          <div className="link-row">
                            {certificate.documentUrl && <ExternalLink href={certificate.documentUrl}>Certificate PDF</ExternalLink>}
                            {certificate.credentialUrl && <ExternalLink href={certificate.credentialUrl}>Verify credential</ExternalLink>}
                            {!certificate.documentUrl && <a className="text-link" href={certificate.preview.src}
                              data-gallery={gallery} data-gallery-src={certificate.preview.src} aria-haspopup="dialog">Read certificate <span aria-hidden="true">↗</span></a>}
                          </div>
                          {certificate.credentialId && <details className="credential-record__details">
                            <summary>Record details <span aria-hidden="true">+</span></summary>
                            <dl><div><dt>Credential ID</dt><dd>{certificate.credentialId}</dd></div><div><dt>Issued</dt><dd>{certificate.issued}</dd></div></dl>
                          </details>}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
        {!embedded && <NextChapter href="/achievements" />}
      </Frame>
    </StoryMotion>
  );
}

export default function CertificationsPage() {
  return <CertificationsChapter />;
}
