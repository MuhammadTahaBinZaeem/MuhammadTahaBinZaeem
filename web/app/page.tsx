"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ASSEMBLY_FEED,
  CAPABILITIES,
  CREDENTIALS,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SIGNALS,
} from "./content";

const NAVIGATION = [
  { id: "work", label: "Selected work", index: "01" },
  { id: "stack", label: "Capability stack", index: "02" },
  { id: "timeline", label: "Timeline", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
] as const;

const BOOT_LINES = [
  "READ 0x0000F // identity.map",
  "LOAD 0x7F45A // machine-core.glb",
  "LINK hardware.o + software.o",
  "VERIFY signal integrity ........ OK",
  "JUMP portfolio.entry",
] as const;

const MachineCanvas = dynamic(
  () => import("./MachineCanvas").then((module) => module.MachineCanvas),
  {
    ssr: false,
    loading: () => null,
  },
);

function MachineFallback() {
  return (
    <div className="machine-fallback">
      <Image
        src="/generated/meshy-core-preview-hd.webp"
        alt="Meshy-generated futuristic machine core"
        width={1254}
        height={1254}
        sizes="(max-width: 780px) 88vw, 520px"
        priority
        unoptimized
      />
    </div>
  );
}

class MachineErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CircuitBlueprint() {
  return (
    <svg
      className="project-blueprint project-blueprint--circuit"
      viewBox="0 0 1200 500"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id="rough-circuit" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="17" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.7" />
        </filter>
        <marker id="circuit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="var(--project-accent)" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="blueprint-ghost" aria-hidden="true">
        <path d="M26 72 C210 48 330 88 503 54 S861 52 1172 78" />
        <path d="M31 432 C274 457 410 419 605 444 S945 457 1169 421" />
        <circle cx="603" cy="250" r="203" />
        <circle cx="603" cy="250" r="184" />
      </g>

      <g className="blueprint-sketch" filter="url(#rough-circuit)">
        <path className="blueprint-flow" d="M312 253 C354 246 385 221 432 224" markerEnd="url(#circuit-arrow)" />
        <path className="blueprint-flow blueprint-flow--echo" d="M312 262 C356 254 389 230 432 232" />
        <path className="blueprint-flow" d="M748 226 C803 217 823 235 866 230" markerEnd="url(#circuit-arrow)" />
        <path className="blueprint-flow blueprint-flow--echo" d="M748 237 C801 229 828 246 867 241" />

        <g transform="rotate(-2 190 250)">
          <rect x="61" y="132" width="252" height="235" rx="19" />
          <path d="M82 179 H289" />
          <path d="M88 286 C110 231 128 333 151 270 S194 221 215 281 S254 319 285 242" />
          <path d="M89 314 H278 M89 329 H244 M89 344 H264" className="blueprint-faint" />
          <circle cx="90" cy="157" r="5" /><circle cx="108" cy="157" r="5" /><circle cx="126" cy="157" r="5" />
        </g>

        <g transform="rotate(1 594 247)">
          <rect x="452" y="112" width="292" height="276" rx="24" />
          <rect x="492" y="150" width="212" height="198" rx="13" />
          <path d="M475 131 V105 M510 131 V101 M545 131 V105 M580 131 V101 M615 131 V105 M650 131 V101 M685 131 V105 M720 131 V101" />
          <path d="M475 369 V396 M510 369 V400 M545 369 V396 M580 369 V400 M615 369 V396 M650 369 V400 M685 369 V396 M720 369 V400" />
          <path d="M434 151 H462 M430 185 H462 M434 219 H462 M430 253 H462 M434 287 H462 M430 321 H462 M434 355 H462" />
          <path d="M734 151 H762 M734 185 H766 M734 219 H762 M734 253 H766 M734 287 H762 M734 321 H766 M734 355 H762" />
          <path d="M518 185 H678 M518 218 H646 M518 251 H677 M518 284 H621 M518 317 H659" className="blueprint-faint" />
          <circle cx="548" cy="185" r="8" /><circle cx="648" cy="218" r="8" /><circle cx="608" cy="251" r="8" /><circle cx="623" cy="284" r="8" /><circle cx="660" cy="317" r="8" />
        </g>

        <g transform="rotate(2.5 996 250)">
          <rect x="865" y="77" width="276" height="344" rx="22" />
          <circle cx="896" cy="108" r="8" /><circle cx="1110" cy="108" r="8" /><circle cx="896" cy="390" r="8" /><circle cx="1110" cy="390" r="8" />
          <rect x="943" y="174" width="114" height="126" rx="10" />
          <path d="M890 145 H936 Q953 145 953 162 V174 M1051 174 V150 Q1051 133 1068 133 H1113" />
          <path d="M890 332 H934 Q950 332 950 316 V300 M1056 300 V323 Q1056 340 1073 340 H1113" />
          <path d="M889 210 H924 Q941 210 941 227 V245 H943 M1057 231 H1082 V196 Q1082 181 1098 181 H1114" />
          <path d="M889 277 H914 Q929 277 929 262 V248 M1057 268 H1078 Q1094 268 1094 284 V307 H1115" />
          <circle cx="922" cy="145" r="6" /><circle cx="1083" cy="133" r="6" /><circle cx="914" cy="332" r="6" /><circle cx="1093" cy="340" r="6" />
          <path d="M965 196 H1036 M965 220 H1022 M965 244 H1038 M965 268 H1013" className="blueprint-faint" />
        </g>

        <g className="blueprint-doodle">
          <path d="M329 133 H347 L354 122 L364 144 L374 122 L384 144 L394 122 L404 144 L412 133 H429" />
          <path d="M797 153 H817 M817 139 V167 M824 139 V167 M824 153 H849" />
          <path d="M803 331 V350 M789 350 H817 M794 358 H812 M800 366 H806" />
          <path d="M401 352 C420 367 434 377 458 381" />
          <circle cx="430" cy="376" r="21" />
          <path d="M419 376 L427 384 L443 366" />
        </g>

        <path className="blueprint-note-line" d="M171 113 C167 90 181 76 206 66" />
        <path className="blueprint-note-line" d="M590 405 C592 431 611 444 639 450" />
        <path className="blueprint-note-line" d="M1010 62 C1034 45 1060 43 1091 48" />
        <path className="blueprint-pencil" d="M47 405 C177 397 280 420 385 407 S598 397 709 414 S934 409 1151 399" />
      </g>

      <g className="blueprint-labels">
        <text x="78" y="112" className="blueprint-micro">01 / HUMAN INTENT</text>
        <text x="84" y="164" className="blueprint-title">PROMPT</text>
        <text x="101" y="217" className="blueprint-hand">“make the signal</text>
        <text x="101" y="241" className="blueprint-hand">hold for 3 seconds”</text>
        <text x="481" y="91" className="blueprint-micro">02 / TYPED INTERMEDIATE</text>
        <text x="528" y="177" className="blueprint-title">CIRCUIT IR</text>
        <text x="534" y="214" className="blueprint-code">NODE  R1  10kΩ</text>
        <text x="534" y="247" className="blueprint-code">EDGE  Q1 → LED</text>
        <text x="534" y="280" className="blueprint-code">RULE  VCC = 5V</text>
        <text x="534" y="313" className="blueprint-code">CHECK ERC  ✓</text>
        <text x="887" y="59" className="blueprint-micro">03 / NATIVE ARTIFACT</text>
        <text x="913" y="129" className="blueprint-title">EDA BOARD</text>
        <text x="964" y="327" className="blueprint-code">EDITABLE</text>
        <text x="952" y="353" className="blueprint-code">TESTABLE</text>
        <text x="934" y="379" className="blueprint-code">SIMULATOR-READY</text>
        <text x="206" y="59" className="blueprint-hand blueprint-hand--accent">ambiguous on purpose</text>
        <text x="645" y="463" className="blueprint-hand blueprint-hand--accent">validation lives here</text>
        <text x="1095" y="49" textAnchor="end" className="blueprint-hand blueprint-hand--accent">proof, not prose</text>
        <text x="330" y="111" className="blueprint-code blueprint-code--pencil">R4 / NO GUESSWORK</text>
        <text x="791" y="127" className="blueprint-code blueprint-code--pencil">D1 / ONE-WAY</text>
        <text x="775" y="389" className="blueprint-code blueprint-code--pencil">GROUND / KNOWN STATE</text>
      </g>
    </svg>
  );
}

function ChessMemoryBlueprint() {
  return (
    <svg
      className="project-blueprint project-blueprint--chess"
      viewBox="0 0 1200 500"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id="rough-chess" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="31" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.45" />
        </filter>
        <marker id="chess-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--project-accent)" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="blueprint-ghost">
        <path d="M24 82 C189 41 332 73 474 46 S798 69 1177 43" />
        <path d="M19 438 C233 462 397 427 591 453 S945 422 1181 449" />
        <path d="M339 40 V463 M755 33 V468" />
      </g>

      <g className="blueprint-sketch blueprint-sketch--chess" filter="url(#rough-chess)">
        <g transform="rotate(-1.5 172 252)">
          <rect x="43" y="75" width="264" height="350" rx="18" />
          <path d="M65 122 H285" />
          {[
            ["0x00", "BOARD[0..7]", "A7 F2 00 1C"],
            ["0x20", "TURN", "WHITE"],
            ["0x24", "CASTLE", "KQ--"],
            ["0x28", "EN_PASSANT", "NULL"],
            ["0x2C", "DEPTH", "04"],
            ["0x30", "BEST_MOVE", "e2 → e4"],
          ].map(([address, label, value], index) => (
            <g key={address} transform={`translate(0 ${index * 43})`}>
              <path d="M64 155 H286" className="blueprint-faint" />
              <text x="68" y="145" className="blueprint-svg-code blueprint-svg-code--accent">{address}</text>
              <text x="119" y="145" className="blueprint-svg-code">{label}</text>
              <text x="278" y="145" textAnchor="end" className="blueprint-svg-code blueprint-svg-code--faint">{value}</text>
            </g>
          ))}
        </g>

        <path className="blueprint-flow" d="M307 252 C339 236 352 219 382 211" markerEnd="url(#chess-arrow)" />

        <g transform="rotate(-3 565 249)">
          <rect x="391" y="75" width="352" height="352" rx="8" className="chess-board-frame" />
          {Array.from({ length: 64 }, (_, index) => {
            const column = index % 8;
            const row = Math.floor(index / 8);
            return (
              <rect
                key={index}
                x={399 + column * 42}
                y={83 + row * 42}
                width="42"
                height="42"
                className={(row + column) % 2 === 0 ? "chess-square chess-square--light" : "chess-square chess-square--dark"}
              />
            );
          })}
          <path d="M399 419 H735 M399 83 V419" className="chess-board-axis" />
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => (
            <text key={file} x={418 + index * 42} y="413" textAnchor="middle" className="chess-coordinate">{file}</text>
          ))}
          {["8", "7", "6", "5", "4", "3", "2", "1"].map((rank, index) => (
            <text key={rank} x="404" y={101 + index * 42} className="chess-coordinate">{rank}</text>
          ))}

          <g className="chess-piece chess-piece--king" transform="translate(516 204)">
            <path d="M20 0 V16 M11 7 H29 M14 21 C5 30 8 44 20 48 C32 44 35 30 26 21 Z M8 53 H32 L37 69 H3 Z" />
          </g>
          <g className="chess-piece chess-piece--knight" transform="translate(642 120)">
            <path d="M8 66 H38 M12 58 H35 C33 45 35 32 27 24 C37 18 31 4 19 2 C12 12 4 17 2 31 L14 27 C21 34 16 46 12 58 Z M22 13 L29 17" />
          </g>
          <g className="chess-piece chess-piece--pawn" transform="translate(474 288)">
            <circle cx="20" cy="13" r="10" /><path d="M13 24 C14 36 10 45 5 52 H35 C30 45 26 36 27 24 Z M3 58 H37 L40 69 H0 Z" />
          </g>

          <path className="chess-candidate" d="M494 318 C530 301 558 281 579 251" markerEnd="url(#chess-arrow)" />
          <path className="chess-candidate chess-candidate--alt" d="M667 153 C646 183 620 202 584 225" markerEnd="url(#chess-arrow)" />
          <circle cx="579" cy="251" r="28" className="chess-target" />
        </g>

        <path className="blueprint-flow" d="M747 245 C773 240 785 222 809 211" markerEnd="url(#chess-arrow)" />

        <g className="chess-tree">
          <circle cx="834" cy="210" r="18" />
          <path d="M851 201 L910 137 M851 219 L910 283" />
          <circle cx="925" cy="125" r="15" /><circle cx="925" cy="294" r="15" />
          <path d="M940 119 L1000 83 M940 130 L1000 166 M940 286 L1000 247 M940 300 L1000 339" />
          <circle cx="1014" cy="75" r="13" /><circle cx="1014" cy="174" r="13" />
          <circle cx="1014" cy="239" r="13" /><circle cx="1014" cy="347" r="13" />
          <path d="M1027 75 H1114 M1027 174 H1084 M1027 239 H1131 M1027 347 H1097" className="blueprint-faint" />
          <path d="M1098 59 C1128 66 1142 87 1132 114" className="blueprint-note-line" />
        </g>

        <path className="blueprint-note-line" d="M537 65 C552 47 583 39 613 47" />
        <path className="blueprint-note-line" d="M675 416 C702 442 728 449 759 438" />
        <path className="blueprint-pencil" d="M40 455 C230 441 350 464 523 448 S877 463 1160 439" />
      </g>

      <g className="blueprint-labels">
        <text x="60" y="57" className="blueprint-micro">01 / MEMORY MAP</text>
        <text x="68" y="108" className="blueprint-title">REGISTER STATE</text>
        <text x="402" y="57" className="blueprint-micro">02 / LEGAL POSITION</text>
        <text x="814" y="57" className="blueprint-micro">03 / BOUNDED SEARCH</text>
        <text x="790" y="111" className="blueprint-title">MOVE TREE</text>
        <text x="1050" y="79" className="blueprint-svg-code blueprint-svg-code--score">+2.4</text>
        <text x="1050" y="178" className="blueprint-svg-code blueprint-svg-code--score">+0.8</text>
        <text x="1050" y="243" className="blueprint-svg-code blueprint-svg-code--score">−1.1</text>
        <text x="1050" y="351" className="blueprint-svg-code blueprint-svg-code--score">MATE?</text>
        <text x="1115" y="130" textAnchor="end" className="blueprint-hand blueprint-hand--accent">prune this branch</text>
        <text x="542" y="39" className="blueprint-hand blueprint-hand--accent">every bit must mean something</text>
        <text x="755" y="458" textAnchor="end" className="blueprint-hand blueprint-hand--accent">king safety lives here</text>
        <text x="63" y="449" className="blueprint-hand blueprint-hand--accent">no heap. no excuses.</text>
        <text x="1088" y="410" textAnchor="end" className="blueprint-code blueprint-code--pencil">64 SQUARES / 32 REGISTERS / ONE DECISION</text>
      </g>
    </svg>
  );
}

