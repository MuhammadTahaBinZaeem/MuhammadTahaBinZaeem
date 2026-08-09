#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

const [inputArg, outputArg, sizeArg = "1024", qualityArg = "82"] = process.argv.slice(2);

if (!inputArg || !outputArg) {
  console.error(
    "Usage: node scripts/resize-glb-textures.mjs <input.glb> <output.glb> [max-size] [jpeg-quality]",
  );
  process.exit(1);
}

const maxSize = Number.parseInt(sizeArg, 10);
const quality = Number.parseInt(qualityArg, 10);

if (!Number.isFinite(maxSize) || maxSize < 64 || !Number.isFinite(quality) || quality < 1 || quality > 100) {
  throw new Error("Texture size must be at least 64px and JPEG quality must be between 1 and 100.");
}

const source = await readFile(inputArg);
if (source.toString("ascii", 0, 4) !== "glTF" || source.readUInt32LE(4) !== 2) {
  throw new Error("Only binary glTF 2.0 (.glb) files are supported.");
}

let chunkOffset = 12;
const jsonLength = source.readUInt32LE(chunkOffset);
const jsonType = source.readUInt32LE(chunkOffset + 4);
if (jsonType !== JSON_CHUNK) throw new Error("The first GLB chunk is not JSON.");

const document = JSON.parse(
  source
    .subarray(chunkOffset + 8, chunkOffset + 8 + jsonLength)
    .toString("utf8")
    .trim(),
);

chunkOffset += 8 + jsonLength;
const binaryLength = source.readUInt32LE(chunkOffset);
const binaryType = source.readUInt32LE(chunkOffset + 4);
if (binaryType !== BIN_CHUNK) throw new Error("The second GLB chunk is not binary data.");

const binary = source.subarray(chunkOffset + 8, chunkOffset + 8 + binaryLength);
const imageViews = new Map(
  (document.images ?? [])
    .filter((image) => Number.isInteger(image.bufferView))
    .map((image) => [image.bufferView, image]),
);

const orderedViews = document.bufferViews
  .map((view, index) => ({ view, index }))
  .sort((left, right) => (left.view.byteOffset ?? 0) - (right.view.byteOffset ?? 0));

const binaryParts = [];
let outputOffset = 0;
let previousSourceEnd = 0;

for (const { view, index } of orderedViews) {
  const sourceOffset = view.byteOffset ?? 0;
  const sourceEnd = sourceOffset + view.byteLength;
  if (sourceOffset < previousSourceEnd || sourceEnd > binary.length) {
    throw new Error(`Overlapping or invalid bufferView ${index}.`);
  }
  previousSourceEnd = sourceEnd;

  const alignment = (4 - (outputOffset % 4)) % 4;
  if (alignment) {
    binaryParts.push(Buffer.alloc(alignment));
    outputOffset += alignment;
  }

  const original = binary.subarray(sourceOffset, sourceEnd);
  const image = imageViews.get(index);
  let replacement = original;

  if (image) {
    const metadata = await sharp(original).metadata();
    const pipeline = sharp(original).resize({
      width: maxSize,
      height: maxSize,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (image.mimeType === "image/png") {
      replacement = await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    } else if (image.mimeType === "image/webp") {
      replacement = await pipeline.webp({ quality, smartSubsample: true }).toBuffer();
    } else {
      image.mimeType = "image/jpeg";
      replacement = await pipeline
        .jpeg({ quality, chromaSubsampling: "4:4:4", mozjpeg: true })
        .toBuffer();
    }

    console.log(
      `${image.name ?? `image-${index}`}: ${metadata.width}x${metadata.height} ${original.length}B -> ${replacement.length}B`,
    );
  }

  view.byteOffset = outputOffset;
  view.byteLength = replacement.length;
  binaryParts.push(replacement);
  outputOffset += replacement.length;
}

const finalAlignment = (4 - (outputOffset % 4)) % 4;
if (finalAlignment) {
  binaryParts.push(Buffer.alloc(finalAlignment));
  outputOffset += finalAlignment;
}

const outputBinary = Buffer.concat(binaryParts, outputOffset);
document.buffers[0].byteLength = outputBinary.length;

const json = Buffer.from(JSON.stringify(document), "utf8");
const jsonPadding = (4 - (json.length % 4)) % 4;
const paddedJson = Buffer.concat([json, Buffer.alloc(jsonPadding, 0x20)]);
const totalLength = 12 + 8 + paddedJson.length + 8 + outputBinary.length;
const header = Buffer.alloc(12);
header.write("glTF", 0, "ascii");
header.writeUInt32LE(2, 4);
header.writeUInt32LE(totalLength, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(paddedJson.length, 0);
jsonHeader.writeUInt32LE(JSON_CHUNK, 4);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(outputBinary.length, 0);
binaryHeader.writeUInt32LE(BIN_CHUNK, 4);

await writeFile(outputArg, Buffer.concat([header, jsonHeader, paddedJson, binaryHeader, outputBinary]));
console.log(`${path.basename(inputArg)} -> ${path.basename(outputArg)} (${source.length}B -> ${totalLength}B)`);
