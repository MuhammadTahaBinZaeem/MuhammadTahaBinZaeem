import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runBookChecks } from "./book-interactions.mjs";
import { runPocketChecks } from "./pocket-engineer-checks.mjs";
import { runGalleryChecks } from "./gallery-checks.mjs";

// Uses an installed Chrome/Chromium; no extra browser dependency or download.
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = process.env.TEST_OUTPUT_DIR || path.join(root, "qa-artifacts", "book-browser");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const routes = [
  "",
  "projects",
  "research",
  "experience",
  "education",
  "certifications",
  "achievements",
  "connect",
];
const report = { checks: [], screenshots: [], errors: [], performance: {} };
// Readiness follows the pixels a screenshot can contain. In a horizontal rail,
// vertically aligned images can remain thousands of pixels outside its clip.
const visibleImages = `Array.from(document.images).filter(image => {
  if (image.closest('details:not([open])')) return false;
  const bounds = image.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return false;
  let left = Math.max(0, bounds.left), right = Math.min(innerWidth, bounds.right);
  let top = Math.max(0, bounds.top), bottom = Math.min(innerHeight, bounds.bottom);
  for (let node = image; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.visibility === 'hidden' || style.visibility === 'collapse' || style.display === 'none' || Number(style.opacity) === 0) return false;
    const clip = node.getBoundingClientRect();
    const paintContained = /(?:paint|strict|content)/.test(style.contain);
    if (paintContained || /^(hidden|clip|scroll|auto)$/.test(style.overflowX)) {
      left = Math.max(left, clip.left); right = Math.min(right, clip.right);
    }
    if (paintContained || /^(hidden|clip|scroll|auto)$/.test(style.overflowY)) {
      top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom);
    }
    if (right <= left || bottom <= top) return false;
  }
  return right > left && bottom > top;
})`;

async function browserPath() {
  if (process.env.BROWSER_PATH) return process.env.BROWSER_PATH;
  const cache =
    process.env.LOCALAPPDATA &&
    path.join(process.env.LOCALAPPDATA, "ms-playwright");
  if (cache && existsSync(cache)) {
    for (const dir of (await readdir(cache))
      .filter((n) => /^chromium-\d+$/.test(n))
      .sort()
      .reverse()) {
      for (const platform of ["chrome-win64", "chrome-win"]) {
        const candidate = path.join(cache, dir, platform, "chrome.exe");
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  for (const candidate of [
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    "Set BROWSER_PATH to an installed Chrome/Chromium executable.",
  );
}

class Cdp {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }
  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", ({ data }) => {
      const event = JSON.parse(String(data));
      if (event.id) {
        const task = this.pending.get(event.id);
        if (!task) return;
        clearTimeout(task.timer);
        this.pending.delete(event.id);
        if (event.error) task.reject(new Error(event.error.message));
        else task.resolve(event.result);
      } else
        for (const handler of this.listeners.get(event.method) || [])
          handler(event.params);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("CDP timeout: " + method));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, handler) {
    this.listeners.set(method, [
      ...(this.listeners.get(method) || []),
      handler,
    ]);
  }
  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails)
      throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  }
  close() {
    this.socket.close();
  }
}