function CpuDatapathBlueprint() {
  return (
    <svg
      className="project-blueprint project-blueprint--cpu"
      viewBox="0 0 1200 500"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id="rough-cpu" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="2" seed="47" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.55" />
        </filter>
        <marker id="cpu-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--project-accent)" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="blueprint-ghost">
        <path d="M23 48 H1178 M24 163 H1177 M25 447 H1178" />
        <path d="M61 31 V468 M1140 31 V468" />
        <circle cx="601" cy="309" r="207" /><circle cx="601" cy="309" r="190" />
      </g>

      <g className="blueprint-sketch blueprint-sketch--cpu" filter="url(#rough-cpu)">
        <g transform="rotate(-0.5 600 112)">
          <rect x="69" y="69" width="1062" height="82" rx="13" className="cpu-word" />
          <rect x="82" y="82" width="204" height="56" rx="5" className="cpu-field cpu-field--op" />
          <rect x="286" y="82" width="204" height="56" rx="5" className="cpu-field" />
          <rect x="490" y="82" width="204" height="56" rx="5" className="cpu-field cpu-field--rs" />
          <rect x="694" y="82" width="424" height="56" rx="5" className="cpu-field" />
          <path d="M286 70 V150 M490 70 V150 M694 70 V150" />
        </g>

        <g className="cpu-datapath">
          <rect x="73" y="231" width="112" height="112" rx="12" />
          <path d="M98 257 H158 M98 279 H144 M98 301 H158 M98 323 H132" className="blueprint-faint" />
          <path className="cpu-bus" d="M185 287 H231" markerEnd="url(#cpu-arrow)" />

          <rect x="232" y="205" width="142" height="164" rx="15" />
          <path d="M256 235 H348 M256 262 H324 M256 289 H348 M256 316 H335 M256 343 H348" className="blueprint-faint" />
          <path className="cpu-bus" d="M374 287 H421" markerEnd="url(#cpu-arrow)" />

          <path d="M422 219 L497 219 L528 287 L497 355 L422 355 Z" className="cpu-decoder" />
          <path d="M451 248 H488 M451 270 H500 M451 292 H491 M451 314 H478" className="blueprint-faint" />
          <path className="cpu-bus" d="M528 274 C559 258 574 231 598 215" markerEnd="url(#cpu-arrow)" />
          <path className="cpu-bus" d="M528 301 C560 316 574 344 598 359" markerEnd="url(#cpu-arrow)" />

          <path d="M598 178 H731 L764 231 L731 284 H598 L631 231 Z" className="cpu-alu" />
          <path d="M598 323 H731 L764 376 L731 429 H598 L631 376 Z" className="cpu-alu cpu-alu--vector" />
          <path d="M654 203 L683 231 L654 259 M689 203 L718 231 L689 259" className="blueprint-faint" />
          <path d="M637 349 H730 M637 367 H730 M637 385 H730 M637 403 H730" className="cpu-lanes" />

          <path className="cpu-bus" d="M764 231 H806" markerEnd="url(#cpu-arrow)" />
          <path className="cpu-bus" d="M764 376 C786 366 793 337 806 320" markerEnd="url(#cpu-arrow)" />
          <rect x="807" y="201" width="132" height="171" rx="15" />
          <path d="M833 231 H913 M833 258 H901 M833 285 H913 M833 312 H893 M833 339 H913" className="blueprint-faint" />

          <path className="cpu-bus" d="M939 287 H977" markerEnd="url(#cpu-arrow)" />
          <rect x="978" y="199" width="157" height="175" rx="15" />
          <path className="cpu-wave" d="M994 307 H1011 V267 H1030 V325 H1050 V240 H1071 V292 H1092 V258 H1119" />
          <path d="M995 334 H1118 M995 348 H1088" className="blueprint-faint" />

          <path className="cpu-feedback" d="M871 373 C858 421 511 461 300 397 C250 382 229 354 231 332" markerEnd="url(#cpu-arrow)" />
          <path className="cpu-feedback cpu-feedback--echo" d="M883 373 C870 437 514 477 287 409" />
        </g>

        <g className="cpu-clock">
          <path d="M75 419 H110 V397 H145 V419 H180 V397 H215 V419 H250 V397 H285 V419 H320 V397 H355" />
          <path d="M75 430 H355" className="blueprint-faint" />
        </g>

        <path className="blueprint-note-line" d="M738 71 C760 51 793 46 824 55" />
        <path className="blueprint-note-line" d="M1084 376 C1108 389 1121 407 1116 431" />
        <path className="blueprint-note-line" d="M570 421 C555 449 527 458 496 450" />
      </g>

      <g className="blueprint-labels">
        <text x="70" y="39" className="blueprint-micro">CUSTOM WORD // 20 BITS</text>
        <text x="101" y="102" className="blueprint-title">OPCODE</text>
        <text x="160" y="127" textAnchor="middle" className="blueprint-code">[19:16]</text>
        <text x="325" y="102" className="blueprint-title">DEST</text>
        <text x="388" y="127" textAnchor="middle" className="blueprint-code">[15:12]</text>
        <text x="533" y="102" className="blueprint-title">SOURCE</text>
        <text x="592" y="127" textAnchor="middle" className="blueprint-code">[11:8]</text>
        <text x="835" y="102" className="blueprint-title">IMMEDIATE / VECTOR MASK</text>
        <text x="906" y="127" textAnchor="middle" className="blueprint-code">[7:0]</text>

        <text x="92" y="220" className="blueprint-micro">00 / PC</text>
        <text x="93" y="277" className="blueprint-title">FETCH</text>
        <text x="258" y="193" className="blueprint-micro">01 / IMEM</text>
        <text x="252" y="286" className="blueprint-title">DECODE</text>
        <text x="424" y="206" className="blueprint-micro">02 / CONTROL</text>
        <text x="435" y="288" className="blueprint-title">ROUTE</text>
        <text x="616" y="167" className="blueprint-micro">03A / SCALAR</text>
        <text x="648" y="238" className="blueprint-title">ALU</text>
        <text x="616" y="312" className="blueprint-micro">03B / SIMD × 4</text>
        <text x="641" y="382" className="blueprint-title">LANES</text>
        <text x="822" y="190" className="blueprint-micro">04 / REGFILE</text>
        <text x="830" y="286" className="blueprint-title">WRITE</text>
        <text x="993" y="188" className="blueprint-micro">05 / TESTBENCH</text>
        <text x="996" y="232" className="blueprint-title">PROVE</text>

        <text x="817" y="45" textAnchor="end" className="blueprint-hand blueprint-hand--accent">same word, two modes</text>
        <text x="1120" y="414" textAnchor="end" className="blueprint-hand blueprint-hand--accent">waveform is the witness</text>
        <text x="504" y="468" textAnchor="end" className="blueprint-hand blueprint-hand--accent">write back what you can explain</text>
        <text x="78" y="390" className="blueprint-code blueprint-code--pencil">CLK / ONE CYCLE / NO HIDING</text>
      </g>
    </svg>
  );
}

