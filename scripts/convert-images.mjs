import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcDir = root;
const destDir = path.join(root, "site", "public", "images");

fs.mkdirSync(destDir, { recursive: true });

const plates = {
  "plantarium_011_0001.png": "dome-wide.webp",
  "plantarium_011_0003.png": "dome-top.webp",
  "plantarium_011_0005.png": "tree-close.webp",
};

const aliases = {
  "crystal-01.webp": "tree-close.webp",
  "crystal-02.webp": "tree-close.webp",
  "crystal-03.webp": "tree-close.webp",
  "crystal-04.webp": "tree-close.webp",
  "crystal-05-tipon.webp": "tree-close.webp",
  "crystal-06.webp": "tree-close.webp",
  "dome-final.webp": "dome-wide.webp",
};

async function convert() {
  for (const [srcName, destName] of Object.entries(plates)) {
    const input = path.join(srcDir, srcName);
    const output = path.join(destDir, destName);
    await sharp(input)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(output);
    console.log("wrote", destName, Math.round(fs.statSync(output).size / 1024), "KB");
  }

  for (const [alias, target] of Object.entries(aliases)) {
    const from = path.join(destDir, target);
    const to = path.join(destDir, alias);
    fs.copyFileSync(from, to);
    console.log("alias", alias, "->", target);
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
