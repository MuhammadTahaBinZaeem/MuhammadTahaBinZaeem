import assert from "node:assert/strict";

// Read-only post-deployment audit. No Search Console credentials or dependencies.
const base = new URL(process.env.SEO_AUDIT_ORIGIN || "http://localhost:3000");
const origin = "https://tahabinzaeem.tech";
const routes = ["/", "/projects", "/research", "/experience", "/education", "/certifications", "/achievements", "/connect"];
const profiles = ["https://github.com/MuhammadTahaBinZaeem", "https://www.linkedin.com/in/tahabinzaeem/", "https://devpost.com/MuhammadTahaBinZaeem", "https://lablab.ai/u/%40taha_zaeem65"];
const checks = [];
const titles = new Set();
const unescape = (text) => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
const request = (path, options = {}) => fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), redirect: "manual", ...options });

for (const path of routes) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path}: HTTP status`);
  assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex/i);
  const html = await response.text();
  const title = unescape(html.match(/<title>([^<]+)<\/title>/)?.[1] || "");
  const meta = (name) => {
    const tags = [...html.matchAll(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`, "g"))];
    assert.equal(tags.length, 1, `${path}: exactly one ${name}`);
    return unescape(tags[0][1]);
  };
  assert.ok(title.includes("Muhammad Taha Bin Zaeem"));
  assert.ok(!titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal(meta("og:title"), title);
  assert.equal(meta("twitter:title"), title);
  assert.equal(meta("og:url"), origin + path);
  assert.equal(meta("og:description"), meta("description"));
  assert.equal(meta("twitter:description"), meta("description"));
  assert.equal(meta("og:image"), origin + "/og.png");
  assert.doesNotMatch(meta("robots"), /noindex|nofollow/);
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], origin + path);
  const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap((match) => { const schema = JSON.parse(match[1]); return schema["@graph"] || [schema]; });
  const person = nodes.find((node) => node["@type"] === "Person");
  assert.deepEqual([...person.sameAs].sort(), [...profiles].sort());
  assert.ok(nodes.some((node) => node["@id"] === origin + path + "#webpage"));
  for (const profile of profiles) assert.ok(html.includes(`href="${profile}"`), `${path}: crawlable ${profile}`);
  checks.push({ path, status: response.status, title });
}

const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(urls.sort(), routes.map((path) => origin + path).sort());
const images = [...new Set([...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => unescape(match[1])))];
assert.ok(images.length >= 35, "Image sitemap present");
// Small batches keep this an inexpensive check against your own server.
for (let i = 0; i < images.length; i += 4) {
  await Promise.all(images.slice(i, i + 4).map(async (image) => {
    const response = await request(new URL(image).pathname, { method: "HEAD" });
    assert.equal(response.status, 200, image);
    assert.match(response.headers.get("content-type"), /^image\//, image);
  }));
}
const robotsResponse = await request("/robots.txt");
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
for (const bot of ["Googlebot", "Googlebot-Image", "Bingbot", "OAI-SearchBot"]) {
  assert.ok(new RegExp(`User-Agent: ${bot}\\s+Allow: /`, "i").test(robots), bot + " explicitly allowed");
}
assert.equal((await request("/not-a-real-page-seo-audit")).status, 404);
assert.equal((await request("/llms.txt")).status, 200);
if (base.hostname === "tahabinzaeem.tech") {
  const redirect = await request("http://tahabinzaeem.tech/projects/?ref=seo-audit");
  assert.ok([301, 308].includes(redirect.status), "Permanent HTTP-to-HTTPS redirect");
  assert.equal(redirect.headers.get("location"), origin + "/projects?ref=seo-audit");
}
console.log(JSON.stringify({ base: base.origin, result: "PASS", pages: checks, sitemapImages: images.length, checks: "Metadata, identity graph, crawlable profiles, sitemap, real image delivery, robots, 404 and production redirect", limitations: "Not a Google index-coverage, ranking, Rich Results Test or field Core Web Vitals report." }, null, 2));