function ContextConsentBlueprint() {
  return (
    <svg
      className="project-blueprint project-blueprint--context"
      viewBox="0 0 1200 500"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id="rough-context" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="63" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.65" />
        </filter>
        <marker id="context-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--project-accent)" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="blueprint-ghost">
        <path d="M26 63 C223 36 356 64 532 43 S881 61 1172 39" />
        <path d="M23 438 C197 463 362 431 542 451 S903 435 1176 460" />
        <path d="M365 26 V469 M745 27 V468" />
        <circle cx="579" cy="251" r="214" /><circle cx="579" cy="251" r="198" />
      </g>

      <g className="blueprint-sketch blueprint-sketch--context" filter="url(#rough-context)">
        <g transform="rotate(-1.5 191 250)">
          <path d="M56 109 H152 L177 82 H327 Q345 82 345 101 V401 Q345 420 326 420 H56 Q38 420 38 401 V128 Q38 109 56 109 Z" className="context-vault" />
          <rect x="69" y="147" width="247" height="226" rx="13" />
          <path d="M89 184 H294 M89 226 H294 M89 268 H294 M89 310 H294 M89 352 H294" className="blueprint-faint" />
          <circle cx="91" cy="168" r="5" /><circle cx="109" cy="168" r="5" /><circle cx="127" cy="168" r="5" />
          <path d="M105 207 H231 M105 249 H276 M105 291 H213 M105 333 H257" />
          <path d="M246 201 H292 V217 H246 Z M224 243 H292 V259 H224 Z M257 285 H292 V301 H257 Z M237 327 H292 V343 H237 Z" className="context-redaction" />
        </g>

        <path className="context-bus" d="M345 253 H409" markerEnd="url(#context-arrow)" />
        <path className="context-bus context-bus--echo" d="M345 264 H409" />

        <g className="context-gate">
          <rect x="410" y="91" width="323" height="326" rx="26" />
          <circle cx="571" cy="251" r="104" />
          <circle cx="571" cy="251" r="82" className="context-gate__inner" />
          <path d="M571 169 V333 M489 251 H653" className="blueprint-faint" />
          <path d="M529 277 C541 239 561 216 601 198" className="context-switch" />
          <circle cx="529" cy="277" r="15" /><circle cx="601" cy="198" r="18" />
          <path d="M615 206 L646 229 L631 248" className="context-switch__spark" />
          <rect x="510" y="216" width="126" height="58" rx="9" className="context-consent-plate" />
          <path d="M439 123 H492 M650 123 H704 M439 386 H498 M645 386 H704" className="blueprint-faint" />
          <path d="M466 141 V181 M676 141 V181 M466 320 V368 M676 320 V368" />
        </g>

        <path className="context-bus" d="M734 252 H787" markerEnd="url(#context-arrow)" />

        <g className="context-routing">
          <rect x="789" y="70" width="363" height="350" rx="22" />
          <circle cx="852" cy="244" r="28" className="context-node context-node--source" />
          <circle cx="962" cy="137" r="24" className="context-node" />
          <circle cx="1081" cy="185" r="24" className="context-node" />
          <circle cx="976" cy="283" r="24" className="context-node" />
          <circle cx="1081" cy="349" r="24" className="context-node" />
          <path d="M879 235 C907 210 930 166 940 148 M878 248 C923 252 943 266 956 279 M984 143 C1021 139 1047 158 1061 176 M998 286 C1038 293 1055 322 1067 337" />
          <path d="M879 256 C923 321 979 364 1058 352" className="context-route--alt" />
          <path d="M821 386 H1121 M821 397 H1088" className="blueprint-faint" />
          <path d="M817 104 H915 M817 119 H886" className="blueprint-faint" />
          <circle cx="818" cy="391" r="4" /><circle cx="1130" cy="391" r="4" />
        </g>

        <g className="context-receipt">
          <path d="M780 435 C847 415 919 423 982 442 S1094 459 1154 440" />
          <path d="M796 449 C858 434 916 441 975 457" className="blueprint-faint" />
        </g>

        <path className="blueprint-note-line" d="M182 77 C192 48 221 38 248 45" />
        <path className="blueprint-note-line" d="M576 428 C585 452 610 463 641 456" />
        <path className="blueprint-note-line" d="M1016 65 C1035 39 1066 35 1092 46" />
      </g>

      <g className="blueprint-labels">
        <text x="46" y="58" className="blueprint-micro">01 / LOCAL STORAGE</text>
        <text x="71" y="137" className="blueprint-title">CONTEXT VAULT</text>
        <text x="104" y="211" className="blueprint-code">notes.md</text>
        <text x="104" y="253" className="blueprint-code">decisions.log</text>
        <text x="104" y="295" className="blueprint-code">secrets.env</text>
        <text x="104" y="337" className="blueprint-code">handoff.json</text>

        <text x="431" y="69" className="blueprint-micro">02 / HUMAN CHECKPOINT</text>
        <text x="455" y="124" className="blueprint-title">CONSENT GATE</text>
        <text x="573" y="236" textAnchor="middle" className="blueprint-code">USER / 0x01</text>
        <text x="573" y="261" textAnchor="middle" className="blueprint-title">APPROVES</text>
        <text x="571" y="298" textAnchor="middle" className="blueprint-code">ALLOW ONCE →</text>

        <text x="807" y="50" className="blueprint-micro">03 / EXPLICIT ROUTING</text>
        <text x="810" y="93" className="blueprint-title">PROVIDER MAP</text>
        <text x="852" y="249" textAnchor="middle" className="blueprint-code">LOCAL</text>
        <text x="962" y="142" textAnchor="middle" className="blueprint-code">REDACT</text>
        <text x="1081" y="190" textAnchor="middle" className="blueprint-code">MODEL A</text>
        <text x="976" y="288" textAnchor="middle" className="blueprint-code">TRACE</text>
        <text x="1081" y="354" textAnchor="middle" className="blueprint-code">MODEL B</text>
        <text x="820" y="379" className="blueprint-code blueprint-code--pencil">RECEIPT  0x7F45A  /  REDACTED  /  REPLAYABLE</text>

        <text x="246" y="39" textAnchor="end" className="blueprint-hand blueprint-hand--accent">raw stays here</text>
        <text x="638" y="470" textAnchor="end" className="blueprint-hand blueprint-hand--accent">the switch belongs to the user</text>
        <text x="1091" y="38" textAnchor="end" className="blueprint-hand blueprint-hand--accent">no silent provider hop</text>
        <text x="1127" y="409" textAnchor="end" className="blueprint-hand blueprint-hand--accent">nothing leaves without a receipt</text>
      </g>
    </svg>
  );
}

