import { HOME_COVER, HOME_INTRO } from "../homepage-data";
import { GalleryImage } from "./gallery-image";
import "./portfolio-cover.css";

export function PortfolioCover({ ready, reader, onOpen, onToggleReader }: {
  ready: boolean;
  reader: boolean;
  onOpen: () => void;
  onToggleReader: () => void;
}) {
  return (
    <div className="cover-face portfolio-cover">
      <header className="cover-masthead">
        <span className="cover-edition"><b>MT.</b>{HOME_COVER.edition}</span>
        <nav aria-label="Portfolio shortcuts"><a href="#projects">Selected work ↗</a><a href="#connect">Let’s talk ↗</a></nav>
      </header>
      <div className="cover-composition">
        <div className="cover-circuit" data-cover-layer="circuit" aria-hidden="true">
          <svg viewBox="0 0 960 720" fill="none">
            <g className="cover-circuit-grid" stroke="currentColor" strokeWidth=".6">
              {[120, 240, 360, 480, 600, 720, 840].map(x => <path key={x} d={`M${x} 0V720`} />)}
              {[120, 240, 360, 480, 600].map(y => <path key={y} d={`M0 ${y}H960`} />)}
            </g>
            <g className="cover-circuit-paths" stroke="currentColor" strokeWidth="1.2">
              <path d="M0 180h180l80 80h200l85 85h275M80 620h210l110-110h180l80-80h300M320 0v150l80 80v170l-80 80v240M780 0v180l-90 90v250l90 90v110" />
              <path d="M0 400h210l70-70h220M480 720V600l70-70h200l70-70h140" />
              <circle cx="580" cy="360" r="185" /><circle cx="580" cy="360" r="230" strokeDasharray="2 12" />
              <path d="M580 100v36m0 448v36M320 360h36m448 0h36" />
            </g>
            <g fill="currentColor">{[[180,180],[260,260],[210,400],[400,510],[660,430],[780,180],[480,600]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />)}</g>
          </svg>
          <span className="cover-circuit-label">INPUT: CURIOSITY<br />OUTPUT: SOMETHING REAL</span>
        </div>
        <div className="cover-identity" data-cover-layer="name">
          <p className="cover-subtitle">{HOME_COVER.subtitle}</p>
          <h1 id="book-title" aria-label="Muhammad Taha Bin Zaeem"><span>{HOME_COVER.title}</span><em>{HOME_COVER.titleAccent}</em></h1>
          <span className="cover-name-rule" aria-hidden="true" />
        </div>
        {HOME_INTRO.portraits[0] && <figure className="cover-portrait" data-cover-layer="portrait">
          <GalleryImage image={HOME_INTRO.portraits[0]} images={HOME_INTRO.portraits} title="Muhammad Taha Bin Zaeem" eager />
          <figcaption><span>THE HUMAN IN THE LOOP</span><span>01 / THE PORTRAIT ↗</span></figcaption>
        </figure>}
        <div className="cover-intro" data-cover-layer="intro">
          <p>{HOME_COVER.lead}<em>{HOME_COVER.leadAccent}</em></p>
          <span>{HOME_COVER.focus}</span>
        </div>
      </div>
      <button className="cover-open-hit" onClick={onOpen} disabled={!ready} aria-label="Explore Muhammad Taha Bin Zaeem’s portfolio" />
      <footer className="cover-bottom">
        <div className="cover-credit"><p className="cover-author">{HOME_COVER.authorLines.join(" ")}</p><p className="cover-foot">{HOME_COVER.foot}</p></div>
        <div className="cover-invitation"><span className="cover-status" role="status">{HOME_COVER.invitation}<b aria-hidden="true">↗</b></span><p>{HOME_COVER.instructions}</p><button onClick={onToggleReader}>{reader ? HOME_COVER.animatedLabel : HOME_COVER.quietLabel}</button></div>
      </footer>
      <noscript><style>{".cover-invitation,.cover-open-hit{display:none!important}"}</style><div className="cover-static-invitation"><a href="#foreword">Explore the work ↓</a></div></noscript>
    </div>
  );
}
