import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

let workerPromise;
async function render(pathname = "/") {
  workerPromise ??= import(
    new URL("../dist/server/index.js", import.meta.url).href
  ).then((module) => module.default);
  const worker = await workerPromise;
  return worker.fetch(
    new Request("http://localhost" + pathname, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}
const source = (path) => readFile(new URL(path, import.meta.url), "utf8");
const ROUTES = [
  ["/", "Curiosity, put to work."],
  ["/projects", "Things I build."],
  ["/research", "Questions I test."],
  ["/experience", "People I build with."],
  ["/education", "Where it began."],
  ["/certifications", "The learning record."],
  ["/achievements", "Milestones, earned."],
  ["/connect", "The next conversation."],
];
const OFFICIAL = [
  "https://github.com/MuhammadTahaBinZaeem",
  "https://www.linkedin.com/in/tahabinzaeem/",
  "https://devpost.com/MuhammadTahaBinZaeem",
  "https://lablab.ai/u/%40taha_zaeem65",
];
test("home is one complete, progressively enhanced book; reader editions remain available", async () => {
  const html = await (await render("/")).text();
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.equal((html.match(/data-world=/g) || []).length, 9);
  assert.equal((html.match(/class="certificate-sheet"/g) || []).length, 14);
  assert.equal((html.match(/class="atlas-leaf atlas-leaf-/g) || []).length, 7);
  assert.doesNotMatch(
    html,
    /class="(?:top-bar|notebook-header|chapter-grid|quick-nav|next-chapter|book-edge-tabs|world-marginalia)"/,
  );
  for (const id of [
    "foreword",
    "atlas",
    "projects",
    "research",
    "experience",
    "education",
    "certifications",
    "achievements",
    "connect",
  ])
    assert.ok(html.includes('id="' + id + '"'), id);
  const github = JSON.parse(await source("../app/github-repositories.json"));
  for (const repo of github.repositories)
    assert.ok(html.includes(repo.url), repo.name + " in home HTML");
  assert.ok(html.includes("/cv/muhammad-taha-bin-zaeem-mitacs-cv.pdf"));
  assert.ok(
    html.includes("/cv/muhammad-taha-bin-zaeem-claude-ambassador-cv.pdf"),
  );
  const engine = await source("../app/components/book-experience.tsx");
  assert.match(engine, /ScrollTrigger\.create/);
  assert.match(engine, /ResizeObserver/);
  assert.match(engine, /prefers-reduced-motion/);
  assert.match(engine, /autoRaf: false/);
  assert.match(engine, /parkedImages/);
  assert.doesNotMatch(
    engine,
    /setInterval|setTimeout|WebGL|requestAnimationFrame\(tick/,
  );
});
test("all eight sections are server-rendered, crawlable, readable without loading gates", async () => {
  for (const [path, title] of ROUTES) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(html.includes(title), path + " heading");
    assert.ok(html.includes("Muhammad Taha Bin Zaeem"));
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path + " has one h1");
    for (const href of OFFICIAL)
      assert.ok(html.includes(href), path + " " + href);
    assert.ok(html.includes("https://tahabinzaeem.tech"));
    assert.doesNotMatch(
      html,
      /boot-veil|portal-warp|generated\/|YOUR NAME|Lorem ipsum|machine-core\.glb/,
    );
    assert.match(html, /application\/ld\+json/);
  }
});
test("every public repository is visible without JavaScript, with correct fork provenance", async () => {
  const github = JSON.parse(await source("../app/github-repositories.json"));
  const html = await (await render("/projects")).text();
  assert.ok(
    github.repositories.length >= 23,
    "The complete audited repository index is preserved",
  );
  for (const repo of github.repositories)
    assert.ok(html.includes(repo.url), repo.name + " is missing");
  assert.equal(
    (html.match(/Fork \/ upstream-derived/g) || []).length,
    github.repositories.filter((r) => r.fork).length,
  );
  assert.ok(html.includes("repo-search"));
  assert.ok(html.includes("ParetoCo"));
  assert.ok(html.includes("Gecode"));
  assert.ok(html.includes("1,000 verified"));
  assert.ok(html.includes("13 interview scripts"));
});
test("Pocket Engineer is the fourth flagship, with current scope and preserved FOP evidence", async () => {
  for (const path of ["/", "/projects"]) {
    const html = await (await render(path)).text();
    assert.equal((html.match(/class="project-feature"/g) || []).length, 4);
    const order = ["paretoco", "progeneda", "type2learn", "pocket-engineer"]
      .map((id) => html.indexOf(`id="${id}"`));
    assert.ok(order.every((position, i) => position >= 0 && (i === 0 || position > order[i - 1])));
    assert.ok(html.includes("55 bounded problem types"));
    assert.ok(html.includes("C++20"));
    assert.ok(html.includes("825,000 stored regression cases"));
    assert.ok(html.includes("https://pocket-engineer.onrender.com/"));
    assert.ok(html.includes("GitHub · private repository"));
    assert.equal((html.match(/id="project-algebraic-expression-solver"/g) || []).length, 1);
    assert.ok(html.includes("algebraic-expression-solver-curve-one.webp"));
    assert.ok(html.includes("From the original FOP solver"));
    assert.match(html, /pocket-engineer-workbench[.]webp[^>]*loading="lazy"/);
  }
  const imagePath = new URL("../public/media/projects/pocket-engineer-workbench.webp", import.meta.url);
  const image = await sharp(await readFile(imagePath)).metadata();
  assert.equal(image.width, 1440);
  assert.equal(image.height, 1031);
  assert.ok((await stat(imagePath)).size < 70000, "Project screenshot stays under 70 KB");
  assert.match(await (await render("/llms.txt")).text(), /Pocket Engineer/);
});
test("CV facts have dedicated sections and retain status boundaries", async () => {
  const research = await (await render("/research")).text();
  for (const term of [
    "Authorial Style Separability",
    "Controlled-Mutation Fingerprinting",
    "1,879",
    "1,080",
    "Unpublished",
    "Phase 1",
    "checksums",
  ])
    assert.ok(research.includes(term), term);
  const experience = await (await render("/experience")).text();
  for (const term of [
    "PhishRod",
    "Arch Technologies",
    "Win32",
    "X11",
    "5+",
    "10 workshops planned",
    "not a completed count",
    "Samar Mubarakmand",
    "Khorana",
    "not a claim of appointment",
  ])
    assert.ok(experience.includes(term), term);
  const honors = await (await render("/achievements")).text();
  assert.ok(honors.includes("P@SHA ICT Awards 2026"));
  assert.ok(honors.includes("20,000"));
  assert.ok(honors.includes("2026 finalist"));
  assert.doesNotMatch(honors, /Gold (winner|award winner|medalist)/i);
  const education = await (await render("/education")).text();
  for (const term of [
    "expected graduation",
    "Third semester",
    "Qazi Grammar",
    "GCU",
    "PyTorch",
    "LaTeX",
    "MIPS",
    "Docker",
    "SQLite",
    "EasyEDA Pro",
  ])
    assert.ok(education.includes(term), term);
});
test("all three unmodified CV PDFs are linked and available", async () => {
  const html = await (await render("/connect")).text();
  for (const filename of [
    "muhammad-taha-bin-zaeem-cv.pdf",
    "muhammad-taha-bin-zaeem-mitacs-cv.pdf",
    "muhammad-taha-bin-zaeem-claude-ambassador-cv.pdf",
  ]) {
    assert.ok(html.includes("/cv/" + filename));
    const bytes = await readFile(
      new URL("../public/cv/" + filename, import.meta.url),
    );
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    assert.ok(bytes.length < 2_000_000);
  }
});
test("all 14 credentials remain visible and all 13 archived source PDFs are available", async () => {
  const html = await (await render("/certifications")).text();
  assert.equal((html.match(/class="certificate-sheet"/g) || []).length, 14);
  const manifest = JSON.parse(
    await source("../public/media/media-manifest.json"),
  );
  const certificates = Object.values(manifest.certificates);
  assert.equal(certificates.length, 13);
  for (const cert of certificates) {
    for (const asset of [cert.publicPath, cert.preview.publicPath]) {
      assert.ok(html.includes(asset), asset);
      assert.ok(
        (await stat(new URL("../public" + asset, import.meta.url))).size > 0,
      );
    }
  }
  assert.ok(
    html.includes("Introduction to Logic and Critical Thinking Specialization"),
  );
});
test("sitemap, robots and machine-readable brief cover the complete site", async () => {
  const sitemap = await (await render("/sitemap.xml")).text();
  for (const [path] of ROUTES)
    assert.ok(
      sitemap.includes(
        "https://tahabinzaeem.tech" + (path === "/" ? "" : path),
      ),
      path,
    );
  const robots = await (await render("/robots.txt")).text();
  assert.ok(robots.includes("sitemap.xml"));
  const brief = await (await render("/llms.txt")).text();
  for (const [path] of ROUTES.slice(1))
    assert.ok(brief.includes("https://tahabinzaeem.tech" + path), path);
  for (const link of OFFICIAL) assert.ok(brief.includes(link), link);
});
test("related image galleries retain valid source URLs and dimensions in server HTML", async () => {
  const html = await (await render("/")).text();
  const galleries = Array.from(html.matchAll(/data-gallery="([^"]+)"/g), (match) => JSON.parse(match[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">")));
  assert.ok(galleries.length >= 45);
  const assets = new Map();
  for (const gallery of galleries) {
    assert.ok(gallery.title && gallery.items.length);
    assert.equal(new Set(gallery.items.map((item) => item.src)).size, gallery.items.length);
    for (const item of gallery.items) assets.set(item.src, item);
  }
  for (const [src, asset] of assets) {
    assert.ok(src.startsWith("/"));
    assert.ok((await stat(new URL("../public" + src, import.meta.url))).size > 0, src);
    const metadata = await sharp(await readFile(new URL("../public" + src, import.meta.url))).metadata();
    assert.equal(metadata.width, asset.width, src);
    assert.equal(metadata.height, asset.height, src);
  }
  assert.equal(galleries.find((group) => group.title === "Pocket Engineer").items.length, 4);
  assert.equal(galleries.find((group) => group.title === "ProGenEDA").items.length, 2);
  assert.equal(galleries.find((group) => group.title === "Type2Learn").items.length, 2);
  assert.equal(galleries.find((group) => group.title === "Duke University").items.length, 4);
  assert.equal(galleries.find((group) => group.title.startsWith("Second Runner-Up")).items.length, 2);
});

test("project collaborators are credited without misclassifying the FOP project as a founder role", async () => {
  const html = await (await render("/experience")).text();
  for (const name of ["Alizay Hasan", "Lameea Mubashir Khan", "Idrees Babar", "Tooba Fatima", "Abdullah Ikram"]) assert.ok(html.includes(name));
  for (const account of ["alizay-debug", "rosseaaq", "meidreesbabar-crypto"]) assert.ok(html.includes("https://github.com/" + account));
  assert.ok(html.includes("https://www.linkedin.com/in/abdullah-ikram-"));
  const founderWork = html.split('id="founder-work"')[1].split('id="internships"')[0];
  assert.ok(founderWork.includes("ProGenEDA") && founderWork.includes("Type2Learn"));
  assert.ok(!founderWork.includes("Pocket Engineer"));
});

test("transparent PNG animation and original artwork stay within delivery budgets", async () => {
  const manifest = JSON.parse(
    await source("../public/art/notebook/sequence.json"),
  );
  assert.equal(manifest.frames.length, 40);
  let bytes = 0;
  for (const frame of manifest.frames) {
    const file = new URL("../public" + frame.src, import.meta.url);
    const details = await stat(file);
    bytes += details.size;
    assert.equal(details.size, frame.bytes);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 960);
    assert.equal(meta.height, 760);
    assert.equal(meta.hasAlpha, true);
  }
  assert.equal(bytes, manifest.totalBytes);
  assert.ok(bytes < 700_000);
  assert.ok(
    (await stat(new URL("../public/og.png", import.meta.url))).size < 100_000,
  );
  const shell = await source("../app/components/experience-shell.tsx");
  assert.doesNotMatch(
    shell,
    /setTimeout|lenis|scrollY|requestAnimationFrame\(tick/,
  );
  const sequence = await source("../app/components/scroll-notebook.tsx");
  assert.match(sequence, /cache\.size\s*>\s*8/);
  assert.ok(sequence.includes("prefers-reduced-motion"));
});
