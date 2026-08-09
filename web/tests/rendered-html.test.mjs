import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the portfolio shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>The Machine Remembers/i);
  assert.match(html, /Compiling the machine/i);
  assert.match(html, /THE MACHINE/);
  assert.match(html, /REMEMBERS/);
  assert.match(html, /YOUR NAME/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps identity content centralized and removes the starter skeleton", async () => {
  const [content, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(content, /PORTFOLIO CONTENT CONTROL PANEL/);
  assert.match(content, /name:\s*"YOUR NAME"/);
  assert.match(page, /from "\.\/content"/);
  assert.match(page, /MachineCanvas/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("ships every release-critical generated asset within its performance budget", async () => {
  const assets = [
    ["../public/models/machine-core.glb", 1_600_000],
    ["../public/generated/meshy-core-preview-hd.webp", 160_000],
    ["../public/og.png", 650_000],
    ["../public/generated/icons/brand-core.png", 32_000],
    ["../public/generated/icons/capability-silicon.png", 32_000],
    ["../public/generated/icons/capability-software.png", 32_000],
    ["../public/generated/icons/capability-intelligence.png", 32_000],
    ["../public/generated/icons/contact-source.png", 20_000],
    ["../public/generated/icons/contact-network.png", 20_000],
    ["../public/generated/icons/contact-signal.png", 20_000],
    ["../public/generated/icons/favicon-core.png", 20_000],
  ];

  for (const [relativePath, budget] of assets) {
    const details = await stat(new URL(relativePath, import.meta.url));
    assert.ok(details.size > 0, `${relativePath} must not be empty`);
    assert.ok(details.size <= budget, `${relativePath} exceeds ${budget} bytes`);
  }
});

test("keeps the audited interaction and fallback contracts in source", async () => {
  const [page, canvas, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/MachineCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /matchMedia\("\(max-width: 1100px\)"\)/);
  assert.match(page, /setMenuOpen\(false\)/);
  assert.match(page, /setAttribute\("inert", ""\)/);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /document\.hidden/);
  assert.match(page, /meshy-core-preview-hd\.webp/);
  assert.match(canvas, /frameloop=\{reducedMotion \|\| !active \? "demand" : "always"\}/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\.mobile-menu \{[\s\S]*overflow-y: auto/);
});
