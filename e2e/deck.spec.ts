import { test, expect, type Page } from "@playwright/test";

async function waitForDeckReady(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("deck-canvas")).toBeVisible();
  await page.waitForFunction(() => typeof window.__deckTest !== "undefined", undefined, {
    timeout: 90_000,
  });
}

async function powerOn(page: Page) {
  await page.getByTestId("power-on-fallback").click();
  await page.waitForFunction(() => window.__deckTest!.getState().poweredOn);
}

async function waitForMainMenu(page: Page) {
  await page.waitForFunction(() => window.__deckTest!.getState().currentApp === "menu", undefined, {
    timeout: 25_000,
  });
}

async function skipBoot(page: Page) {
  await page.evaluate(() => window.__deckTest!.skipBoot());
  await waitForMainMenu(page);
}

test.describe("Steam Deck portfolio", () => {
  test("fallback power on reaches main menu", async ({ page }) => {
    await waitForDeckReady(page);
    await powerOn(page);
    await skipBoot(page);
  });

  test("screen menu items are clickable", async ({ page }) => {
    await waitForDeckReady(page);
    await powerOn(page);
    await skipBoot(page);

    await page.evaluate(() => window.__deckTest!.clickMenuItem("about"));
    await page.waitForFunction(() => window.__deckTest!.getState().currentApp === "about");

    await page.evaluate(() => window.__deckTest!.navigateTo("menu"));

    await page.evaluate(() => window.__deckTest!.clickMenuItem("games"));
    await page.waitForFunction(() => window.__deckTest!.getState().currentApp === "games");
  });

  test("3D power button toggles device on press", async ({ page }) => {
    await waitForDeckReady(page);
    const ok = await page.evaluate(() => window.__deckTest!.simulateMeshPress("Btn_Power"));
    expect(ok).toBe(true);
    await page.waitForFunction(() => window.__deckTest!.getState().poweredOn);
  });

  test("3D Btn_A navigates to About from main menu", async ({ page }) => {
    await waitForDeckReady(page);
    await powerOn(page);
    await skipBoot(page);

    const pressed = await page.evaluate(() => window.__deckTest?.simulateMeshPress("Btn_A") ?? false);
    expect(pressed).toBe(true);
    await page.waitForFunction(() => window.__deckTest!.getState().currentApp === "about");
  });

  test("canvas raycast hits power button mesh", async ({ page }) => {
    await waitForDeckReady(page);

    const state = await page.evaluate(() => {
      const pt = window.__deckTest?.getMeshClickPoint("Btn_Power");
      return { hasPoint: !!pt, x: pt?.x, y: pt?.y };
    });

    expect(state.hasPoint).toBe(true);
    expect(state.x).toBeGreaterThan(0);
    expect(state.y).toBeGreaterThan(0);
  });
});
