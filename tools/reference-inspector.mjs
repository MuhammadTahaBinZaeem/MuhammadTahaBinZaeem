import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const referenceRoot = join(workspace, ".reference-sources");
const port = Number(process.env.REFERENCE_INSPECTOR_PORT ?? 4177);
const host = "127.0.0.1";
const corepack = process.platform === "win32" ? "corepack.cmd" : "corepack";
const bun = process.platform === "win32" ? join(process.env.APPDATA ?? "", "npm", "bun.cmd") : "bun";
const ignoredGroups = new Set(["generated", "live-captures", "personal-pack-20260811"]);
const ignoredSuffixes = [".partial-", ".archive-", ".raw-"];
const running = new Map();

function isIgnoredDirectory(name) {
  return name.startsWith("_") || ignoredGroups.has(name) || ignoredSuffixes.some((suffix) => name.includes(suffix));
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
}

function packageManager(root, manifest) {
  const declared = manifest?.packageManager?.split("@")[0];
  if (declared && ["npm", "pnpm", "yarn", "bun"].includes(declared)) return declared;
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  if (existsSync(join(root, "bun.lockb")) || existsSync(join(root, "bun.lock"))) return "bun";
  return "npm";
}

function launchableScript(manifest) {
  const scripts = manifest?.scripts ?? {};
  for (const name of ["dev", "start", "preview"]) {
    if (typeof scripts[name] === "string") return name;
  }
  return null;
}

function makeId(group, repo) {
  return `${group}/${repo}`.replaceAll("\\", "/");
}

async function scanReferences() {
  if (!existsSync(referenceRoot)) return [];
  const installReport = await readJson(join(workspace, "qa-artifacts", "reference-preinstall-report.json"));
  const installation = installReport?.sites ?? {};
  const groups = await readdir(referenceRoot, { withFileTypes: true });
  const sites = [];

  for (const groupEntry of groups) {
    if (!groupEntry.isDirectory() || isIgnoredDirectory(groupEntry.name)) continue;
    const groupPath = join(referenceRoot, groupEntry.name);
    const repos = await readdir(groupPath, { withFileTypes: true });

    for (const repoEntry of repos) {
      if (!repoEntry.isDirectory() || isIgnoredDirectory(repoEntry.name)) continue;
      const root = join(groupPath, repoEntry.name);
      if (!existsSync(join(root, ".git"))) continue;

      const manifest = await readJson(join(root, "package.json"));
      const script = launchableScript(manifest);
      const manager = packageManager(root, manifest);
      const scripts = Object.keys(manifest?.scripts ?? {});
      const id = makeId(groupEntry.name, repoEntry.name);
      const provision = installation[id]?.status ?? (existsSync(join(root, "node_modules")) ? "ready" : "setup-needed");

      sites.push({
        id,
        group: groupEntry.name,
        name: repoEntry.name,
        path: relative(workspace, root),
        packageName: manifest?.name ?? null,
        manager,
        script,
        scripts,
        installed: provision === "ready",
        provision,
        kind: manifest ? (script ? "launchable" : "source-only") : "source-only",
      });
    }
  }

  return sites.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
}

function pickPort(id) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return 4300 + (hash % 1000);
}

function commandFor(site, appPort) {
  const manager = site.manager;
  const script = site.script;
  if (manager === "pnpm") return { command: corepack, args: ["pnpm", "run", script, "--", "--port", String(appPort)] };
  if (manager === "yarn") return { command: corepack, args: ["yarn", script, "--port", String(appPort)] };
  if (manager === "bun") return { command: bun, args: ["run", script, "--", "--port", String(appPort)] };
  return { command: "npm.cmd", args: ["run", script, "--", "--port", String(appPort)] };
}

function setupCommand(site) {
  const root = resolve(workspace, site.path);
  if (site.manager === "pnpm") return { command: corepack, args: ["pnpm", "install", "--no-frozen-lockfile"] };
  if (site.manager === "yarn") return { command: corepack, args: ["yarn", "install"] };
  if (site.manager === "bun") return { command: bun, args: ["install"] };
  return { command: "npm.cmd", args: [existsSync(join(root, "package-lock.json")) ? "ci" : "install"] };
}

function compactLog(entry) {
  const text = entry.log.join("");
  return text.length > 18_000 ? text.slice(-18_000) : text;
}

function stopEntry(entry) {
  if (!entry || !entry.process || entry.process.exitCode !== null) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(entry.process.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
  } else {
    entry.process.kill("SIGTERM");
  }
  entry.status = "stopping";
}

function runCommand(entry, command, args, cwd) {
  return new Promise((resolveTask) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, PORT: String(entry.appPort), BROWSER: "none" },
      windowsHide: true,
      shell: process.platform === "win32",
    });
    entry.process = child;
    const collect = (buffer) => {
      entry.log.push(buffer.toString());
      if (compactLog(entry).length > 18_000) entry.log = [compactLog(entry)];
    };
    child.stdout?.on("data", collect);
    child.stderr?.on("data", collect);
    child.on("error", (error) => {
      entry.log.push(`\n${error.message}\n`);
      resolveTask(1);
    });
    child.on("exit", (code) => resolveTask(code ?? 1));
  });
}

