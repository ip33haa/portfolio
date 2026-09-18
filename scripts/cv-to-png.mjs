import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pdfPath = path.join(root, "public", "cv", "John-Philip-Garcia.pdf");
const out = path.join(root, "public", "cv", "John-Philip-Garcia.png");
const b64 = fs.readFileSync(pdfPath).toString("base64");

const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#fff">
    <canvas id="c"></canvas>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const raw = atob(${JSON.stringify(b64)});
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      pdfjsLib.getDocument({ data: bytes }).promise.then(async (pdf) => {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.2 });
        const canvas = document.getElementById("c");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        document.title = "ready";
      });
    </script>
  </body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.waitForFunction(() => document.title === "ready", { timeout: 30_000 });
const canvas = page.locator("#c");
await canvas.screenshot({ path: out, type: "png" });
await browser.close();
console.log("wrote", out, Math.round(fs.statSync(out).size / 1024), "KB");
