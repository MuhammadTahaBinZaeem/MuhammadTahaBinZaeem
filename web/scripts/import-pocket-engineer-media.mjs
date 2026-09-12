import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Actual application evidence, pinned for reproducible portfolio updates.
const repository = "MuhammadTahaBinZaeem/FOP-Project";
const revision = "78380ea15a05f9f4ae99b503d4eb5337710b1587";
const source = "docs/evidence/2026-09-06/layout-1440.png";
const payload = JSON.parse(execFileSync("gh", [
  "api", `repos/${repository}/contents/${source}?ref=${revision}`,
], { encoding: "utf8", windowsHide: true, maxBuffer: 2 * 1024 * 1024 }));
const output = new URL("../public/media/projects/pocket-engineer-workbench.webp", import.meta.url);
const result = await sharp(Buffer.from(payload.content, "base64"))
  .resize({ width: 1440, withoutEnlargement: true })
  .webp({ quality: 84, effort: 6 })
  .toFile(fileURLToPath(output));
console.log({ repository, revision, source, ...result });
