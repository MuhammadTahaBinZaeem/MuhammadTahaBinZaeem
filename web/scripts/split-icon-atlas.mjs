#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [input, output = "public/generated/icons"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/split-icon-atlas.mjs <atlas.png> [output-directory]");
  process.exit(1);
}
const names = [
  "brand-core",
  "capability-silicon",
  "capability-software",
  "capability-intelligence",
  "contact-source",
  "contact-network",
  "contact-signal",
  "favicon-core",
];

const source = sharp(input).ensureAlpha();
const metadata = await source.metadata();
if (!metadata.width || !metadata.height || metadata.width % 4 || metadata.height % 2) {
  throw new Error("The icon atlas must be an evenly divisible 4 × 2 grid.");
}

const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
const cellWidth = info.width / 4;
const cellHeight = info.height / 2;
await mkdir(output, { recursive: true });

function isolateCell(column, row) {
  const width = cellWidth;
  const height = cellHeight;
  const pixels = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const sourceStart = ((row * height + y) * info.width + column * width) * 4;
    data.copy(pixels, y * width * 4, sourceStart, sourceStart + width * 4);
  }

  const count = width * height;
  const background = new Uint8Array(count);
  const queue = new Int32Array(count);
  let head = 0;
  let tail = 0;

  const isBackgroundColor = (index) => {
    const offset = index * 4;
    const red = pixels[offset];
    const green = pixels[offset + 1];
    const blue = pixels[offset + 2];
    const brightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);
    return darkest >= 228 && brightest - darkest <= 16;
  };

  const enqueue = (index) => {
    if (index < 0 || index >= count || background[index] || !isBackgroundColor(index)) return;
    background[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    if (x > 0) enqueue(index - 1);
    if (x < width - 1) enqueue(index + 1);
    if (index >= width) enqueue(index - width);
    if (index < count - width) enqueue(index + width);
  }

  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let index = 0; index < count; index++) {
    const offset = index * 4;
    if (background[index]) pixels[offset + 3] = 0;
    if (pixels[offset + 3] > 8) {
      const x = index % width;
      const y = Math.floor(index / width);
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < left || bottom < top) throw new Error(`No foreground found in cell ${column},${row}.`);
  return { pixels, width, height, bounds: { left, top, width: right - left + 1, height: bottom - top + 1 } };
}

for (let index = 0; index < names.length; index++) {
  const cell = isolateCell(index % 4, Math.floor(index / 4));
  const maxArtwork = 388;
  const scale = Math.min(maxArtwork / cell.bounds.width, maxArtwork / cell.bounds.height);
  const width = Math.max(1, Math.round(cell.bounds.width * scale));
  const height = Math.max(1, Math.round(cell.bounds.height * scale));
  const icon = await sharp(cell.pixels, {
    raw: { width: cell.width, height: cell.height, channels: 4 },
  })
    .extract(cell.bounds)
    .resize(width, height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const destination = path.join(output, `${names[index]}.png`);
  await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: icon, left: Math.round((512 - width) / 2), top: Math.round((512 - height) / 2) }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(destination);
  console.log(`${names[index]}: ${cell.bounds.width}×${cell.bounds.height} -> ${width}×${height} inside 512×512`);
}
