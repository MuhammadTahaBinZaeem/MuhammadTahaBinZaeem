import { cp, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const siteRoot = resolve(import.meta.dirname, "..");
const generatedSource = resolve(
  siteRoot,
  "..",
  ".reference-sources",
  "generated",
  "og",
  "copper-field-background.png",
);
const imageSource = "C:/Users/Empty/.codex/generated_images/019fe320-9509-78c0-97d0-4efc81d0a2d3/exec-4a31622e-0b89-4bf5-95f2-7d58a69eaca5.png";
const output = resolve(siteRoot, "public", "og.png");

await mkdir(dirname(generatedSource), { recursive: true });
await cp(imageSource, generatedSource, { force: true });

const label = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect x="54" y="50" width="6" height="476" fill="#d9853e"/>
  <text x="86" y="98" fill="#a7b56c" font-family="Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="4">FIELD SYSTEM / 00</text>
  <text x="86" y="216" fill="#ede2c8" font-family="Arial Black, Arial, sans-serif" font-size="58" font-weight="900" letter-spacing="-3">MUHAMMAD TAHA</text>
  <text x="86" y="282" fill="#d9853e" font-family="Arial Black, Arial, sans-serif" font-size="58" font-weight="900" letter-spacing="-3">BIN ZAEEM</text>
  <line x1="86" y1="326" x2="470" y2="326" stroke="#ede2c8" stroke-opacity="0.38"/>
  <text x="86" y="365" fill="#ede2c8" fill-opacity="0.78" font-family="Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="2">COMPUTER ENGINEER / SYSTEM BUILDER</text>
  <text x="86" y="520" fill="#ede2c8" fill-opacity="0.6" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="3">TAHABINZAEEM.TECH</text>
</svg>`);

const emblem = await sharp(resolve(siteRoot, "public", "media", "identity", "mtbz-signal-mark.webp"))
  .resize(132, 132, { fit: "contain" })
  .png()
  .toBuffer();

await sharp(generatedSource)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([
    { input: Buffer.from("<svg width=\"1200\" height=\"630\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"610\" height=\"630\" fill=\"#0b0c0a\" fill-opacity=\"0.18\"/></svg>") },
    { input: emblem, left: 906, top: 72 },
    { input: label, top: 0, left: 0 },
  ])
  .png({ palette: true, quality: 86, colours: 256, dither: 0.55, compressionLevel: 9 })
  .toFile(output);

const metadata = await sharp(output).metadata();
const bytes = (await stat(output)).size;
if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== "png") {
  throw new Error(`Unexpected OG output: ${JSON.stringify(metadata)}`);
}
if (bytes > 700_000) {
  throw new Error(`OG image exceeds 700 KB budget (${bytes} bytes)`);
}

console.log(`Built ${output} (${metadata.width}x${metadata.height}, ${bytes} bytes)`);
