/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { BookExperience } from "./components/book-experience";
import { BOOK_WORLDS } from "./book-data";
import { CHAPTERS } from "./dossier-data";
import { IDENTITY_LINKS } from "./seo";
import { PageStructuredData } from "./seo-schema";
import { HOME_INTRO } from "./homepage-data";
import { OrbitalPortrait } from "./components/orbital-portrait";
import { FEATURED } from "./dossier-data";
import { ACHIEVEMENTS, CERTIFICATES } from "./portfolio-data";
import { ProjectsChapter } from "./projects/page";
import { ResearchChapter } from "./research/page";
import { ExperienceChapter } from "./experience/page";
import { EducationChapter } from "./education/page";
import { CertificationsChapter } from "./certifications/page";
import { AchievementsChapter } from "./achievements/page";
import { ConnectChapter } from "./connect/page";
import "./storybook.css";

function Foreword() {
  return (
    <div className="foreword-leaves">
      <section className="foreword-spread">
        <div className="foreword-copy" data-reveal>
          <p className="book-kicker">{HOME_INTRO.kicker}</p>
          <span className="hand-note">{HOME_INTRO.note}</span>
          <h2>{HOME_INTRO.title.map((line, index) => <span key={line}>{index === HOME_INTRO.title.length - 1 ? <em>{line}</em> : line}</span>)}</h2>
          <p>{HOME_INTRO.lead}</p>
          <span className="foreword-signature">{HOME_INTRO.signature}</span>
          <a href="#projects" className="foreword-action">Enter the workshop <span aria-hidden="true">↗</span></a>
        </div>
        <div className="foreword-desk" data-book-drift>
          <OrbitalPortrait images={HOME_INTRO.portraits} />
        </div>
        <div className="foreword-margin">
          <span>COMPUTER ENGINEERING / NUST CEME</span>
          <span>PAKISTAN · FIELD NOTES IN PROGRESS</span>
        </div>
        <p className="foreword-scroll">Let the page move you. <span>↓</span></p>
      </section>
      <section className="foreword-manifesto">
        <div className="foreword-ledger" data-reveal>
          <p className="book-kicker">Ideas become things.</p>
          {[
            { count: FEATURED.length, label: "Flagship projects", href: "#projects" },
            { count: CERTIFICATES.length, label: "Learning records", href: "#certifications" },
            { count: ACHIEVEMENTS.length, label: "Competition & school honors", href: "#achievements" },
          ].map((item) => <a href={item.href} key={item.label}><strong>{String(item.count).padStart(2, "0")}</strong><span>{item.label}</span><i aria-hidden="true">↗</i></a>)}
          <span className="hand-note">Follow the evidence.</span>
        </div>
        <div data-reveal>
          <p className="book-kicker">A note in the margin</p>
          <h2>{HOME_INTRO.manifesto[0]}<br /><em>{HOME_INTRO.manifesto[1]}</em></h2>
          <p>{HOME_INTRO.biography}</p>
          <div className="intro-ventures">{HOME_INTRO.links.map((link) => <a href={link.href} key={link.href}><small>{link.role}</small><strong>{link.label} <span aria-hidden="true">↗</span></strong></a>)}</div>
          <nav className="foreword-profiles" aria-label="Muhammad Taha Bin Zaeem’s official profiles">
            {IDENTITY_LINKS.map((link) => <a key={link.id} href={link.href} rel="me">{link.label} ↗</a>)}
          </nav>
          <p className="hand-note">Field notes in progress.<br />There’s always another question.</p>
        </div>
      </section>
      <section className="foreword-instruction" aria-label="The creative process">
        {HOME_INTRO.process.map((step, index) => <span key={step}><small>{String(index + 1).padStart(2, "0")}</small>{step}</span>)}
      </section>
    </div>
  );
}
function Atlas() {
  return (
    <section className="book-atlas">
      <header className="atlas-heading">
        <p className="book-kicker">The atlas / a few ways into my world</p>
        <h2>
          Which thread
          <br />
          will you <em>pull?</em>
        </h2>
        <p>
          Follow every page, or open a world that catches your curiosity.
          <br />
          The book remembers the way back: just scroll upward.
        </p>
      </header>
      <div className="atlas-leaves">
        {CHAPTERS.map((chapter) => {
          const world = BOOK_WORLDS.find((world) => chapter.href === "/" + world.id);
          if (!world) return null;
          return (
            <a
              className={"atlas-leaf atlas-leaf-" + world.id}
              href={chapter.href}
              key={world.id}
              data-book-leaf
              style={
                {
                  "--leaf-paper": world.paper,
                  "--leaf-ink": world.ink,
                  "--leaf-accent": world.accent,
                } as CSSProperties
              }
            >
              <span className="atlas-leaf-number" aria-hidden="true">
                {chapter.number}
              </span>
              <div className="atlas-leaf-copy">
                <span className="book-kicker">
                  {chapter.label} / {world.title}
                </span>
                <h3>
                  {chapter.title}
                  <em>.</em>
                </h3>
                <p>
                  {world.motif}
                  {/[.!?]$/.test(world.motif) ? "" : "."}
                </p>
                <span className="atlas-invitation">
                  Pull this thread <b aria-hidden="true">↗</b>
                </span>
              </div>
              <figure>
                <img
                  src={"/art/notebook/" + chapter.drawing + ".svg"}
                  width={960}
                  height={760}
                  loading="lazy"
                  alt=""
                />
                <span className="atlas-thread" aria-hidden="true" />
              </figure>
            </a>
          );
        })}
      </div>
    </section>
  );
}
export default function Home() {
  // BOOK_WORLDS controls the order. This registry keeps each chapter attached
  // to its ID when you reorder or remove a world in book-data.ts.
  const chapters = {
    foreword: <Foreword />,
    atlas: <Atlas />,
    projects: <ProjectsChapter embedded />,
    research: <ResearchChapter embedded />,
    experience: <ExperienceChapter embedded />,
    education: <EducationChapter embedded />,
    certifications: <CertificationsChapter embedded />,
    achievements: <AchievementsChapter embedded />,
    connect: <ConnectChapter embedded />,
  };
  return (
    <>
    <PageStructuredData path="/" />
    <BookExperience>
      {BOOK_WORLDS.map((world, index) => (
        <section
          className={"book-world world-" + world.id}
          id={world.id}
          key={world.id}
          data-world={world.id}
          aria-label={world.label}
          style={
            {
              "--paper": world.paper,
              "--ink": world.ink,
              "--accent": world.accent,
            } as CSSProperties
          }
        >
          <div className="book-content">
            {chapters[world.id]}
            <div className="world-last-line">
              <span>
                {index < BOOK_WORLDS.length - 1
                  ? "Next leaf / " + BOOK_WORLDS[index + 1].title
                  : "End of this volume"}
              </span>
              <span>
                {index < BOOK_WORLDS.length - 1
                  ? "Scroll on. Turn the leaf. ↘"
                  : "The next page is ours to write. ↗"}
              </span>
            </div>
          </div>
          <div className="page-turn-shade" aria-hidden="true" />
        </section>
      ))}
    </BookExperience>
    </>
  );
}