await mkdir(output, { recursive: true });
assert.equal(
  (await fetch(base)).status,
  200,
  "Start the built Cloudflare preview with npm start before browser tests.",
);
const profile = await mkdtemp(path.join(tmpdir(), "taha-notebook-qa-"));
const chrome = spawn(
  await browserPath(),
  [
    "--headless=new",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
let cdp;
try {
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt++)
    await sleep(100);
  const port = (await readFile(portFile, "utf8")).split("\n")[0];
  let pageTarget;
  for (let attempt = 0; attempt < 80 && !pageTarget; attempt++) {
    const targets = await (
      await fetch(`http://127.0.0.1:${port}/json/list`)
    ).json();
    pageTarget = targets.find((target) => target.type === "page");
    if (!pageTarget) await sleep(100);
  }
  assert.ok(pageTarget, "Chrome did not create a page target");
  cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
  await cdp.open();
  cdp.on("Runtime.exceptionThrown", (e) =>
    report.errors.push({ type: "exception", details: e.exceptionDetails }),
  );
  cdp.on("Runtime.consoleAPICalled", (e) => {
    if (e.type === "error")
      report.errors.push({ type: "console", args: e.args });
  });
  cdp.on("Network.responseReceived", (e) => {
    if (e.response.status >= 400)
      report.errors.push({
        type: "http",
        url: e.response.url,
        status: e.response.status,
      });
  });
  await Promise.all([
    cdp.send("Page.enable"),
    cdp.send("Runtime.enable"),
    cdp.send("Network.enable"),
    cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true }),
  ]);

  async function until(expression, label) {
    for (let i = 0; i < 80; i++) {
      if (await cdp.evaluate(expression)) return;
      await sleep(100);
    }
    throw new Error("Timed out: " + label);
  }
  async function navigate(route) {
    // Leave the current document first. A hash-only Page.navigate followed by
    // reload races the book's hash/history handler and can reload the old hash.
    await cdp.send("Page.navigate", { url: "about:blank" });
    await until(`location.href==='about:blank'`, "blank navigation bridge");
    await cdp.send("Page.navigate", {
      url: `${base}/${route}`,
    });
    await until(
      `document.readyState==='complete' && location.pathname===${JSON.stringify("/" + route.split("#")[0])} && !!document.querySelector('main')`,
      route || "home",
    );
    await cdp.evaluate("document.fonts.ready.then(()=>true)");
    await sleep(550);
    if (!route.split("#")[0])
      await until(
        `!!document.querySelector('.living-book[data-mode]')`,
        "book initialized",
      );
  }
  async function viewport(width, height = 900) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 500,
    });
  }
  async function screenshot(name) {
    // Allow real lazy images to finish before judging the composition.
    if (!name.includes("tearing") && !name.includes("without-javascript")) {
      try {
        await until(
          `${visibleImages}.every(i=>i.complete&&i.naturalWidth>0)`,
          "visible images: " + name,
        );
      } catch (error) {
        report.imageReadinessFailure = await cdp.evaluate(`(()=>({name:${JSON.stringify(name)},scrollY,chapter:document.querySelector('.living-book')?.dataset.chapter,images:${visibleImages}.filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>({src:i.currentSrc||i.src,loading:i.loading,complete:i.complete,naturalWidth:i.naturalWidth,bounds:i.getBoundingClientRect().toJSON(),world:i.closest('.book-world')?.id,ancestors:(()=>{const nodes=[];for(let node=i.parentElement;node&&nodes.length<8;node=node.parentElement){const style=getComputedStyle(node);nodes.push({className:node.className,bounds:node.getBoundingClientRect().toJSON(),overflowX:style.overflowX,overflowY:style.overflowY,visibility:style.visibility,opacity:style.opacity})}return nodes})()}))}))()`);
        console.error(JSON.stringify(report.imageReadinessFailure, null, 2));
        throw error;
      }
      // Network completion does not guarantee async image decoding or painting.
      await cdp.evaluate(`(async()=>{
        const visible=${visibleImages};
        await Promise.all(visible.map(i=>i.decode()));
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        await Promise.all((document.querySelector('.gallery-full-image')?.getAnimations()||[]).map(animation=>animation.finished));
      })()`);
    }
    const capture = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(output, name + ".png"),
      Buffer.from(capture.data, "base64"),
    );
    report.screenshots.push(name + ".png");
  }

  if (!process.env.POCKET_ONLY && !process.env.BOOK_ONLY && !process.env.POLISH_ONLY) await runGalleryChecks({ cdp, navigate, viewport, until, sleep, screenshot, report });
  if (!process.env.GALLERY_ONLY && !process.env.BOOK_ONLY && !process.env.POLISH_ONLY) await runPocketChecks({ cdp, navigate, viewport, until, sleep, screenshot, report });

  for (const width of process.env.BOOK_ONLY || process.env.PROJECT_ONLY || process.env.GALLERY_ONLY || process.env.POCKET_ONLY || process.env.POLISH_ONLY ? [] : [320, 390, 768, 1440]) {
    await viewport(width);
    for (const route of routes) {
      await navigate(route);
      const state = await cdp.evaluate(
        `({css:document.styleSheets.length,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})`,
      );
      assert.ok(state.css > 0, route + " CSS");
      assert.equal(
        state.overflow,
        false,
        `${route} horizontal overflow at ${width}`,
      );
      assert.equal(state.h1, 1, route + " main heading");
      assert.deepEqual(state.broken, [], route + " missing images");
      await screenshot(`${route || "home"}-${width}`);
    }
  }
  if (!process.env.BOOK_ONLY && !process.env.PROJECT_ONLY && !process.env.GALLERY_ONLY && !process.env.POCKET_ONLY && !process.env.POLISH_ONLY)
    report.checks.push(
      "Eight routes at 320, 390, 768 and 1440 pixels; no overflow or broken images.",
    );

  if (!process.env.PROJECT_ONLY && !process.env.GALLERY_ONLY && !process.env.POCKET_ONLY) await runBookChecks({
    cdp,
    navigate,
    viewport,
    screenshot,
    until,
    sleep,
    report,
  });

  await navigate("connect");
  const pdfs = await cdp.evaluate(
    `[...new Set([...document.querySelectorAll('a[href^="/cv/"]')].map(a=>a.getAttribute('href')))]`,
  );
  assert.equal(pdfs.length, 3);
  for (const pdf of pdfs) {
    const response = await fetch(base + pdf);
    assert.equal(response.status, 200, pdf);
    assert.match(response.headers.get("content-type"), /application\/pdf/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(
      bytes,
      await readFile(new URL("../public" + pdf, import.meta.url)),
      pdf + " exact delivery",
    );
  }
  report.checks.push(
    "All three CV PDFs return HTTP 200, application/pdf, and unchanged file bytes.",
  );

  await cdp.send("Emulation.setScriptExecutionDisabled", { value: true });
  await cdp.send("Page.navigate", { url: base + "/" });
  await sleep(1300);
  await screenshot("home-without-javascript");
  await cdp.send("Emulation.setScriptExecutionDisabled", { value: false });
  assert.equal(await cdp.evaluate(`document.querySelectorAll('h1').length`), 1);
  assert.equal(
    await cdp.evaluate(`document.querySelectorAll('.book-world').length`),
    9,
  );
  assert.equal(
    await cdp.evaluate(
      `getComputedStyle(document.querySelector('.book-world')).position`,
    ),
    "relative",
  );
  assert.equal(
    await cdp.evaluate(`document.querySelectorAll('main').length`),
    1,
  );
  report.checks.push(
    "All nine book worlds remain in normal, readable document flow without JavaScript.",
  );
  assert.deepEqual(report.errors, [], "No runtime, console or HTTP errors");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  cdp?.close();
  chrome.kill();
}