async function startSite(id) {
  const sites = await scanReferences();
  const site = sites.find((candidate) => candidate.id === id);
  if (!site) throw new Error("Unknown reference site.");
  if (!site.script) throw new Error("This repository has no local web launch script. Its source is still listed for inspection.");
  if (site.provision === "installing" || site.provision === "queued") throw new Error("Dependencies for this source are still being provisioned. Choose another ready source or wait for this one to finish.");
  if (site.provision === "failed") throw new Error("This source's local dependency installation failed. Its log is preserved in qa-artifacts/reference-preinstall.log.");
  for (const [runningId, entry] of running) {
    if (runningId !== id) stopEntry(entry);
  }
  const existing = running.get(id);
  if (existing?.status === "running" || existing?.status === "starting") return existing;

  const appPort = pickPort(id);
  const launch = commandFor(site, appPort);
  const root = resolve(workspace, site.path);
  const entry = {
    id,
    appPort,
    url: `http://${host}:${appPort}/`,
    status: "starting",
    log: [],
    process: null,
  };
  running.set(id, entry);
  void (async () => {
    if (!site.installed) {
      entry.status = "installing";
      entry.log.push(`Installing the selected repository's local dependencies…\n`);
      const setup = setupCommand(site);
      const setupCode = await runCommand(entry, setup.command, setup.args, root);
      if (setupCode !== 0) {
        if (entry.status !== "stopping") entry.status = "failed";
        return;
      }
    }
    if (entry.status === "stopping") return;
    entry.status = "running";
    entry.log.push(`Launching ${site.script} on ${entry.url}\n`);
    const exitCode = await runCommand(entry, launch.command, launch.args, root);
    if (entry.status !== "stopping") entry.status = exitCode === 0 ? "stopped" : "failed";
  })().catch((error) => {
    entry.status = "failed";
    entry.log.push(`\n${error instanceof Error ? error.message : "Launch failed."}\n`);
  });
  return entry;
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
}

