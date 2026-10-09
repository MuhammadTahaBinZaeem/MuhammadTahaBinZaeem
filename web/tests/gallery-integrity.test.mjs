import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import ts from "typescript";

const webRoot = fileURLToPath(new URL("../", import.meta.url));
const ROUTES = ["/", "/projects", "/research", "/experience", "/education", "/certifications", "/achievements", "/connect"];
const decodeHtml = (value) => value.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const attribute = (html, name) => {
  const match = html.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`));
  return match ? decodeHtml(match[1]) : undefined;
};
function galleries(html) {
  return [...html.matchAll(/<a\b[^>]*\bdata-gallery="[^"]*"[^>]*>/g)].map(([anchor]) => ({
    ...JSON.parse(attribute(anchor, "data-gallery")),
    selected: attribute(anchor, "data-gallery-src"),
    href: attribute(anchor, "href"),
    popup: attribute(anchor, "aria-haspopup"),
  }));
}
const sources = (items) => items.map((item) => item.src);
const unique = (items) => [...new Map(items.map((item) => [item.src, item])).values()];
function assertCollection(groups, title, items, context) {
  const matching = groups.filter((group) => group.title === title);
  assert.ok(matching.length, `${context}: ${title} has an image library`);
  for (const group of matching)
    assert.deepEqual(sources(group.items), sources(unique(items)), `${context}: ${title} contains only its curated images, in order`);
  return matching;
}

// Transpile only the small modules being exercised, without another full
// TypeScript program or production build. Overrides simulate real content edits
// in memory and leave the owner's files and shipped arrays untouched.
const compiled = new Map();
function moduleLoader(overrides = new Map()) {
  const cache = new Map();
  return function load(relativeOrAbsolute) {
    const filename = path.resolve(webRoot, relativeOrAbsolute);
    if (overrides.has(filename)) return overrides.get(filename);
    if (cache.has(filename)) return cache.get(filename);
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule.exports);
    const nativeRequire = createRequire(filename);
    const require = (specifier) => {
      if (specifier.endsWith(".css")) return {};
      if (specifier === "next/link") return function Link(props) {
        const attributes = { ...props };
        delete attributes.prefetch;
        return createElement("a", attributes);
      };
      if (specifier.startsWith(".")) {
        const base = path.resolve(path.dirname(filename), specifier);
        const target = [base, base + ".ts", base + ".tsx"].find((candidate) => existsSync(candidate));
        if (target?.endsWith(".ts") || target?.endsWith(".tsx")) return load(target);
      }
      return nativeRequire(specifier);
    };
    if (!compiled.has(filename)) compiled.set(filename, ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText);
    new Function("require", "module", "exports", compiled.get(filename))(require, loadedModule, loadedModule.exports);
    cache.set(filename, loadedModule.exports);
    return loadedModule.exports;
  };
}
const load = moduleLoader();
const data = load("app/portfolio-data.ts");
const dossier = load("app/dossier-data.ts");
const { COLLABORATORS } = load("app/collaborators-data.ts");
const { PROJECT_GALLERIES } = load("app/project-galleries.ts");
const { CHAPTER_ARTWORK, CHAPTER_AUTHOR } = load("app/chapter-artwork.ts");
const { HOME_INTRO } = load("app/homepage-data.ts");
const { GalleryImage, EntryGallery } = load("app/components/gallery-image.tsx");

let workerPromise;
const rendered = new Map();
async function render(route) {
  if (!rendered.has(route)) rendered.set(route, (async () => {
    workerPromise ??= import(new URL("../dist/server/index.js", import.meta.url).href).then((module) => module.default);
    const response = await (await workerPromise).fetch(new Request("http://localhost" + route, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200, route);
    return galleries(await response.text());
  })());
  return rendered.get(route);
}
const assetA = { src: "/media/test-owner-a.webp", width: 40, height: 30, alt: "First owner photograph", caption: "First original frame" };
const assetB = { src: "/media/test-owner-b.webp", width: 30, height: 40, alt: "Second owner photograph", caption: "Second original frame" };
const cover = { src: "/art/test-cover.svg", width: 40, height: 30, alt: "A decorative displayed cover" };

test("explicit image libraries never acquire the displayed cover implicitly", () => {
  const [group] = galleries(renderToStaticMarkup(createElement(GalleryImage, { image: cover, images: [assetA, assetB], title: "A curated record" })));
  assert.deepEqual(group.items, [assetA, assetB]);
  assert.equal(group.selected, assetA.src, "An absent displayed cover selects the first actual library image");
  assert.equal(group.href, assetA.src, "The no-JavaScript link opens that same real library image");
  const [selected] = galleries(renderToStaticMarkup(createElement(GalleryImage, { image: assetB, images: [assetA, assetB], title: "A curated record" })));
  assert.equal(selected.selected, assetB.src);
  assert.equal(selected.href, assetB.src);
  for (const props of [{ image: cover }, { image: cover, images: [] }]) {
    const [standalone] = galleries(renderToStaticMarkup(createElement(GalleryImage, { ...props, title: "Standalone illustration" })));
    assert.deepEqual(standalone.items, [cover]);
    assert.equal(standalone.selected, cover.src);
    assert.equal(standalone.href, cover.src);
  }
});

test("optional record evidence preserves its exact library and omits empty controls", () => {
  for (const entry of [{}, { media: [] }])
    assert.equal(renderToStaticMarkup(createElement(EntryGallery, { entry, title: "Optional record" })), "");
  const [group] = galleries(renderToStaticMarkup(createElement(EntryGallery, { entry: { media: [assetB, assetA] }, title: "Optional record" })));
  assert.deepEqual(group.items, [assetB, assetA], "Source order, alt text and captions stay intact");
  assert.equal(group.selected, assetB.src);
});

test("every rendered library has valid ownership selection and no repeated files or pixel-identical views", async () => {
  const fingerprints = new Map();
  const checked = new Set();
  async function fingerprint(src) {
    if (!fingerprints.has(src)) fingerprints.set(src, (async () => {
      assert.ok(src.startsWith("/") && !src.startsWith("//"), src + " is a local curated asset");
      const file = await readFile(path.join(webRoot, "public", src));
      const { data: pixels, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      return {
        binary: createHash("sha256").update(file).digest("hex"),
        pixels: createHash("sha256").update(`${info.width}x${info.height}:${info.channels}:`).update(pixels).digest("hex"),
      };
    })());
    return fingerprints.get(src);
  }
  for (const route of ROUTES) {
    const groups = await render(route);
    assert.ok(groups.length, route + " contains accessible image libraries");
    for (const group of groups) {
      assert.equal(group.popup, "dialog", route + " " + group.title);
      assert.ok(group.items.some((item) => item.src === group.selected), `${route}: ${group.title} selects one of its own images`);
      assert.equal(group.href, group.selected, `${route}: ordinary links retain the same image selection`);
      const label = `${route}: ${group.title}`;
      assert.equal(new Set(sources(group.items)).size, group.items.length, label + " has no repeated source URLs");
      const identity = JSON.stringify(group.items);
      if (checked.has(identity)) continue;
      checked.add(identity);
      const bytes = new Set();
      const frames = new Set();
      for (const item of group.items) {
        assert.ok(item.alt?.trim() && item.width > 0 && item.height > 0, label + " has complete image metadata");
        const hashes = await fingerprint(item.src);
        assert.ok(!bytes.has(hashes.binary), label + ": duplicated file under another URL: " + item.src);
        assert.ok(!frames.has(hashes.pixels), label + ": identical decoded frame under another URL: " + item.src);
        bytes.add(hashes.binary);
        frames.add(hashes.pixels);
      }
    }
  }
});

test("education, achievements and credential issuers keep their own original records separate from artwork", async () => {
  for (const route of ["/", "/education"]) {
    const groups = await render(route);
    for (const entry of data.EDUCATION) {
      if (entry.campus) {
        const artwork = groups.filter((group) => group.items.some((image) => image.src === entry.campus.src));
        assert.ok(artwork.length, route + " " + entry.institution + " retains its campus illustration viewer");
        for (const group of artwork) assert.deepEqual(sources(group.items), [entry.campus.src], "Campus concept art never enters an educational evidence archive");
      }
      const archiveTitle = entry.institution + " · education archive";
      if (entry.media.length) assertCollection(groups, archiveTitle, entry.media, route);
      else assert.ok(!groups.some((group) => group.title === archiveTitle), "An institution without supplied evidence has no borrowed photo collection");
    }
  }
  for (const route of ["/", "/achievements"]) {
    const groups = await render(route);
    for (const entry of [...data.ACHIEVEMENTS, ...data.ACHIEVEMENT_SPOTLIGHTS])
      if (entry.media?.length) assertCollection(groups, entry.title, entry.media, route);
    assert.ok(!groups.some((group) => /Samar|Mubarakmand/i.test(group.title)), "Removed meeting material stays outside every achievement library");
  }
  for (const route of ["/", "/certifications"]) {
    const groups = await render(route);
    for (const issuer of data.CERTIFICATE_GROUPS) {
      const records = data.CERTIFICATES.filter((certificate) => certificate.groupId === issuer.id);
      if (!records.length) continue;
      const items = records.flatMap((certificate) => [certificate.preview, ...(certificate.media || [])]);
      const collection = assertCollection(groups, issuer.name, items, route);
      for (const certificate of records)
        assert.ok(collection.some((group) => group.selected === certificate.preview.src), certificate.title + " can open on its own original certificate");
    }
  }
});

test("project, portrait and chapter libraries remain local to their content owner", async () => {
  for (const route of ["/", "/projects"]) {
    const groups = await render(route);
    for (const entry of dossier.FEATURED) {
      const legacy = data.PROJECTS.find((project) => project.id === entry.legacyId);
      const related = [...(entry.media || []), ...(PROJECT_GALLERIES[entry.id] || []), ...(legacy?.media || [])];
      const items = entry.image ? [entry.image, ...related] : related.length ? related : [{ src: `/art/notebook/${entry.drawing}.svg` }];
      assertCollection(groups, entry.title, items, route);
    }
    for (const entry of data.PROJECTS.filter((project) => !dossier.FEATURED.some((featured) => featured.legacyId === project.id))) {
      const images = [...(PROJECT_GALLERIES[entry.id] || []), ...entry.media];
      if (images.length) assertCollection(groups, entry.title, images, route);
    }
  }
  for (const route of ["/", "/experience"]) {
    const groups = await render(route);
    for (const person of COLLABORATORS) {
      if (person.background) assertCollection(groups, person.name + " · conceptual profile artwork", [person.background], route);
      if (person.portrait) assertCollection(groups, person.name + " · profile picture & photographs", [person.portrait, ...(person.media || [])], route);
      else if (person.media?.length) assertCollection(groups, person.name, person.media, route);
    }
  }
  const home = await render("/");
  assert.ok(home.some((group) => group.title === CHAPTER_AUTHOR.name && JSON.stringify(sources(group.items)) === JSON.stringify(sources(HOME_INTRO.portraits))), "The foreword owns its complete personal photo collection");
  for (const [chapter, artwork] of Object.entries(CHAPTER_ARTWORK)) {
    for (const route of ["/", "/" + chapter]) {
      const groups = await render(route);
      assertCollection(groups, artwork.atmosphere, [artwork.image, ...(artwork.media || [])], route);
      const authorStamps = groups.filter((group) => group.title === CHAPTER_AUTHOR.name && group.items.some((item) => item.src === CHAPTER_AUTHOR.image.src));
      assert.ok(authorStamps.length);
      for (const group of authorStamps) assert.deepEqual(sources(group.items), [CHAPTER_AUTHOR.image.src], "A chapter author stamp does not reopen the same foreword collection");
    }
  }
});

test("ordinary content edits add exact evidence collections across every chapter without decorative filler", () => {
  const media = [assetA, assetB];
  const featured = { ...dossier.FEATURED.find((entry) => entry.drawing), id: "edited-drawing-project", title: "Edited drawing project", media };
  const research = { ...dossier.RESEARCH[0], media };
  const founder = { ...dossier.FEATURED.find((entry) => entry.founderWork), title: "Edited founder record", media };
  const experience = { ...dossier.EXPERIENCE[0], media };
  const leadership = { ...dossier.LEADERSHIP[0], media };
  const cv = { ...dossier.CVS[0], media };
  const person = { ...COLLABORATORS.find((entry) => !entry.portrait), media };
  const education = { ...data.EDUCATION.find((entry) => entry.campus), media };
  const spotlight = { ...data.ACHIEVEMENT_SPOTLIGHTS[0], media };
  const achievement = { ...data.ACHIEVEMENTS[0], media };
  const certificate = { ...data.CERTIFICATES[0], media };
  const override = (relative, value) => [path.join(webRoot, relative), value];
  const nullComponent = () => null;
  const editedLoad = moduleLoader(new Map([
    override("app/seo.ts", { pageMetadata: () => ({}) }),
    override("app/seo-schema.tsx", { PageStructuredData: nullComponent, CollectionStructuredData: nullComponent }),
    override("app/components/story-motion.tsx", { StoryMotion: ({ children }) => children }),
    override("app/projects/repository-index.tsx", { RepositoryIndex: nullComponent }),
    override("app/dossier-data.ts", { ...dossier, FEATURED: [featured, founder], RESEARCH: [research], EXPERIENCE: [experience], LEADERSHIP: [leadership], CVS: [cv] }),
    override("app/portfolio-data.ts", { ...data, PROJECTS: [], EDUCATION: [education], ACHIEVEMENTS: [achievement], ACHIEVEMENT_SPOTLIGHTS: [spotlight], CERTIFICATES: [certificate] }),
    override("app/project-galleries.ts", { PROJECT_GALLERIES: {} }),
    override("app/collaborators-data.ts", { COLLABORATORS: [person] }),
  ]));
  const chapterCases = [
    ["projects", "ProjectsChapter", [[featured.title, media]]],
    ["research", "ResearchChapter", [[research.title, media]]],
    ["experience", "ExperienceChapter", [[founder.title, media], [experience.organization, media], [leadership.organization, media], [person.name, media]]],
    ["education", "EducationChapter", [[education.institution + " · education archive", media]]],
    ["certifications", "CertificationsChapter", [[data.CERTIFICATE_GROUPS.find((group) => group.id === certificate.groupId).name, [certificate.preview, ...media]]]],
    ["achievements", "AchievementsChapter", [[spotlight.title, media], [achievement.title, media]]],
    ["connect", "ConnectChapter", [[cv.title, media]]],
  ];
  for (const [chapter, exportName, expectations] of chapterCases) {
    const Component = editedLoad(`app/${chapter}/page.tsx`)[exportName];
    const groups = galleries(renderToStaticMarkup(createElement(Component, { embedded: true })));
    for (const [title, items] of expectations) assertCollection(groups, title, items, "Edited " + chapter);
    if (chapter === "projects") {
      const [group] = groups.filter((entry) => entry.title === featured.title);
      assert.equal(group.selected, assetA.src);
      assert.equal(group.href, assetA.src, "A displayed concept drawing opens the edited evidence group without joining it");
    }
  }
});
