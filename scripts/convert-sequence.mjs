import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seqDir = path.join(root, "public", "images", "sequence");
const parentDir = path.resolve(root, "..");
const destDir = path.join(root, "public", "images", "journey");

fs.mkdirSync(destDir, { recursive: true });

function getSourceDir() {
  if (fs.existsSync(seqDir)) {
    const files = fs.readdirSync(seqDir).filter((name) => /^plantarium_011_\d{4}\.png$/i.test(name));
    if (files.length > 0) return { dir: seqDir, files: files.sort() };
  }
  const files = fs.readdirSync(parentDir).filter((name) => /^plantarium_011_\d{4}\.png$/i.test(name));
  return { dir: parentDir, files: files.sort() };
}

async function convert() {
  const { dir, files } = getSourceDir();
  console.log(`Found ${files.length} frames in ${dir}`);

  // Clean old png frames in journey
  const oldFiles = fs.readdirSync(destDir);
  for (const f of oldFiles) {
    if (f.startsWith("frame_") && f.endsWith(".png")) {
      fs.unlinkSync(path.join(destDir, f));
    }
  }

  const batchSize = 16;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (name, batchIdx) => {
        const frameIdx = i + batchIdx + 1;
        const n = String(frameIdx).padStart(4, "0");
        const output = path.join(destDir, `frame_${n}.webp`);
        await sharp(path.join(dir, name))
          .resize({ width: 2560, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(output);
      })
    );
    console.log(`Converted batch up to frame ${Math.min(i + batchSize, files.length)} / ${files.length}`);
  }
  console.log("Successfully converted all journey frames:", files.length);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