function sendHtml(response) {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  response.end(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reference Site Inspector</title>
<style>
  :root{color-scheme:dark;--bg:#0b0c0a;--surface:#171812;--ink:#ede2c8;--muted:#b5ac97;--accent:#d9853e;--line:rgb(237 226 200/.18)}
  *{box-sizing:border-box} body{margin:0;background:radial-gradient(circle at 72% 0%,rgb(217 133 62/.13),transparent 34%),var(--bg);color:var(--ink);font:16px/1.45 system-ui,sans-serif}
  header{position:sticky;top:0;z-index:2;display:flex;align-items:end;justify-content:space-between;gap:1rem;padding:1.25rem clamp(1rem,4vw,4rem);border-bottom:1px solid var(--line);background:rgb(11 12 10/.92);backdrop-filter:blur(16px)} h1{margin:0;font-size:clamp(1.5rem,4vw,3rem);letter-spacing:-.04em} header p{margin:.25rem 0 0;color:var(--muted);font-size:.9rem} input{width:min(24rem,45vw);padding:.75rem .9rem;color:var(--ink);border:1px solid var(--line);background:var(--surface)} main{padding:1.5rem clamp(1rem,4vw,4rem) 4rem}.summary{display:flex;justify-content:space-between;gap:1rem;margin-bottom:1.3rem;color:var(--muted);font-size:.86rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}.card{min-height:225px;padding:1rem;border:1px solid var(--line);background:linear-gradient(140deg,rgb(217 133 62/.08),transparent 52%),var(--surface)}.eyebrow{color:var(--accent);font:700 .68rem/1 monospace;letter-spacing:.08em;text-transform:uppercase}.card h2{margin:.55rem 0;font-size:1rem;line-height:1.2;overflow-wrap:anywhere}.card p{margin:.45rem 0;color:var(--muted);font-size:.78rem}.tags{display:flex;flex-wrap:wrap;gap:.35rem;margin:1rem 0}.tag{padding:.28rem .38rem;border:1px solid var(--line);font:.61rem/1 monospace;color:var(--muted)}button,a.action{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:.6rem .75rem;color:var(--bg);border:0;background:var(--accent);font:800 .68rem/1 monospace;letter-spacing:.05em;text-decoration:none;cursor:pointer}.action[aria-disabled=true],button:disabled{opacity:.45;cursor:not-allowed}.detail{display:none;position:fixed;z-index:4;right:1rem;bottom:1rem;width:min(44rem,calc(100vw - 2rem));max-height:54vh;padding:1rem;border:1px solid var(--line);background:#11130f;box-shadow:0 28px 80px rgb(0 0 0/.5)}.detail[data-open=true]{display:block}.detail header{position:static;padding:0 0 .75rem;background:transparent;backdrop-filter:none}.detail pre{max-height:34vh;margin:0;overflow:auto;color:var(--muted);white-space:pre-wrap;font:.72rem/1.45 ui-monospace,monospace}.status{color:var(--accent)}@media(max-width:640px){header{align-items:start;flex-direction:column}input{width:100%}}
</style></head><body>
<header><div><h1>Reference Site Inspector</h1><p>One cloned source at a time. The portfolio itself remains at <a href="http://localhost:3000/" style="color:var(--accent)">localhost:3000</a>.</p></div><input id="search" placeholder="Filter repositories"></header>
<main><div class="summary"><span id="count">Scanning references…</span><span>Dependencies are provisioning in the background; ready sources launch immediately.</span></div><section class="grid" id="sites"></section></main>
<aside class="detail" id="detail"><header><strong id="detail-title">Local process</strong><button id="close" style="background:transparent;color:var(--ink);border:1px solid var(--line)">CLOSE</button></header><p id="detail-status" class="status"></p><p id="detail-url"></p><pre id="detail-log"></pre></aside>
<script>
const siteRoot=document.querySelector('#sites'),count=document.querySelector('#count'),search=document.querySelector('#search'),detail=document.querySelector('#detail'),detailTitle=document.querySelector('#detail-title'),detailStatus=document.querySelector('#detail-status'),detailUrl=document.querySelector('#detail-url'),detailLog=document.querySelector('#detail-log'); let sites=[];
function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))} function provisionLabel(s){return s.provision==='ready'?'dependencies ready':s.provision==='installing'?'installing dependencies':s.provision==='queued'?'queued for setup':s.provision==='failed'?'setup failed':'setup needed'} function render(){const q=search.value.toLowerCase();const list=sites.filter(s=>(s.name+' '+s.group+' '+s.packageName).toLowerCase().includes(q));count.textContent=list.length+' of '+sites.length+' cloned references';siteRoot.innerHTML=list.map(s=>'<article class="card"><div class="eyebrow">'+esc(s.group)+'</div><h2>'+esc(s.name)+'</h2><p>'+esc(s.path)+'</p><div class="tags"><span class="tag">'+esc(s.kind)+'</span><span class="tag">'+esc(s.manager)+'</span><span class="tag">'+esc(provisionLabel(s))+'</span></div>'+(s.script?'<button data-id="'+esc(s.id)+'" '+(s.provision==='installing'||s.provision==='queued'?'disabled':'')+'>'+(s.installed?'LAUNCH '+esc(s.script).toUpperCase():(s.provision==='installing'||s.provision==='queued'?'PROVISIONING…':'SET UP &amp; LAUNCH'))+'</button>':'<button disabled>SOURCE ONLY</button>')+'</article>').join('')}
async function refresh(){const r=await fetch('/api/sites');sites=await r.json();render()} search.addEventListener('input',render);siteRoot.addEventListener('click',async e=>{const button=e.target.closest('button[data-id]');if(!button)return;button.disabled=true;const id=button.dataset.id;const r=await fetch('/api/launch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id})});const data=await r.json();detail.dataset.open='true';detailTitle.textContent=id;detailStatus.textContent=data.status||data.error||'Starting';detailUrl.innerHTML=data.url?'<a class="action" href="'+data.url+'" target="_blank" rel="noreferrer">OPEN '+data.url+'</a>':'';detailLog.textContent=data.log||'';button.disabled=false;setTimeout(()=>poll(id),700)});async function poll(id){const r=await fetch('/api/status?id='+encodeURIComponent(id));const data=await r.json();detailStatus.textContent=data.status||'';detailUrl.innerHTML=data.url?'<a class="action" href="'+data.url+'" target="_blank" rel="noreferrer">OPEN '+data.url+'</a>':'';detailLog.textContent=data.log||'';if(data.status==='starting'||data.status==='running')setTimeout(()=>poll(id),1000)}document.querySelector('#close').onclick=()=>detail.dataset.open='false';refresh();
</script></body></html>`);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${host}:${port}`);
  if (request.method === "GET" && url.pathname === "/") return sendHtml(response);
  if (request.method === "GET" && url.pathname === "/api/sites") return sendJson(response, 200, await scanReferences());
  if (request.method === "GET" && url.pathname === "/api/status") {
    const entry = running.get(url.searchParams.get("id"));
    return sendJson(response, 200, entry ? { status: entry.status, url: entry.url, log: compactLog(entry) } : { status: "not running" });
  }
  if (request.method === "POST" && url.pathname === "/api/launch") {
    let body = "";
    for await (const chunk of request) body += chunk;
    try {
      const entry = await startSite(JSON.parse(body).id);
      return sendJson(response, 200, { status: entry.status, url: entry.url, log: compactLog(entry) });
    } catch (error) {
      return sendJson(response, 422, { error: error instanceof Error ? error.message : "Could not launch this site." });
    }
  }
  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Reference inspector is ready at http://${host}:${port}/`);
});

function shutdown() {
  for (const entry of running.values()) stopEntry(entry);
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
