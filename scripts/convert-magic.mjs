import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcDir = path.join(root, "magic");
const destDir = path.join(root, "site", "public", "images", "magic");

fs.mkdirSync(destDir, { recursive: true });

const files = fs
  .readdirSync(srcDir)
  .filter((name) => /^pngs00108\d{3}\.png$/i.test(name))
  .sort();

async function convert() {
  let i = 0;
  for (const name of files) {
    i += 1;
    const n = String(i).padStart(4, "0");
    const output = path.join(destDir, `frame_${n}.png`);
    await sharp(path.join(srcDir, name))
      .resize({ width: 2560, withoutEnlargement: true })
      .png({ compressionLevel: 6, adaptiveFiltering: true })
      .toFile(output);
    console.log("wrote", path.basename(output), Math.round(fs.statSync(output).size / 1024), "KB");
  }
  console.log("magic frames", files.length);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
