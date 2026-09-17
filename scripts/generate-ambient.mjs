import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sampleRate = 22050;
const duration = 24;
const n = sampleRate * duration;
const samples = new Float32Array(n);
const voices = [
  { f: 64, a: 0.18 },
  { f: 96, a: 0.14 },
  { f: 128, a: 0.1 },
  { f: 160, a: 0.06 },
  { f: 192, a: 0.05 },
  { f: 256, a: 0.03 },
];

for (let i = 0; i < n; i++) {
  const t = i / sampleRate;
  const breathe = 0.72 + 0.28 * Math.sin((2 * Math.PI * t) / 8);
  let v = 0;
  for (const voice of voices) {
    const trem = 1 + 0.08 * Math.sin(2 * Math.PI * (0.07 + voice.f / 4000) * t);
    v += Math.sin(2 * Math.PI * voice.f * t) * voice.a * trem;
  }
  v += Math.sin(2 * Math.PI * 48 * t) * 0.05;
  samples[i] = v * breathe * 0.55;
}

const pcm = Buffer.alloc(n * 2);
for (let i = 0; i < n; i++) {
  const s = Math.max(-1, Math.min(1, samples[i]));
  pcm.writeInt16LE(Math.round(s * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/audio");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "journey-ambient.wav");
fs.writeFileSync(out, Buffer.concat([header, pcm]));
console.log("wrote", out, Math.round(fs.statSync(out).size / 1024), "KB");