function DecompileForensicsBlueprint() {
  return (
    <svg
      className="project-blueprint project-blueprint--decompile"
      viewBox="0 0 1200 500"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id="rough-decompile" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="79" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.7" />
        </filter>
        <marker id="decompile-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--project-accent)" strokeWidth="1.4" />
        </marker>
      </defs>

      <g className="blueprint-ghost">
        <path d="M24 55 H1177 M23 444 H1176" />
        <path d="M348 28 V469 M828 28 V469" />
        <path d="M29 421 C215 455 382 420 552 448 S886 430 1171 453" />
        <circle cx="593" cy="252" r="207" /><circle cx="593" cy="252" r="190" />
      </g>

      <g className="blueprint-sketch blueprint-sketch--decompile" filter="url(#rough-decompile)">
        <g transform="rotate(-1.2 180 251)">
          <path d="M47 105 H128 L151 79 H316 Q331 79 331 95 V411 Q331 425 316 425 H47 Q32 425 32 410 V120 Q32 105 47 105 Z" className="decompile-tree" />
          <path d="M70 148 V369 M70 165 H104 M70 224 H104 M70 283 H104 M70 342 H104" />
          <rect x="103" y="137" width="196" height="48" rx="8" />
          <rect x="103" y="196" width="196" height="48" rx="8" />
          <rect x="103" y="255" width="196" height="48" rx="8" />
          <rect x="103" y="314" width="196" height="48" rx="8" />
          <path d="M118 154 H152 V168 H118 Z M118 213 H152 V227 H118 Z M118 272 H152 V286 H118 Z M118 331 H152 V345 H118 Z" className="decompile-binary" />
          <circle cx="70" cy="165" r="5" /><circle cx="70" cy="224" r="5" /><circle cx="70" cy="283" r="5" /><circle cx="70" cy="342" r="5" />
        </g>

        <path className="decompile-map decompile-map--one" d="M331 165 C374 149 397 143 431 156" markerEnd="url(#decompile-arrow)" />
        <path className="decompile-map decompile-map--two" d="M331 224 C373 211 394 205 431 215" markerEnd="url(#decompile-arrow)" />
        <path className="decompile-map decompile-map--three" d="M331 283 C373 276 397 273 431 281" markerEnd="url(#decompile-arrow)" />
        <path className="decompile-map decompile-map--four" d="M331 342 C373 343 398 338 431 349" markerEnd="url(#decompile-arrow)" />

        <g className="decompile-workbench">
          <rect x="432" y="70" width="365" height="358" rx="22" />
          <path d="M455 118 H774 M455 374 H774" />
          <path d="M510 118 V374" className="blueprint-faint" />
          {[
            ["1000", "55 48 89 E5", "push rbp"],
            ["1004", "48 83 EC 20", "sub rsp, 0x20"],
            ["1008", "E8 91 02 00", "call route_packet"],
            ["100C", "85 C0 75 0A", "test eax, eax"],
            ["1010", "48 8B 45 F8", "mov rax, [rbp-8]"],
            ["1014", "C9 C3", "leave / ret"],
          ].map(([address, bytes, op], index) => (
            <g key={address} transform={`translate(0 ${index * 39})`}>
              <text x="456" y="151" className="blueprint-svg-code blueprint-svg-code--accent">{address}</text>
              <text x="522" y="151" className="blueprint-svg-code blueprint-svg-code--faint">{bytes}</text>
              <text x="650" y="151" className="blueprint-svg-code">{op}</text>
              <path d="M455 162 H774" className="blueprint-faint" />
            </g>
          ))}

          <circle cx="626" cy="252" r="91" className="decompile-lens" />
          <circle cx="626" cy="252" r="74" className="decompile-lens decompile-lens--inner" />
          <path d="M690 316 L758 385" className="decompile-lens__handle" />
          <path d="M581 241 C596 216 613 204 638 197 M577 263 C603 244 628 237 664 242 M590 286 C617 278 642 282 668 299" className="decompile-control-flow" />
          <circle cx="580" cy="241" r="7" /><circle cx="638" cy="197" r="7" /><circle cx="577" cy="263" r="7" /><circle cx="664" cy="242" r="7" /><circle cx="590" cy="286" r="7" /><circle cx="668" cy="299" r="7" />
        </g>

        <path className="decompile-map" d="M797 169 C835 154 848 146 873 142" markerEnd="url(#decompile-arrow)" />
        <path className="decompile-map" d="M797 246 C835 236 848 229 873 226" markerEnd="url(#decompile-arrow)" />
        <path className="decompile-map" d="M797 330 C837 327 851 317 873 311" markerEnd="url(#decompile-arrow)" />

        <g transform="rotate(1.4 1010 251)" className="decompile-output">
          <path d="M891 98 H969 L991 76 H1149 Q1164 76 1164 91 V414 Q1164 428 1149 428 H891 Q876 428 876 413 V113 Q876 98 891 98 Z" />
          <path d="M910 137 V369 M910 157 H941 M910 239 H941 M910 321 H941" />
          <rect x="941" y="130" width="190" height="55" rx="7" />
          <rect x="941" y="212" width="190" height="55" rx="7" />
          <rect x="941" y="294" width="190" height="55" rx="7" />
          <circle cx="910" cy="157" r="5" /><circle cx="910" cy="239" r="5" /><circle cx="910" cy="321" r="5" />
          <path d="M956 151 H1088 M956 165 H1051 M956 233 H1099 M956 247 H1069 M956 315 H1082 M956 329 H1038" className="blueprint-faint" />
          <path d="M933 386 H1130 M933 400 H1093" className="blueprint-faint" />
        </g>

        <path className="blueprint-note-line" d="M165 70 C180 40 211 34 241 43" />
        <path className="blueprint-note-line" d="M626 437 C640 460 666 465 695 455" />
        <path className="blueprint-note-line" d="M1014 68 C1029 41 1054 32 1082 39" />
      </g>

      <g className="blueprint-labels">
        <text x="39" y="57" className="blueprint-micro">01 / SOURCE TREE</text>
        <text x="54" y="95" className="blueprint-title">BLACK BOX</text>
        <text x="164" y="168" className="blueprint-code">packet.sys</text>
        <text x="164" y="227" className="blueprint-code">router.dll</text>
        <text x="164" y="286" className="blueprint-code">engine.elf</text>
        <text x="164" y="345" className="blueprint-code">agent.bin</text>
        <text x="288" y="168" textAnchor="end" className="blueprint-code blueprint-code--pencil">PE</text>
        <text x="288" y="227" textAnchor="end" className="blueprint-code blueprint-code--pencil">DLL</text>
        <text x="288" y="286" textAnchor="end" className="blueprint-code blueprint-code--pencil">ELF</text>
        <text x="288" y="345" textAnchor="end" className="blueprint-code blueprint-code--pencil">RAW</text>

        <text x="439" y="51" className="blueprint-micro">02 / TYPE-AWARE WORKBENCH</text>
        <text x="455" y="106" className="blueprint-title">DISASSEMBLE → TRACE → NAME</text>
        <text x="626" y="235" textAnchor="middle" className="blueprint-code">CONTROL</text>
        <text x="626" y="262" textAnchor="middle" className="blueprint-title">FLOW</text>
        <text x="626" y="288" textAnchor="middle" className="blueprint-code">EVIDENCE</text>

        <text x="884" y="55" className="blueprint-micro">03 / MIRRORED OUTPUT</text>
        <text x="895" y="88" className="blueprint-title">READABLE TREE</text>
        <text x="959" y="154" className="blueprint-code">drivers/packet.cpp</text>
        <text x="959" y="236" className="blueprint-code">net/router.cpp</text>
        <text x="959" y="318" className="blueprint-code">core/engine.map</text>
        <text x="931" y="390" className="blueprint-code blueprint-code--pencil">SAME PATH // EXACT BASENAME</text>
        <text x="931" y="406" className="blueprint-code blueprint-code--pencil">ADDRESS + EVIDENCE RETAINED</text>

        <text x="238" y="37" textAnchor="end" className="blueprint-hand blueprint-hand--accent">do not flatten the crime scene</text>
        <text x="692" y="470" textAnchor="end" className="blueprint-hand blueprint-hand--accent">a name is a hypothesis—keep the address</text>
        <text x="1082" y="35" textAnchor="end" className="blueprint-hand blueprint-hand--accent">every output points home</text>
        <text x="1137" y="374" textAnchor="end" className="blueprint-hand blueprint-hand--accent">black box → evidence trail</text>
      </g>
    </svg>
  );
}

