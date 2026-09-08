/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { StoryMotion } from "./components/story-motion";
import { InkDrawing } from "./components/notebook-ui";
import { ScrollNotebook } from "./components/scroll-notebook";
import { CHAPTERS } from "./dossier-data";

export default function Home() {
  return (
    <StoryMotion>
      <main>
        <section className="notebook-hero">
          <div className="hero-meta">
            <span>COMPUTER ENGINEERING / NUST CEME</span>
            <span>PAKISTAN · OPEN NOTEBOOK № 01</span>
          </div>
          <div className="hero-layout">
            <div className="hero-type">
              <span className="hand-note">Curiosity, put to work.</span>
              <h1>
                <span>Muhammad</span>
                <span>
                  Taha <em>Bin Zaeem.</em>
                </span>
              </h1>
              <p>
                I build where <strong>hardware, software,</strong>
                <br className="desktop-break" /> and human curiosity meet.
              </p>
              <div className="hero-actions">
                <Link className="ink-button" href="/projects">
                  Open the work <span>↗</span>
                </Link>
                <Link className="text-link" href="/research">
                  Follow the questions ↗
                </Link>
              </div>
            </div>
            <figure className="hero-sketch">
              <InkDrawing
                name="workbench"
                alt="Original ink-style drawing of an engineer’s desk: circuit monitor, notebook, and pencil"
              />
              <figcaption>
                Fig. 01 — Make it real. Then make it reliable.
              </figcaption>
            </figure>
          </div>
          <div className="hero-footnote">
            <p>
              Founder, <a href="https://progeneda.app">ProGenEDA ↗</a> &{" "}
              <a href="https://type2learn.tech">Type2Learn ↗</a>
              <br />
              Co-creator,{" "}
              <a href="https://github.com/MuhammadTahaBinZaeem/ParetCo">
                ParetoCo ↗
              </a>
            </p>
            <span className="scroll-note">
              A few pages from a work in progress ↓
            </span>
          </div>
        </section>
        <ScrollNotebook />
        <section className="chapter-index page-width" id="chapters">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">
              The contents / choose your own way through
            </p>
            <h2>
              There’s more
              <br />
              <em>between the lines.</em>
            </h2>
          </div>
          <div className="chapter-grid">
            {CHAPTERS.map((ch) => (
              <Link
                className="chapter-entry"
                href={ch.href}
                key={ch.number}
                prefetch={false}
                data-reveal
              >
                <span className="chapter-number">
                  {ch.number} / {ch.label}
                </span>
                <h3>{ch.title}</h3>
                <p>{ch.note}</p>
                <span className="chapter-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="portrait-note page-width" data-reveal>
          <figure data-paper>
            <img
              src="/media/identity/muhammad-taha-studio-portrait.webp"
              width={988}
              height={970}
              alt="Muhammad Taha Bin Zaeem"
              loading="lazy"
              decoding="async"
            />
            <figcaption>A person behind the projects.</figcaption>
          </figure>
          <div>
            <p className="eyebrow">A note from me</p>
            <h2>
              Still asking
              <br />
              <em>“what if?”</em>
            </h2>
            <p>
              I’m a Computer Engineering undergraduate at NUST CEME. My work
              moves between processors, research protocols, AI-assisted
              engineering, and accessible learning.
            </p>
            <p>
              I care about the part after the first impressive demo: the checks,
              the evidence, and the people who actually use what we build.
            </p>
            <Link className="text-link" href="/experience">
              Meet the builder ↗
            </Link>
            <span className="hand-note signature">Taha.</span>
          </div>
        </section>
      </main>
    </StoryMotion>
  );
}
