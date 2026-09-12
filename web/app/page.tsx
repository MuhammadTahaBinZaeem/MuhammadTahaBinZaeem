/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { BookExperience } from "./components/book-experience";
import { BOOK_WORLDS } from "./book-data";
import { CHAPTERS } from "./dossier-data";
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
        <div className="foreword-copy">
          <p className="book-kicker">Foreword / Muhammad Taha Bin Zaeem</p>
          <span className="hand-note">Curiosity, put to work.</span>
          <h2>
            A mind
            <br />
            between
            <br />
            <em>worlds.</em>
          </h2>
          <p>
            Hardware. Software. The very human question of <em>what if?</em>
          </p>
          <span className="foreword-signature">Taha.</span>
        </div>
        <figure className="foreword-desk" data-book-drift>
          <img
            src="/art/notebook/workbench.svg"
            width={960}
            height={760}
            alt="Pen-and-ink drawing of a workbench, circuit, pencil and an open notebook"
          />
          <figcaption>
            Fig. 00 — Somewhere between an idea and a working thing.
          </figcaption>
        </figure>
        <div className="foreword-margin">
          <span>COMPUTER ENGINEERING / NUST CEME</span>
          <span>PAKISTAN · FIELD NOTES IN PROGRESS</span>
        </div>
        <p className="foreword-scroll">
          Let the page move you. <span>↓</span>
        </p>
      </section>
      <section className="foreword-manifesto">
        <figure className="book-portrait" data-paper>
          <img
            src="/media/identity/muhammad-taha-studio-portrait.webp"
            width={988}
            height={970}
            alt="Muhammad Taha Bin Zaeem"
            loading="lazy"
          />
          <figcaption>The person behind these pages.</figcaption>
        </figure>
        <div data-reveal>
          <p className="book-kicker">A note in the margin</p>
          <h2>
            Build something.
            <br />
            <em>Then question it.</em>
          </h2>
          <p>
            I’m a Computer Engineering undergraduate at NUST CEME, founder of{" "}
            <a href="https://progeneda.app">ProGenEDA ↗</a> and{" "}
            <a href="https://type2learn.tech">Type2Learn ↗</a>, and co-creator
            of{" "}
            <a href="https://github.com/MuhammadTahaBinZaeem/ParetCo">
              ParetoCo ↗
            </a>
            .
          </p>
          <p>
            My work moves between processors, applied AI, accessible learning,
            and the evidence that makes a system worth trusting.
          </p>
          <p className="hand-note">
            This isn’t a finished story.
            <br />
            That’s the interesting part.
          </p>
        </div>
      </section>
      <section className="foreword-instruction">
        <span>fetch curiosity</span>
        <span>decode possibility</span>
        <span>execute an idea</span>
        <span>repeat.</span>
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
        {CHAPTERS.map((chapter, index) => {
          const world = BOOK_WORLDS[index + 2];
          return (
            <a
              className={"atlas-leaf atlas-leaf-" + world.id}
              href={"#" + world.id}
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
  const chapters = [
    <Foreword key="foreword" />,
    <Atlas key="atlas" />,
    <ProjectsChapter embedded key="projects" />,
    <ResearchChapter embedded key="research" />,
    <ExperienceChapter embedded key="experience" />,
    <EducationChapter embedded key="education" />,
    <CertificationsChapter embedded key="certifications" />,
    <AchievementsChapter embedded key="achievements" />,
    <ConnectChapter embedded key="connect" />,
  ];
  return (
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
            {chapters[index]}
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
  );
}
