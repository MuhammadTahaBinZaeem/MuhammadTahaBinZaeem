import type { Metadata } from "next";

/* All editorial images are source-sized, metadata-free WebPs with explicit dimensions. */
/* eslint-disable @next/next/no-img-element */
import { PortalLink, SignalEmblem } from "./components/experience-shell";
import { StoryMotion } from "./components/story-motion";

export const metadata: Metadata = {
  title: "Muhammad Taha Bin Zaeem | Taha Zaeem Computer Engineer Portfolio",
  description:
    "Meet Muhammad Taha Bin Zaeem, also known as Muhammad Taha and Taha Zaeem: a NUST CEME computer engineer and founder building hardware, software, AI, and education products.",
  alternates: { canonical: "/" },
};

const ROOMS = [
  {
    code: "01",
    href: "/projects",
    title: "The Engine Room",
    label: "Projects",
    note: "Processors, assembly, AI systems, products, and circuits — each with its own atmosphere.",
    command: "JAL WORKSHOP",
    color: "#c66a3d",
  },
  {
    code: "02",
    href: "/certifications",
    title: "The Hall of Institutions",
    label: "Certifications",
    note: "Duke stone, Stanford cardinal, Google signal, Coursera blue. Fourteen pieces of inspectable proof.",
    command: "LW PROOF, 14($VAULT)",
    color: "#c59a43",
  },
  {
    code: "03",
    href: "/achievements",
    title: "The Trophy Voltage",
    label: "Achievements",
    note: "Award rooms, competition nights, student leadership, and the moments the work left the screen.",
    command: "BNE EVIDENCE, $ZERO, ENTER",
    color: "#9e3f2d",
  },
  {
    code: "04",
    href: "/education",
    title: "The Foundry",
    label: "Education",
    note: "Three stations in a continuing build: graphite beginnings, crimson heritage, and NUST circuitry.",
    command: "ADDI CURIOSITY, CURIOSITY, 1",
    color: "#73906a",
  },
] as const;

