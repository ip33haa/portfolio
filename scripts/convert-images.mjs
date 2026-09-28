import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seqDir = path.join(root, "public", "images", "sequence");
const parentDir = path.resolve(root, "..");
const destDir = path.join(root, "public", "images");

fs.mkdirSync(destDir, { recursive: true });

function findSource(name) {
  const p1 = path.join(seqDir, name);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(parentDir, name);
  if (fs.existsSync(p2)) return p2;
  throw new Error(`Input file not found: ${name} in ${seqDir} or ${parentDir}`);
}

const plates = {
  "plantarium_011_0040.png": "dome-wide.webp",
  "plantarium_011_0003.png": "dome-top.webp",
  "plantarium_011_0100.png": "tree-close.webp",
  "plantarium_011_0135.png": "crystal-01.webp",
  "plantarium_011_0185.png": "crystal-02.webp",
  "plantarium_011_0240.png": "crystal-03.webp",
  "plantarium_011_0305.png": "crystal-04.webp",
  "plantarium_011_0355.png": "crystal-05-tipon.webp",
  "plantarium_011_0405.png": "crystal-06.webp",
  "plantarium_011_0001.png": "dome-final.webp",
};

async function convert() {
  for (const [srcName, destName] of Object.entries(plates)) {
    const input = findSource(srcName);
    const output = path.join(destDir, destName);
    await sharp(input)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(output);
    console.log("wrote", destName, Math.round(fs.statSync(output).size / 1024), "KB");
  }

  const og = path.join(destDir, "og.webp");
  await sharp(path.join(destDir, "dome-wide.webp"))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .webp({ quality: 80 })
    .toFile(og);
  console.log("wrote og.webp");
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
