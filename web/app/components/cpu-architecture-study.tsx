import { PROJECTS } from "../portfolio-data";
import { PROJECT_GALLERIES } from "../project-galleries";
import "./cpu-architecture-study.css";

/** The illustration explains the architecture; the gallery owns its evidence. */
export function CPUArchitectureStudy() {
  const project = PROJECTS.find((entry) => entry.id === "vector-cpu");
  if (!project) return null;
  const images = Array.from(new Map([
    ...(PROJECT_GALLERIES[project.id] || []), ...project.media,
  ].map((image) => [image.src, image])).values());
  return (
    <section className="cpu-study" id="cpu-architecture" data-scroll-scene="architecture" aria-labelledby="cpu-study-title">
      <div className="cpu-study__viewport" data-study-viewport>
        <div className="cpu-study__copy">
          <p className="cpu-study__eyebrow"><span /> Inside the architecture / Verilog</p>
          <h2 id="cpu-study-title">One instruction.<br /><em>Four lanes.</em></h2>
          <p className="cpu-study__lead">A custom 20-bit instruction set. Scalar execution. Four 16-bit lanes working across a 64-bit SIMD datapath.</p>
          <div className="cpu-study__equation" aria-label="Four lanes times sixteen bits equals sixty-four bits">
            <strong>4</strong><span>×</span><strong>16</strong><span>=</span><strong>64</strong><small>bits in parallel</small>
          </div>
          <ol className="cpu-study__beats">
            <li><b>01</b><span>Fetch an instruction.</span></li>
            <li><b>02</b><span>Decode the operation.</span></li>
            <li><b>03</b><span>Execute across four lanes.</span></li>
          </ol>
        </div>
        <figure className="cpu-study__diagram">
          <span className="cpu-study__ghost" aria-hidden="true">64</span>
          <svg viewBox="0 0 720 640" role="img" aria-labelledby="cpu-diagram-title cpu-diagram-description">
            <title id="cpu-diagram-title">Four 16-bit lanes in a 64-bit SIMD datapath</title>
            <desc id="cpu-diagram-description">Simplified architectural illustration: a 20-bit instruction is decoded into shared control, then four 16-bit vector lanes contribute to a 64-bit result. Separate scalar execution, memory, branch and integration logic belong to the complete CPU. This drawing is an explanation, not a simulation trace.</desc>
            <g className="cpu-study__guides" aria-hidden="true">
              <path d="M20 270H700M20 530H700M360 0V640M20 20H700V620H20Z" />
              <path d="M35 40H65M50 25V55M655 40H685M670 25V55M35 600H65M50 585V615M655 600H685M670 585V615" />
            </g>
            <g className="cpu-study__traces" fill="none" aria-hidden="true">
              <path data-study-trace="fetch" pathLength="1" d="M360 104V150" />
              <path data-study-trace="dispatch" pathLength="1" d="M360 242V270H180V300M360 270H540V300M360 270V392H180V420M360 392H540V420" />
              <path data-study-trace="result" pathLength="1" d="M180 390V404H110V530H360V558M540 390V404H610V530H360M180 510V530M540 510V530" />
            </g>
            <g transform="translate(250 24)">
              <g data-study-module="fetch" className="cpu-study__module">
                <rect width="220" height="80" rx="3" />
                <text className="cpu-study__module-label" x="20" y="27">INSTRUCTION MEMORY</text>
                <text className="cpu-study__module-value" x="20" y="59">20-bit ISA</text>
                <circle cx="198" cy="23" r="3" />
              </g>
            </g>
            <g transform="translate(250 150)">
              <g data-study-module="decode" className="cpu-study__module">
                <rect width="220" height="92" rx="3" />
                <text className="cpu-study__module-label" x="20" y="28">SHARED CONTROL</text>
                <text className="cpu-study__module-value" x="20" y="61">Decode → execute</text>
              </g>
            </g>
            {[{ x: 70, y: 300 }, { x: 430, y: 300 }, { x: 70, y: 420 }, { x: 430, y: 420 }].map(({ x, y }, index) => (
              <g transform={`translate(${x} ${y})`} key={index}>
                <g data-study-lane={index} className="cpu-study__lane">
                  <rect width="220" height="90" rx="3" />
                  <text className="cpu-study__module-label" x="20" y="28">VECTOR LANE / 0{index + 1}</text>
                  <text className="cpu-study__lane-value" x="20" y="67">16<tspan className="cpu-study__lane-unit" dx="9">BIT</tspan></text>
                  <path d="M161 45h36m-36 9h36m-36 9h36" />
                </g>
              </g>
            ))}
            <g transform="translate(250 558)">
              <g data-study-module="result" className="cpu-study__module cpu-study__module--result">
                <rect width="220" height="64" rx="3" />
                <text className="cpu-study__module-label" x="20" y="25">VECTOR RESULT</text>
                <text className="cpu-study__module-value" x="20" y="51">64 bits / four lanes</text>
              </g>
            </g>
          </svg>
          <figcaption>Simplified architectural illustration · single-cycle CPU, not a cycle-accurate simulation.</figcaption>
        </figure>
        <div className="cpu-study__footer">
          <p><span>My part in the system</span>Branch-condition logic, data memory, immediate extension, lane load/store, core integration and top-level logic.</p>
          <div className="cpu-study__links">
            {images[0] && <a className="cpu-study__evidence" href={images[0].src}
              data-gallery={JSON.stringify({ title: project.title, items: images })}
              data-gallery-src={images[0].src} aria-haspopup="dialog"
              aria-label={`Open ${project.title} evidence gallery · ${images.length} images`}>Inspect the evidence <span aria-hidden="true">↗</span></a>}
            {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer">Read the source <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </div>
    </section>
  );
}
