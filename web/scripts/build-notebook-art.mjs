// Original pen-style artwork. Authored paths, hatching and transparent PNG frames;
// no image-generation service, stock icons, WebGL, or runtime drawing library.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const out = new URL("../public/art/notebook/", import.meta.url);
await mkdir(out, { recursive: true });
const ink = "#293c33",
  red = "#a3452e",
  pencil = "#8b8879";
const path = (d, color = ink, width = 2.5, extra = "") =>
  `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const text = (x, y, s, size = 22, color = ink) =>
  `<text x="${x}" y="${y}" font-family="Georgia,serif" font-style="italic" font-size="${size}" fill="${color}">${s}</text>`;
const line = (x1, y1, x2, y2, color = ink, w = 2) =>
  path(
    `M${x1} ${y1} Q${(x1 + x2) / 2 + 1.5} ${(y1 + y2) / 2 - 1.2} ${x2} ${y2}`,
    color,
    w,
  );
const box = (x, y, w, h) =>
  path(
    `M${x + 2} ${y} L${x + w} ${y + 2} L${x + w - 1} ${y + h} L${x} ${y + h - 1} Z`,
  ) +
  path(
    `M${x + 4} ${y - 3} L${x + w + 3} ${y} L${x + w + 2} ${y + h - 4}`,
    pencil,
    0.7,
  );
const circle = (x, y, r, color = ink) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.98}" stroke="${color}" stroke-width="2" fill="none"/>`;
function hatch(x, y, w, h, n = 10) {
  return Array.from({ length: n }, (_, i) =>
    line(x + (i * w) / n, y + h, x + ((i + 1) * w) / n, y, pencil, 0.7),
  ).join("");
}
function chip() {
  let s =
    path("M305 248 L541 180 L695 280 L454 358 Z") +
    path("M305 248 L304 287 L455 399 L695 320 L695 280") +
    line(455, 358, 455, 399);
  s +=
    path("M343 250 L535 197 L659 280 L460 340 Z", pencil, 1) +
    path("M411 258 L519 228 L580 270 L469 302 Z", red, 2);
  s += hatch(466, 361, 200, 27, 20);
  for (let i = 0; i < 12; i++) {
    let x = 324 + i * 11,
      y = 299 + i * 8;
    s += path(`M${x} ${y} l-20 10 l-1 13 l-7 3`);
    x = 475 + i * 17;
    y = 400 - i * 5.5;
    s += path(`M${x} ${y} l10 13 l0 11 l7 3`);
  }
  s +=
    text(461, 264, "ISA", 19, red) +
    text(690, 223, "20-bit", 24, red) +
    path("M735 231 Q760 260 701 287", red, 1.5);
  return s;
}
function processor(p = 1) {
  let s = chip();
  const layer = (n, body) =>
    `<g opacity="${Math.min(1, Math.max(0, (p - n) * 5))}">${body}</g>`;
  s += layer(
    0.12,
    path("M240 373 L541 284 L749 432 L446 532 Z") +
      path("M240 373 L240 390 L446 553 L749 451 L749 432") +
      hatch(462, 529, 265, 19, 22),
  );
  s += layer(
    0.3,
    path("M199 503 L535 399 L793 580 L449 686 Z") +
      path("M199 503 L199 518 L449 705 L793 598 L793 580") +
      path("M250 509 L524 428 L740 577 L458 662 Z", pencil, 1),
  );
  s += layer(
    0.45,
    Array.from({ length: 4 }, (_, i) => {
      const x = 350 + i * 49,
        y = 501 - i * 14;
      return (
        path(`M${x} ${y} l40 -11 l46 30 l-39 13 Z`, red, 1.8) +
        text(x + 15, y + 13, `${i}`, 13, red)
      );
    }).join("") +
      text(712, 496, "4 × 16-bit lanes", 21, red) +
      path("M728 504 Q775 527 690 540", red, 1.5),
  );
  s += layer(
    0.6,
    path("M188 174 Q90 210 195 352 M181 337 L195 352 L198 331", red, 2) +
      text(83, 164, "fetch", 28, red) +
      path("M790 337 Q887 379 812 493 M811 475 L812 493 L828 485", red, 2) +
      text(768, 324, "execute", 28, red),
  );
  s += layer(
    0.75,
    path("M171 584 Q79 436 150 329", pencil, 1.3, 'stroke-dasharray="5 8"') +
      text(78, 615, "one instruction,", 22) +
      text(88, 643, "many possibilities.", 22),
  );
  const offset = Math.round(p * 160);
  s +=
    path("M323 125 L548 64 L772 229", red, 1.3, 'stroke-dasharray="3 7"') +
    text(290, 108, "from a sketch to silicon", 24, red);
  if (p > 0.75)
    s += `<circle cx="${356 + offset}" cy="${511 - offset * 0.28}" r="6" fill="${red}"/>`;
  return s;
}
function workbench() {
  let s =
    path("M166 173 L626 102 Q651 98 656 125 L686 452 L215 539 Z", ink, 3) +
    path("M185 189 L634 123 L659 429 L227 507 Z") +
    path("M166 173 L150 178 L192 560 L686 470 L686 452") +
    line(215, 539, 192, 560) +
    hatch(171, 185, 25, 345, 15);
  s +=
    path("M368 530 L370 597 L489 574 L479 509") +
    path("M336 609 L474 578 L541 604 L399 640 Z");
  s +=
    path("M264 247 L390 227 L399 324 L273 347 Z") +
    text(282, 278, "idea →", 27, red) +
    text(295, 311, "test", 24);
  s +=
    path("M455 214 L588 193 L601 329 L467 353 Z") +
    path("M482 240 l80 -13 l7 66 l-80 14 Z", red) +
    line(399, 276, 458, 265, red);
  for (let i = 0; i < 6; i++) {
    s += line(489 + i * 13, 230, 488 + i * 13, 217);
    s += line(498 + i * 13, 318, 499 + i * 13, 332);
  }
  s += path(
    "M267 384 L285 381 L296 402 L312 363 L327 405 L340 359 L357 396 L374 368 L390 373 L566 344",
    red,
    2,
  );
  s +=
    path("M288 654 L626 580 L768 642 L420 727 Z") +
    path("M301 660 L626 592 L739 641 L421 714 Z", pencil, 1);
  for (let i = 0; i < 4; i++)
    s += line(
      328 + i * 21,
      663 + i * 12,
      636 + i * 22,
      599 + i * 13,
      pencil,
      1,
    );
  for (let i = 0; i < 13; i++)
    s += line(331 + i * 23, 656 - i * 5, 419 + i * 23, 704 - i * 5, pencil, 1);
  s +=
    path("M709 379 Q802 341 847 397 L861 530 Q792 497 723 547 Z") +
    path("M785 375 L796 518", pencil, 1) +
    text(733, 421, "build.", 24) +
    text(739, 454, "measure.", 19) +
    text(745, 487, "repeat.", 24, red);
  s +=
    path("M89 554 L179 676 L186 697 L165 684 L76 565 Z") +
    line(84, 559, 176, 683, pencil) +
    text(331, 78, "the working notebook", 28, red);
  s +=
    path("M796 194 Q739 141 676 153 M688 144 L676 153 L690 158", red, 1.5) +
    text(711, 222, "stay curious.", 24, red);
  return s;
}
function research() {
  let s =
    path("M154 143 L433 174 L425 610 L137 577 Z") +
    path("M433 174 Q551 115 738 138 L761 570 Q569 551 425 610") +
    path("M137 577 L133 593 L425 627 L770 588 L761 570") +
    line(425, 610, 425, 627);
  for (let i = 0; i < 12; i++) {
    s += line(182, 208 + i * 26, 384 - (i % 3) * 26, 231 + i * 26, pencil, 1.1);
    s += line(481, 224 + i * 25, 694 - (i % 4) * 15, 200 + i * 25, pencil, 1.1);
  }
  s +=
    text(186, 187, "the question", 27, red) +
    text(499, 182, "the evidence", 27, red);
  s +=
    circle(657, 483, 94) +
    circle(657, 483, 83, pencil) +
    path(
      "M714 555 L797 649 Q810 664 825 647 L839 635 Q850 623 835 612 L750 535 Z",
    ) +
    hatch(800, 609, 18, 34, 6);
  s +=
    path("M207 479 Q266 428 333 489 M211 480 Q267 432 335 492", red, 1.2) +
    text(114, 684, "a claim needs a trail.", 30, red) +
    path("M120 696 Q349 710 562 684", red, 1.7);
  return s;
}
function learning() {
  let s =
    path(
      "M170 381 Q275 299 467 349 Q631 287 772 338 L803 573 Q650 532 471 598 Q284 551 170 617 Z",
    ) +
    path("M467 349 L471 598") +
    path("M170 617 L170 635 Q329 576 471 617 Q651 551 808 592 L803 573") +
    line(471, 598, 471, 617);
  for (let i = 0; i < 6; i++) {
    s += path(
      `M218 ${402 + i * 26} Q326 ${364 + i * 26} 415 ${399 + i * 26}`,
      pencil,
      1.2,
    );
    s += path(
      `M521 ${390 + i * 26} Q639 ${353 + i * 26} 732 ${379 + i * 26}`,
      pencil,
      1.2,
    );
  }
  s +=
    path(
      "M412 276 C339 193 407 94 479 101 C559 107 598 191 527 273 L519 305 L422 305 Z",
    ) +
    path("M430 319 L512 319 M438 334 L504 334 M457 349 L489 349") +
    path("M451 292 L447 201 L482 236 L518 191 L497 298", red);
  for (let i = 0; i < 9; i++) {
    const a = ((i * 32 + 160) * Math.PI) / 180;
    s += line(
      478 + 119 * Math.cos(a),
      190 + 119 * Math.sin(a),
      478 + 150 * Math.cos(a),
      190 + 150 * Math.sin(a),
      red,
      2,
    );
  }
  s += text(99, 689, "learning, on your terms.", 30, red);
  return s;
}
function circuit() {
  let s =
    box(135, 169, 645, 415) +
    text(175, 226, "intent → CircuitIR → editable files", 25, red);
  s += path(
    "M193 380 L255 380 l9 -17 l15 34 l15 -34 l15 34 l15 -34 l10 17 L398 380 L398 300 L547 300 L547 381 L695 381 L695 504 L193 504 Z",
  );
  s +=
    circle(547, 381, 44) +
    path(
      "M526 357 L526 407 M526 369 L555 348 M526 397 L558 419 M546 413 L558 419 L555 405",
    ) +
    line(547, 425, 547, 504) +
    text(281, 350, "R₁", 23) +
    text(555, 285, "Q₁", 23);
  s +=
    line(180, 422, 207, 422, red, 3) +
    line(187, 437, 199, 437, red, 3) +
    line(193, 380, 193, 418) +
    line(193, 441, 193, 504);
  for (const [x, y] of [
    [398, 380],
    [547, 504],
    [695, 381],
  ])
    s += `<circle cx="${x}" cy="${y}" r="4" fill="${ink}"/>`;
  s +=
    text(138, 637, "draw it. validate it. open it.", 30, red) +
    path("M629 558 l30 -37 l28 15", red);
  return s;
}
function architecture() {
  let s =
    line(174, 590, 765, 590) +
    line(174, 590, 174, 168) +
    text(194, 135, "trade-offs, made visible", 30, red) +
    text(666, 630, "energy →", 22) +
    text(86, 357, "cost", 23);
  for (let i = 0; i < 5; i++)
    s += line(178, 235 + i * 70, 750, 235 + i * 70, pencil, 0.6);
  for (let i = 0; i < 45; i++) {
    const x = 228 + ((i * 71) % 480),
      y = 215 + ((i * 59) % 310);
    s += circle(x, y, 3 + (i % 3), pencil);
  }
  s += path("M231 264 C253 329 298 402 362 459 S555 535 706 548", red, 3);
  for (const [x, y] of [
    [231, 264],
    [288, 376],
    [362, 459],
    [485, 517],
    [706, 548],
  ])
    s += circle(x, y, 9, red);
  s +=
    text(426, 402, "Pareto frontier", 28, red) +
    path("M560 416 Q606 456 572 520", red, 1.5) +
    text(231, 681, "feasibility is computed, not guessed.", 24);
  return s;
}
function campus() {
  let s =
    path(
      "M141 591 L812 591 M177 587 L177 323 L774 323 L774 590 M144 323 L471 167 L810 323 Z",
    ) +
    path("M186 307 L471 184 L765 307 Z", pencil, 1) +
    box(432, 210, 78, 70) +
    circle(471, 245, 25) +
    path("M471 227 L471 245 L486 257");
  for (let i = 0; i < 7; i++) {
    const x = 212 + i * 79;
    s +=
      path(`M${x} 580 L${x} 359 Q${x + 20} 342 ${x + 37} 359 L${x + 37} 580`) +
      line(x - 5, 581, x + 43, 581) +
      line(x - 5, 354, x + 43, 354) +
      hatch(x + 26, 363, 9, 210, 6);
  }
  s +=
    path("M122 612 L829 612 M105 632 L845 632 M88 652 L861 652") +
    text(243, 722, "the foundations keep growing.", 28, red) +
    path("M473 162 L473 84 L581 107 L473 129", red);
  return s;
}
function medal() {
  let s =
    path("M299 113 L447 130 L501 338 L407 378 Z") +
    path("M603 105 L461 131 L405 339 L501 378 Z") +
    path("M330 118 L434 140 L481 327", red, 1.5) +
    path("M573 118 L474 143 L426 327", red, 1.5);
  s +=
    circle(455, 468, 147) +
    circle(455, 468, 132, pencil) +
    circle(455, 468, 118) +
    path(
      "M455 380 L477 434 L537 436 L490 474 L506 533 L455 499 L405 533 L421 474 L374 436 L434 434 Z",
      red,
      2.7,
    );
  for (let i = 0; i < 25; i++) {
    let a = (i / 25) * Math.PI * 2;
    s += line(
      455 + 133 * Math.cos(a),
      468 + 133 * Math.sin(a),
      455 + 141 * Math.cos(a),
      468 + 141 * Math.sin(a),
      pencil,
      0.8,
    );
  }
  s +=
    text(251, 686, "the work leaves a mark.", 30, red) +
    path("M711 245 Q691 304 625 356", red, 1.5) +
    text(649, 220, "earned.", 28, red);
  return s;
}
function community() {
  let s =
    path("M182 521 L661 423 L809 537 L323 650 Z") +
    path("M323 650 L324 704 M184 521 L183 586 M809 537 L810 602") +
    box(407, 302, 205, 131) +
    path("M415 427 L393 465 L617 465 L612 433");
  for (const [x, y] of [
    [239, 283],
    [703, 321],
    [353, 448],
  ]) {
    s +=
      circle(x, y, 41) +
      path(
        `M${x - 65} ${y + 129} Q${x - 68} ${y + 52} ${x - 17} ${y + 49} L${x + 18} ${y + 49} Q${x + 74} ${y + 62} ${x + 64} ${y + 120}`,
      ) +
      path(
        `M${x - 29} ${y - 5} Q${x - 18} ${y - 37} ${x + 26} ${y - 25}`,
        pencil,
        1.2,
      );
  }
  s +=
    text(220, 142, "build something together.", 31, red) +
    path("M250 171 Q334 222 455 231", red, 1.5) +
    text(448, 363, "idea +", 25, red) +
    text(455, 397, "people", 25);
  return s;
}
function correspondence() {
  return (
    path("M172 241 L732 166 L793 559 L227 639 Z") +
    path("M172 241 L491 416 L732 166 M227 639 L404 369 M793 559 L561 352") +
    box(629, 200, 70, 84) +
    hatch(637, 210, 55, 63, 9) +
    path("M193 177 Q393 88 522 139", red, 2) +
    text(199, 112, "a good conversation", 30, red) +
    text(216, 147, "is a beginning.", 30, red) +
    text(294, 693, "say hello →", 35, red)
  );
}
const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="760" viewBox="0 0 960 760">${body}</svg>`;
const drawings = {
  workbench,
  research,
  learning,
  circuit,
  architecture,
  campus,
  medal,
  community,
  correspondence,
};
for (const [name, draw] of Object.entries(drawings))
  await writeFile(new URL(`${name}.svg`, out), svg(draw()));
await writeFile(new URL("processor-source.svg", out), svg(processor()));
const frames = [];
for (let i = 0; i < 40; i++) {
  const buffer = await sharp(Buffer.from(svg(processor(i / 39))))
    .png({ palette: true, colours: 48, compressionLevel: 9 })
    .toBuffer();
  const name = `processor-${String(i).padStart(2, "0")}.png`;
  await writeFile(new URL(name, out), buffer);
  frames.push({ src: `/art/notebook/${name}`, bytes: buffer.length });
}
const manifest = {
  width: 960,
  height: 760,
  frames,
  totalBytes: frames.reduce((n, f) => n + f.bytes, 0),
};
await writeFile(
  new URL("sequence.json", out),
  JSON.stringify(manifest, null, 2),
);
const mark = svg(
  path(
    "M215 526 L247 233 L405 436 L552 209 L594 516 M650 234 L822 234 L663 515 L835 515",
    ink,
    17,
  ),
);
await sharp(Buffer.from(mark))
  .resize(96, 76)
  .png()
  .toFile(new URL("../favicon.png", out).pathname.replace(/^\/(\w:)/, "$1"));
const social =
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f3eedf"/><path d="M54 61 H1146 M54 565 H1146" fill="none" stroke="${ink}"/><text x="60" y="110" font-family="monospace" font-size="16" letter-spacing="3" fill="${red}">THE ENGINEERING NOTEBOOK / TA HABINZAEEM.TECH</text><text x="60" y="238" font-family="Georgia,serif" font-size="65" fill="${ink}">Muhammad Taha</text><text x="60" y="323" font-family="Georgia,serif" font-style="italic" font-size="74" fill="${ink}">Bin Zaeem.</text><text x="63" y="421" font-family="Georgia,serif" font-size="23" fill="${ink}">Computer engineering. Applied AI.</text><text x="63" y="459" font-family="Georgia,serif" font-size="23" fill="${ink}">Questions worth building for.</text><g transform="translate(655 118) scale(.52)">${processor()}</g></svg>`.replace(
    "TA HABINZAEEM",
    "TAHABINZAEEM",
  );
await sharp(Buffer.from(social))
  .png({ palette: true, colours: 64 })
  .toFile(new URL("../../og.png", out).pathname.replace(/^\/(\w:)/, "$1"));
console.log(
  `Authored ${Object.keys(drawings).length} ink illustrations and ${frames.length} PNG frames (${Math.round(manifest.totalBytes / 1024)} KB).`,
);
