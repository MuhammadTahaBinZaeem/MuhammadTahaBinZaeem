import type { Metadata } from "next";
import Link from "next/link";
import { ALL_LINKS, CVS, DOSSIER, PUBLIC_REPOSITORIES } from "../dossier-data";
import {
  ChapterHeading,
  InkDrawing,
  SectionHeading,
} from "../components/notebook-ui";
import { StoryMotion } from "../components/story-motion";
export const metadata: Metadata = {
  title: "Links, Contact & CVs",
  description:
    "All official profiles, project links, public repositories, contact details, and three downloadable CVs for Muhammad Taha Bin Zaeem.",
  alternates: { canonical: "/connect" },
};
const destinations = [
  ...ALL_LINKS,
  ...PUBLIC_REPOSITORIES.flatMap((r) =>
    r.homepage && /^https?:\/\//.test(r.homepage)
      ? [
          {
            label: r.name + " · website",
            href: r.homepage,
            note: "Website listed in the public GitHub repository.",
          },
        ]
      : [],
  ),
].filter(
  (link, index, all) =>
    link.href && all.findIndex((other) => other.href === link.href) === index,
);
export default function ConnectPage() {
  return (
    <StoryMotion>
      <main className="page-width">
        <ChapterHeading
          number="07 / Links & CVs"
          title="The next conversation."
          lead="Research questions, engineering problems, and people with something worth building. Here is how to find me—and the full record to take with you."
          note="Leave a note."
        />
        <div className="connect-intro">
          <div>
            <h2>Let’s compare notes.</h2>
            <p>For research and engineering collaboration:</p>
            <a className="contact-email" href={"mailto:" + DOSSIER.email}>
              {DOSSIER.email}
            </a>
            <p>
              For Type2Learn:{" "}
              <a href={"mailto:" + DOSSIER.founderEmail}>
                {DOSSIER.founderEmail}
              </a>
            </p>
          </div>
          <InkDrawing
            name="correspondence"
            alt="Pen-and-ink correspondence: an envelope, pencil, and open notebook"
          />
        </div>
        <section id="cvs">
          <SectionHeading
            eyebrow="The original documents / downloadable PDFs"
            title="Three views of the same work."
          />
          <div className="cv-grid">
            {CVS.map((cv) => (
              <article className="cv-card" key={cv.id} data-reveal>
                <p className="eyebrow">
                  {cv.pages} {cv.pages === 1 ? "page" : "pages"} / {cv.date}
                </p>
                <h3>{cv.title}</h3>
                <p>{cv.description}</p>
                <div className="link-row">
                  <a
                    className="text-link"
                    href={cv.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF ↗
                  </a>
                  <a className="text-link" href={cv.href} download>
                    Download ↓
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="links">
          <SectionHeading
            eyebrow="Official destinations / profiles & products"
            title="No link left behind."
          />
          <div className="directory-grid">
            {destinations.map((link) => (
              <a
                className="directory-link"
                key={link.href}
                href={link.href!}
                target={link.href!.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <strong>
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </strong>
                <small>{link.note}</small>
                <small>{link.href!.replace(/^https?:\/\//, "")}</small>
              </a>
            ))}
          </div>
        </section>
        <section>
          <SectionHeading
            eyebrow="The complete source record"
            title="All public repositories."
          />
          <p>
            For descriptions and filters, visit the{" "}
            <Link className="text-link" href="/projects#repositories">
              project index
            </Link>
            . Forks are labeled below.
          </p>
          <div className="directory-grid">
            {PUBLIC_REPOSITORIES.map((repo) => (
              <a
                className="directory-link"
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
              >
                <strong>
                  {repo.name}
                  <span aria-hidden="true">↗</span>
                </strong>
                <small>
                  {repo.fork ? "Fork / upstream-derived" : "Source repository"}{" "}
                  · {repo.language ?? "Mixed / unclassified"}
                </small>
              </a>
            ))}
          </div>
        </section>
        <Link href="/" className="next-chapter">
          <span className="eyebrow">Back to the beginning</span>
          <span>The engineering notebook.</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </main>
    </StoryMotion>
  );
}
