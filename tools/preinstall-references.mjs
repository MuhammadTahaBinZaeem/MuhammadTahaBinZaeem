import { appendFile, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync as fileExists } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const referenceRoot = join(workspace, ".reference-sources");
const artifacts = join(workspace, "qa-artifacts");
const logFile = join(artifacts, "reference-preinstall.log");
const reportFile = join(artifacts, "reference-preinstall-report.json");
const concurrencyIndex = process.argv.indexOf("--concurrency");
const requestedConcurrency = concurrencyIndex >= 0 ? Number(process.argv[concurrencyIndex + 1]) : 3;
const concurrency = Math.min(4, Math.max(1, Number.isFinite(requestedConcurrency) ? requestedConcurrency : 3));
const ignoredGroups = new Set(["generated", "live-captures", "personal-pack-20260811"]);
const corepack = process.platform === "win32" ? "corepack.cmd" : "corepack";
const bun = process.platform === "win32" ? join(process.env.APPDATA ?? "", "npm", "bun.cmd") : "bun";

const report = { startedAt: new Date().toISOString(), concurrency, sites: {} };

function ignored(name) {
  return name.startsWith("_") || ignoredGroups.has(name) || name.includes(".partial-") || name.includes(".archive-") || name.includes(".raw-");
}

async function json(path) {
  try { return JSON.parse(await readFile(path, "utf8")); } catch { return null; }
}

function managerFor(root, manifest) {
  const declared = manifest?.packageManager?.split("@")[0];
  if (["npm", "pnpm", "yarn", "bun"].includes(declared)) return declared;
  if (fileExists(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (fileExists(join(root, "yarn.lock"))) return "yarn";
  if (fileExists(join(root, "bun.lock")) || fileExists(join(root, "bun.lockb"))) return "bun";
  return "npm";
}

function installCommand(site) {
  if (site.manager === "pnpm") return [corepack, ["pnpm", "install", "--no-frozen-lockfile"]];
  if (site.manager === "yarn") return [corepack, ["yarn", "install"]];
  if (site.manager === "bun") return [bun, ["install"]];
  return ["npm.cmd", [fileExists(join(site.root, "package-lock.json")) ? "ci" : "install", "--no-audit", "--no-fund"]];
}

function run(command, args, cwd, output) {
  return new Promise((done) => {
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      windowsHide: true,
      env: { ...process.env, CI: "true", npm_config_audit: "false", npm_config_fund: "false" },
    });
    child.stdout.on("data", (data) => output(data.toString()));
    child.stderr.on("data", (data) => output(data.toString()));
    child.on("error", (error) => { output(`\n${error.message}\n`); done(1); });
    child.on("exit", (code) => done(code ?? 1));
  });
}

async function saveReport() {
  report.updatedAt = new Date().toISOString();
  await writeFile(reportFile, JSON.stringify(report, null, 2));
}

async function scan() {
  const sites = [];
  for (const group of await readdir(referenceRoot, { withFileTypes: true })) {
    if (!group.isDirectory() || ignored(group.name)) continue;
    const groupRoot = join(referenceRoot, group.name);
    for (const repo of await readdir(groupRoot, { withFileTypes: true })) {
      if (!repo.isDirectory() || ignored(repo.name)) continue;
      const root = join(groupRoot, repo.name);
      if (!fileExists(join(root, ".git"))) continue;
      const manifest = await json(join(root, "package.json"));
      const scripts = manifest?.scripts ?? {};
      const script = ["dev", "start", "preview"].find((name) => typeof scripts[name] === "string");
      if (!script) continue;
      sites.push({ id: `${group.name}/${repo.name}`, root, manager: managerFor(root, manifest) });
    }
  }
  return sites.sort((a, b) => a.id.localeCompare(b.id));
}

async function install(site) {
  if (fileExists(join(site.root, "node_modules"))) {
    report.sites[site.id] = { status: "ready", manager: site.manager, path: relative(workspace, site.root), skipped: true, updatedAt: new Date().toISOString() };
    await saveReport();
    return;
  }
  report.sites[site.id] = { status: "installing", manager: site.manager, path: relative(workspace, site.root), updatedAt: new Date().toISOString() };
  await saveReport();
  await appendFile(logFile, `\n\n=== ${site.id} (${site.manager}) ===\n`);
  const [command, args] = installCommand(site);
  const write = (text) => appendFile(logFile, text);
  const exitCode = await run(command, args, site.root, write);
  report.sites[site.id] = { status: exitCode === 0 ? "ready" : "failed", manager: site.manager, path: relative(workspace, site.root), command: [command, ...args].join(" "), updatedAt: new Date().toISOString() };
  await saveReport();
}

const sites = await scan();
await writeFile(logFile, `Reference dependency provisioning started ${new Date().toISOString()} with concurrency ${concurrency}.\n`);
for (const site of sites) report.sites[site.id] ??= { status: "queued", manager: site.manager, path: relative(workspace, site.root) };
await saveReport();

let cursor = 0;
async function worker() {
  while (cursor < sites.length) {
    const site = sites[cursor++];
    await install(site);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
report.completedAt = new Date().toISOString();
await saveReport();
console.log(`Provisioned ${sites.length} launchable references. Report: ${reportFile}`);