function ProjectVisual({
  kind,
  artifact,
}: {
  kind: (typeof PROJECTS)[number]["visual"];
  artifact: string;
}) {
  return (
    <>
      {kind === "circuit" && (
        <CircuitBlueprint />
      )}

      {kind === "chess" && (
        <ChessMemoryBlueprint />
      )}

      {kind === "pipeline" && (
        <CpuDatapathBlueprint />
      )}

      {kind === "context" && (
        <ContextConsentBlueprint />
      )}

      {kind === "decompile" && (
        <DecompileForensicsBlueprint />
      )}

      <span className="blueprint-pan-cue">PAN / TRACE / INSPECT</span>
      <code>{artifact}</code>
    </>
  );
}

export default function Home() {
  const [bootVisible, setBootVisible] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState<boolean | null>(null);
  const [machineEnabled, setMachineEnabled] = useState(false);
  const [machineReady, setMachineReady] = useState(false);
  const [machineActive, setMachineActive] = useState(true);
  const [activeSection, setActiveSection] = useState("top");
  const [workInProgressVisible, setWorkInProgressVisible] = useState(true);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLElement>(null);
  const bootSkipButton = useRef<HTMLButtonElement>(null);
  const machineStage = useRef<HTMLDivElement>(null);

  const completeBoot = useCallback((immediate = false) => {
    setBootComplete(true);
    window.setTimeout(() => {
      setBootVisible(false);
      window.setTimeout(() => {
        document.getElementById("main-content")?.focus();
      }, 60);
    }, immediate ? 0 : 820);
  }, []);

  const handleMachineReady = useCallback(() => setMachineReady(true), []);

  const playSignal = useCallback(
    (frequency = 380, duration = 0.045, force = false) => {
      if ((!soundOn && !force) || typeof window === "undefined") return;
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(80, frequency * 0.72),
        context.currentTime + duration,
      );
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.01);
    },
    [soundOn],
  );

  const toggleSound = useCallback(() => {
    if (!soundOn) {
      setSoundOn(true);
      playSignal(520, 0.08, true);
    } else {
      playSignal(240, 0.05);
      setSoundOn(false);
    }
  }, [playSignal, soundOn]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 780px)");
    const mobileNavigation = window.matchMedia("(max-width: 1100px)");
    const updatePreference = () => setReducedMotion(media.matches);
    const updateCompactMode = () => {
      let supportsWebGL = false;
      try {
        const canvas = document.createElement("canvas");
        supportsWebGL = Boolean(
          canvas.getContext("webgl2") || canvas.getContext("webgl"),
        );
      } catch {
        supportsWebGL = false;
      }
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection;
      setCompactMode(
        compact.matches || media.matches || !supportsWebGL || connection?.saveData === true,
      );
    };
    const closeDesktopMenu = () => {
      if (!mobileNavigation.matches) setMenuOpen(false);
    };
    updatePreference();
    updateCompactMode();
    const updateMotionPreference = () => {
      updatePreference();
      updateCompactMode();
    };
    media.addEventListener("change", updateMotionPreference);
    compact.addEventListener("change", updateCompactMode);
    mobileNavigation.addEventListener("change", closeDesktopMenu);
    return () => {
      media.removeEventListener("change", updateMotionPreference);
      compact.removeEventListener("change", updateCompactMode);
      mobileNavigation.removeEventListener("change", closeDesktopMenu);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => completeBoot(reducedMotion),
      reducedMotion ? 0 : 2350,
    );
    return () => window.clearTimeout(timer);
  }, [completeBoot, reducedMotion]);

  useEffect(() => {
    if (compactMode !== false || bootVisible) {
      const resetTimer = window.setTimeout(() => {
        setMachineEnabled(false);
        setMachineReady(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const schedule = window.requestIdleCallback?.bind(window);
    const cancel = window.cancelIdleCallback?.bind(window);
    if (schedule) {
      const idleId = schedule(() => setMachineEnabled(true), { timeout: 900 });
      return () => cancel?.(idleId);
    }

    const timer = window.setTimeout(() => setMachineEnabled(true), 240);
    return () => window.clearTimeout(timer);
  }, [bootVisible, compactMode]);

  useEffect(() => {
    const stage = machineStage.current;
    if (!stage) return;
    let inView = true;
    const updateActivity = () => setMachineActive(inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    observer.observe(stage);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  useEffect(() => {
    if (!bootVisible || reducedMotion) return;
    const focusTimer = window.setTimeout(() => bootSkipButton.current?.focus(), 60);
    return () => window.clearTimeout(focusTimer);
  }, [bootVisible, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (bootVisible) {
          completeBoot();
          return;
        }
        if (menuOpen) {
          setMenuOpen(false);
          window.requestAnimationFrame(() => menuButton.current?.focus());
        }
      }
      if (event.key === "Tab" && bootVisible) {
        event.preventDefault();
        bootSkipButton.current?.focus();
      }
      if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey) {
        toggleSound();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bootVisible, completeBoot, menuOpen, toggleSound]);

  useEffect(() => {
    const content = document.getElementById("main-content");
    const header = document.querySelector<HTMLElement>(".site-header");
    const previousOverflow = document.body.style.overflow;
    let focusTimer: number | undefined;

    if (bootVisible || menuOpen) {
      content?.setAttribute("inert", "");
      document.body.style.overflow = "hidden";
    } else {
      content?.removeAttribute("inert");
    }

    if (bootVisible) header?.setAttribute("inert", "");
    else header?.removeAttribute("inert");

    if (menuOpen && !bootVisible) {
      focusTimer = window.setTimeout(() => {
        mobileMenu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }, 60);
    }

    return () => {
      content?.removeAttribute("inert");
      header?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      if (focusTimer) window.clearTimeout(focusTimer);
    };
  }, [bootVisible, menuOpen]);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? window.scrollY / available : 0;
      scrollProgress.current?.style.setProperty("--progress", `${progress}`);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const sections = ["work", "stack", "timeline", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -58%", threshold: [0, 0.12, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };
    const animateRing = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      if (cursorRing.current) {
        cursorRing.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(animateRing);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(animateRing);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 64, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.to(".hero-title__line--one", {
        xPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".hero-title__line--two", {
        xPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".machine-stage", {
        yPercent: 14,
        scale: 0.88,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.94, filter: "brightness(0.62)" },
          {
            scale: 1,
            filter: "brightness(1)",
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 24%", scrub: 1 },
          },
        );
      });
    });
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" tabIndex={bootVisible ? -1 : undefined}>
        Skip to portfolio content
      </a>

      {bootVisible && (
        <div
          className="boot-screen"
          data-complete={bootComplete ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-labelledby="boot-title"
        >
          <div className="boot-screen__topline">
            <span>{PROFILE.shortName}.SYS</span>
            <span>POWER-ON SELF TEST</span>
          </div>
          <div className="boot-screen__core">
            <span className="eyebrow">PORTFOLIO BIOS // REV 01</span>
            <h1 id="boot-title">Compiling the machine.</h1>
            <div className="boot-screen__log" aria-hidden="true">
              {BOOT_LINES.map((line, index) => (
                <span key={line} style={{ "--line": index } as React.CSSProperties}>
                  {line}
                </span>
              ))}
            </div>
          </div>
          <div className="boot-screen__footer">
            <div className="boot-progress"><i /></div>
            <button ref={bootSkipButton} type="button" onClick={() => completeBoot()}>
              ESC / SKIP INTRO
            </button>
          </div>
        </div>
      )}

      {!bootVisible && workInProgressVisible && (
        <aside className="work-in-progress" role="status" aria-label="Portfolio status">
          <span aria-hidden="true">●</span>
          <p><strong>WORK IN PROGRESS</strong> — new builds are still being wired in.</p>
          <button
            type="button"
            onClick={() => setWorkInProgressVisible(false)}
            aria-label="Dismiss work in progress notice"
          >
            ×
          </button>
        </aside>
      )}

      <div className="cursor-dot" ref={cursorDot} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRing} aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" ref={scrollProgress} aria-hidden="true"><i /></div>

      <header className="site-header">
        <a className="identity-mark" href="#top" aria-label="Back to the top">
          <span>
            <Image
              src="/generated/icons/brand-core.png"
              alt=""
              width={44}
              height={44}
              unoptimized
            />
          </span>
          <small>PORTFOLIO<br />SYSTEM</small>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAVIGATION.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "location" : undefined}
              onPointerEnter={() => playSignal(320)}
            >
              <span>{item.index}</span>{item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="sound-toggle"
            type="button"
            aria-label={soundOn ? "Mute interface sounds" : "Enable interface sounds"}
            aria-pressed={soundOn}
            onClick={toggleSound}
          >
            <span className="sound-glyph" data-active={soundOn ? "true" : "false"} aria-hidden="true">
              <i /><i /><i />
            </span>
            <span>{soundOn ? "SOUND ON" : "SOUND OFF"}</span>
          </button>
          <button
            className="menu-toggle"
            ref={menuButton}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-glyph" data-open={menuOpen ? "true" : "false"} aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav
        id="mobile-navigation"
        className="mobile-menu"
        ref={mobileMenu}
        data-open={menuOpen ? "true" : "false"}
        aria-label="Portfolio navigation"
        aria-hidden={!menuOpen}
      >
        {NAVIGATION.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={activeSection === item.id ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>{item.index}</span>{item.label}<i className="ui-vector ui-vector--out" aria-hidden="true" />
          </a>
        ))}
        <p>{PROFILE.location}</p>
      </nav>

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="assembly-feed" aria-hidden="true">
            <span className="assembly-feed__address">0x0000F — 0x7F45A</span>
            {ASSEMBLY_FEED.map((line, index) => (
              <code key={line}><b>{String(index).padStart(2, "0")}</b>{line}</code>
            ))}
          </div>

          <div className="hero-kicker">
            <span>{PROFILE.name}</span>
            <span>{PROFILE.role}</span>
            <span>{PROFILE.location}</span>
          </div>

          <h1 className="hero-title" id="hero-title" aria-label="The machine remembers">
            <span className="hero-title__line hero-title__line--one">THE MACHINE</span>
            <span className="hero-title__line hero-title__line--two">REMEMBERS</span>
          </h1>

          <div
            className="machine-stage"
            ref={machineStage}
            data-machine-ready={machineReady ? "true" : "false"}
            aria-label={
              compactMode === false
                ? "Interactive 3D machine core. Drag to inspect."
                : "Generated futuristic machine core."
            }
          >
            {compactMode !== false ? (
              <MachineFallback />
            ) : (
              <>
                <MachineFallback />
                {machineEnabled && (
                  <div
                    className="machine-canvas-layer"
                    data-ready={machineReady ? "true" : "false"}
                  >
                    <MachineErrorBoundary>
                      <MachineCanvas
                        active={machineActive}
                        reducedMotion={reducedMotion}
                        onReady={handleMachineReady}
                      />
                    </MachineErrorBoundary>
                  </div>
                )}
              </>
            )}
            <div className="machine-stage__label">
              <span>MESHY CORE // GLB 01</span>
              <span>
                {compactMode !== false
                  ? "STATIC PREVIEW"
                  : machineReady
                    ? "DRAG TO INSPECT"
                    : "LINKING 3D CORE"}
              </span>
            </div>
          </div>

          <div className="hero-bottom">
            <p>{PROFILE.headline}</p>
            <a className="signal-link" href="#work" onPointerEnter={() => playSignal(440)}>
              ENTER THE SIGNAL <i className="ui-vector ui-vector--down" aria-hidden="true" />
            </a>
            <span>{PROFILE.specialty}</span>
          </div>
        </section>

        <section className="system-thesis section-pad" aria-labelledby="thesis-title">
          <div className="section-index"><span>00</span><p>SYSTEM THESIS</p></div>
          <div className="thesis-copy">
            <p className="eyebrow" data-reveal>FROM ABSTRACT THOUGHT TO PHYSICAL PROOF</p>
            <h2 id="thesis-title" data-reveal>{PROFILE.statement}</h2>
            <div className="thesis-lower" data-reveal>
              <p>{PROFILE.intro}</p>
              <span>SCROLL / TRACE / INSPECT</span>
            </div>
          </div>
          <div className="signal-stats">
            {SIGNALS.map((signal) => (
              <div key={signal.label} data-reveal>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="work section-pad" id="work" aria-labelledby="work-title">
          <div className="work-intro">
            <div className="section-index"><span>01</span><p>SELECTED WORK</p></div>
            <div className="work-intro__copy">
              <p className="eyebrow">ARTIFACTS / NOT PROMISES</p>
              <h2 id="work-title">{String(PROJECTS.length).padStart(2, "0")} systems.<br />One operating principle.</h2>
              <p>Each case study crosses a boundary: text into circuits, assembly into gameplay, logic into silicon, or context into usable infrastructure.</p>
            </div>
          </div>

          <div className="project-list">
            {PROJECTS.map((project) => (
              <article className={`project-card project-card--${project.accent}`} key={project.id}>
                <div className="project-card__topline">
                  <span>CASE // {project.id}</span>
                  <span>{project.kicker}</span>
                </div>
                <div className={`project-card__visual project-card__visual--${project.visual}`} aria-hidden="true">
                  <ProjectVisual kind={project.visual} artifact={project.artifact} />
                </div>
                <div className="project-card__content">
                  <span className="project-card__id">0x{project.id} / 0x0{PROJECTS.length}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <blockquote>{project.outcome}</blockquote>
                  <dl className="project-evidence">
                    {project.evidence.map((item) => (
                      <div key={item.label}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul aria-label={`${project.title} technology stack`}>
                    {project.stack.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a href={project.href} target="_blank" rel="noreferrer" onPointerEnter={() => playSignal(480)}>
                    INSPECT PROJECT <i className="ui-vector ui-vector--out" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="capability-stack section-pad" id="stack" aria-labelledby="stack-title">
          <div className="section-index section-index--light"><span>02</span><p>CAPABILITY STACK</p></div>
          <div className="stack-heading">
            <p className="eyebrow" data-reveal>FULL-STACK / ALL THE WAY DOWN</p>
            <h2 id="stack-title" data-reveal>From electrons<br />to interfaces.</h2>
          </div>
          <div className="capability-list">
            {CAPABILITIES.map((capability) => {
              return (
                <article key={capability.index} data-reveal>
                  <div className="capability-list__icon">
                    <Image src={capability.icon} alt="" width={64} height={64} unoptimized />
                  </div>
                  <span>{capability.index}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <code>{capability.code}</code>
                </article>
              );
            })}
          </div>
          <div className="instruction-river" aria-hidden="true">
            <span>LW $t0, 0($sp) • ADDU $v0, $t0, $a1 • SW $v0, PROOF • BNE $v0, $zero, SHIP • </span>
            <span>LW $t0, 0($sp) • ADDU $v0, $t0, $a1 • SW $v0, PROOF • BNE $v0, $zero, SHIP • </span>
          </div>
        </section>

        <section className="timeline section-pad" id="timeline" aria-labelledby="timeline-title">
          <div className="section-index"><span>03</span><p>EXPERIENCE BUS</p></div>
          <div className="timeline-heading">
            <p className="eyebrow" data-reveal>THE SIGNAL HAS A HISTORY</p>
            <h2 id="timeline-title" data-reveal>Work, study,<br />repeat.</h2>
          </div>
          <ol className="timeline-list">
            {EXPERIENCE.map((item, index) => (
              <li key={`${item.role}-${index}`} data-reveal>
                <span className="timeline-list__node">{String(index + 1).padStart(2, "0")}</span>
                <time>{item.period}</time>
                <div><h3>{item.role}</h3><strong>{item.organization}</strong></div>
                <p>{item.note}</p>
              </li>
            ))}
          </ol>
          <div className="credentials" data-reveal>
            <span>CREDENTIAL BUFFER</span>
            <div>{CREDENTIALS.map((credential) => <small key={credential}>{credential}</small>)}</div>
          </div>
        </section>

        <section className="manifesto section-pad" aria-labelledby="manifesto-title">
          <div className="manifesto-terminal" data-reveal>
            <div className="terminal-bar"><span /><span /><span /><code>~/operating-system/rules.asm</code></div>
            <div className="terminal-body">
              <span>001</span><p>BUILD FIRST. POLISH WITH INTENT.</p>
              <span>002</span><p>VAGUE IDEAS ARE UNCOMPILED SPECIFICATIONS.</p>
              <span>003</span><p>IF IT CANNOT BE TESTED, IT IS STILL IMAGINATION.</p>
              <span>004</span><p>MAKE THE TOOL SERVE THE GOAL.</p>
              <span>005</span><p>LEAVE AN EVIDENCE TRAIL.</p>
            </div>
          </div>
          <div className="manifesto-copy">
            <span className="eyebrow">PERSONAL OPERATING SYSTEM</span>
            <h2 id="manifesto-title">Curiosity is useful only when it survives compilation.</h2>
          </div>
        </section>

        <section className="contact section-pad" id="contact" aria-labelledby="contact-title">
          <div className="contact-coordinates" aria-hidden="true">
            <span>X 07341.22</span><span>Y 02217.88</span><span>Z −00118.40</span>
          </div>
          <p className="eyebrow" data-reveal>END OF MEMORY // START OF CONVERSATION</p>
          <h2 id="contact-title" data-reveal>
            HAVE A HARD<br /><em>PROBLEM?</em>
          </h2>
          <a className="contact-link" href={`mailto:${PROFILE.email}`} onPointerEnter={() => playSignal(620)}>
            <span>ROUTE A SIGNAL</span>
            <strong>{PROFILE.email}</strong>
            <i className="ui-vector ui-vector--out" aria-hidden="true" />
          </a>
          <div className="contact-footer">
            <span>{PROFILE.availability}</span>
            <div>
              <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="Source repositories">
                <Image src="/generated/icons/contact-source.png" alt="" width={48} height={48} unoptimized />
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="Professional network">
                <Image src="/generated/icons/contact-network.png" alt="" width={48} height={48} unoptimized />
              </a>
              <a href={`mailto:${PROFILE.email}`} aria-label="Send an email signal">
                <Image src="/generated/icons/contact-signal.png" alt="" width={48} height={48} unoptimized />
              </a>
            </div>
            <span>© {new Date().getFullYear()} / {PROFILE.name}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
