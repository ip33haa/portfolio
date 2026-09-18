import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(root, "public", "images", "projects");
fs.mkdirSync(dest, { recursive: true });

const sites = [
  { file: "medblast.png", url: "https://medblast.com/" },
  { file: "ace.png", url: "https://norimaconsulting.com/portfolio/advisor-credit-exchange-ace/" },
  { file: "mmh-v2.png", url: "https://mmh-v2.mymoneyhouse.com.au/" },
  { file: "mymoneyhouse.png", url: "https://mymoneyhouse.com.au/" },
  { file: "mph.png", url: "https://mph.mymoneyhouse.com.au/" },
  { file: "mypropertyhouse.png", url: "https://www.mypropertyhouse.com.au/" },
  { file: "lendux.png", url: "https://lendux-v2.mymoneyhouse.com.au/" },
  { file: "megarewards.png", url: "https://e-commerce.megarewards.au/" },
  { file: "jzl.png", url: "https://jzl-seven.vercel.app/" },
  { file: "casa-vista.png", url: "https://virtual-tour-neon-beta.vercel.app/" },
  { file: "jpb-dimensions.png", url: "https://jpb-solution.vercel.app/" },
  { file: "obp-corporate.png", url: "https://www.offshorebusinessprocessing.com/" },
  { file: "obp-careers.png", url: "https://www.obpcareers.com/" },
  { file: "fta.png", url: "https://ftalliance.com.au/" },
  { file: "map-cargo.png", url: "https://www.mapcargo.com/" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const site of sites) {
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 60_000 }).catch(async () => {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    });
    await page.waitForTimeout(6000);
    const cookie = page.getByRole("button", { name: /continue|accept|agree|got it/i });
    if (await cookie.count()) {
      await cookie.first().click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(600);
    }
    const enter = page.getByRole("button", { name: /enter|start|begin/i });
    if (await enter.count()) {
      await enter.first().click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(1200);
    }
    const out = path.join(dest, site.file);
    await page.screenshot({ path: out, fullPage: false });
    console.log("ok", site.file, Math.round(fs.statSync(out).size / 1024), "KB");
  } catch (err) {
    console.error("fail", site.file, err instanceof Error ? err.message : err);
  }
}

await browser.close();
