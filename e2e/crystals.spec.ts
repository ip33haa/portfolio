import { expect, test } from "@playwright/test";

test("scroll journey travels through all 6 crystals matching their visual names", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "ENTER THE JOURNEY" }).waitFor({ timeout: 60_000 });
  await page.getByRole("button", { name: "ENTER THE JOURNEY" }).click();

  const track = page.getByTestId("cinematic-track");
  await expect(track).toBeVisible();

  // Test clicking crystal navigation buttons (1 to 6)
  const crystalButtons = page.locator('nav[aria-label="Crystal chapters"] button');
  await expect(crystalButtons).toHaveCount(6);

  // Jump to Crystal 1 (Blueprint)
  await crystalButtons.nth(0).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("BLUEPRINT — MY FIRST STEPS")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-1-blueprint.png" });

  // Jump to Crystal 2 (Jade)
  await crystalButtons.nth(1).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("JADE — GROWING STRONGER")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-2-jade.png" });

  // Jump to Crystal 3 (Earth)
  await crystalButtons.nth(2).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("EARTH — BUILDING SYSTEMS")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-3-earth.png" });

  // Jump to Crystal 4 (Cyber)
  await crystalButtons.nth(3).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("CYBER — CREATIVE & INNOVATION")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-4-cyber.png" });

  // Jump to Crystal 5 (Amethyst)
  await crystalButtons.nth(4).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("AMETHYST — TIPON ERP SYSTEM")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-5-amethyst.png" });

  // Jump to Crystal 6 (Magma)
  await crystalButtons.nth(5).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText("MAGMA — WHAT'S NEXT")).toBeVisible();
  await page.screenshot({ path: "e2e/crystal-6-magma.png" });
});
