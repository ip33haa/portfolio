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
  const batchSize = 24;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (name, idx) => {
        const frameIdx = i + idx + 1;
        const n = String(frameIdx).padStart(4, "0");
        const output = path.join(destDir, `frame_${n}.webp`);
        await sharp(path.join(srcDir, name))
          .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 72, effort: 3 })
          .toFile(output);
      })
    );
  }
  console.log("magic frames converted:", files.length);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