export default function HomePage() {
  return (
    <StoryMotion className="threshold-page">
      <section className="threshold-hero">
        <div className="threshold-hero__grid" aria-hidden="true" />
        <div className="threshold-hero__portrait" data-intro>
          <img
            src="/media/identity/muhammad-taha-studio-portrait.webp"
            srcSet="/media/identity/muhammad-taha-studio-portrait-480.webp 480w, /media/identity/muhammad-taha-studio-portrait-800.webp 800w, /media/identity/muhammad-taha-studio-portrait.webp 988w"
            sizes="(max-width: 760px) 94vw, 49vw"
            alt="Studio portrait of Muhammad Taha Bin Zaeem"
            height="970"
            width="988"
          />
          <span>FIG. 00 / THE BUILDER</span>
        </div>

        <div className="threshold-hero__copy">
          <p className="micro-label" data-intro>
            <span>COMPUTER ENGINEER · NUST CEME</span>
            <span>PAKISTAN · FIELD ACTIVE</span>
          </p>
          <h1 aria-label="Muhammad Taha Bin Zaeem">
            <span data-intro>MUHAMMAD</span>
            <span data-intro>TAHA</span>
            <span data-intro>BIN ZAEEM</span>
          </h1>
          <p className="threshold-hero__thesis" data-intro>
            I build from the uncomfortable edge — where AI must create a real file,
            assembly must hold a world, and an idea must survive the waveform.
          </p>
        </div>

        <SignalEmblem animated className="threshold-hero__signal" />

        <div className="threshold-hero__rail" data-intro>
          <code>0x0000 → IDENTITY</code>
          <i />
          <span>SCROLL / CROSS THE BUS</span>
        </div>
      </section>

      <section className="chosen-sequence">
        <div className="chosen-sequence__pulse" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p className="micro-label" data-reveal>
          00.1 / THE OPERATING PRINCIPLE
        </p>
        <blockquote data-reveal>
          <span>VAGUE IDEAS</span>
          <strong>ARE UNCOMPILED SPECIFICATIONS.</strong>
        </blockquote>
        <div className="chosen-sequence__copy" data-reveal>
          <p>
            Muhammad Taha Bin Zaeem moves between silicon, source code, circuit benches,
            AI pipelines, and learning products without asking those worlds to become simpler.
          </p>
          <p>
            The standard is evidence: an editable project, a passing test, a visible trace,
            a person who can actually use what was built.
          </p>
        </div>
      </section>

      <section className="room-atrium" aria-labelledby="rooms-title">
        <div className="room-atrium__heading" data-reveal>
          <p className="micro-label">00.2 / SELECT A CHAMBER</p>
          <h2 id="rooms-title">THE HOUSE IS NOT A LIST.</h2>
          <p>Every door changes the physics. Enter one; come back different.</p>
        </div>

        <div className="room-grid">
          {ROOMS.map((room) => (
            <PortalLink
              className="room-door"
              href={room.href}
              key={room.href}
              portalLabel={room.label}
              style={{ "--door-color": room.color } as React.CSSProperties}
              data-reveal
            >
              <span className="room-door__code">{room.code}</span>
              <div className="room-door__aperture" aria-hidden="true">
                <i />
                <i />
                <i />
                <b>{room.label.slice(0, 1)}</b>
              </div>
              <div>
                <small>{room.title}</small>
                <h3>{room.label}</h3>
                <p>{room.note}</p>
              </div>
              <code>{room.command}</code>
              <strong>ENTER ROOM ↘</strong>
            </PortalLink>
          ))}
        </div>
      </section>

      <section className="venture-gates" aria-labelledby="ventures-title">
        <div className="venture-gates__intro" data-reveal>
          <p className="micro-label">00.3 / SYSTEMS ALREADY BREATHING</p>
          <h2 id="ventures-title">TWO LIVE SIGNALS.</h2>
          <p>Not concepts. Public products with names, boundaries, and a place to go.</p>
        </div>

        <a
          className="venture-gate venture-gate--progeneda"
          data-reveal
          href="https://progeneda.app"
          rel="noreferrer"
          target="_blank"
        >
          <div className="venture-gate__visual" data-drift>
            <img
              src="/media/ventures/progeneda-live.webp"
              alt="Current ProGenEDA product website"
              width="1440"
              height="900"
              loading="lazy"
            />
          </div>
          <span>FOUNDER · PRODUCT · ENGINEERING</span>
          <h3>ProGenEDA</h3>
          <p>Describe a supported circuit. Leave with an editable native engineering project.</p>
          <strong>OPEN PROGENEDA.APP ↗</strong>
        </a>

        <a
          className="venture-gate venture-gate--type2learn"
          data-reveal
          href="https://type2learn.tech"
          rel="noreferrer"
          target="_blank"
        >
          <div className="venture-gate__visual" data-drift>
            <img
              src="/media/ventures/type2learn-live.webp"
              alt="Current Type2Learn active-learning website"
              width="1440"
              height="900"
              loading="lazy"
            />
          </div>
          <span>FOUNDER · DEVELOPMENT LEAD</span>
          <h3>Type2Learn</h3>
          <p>Accessible active learning where typing is a way to show knowledge, not a speed test.</p>
          <strong>OPEN TYPE2LEARN.TECH ↗</strong>
        </a>
      </section>

      <section className="field-note" aria-labelledby="field-note-title">
        <div className="field-note__visual" data-reveal>
          <img
            src="/media/identity/muhammad-taha-mountain-field-note.webp"
            srcSet="/media/identity/muhammad-taha-mountain-field-note-640.webp 640w, /media/identity/muhammad-taha-mountain-field-note.webp 1058w"
            sizes="(max-width: 760px) 100vw, 52vw"
            alt="Muhammad Taha Bin Zaeem during a mountain field journey"
            height="1086"
            width="1058"
            loading="lazy"
          />
          <span>FIELD IMAGE / 01</span>
        </div>
        <div className="field-note__copy" data-reveal>
          <p className="micro-label">00.4 / OUTSIDE THE LAB</p>
          <h2 id="field-note-title">THE SYSTEM MUST SURVIVE THE TERRAIN.</h2>
          <p>
            Engineering is not only the controlled bench. It is attention under changing
            conditions: observing the whole landscape, carrying constraints with you, and
            returning with a sharper model of the problem.
          </p>
          <dl>
            <div><dt>MODE</dt><dd>FIELD OBSERVATION</dd></div>
            <div><dt>INPUT</dt><dd>UNSCRIPTED CONDITIONS</dd></div>
            <div><dt>OUTPUT</dt><dd>BETTER QUESTIONS</dd></div>
          </dl>
        </div>
        <div className="field-note__contours" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section className="threshold-contact">
        <SignalEmblem className="threshold-contact__mark" />
        <p className="micro-label" data-reveal>00.5 / OPEN CHANNEL</p>
        <h2 data-reveal>BRING THE PROBLEM THAT LOOKS TOO HARD.</h2>
        <div className="threshold-contact__actions" data-reveal>
          <a href="https://www.linkedin.com/in/tahabinzaeem/" rel="me noreferrer" target="_blank">
            OPEN LINKEDIN CHANNEL ↗
          </a>
          <a href="https://github.com/MuhammadTahaBinZaeem" rel="me noreferrer" target="_blank">READ THE SOURCE ↗</a>
          <a href="https://lablab.ai/u/%40taha_zaeem65" rel="me noreferrer" target="_blank">OPEN LABLAB PROFILE ↗</a>
          <a href="https://type2learn.tech" rel="noreferrer" target="_blank">VISIT TYPE2LEARN ↗</a>
          <a href="https://progeneda.app" rel="noreferrer" target="_blank">VISIT PROGENEDA ↗</a>
          <a href="https://devpost.com/MuhammadTahaBinZaeem" rel="me noreferrer" target="_blank">OPEN DEVPOST PROFILE ↗</a>
        </div>
      </section>
    </StoryMotion>
  );
}
