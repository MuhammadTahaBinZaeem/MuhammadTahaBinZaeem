import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

let workerPromise;

async function loadWorker() {
  workerPromise ??= import(
    `${new URL("../dist/server/index.js", import.meta.url).href}?test=${process.pid}-${Date.now()}`
  ).then(({ default: worker }) => worker);
  return workerPromise;
}

async function render(pathname = "/") {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function readTextTree(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const chunks = [];

  for (const entry of entries) {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
    if (entry.isDirectory()) {
      chunks.push(await readTextTree(entryUrl));
    } else if (/\.(?:css|ts|tsx)$/.test(entry.name)) {
      chunks.push(await readFile(entryUrl, "utf8"));
    }
  }

  return chunks.join("\n");
}

async function assertAsset(relativePath, budget) {
  const details = await stat(new URL(relativePath, import.meta.url));
  assert.ok(details.size > 0, `${relativePath} must not be empty`);
  assert.ok(
    details.size <= budget,
    `${relativePath} is ${details.size} bytes and exceeds its ${budget}-byte budget`,
  );
  return details.size;
}

const ROUTES = [
  ["/", /THE HOUSE IS NOT A LIST/],
  ["/projects", /EIGHT MACHINES\. EIGHT LAWS OF PHYSICS\./],
  ["/certifications", /PROOF DOES NOT HANG STILL\. WALK THE RECORD\./],
  ["/achievements", /THE MOMENT THE WORK LEFT THE SCREEN\./],
  ["/education", /FORMATION IS A CIRCUIT, NOT A LADDER\./],
];

test("server-renders the complete five-route story with the real identity", async () => {
  for (const [pathname, routeSignature] of ROUTES) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must return 200`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, /Muhammad Taha Bin Zaeem/i, `${pathname} must retain the owner identity`);
    assert.match(html, routeSignature, `${pathname} must render its authored story`);
    assert.doesNotMatch(
      html,
      /YOUR NAME|YOUR CITY|your-handle|example\.com|Lorem ipsum|codex-preview|SkeletonPreview/i,
      `${pathname} must not expose starter copy`,
    );
  }
});

test("keeps identity, domain, and verified public destinations exact", async () => {
  const [portfolioData, layout, home, shell, siteConfig, schema, robots, sitemap, llms, appSource, packageText] =
    await Promise.all([
      readFile(new URL("../app/portfolio-data.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components/experience-shell.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/site-config.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/seo-schema.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/llms.txt/route.ts", import.meta.url), "utf8"),
      readTextTree(new URL("../app/", import.meta.url)),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
    ]);

  const packageJson = JSON.parse(packageText);
  const identitySource = `${portfolioData}\n${layout}\n${home}\n${shell}\n${siteConfig}`;
  const exactDestinations = [
    "https://tahabinzaeem.tech",
    "https://github.com/MuhammadTahaBinZaeem",
    "https://www.linkedin.com/in/tahabinzaeem/",
    "https://lablab.ai/u/%40taha_zaeem65",
    "https://type2learn.tech",
    "https://progeneda.app",
  ];

  assert.match(portfolioData, /name:\s*"Muhammad Taha Bin Zaeem"/);
  assert.match(layout, /creator:\s*"Muhammad Taha Bin Zaeem"/);
  for (const destination of exactDestinations) {
    assert.ok(identitySource.includes(destination), `missing verified destination: ${destination}`);
  }

  for (const alias of ["Muhammad Taha", "Taha Zaeem", "Taha Bin Zaeem", "tahabinzaeem"]) {
    assert.ok(`${layout}\n${home}\n${schema}\n${llms}`.includes(alias), `missing search alias: ${alias}`);
  }
  assert.match(schema, /ProfilePage/);
  assert.match(schema, /sameAs/);
  assert.match(schema, /CollectionPage/);
  assert.match(robots, /Googlebot/);
  assert.match(robots, /OAI-SearchBot/);
  assert.match(sitemap, /sitemap/);
  assert.match(llms, /Official public profiles and ventures/);

  assert.doesNotMatch(
    appSource,
    /YOUR NAME|YOUR CITY|your-handle|example\.com|Lorem ipsum|codex-preview|SkeletonPreview/i,
  );
  assert.doesNotMatch(
    appSource,
    /MachineCanvas|machine-core\.glb|meshy-core|@react-three|from\s+["']three["']/i,
  );

  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  assert.equal(allDependencies.three, undefined);
  assert.equal(allDependencies["@react-three/fiber"], undefined);
  assert.equal(allDependencies["@react-three/drei"], undefined);
});

test("publishes a crawlable machine-readable identity brief", async () => {
  const response = await render("/llms.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain\b/i);

  const brief = await response.text();
  assert.match(brief, /Muhammad Taha Bin Zaeem/);
  assert.match(brief, /https:\/\/github\.com\/MuhammadTahaBinZaeem/);
  assert.match(brief, /https:\/\/www\.linkedin\.com\/in\/tahabinzaeem\//);
  assert.match(brief, /https:\/\/lablab\.ai\/u\/%40taha_zaeem65/);
});

test("ships the original 2D identity sequence and critical imagery within budgets", async () => {
  const criticalAssets = [
    ["../public/og.png", 700_000],
    ["../public/media/identity/favicon.png", 70_000],
    ["../public/media/identity/mtbz-signal-mark.webp", 140_000],
    ["../public/media/identity/muhammad-taha-studio-portrait.webp", 80_000],
    ["../public/media/identity/muhammad-taha-mountain-field-note.webp", 180_000],
    ["../public/media/identity/muhammad-taha-medals-portrait.webp", 180_000],
    ["../public/media/ventures/progeneda-live.webp", 100_000],
    ["../public/media/ventures/type2learn-live.webp", 100_000],
    ["../public/media/ventures/debate-club-live.webp", 50_000],
    ["../public/media/projects/vector-cpu-showcase.webp", 160_000],
    ["../public/media/certificates/machine-learning-specialization.webp", 110_000],
    ["../public/media/achievements/sempec-award-presentation.webp", 110_000],
  ];

  for (const [relativePath, budget] of criticalAssets) {
    await assertAsset(relativePath, budget);
  }

  let sequenceBytes = 0;
  for (let frame = 1; frame <= 8; frame += 1) {
    sequenceBytes += await assertAsset(
      `../public/media/identity/signal-frame-${String(frame).padStart(2, "0")}.webp`,
      75_000,
    );
  }
  assert.ok(sequenceBytes <= 430_000, `2D signal sequence exceeds 430 KB (${sequenceBytes} bytes)`);
});

test("keeps every staged portfolio media and certificate record available", async () => {
  const [portfolioData, manifestText] = await Promise.all([
    readFile(new URL("../app/portfolio-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/media/media-manifest.json", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);
  const certificateEntries = Object.values(manifest.certificates);

  assert.equal(certificateEntries.length, 13, "the personal archive must stage all 13 source PDFs");

  let pdfBytes = 0;
  for (const certificate of certificateEntries) {
    const documentPath = `../public${certificate.publicPath}`;
    const previewPath = `../public${certificate.preview.publicPath}`;
    pdfBytes += await assertAsset(documentPath, 420_000);
    await assertAsset(previewPath, 110_000);
    assert.ok(portfolioData.includes(certificate.publicPath));
    assert.ok(portfolioData.includes(certificate.preview.publicPath));
  }
  assert.ok(pdfBytes <= 4_700_000, `certificate archive exceeds 4.7 MB (${pdfBytes} bytes)`);

  const referencedPaths = new Set(
    [...portfolioData.matchAll(/(?:src|documentUrl):\s*"(\/(?:media|certificates)\/[^"\n]+)"/g)]
      .map((match) => match[1]),
  );
  assert.ok(referencedPaths.size >= 50, "portfolio data should reference the complete staged archive");

  for (const publicPath of referencedPaths) {
    const details = await stat(new URL(`../public${publicPath}`, import.meta.url));
    assert.ok(details.size > 0, `${publicPath} must resolve to a non-empty staged asset`);
    if (publicPath.endsWith(".webp")) {
      assert.ok(details.size <= 310_000, `${publicPath} exceeds the 310 KB WebP ceiling`);
    }
  }
});

test("keeps mobile, reduced-motion, portal, and dwell-memory contracts in source", async () => {
  const [shell, motion, projects, styles] = await Promise.all([
    readFile(new URL("../app/components/experience-shell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/story-motion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/projects/projects-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(shell, /Array\.from\(\{ length: 8 \}/);
  assert.match(shell, /setAttribute\("inert", ""\)/);
  assert.match(shell, /removeAttribute\("inert"\)/);
  assert.match(shell, /matchMedia\("\(min-width: 1101px\)"\)/);
  assert.match(shell, /window\.addEventListener\("resize", onResize\)/);
  assert.match(shell, /window\.removeEventListener\("resize", onResize\)/);
  assert.match(shell, /lenis\.destroy\(\)/);
  assert.match(shell, /prefers-reduced-motion: reduce/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /return \(\) => context\.revert\(\)/);

  assert.match(projects, /document\.hidden/);
  assert.match(projects, /mtbz:project-dwell-scores/);
  assert.match(projects, /mtbz:dominant-project-theme/);
  assert.match(projects, /document\.documentElement\.dataset\.affinity/);
  assert.match(projects, /window\.clearInterval\(tick\)/);

  assert.match(styles, /\.mobile-rooms\s*\{[\s\S]{0,1400}overflow-y:\s*auto/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\) and \(hover: hover\) and \(pointer: fine\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(max-width: 760px\)/);
});
