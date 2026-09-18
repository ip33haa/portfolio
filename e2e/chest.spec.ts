import { expect, test } from "@playwright/test";

test("magic sequence after Still Growing shows clickable CV on last frames", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "ENTER THE JOURNEY" }).waitFor({ timeout: 60_000 });
  await page.getByRole("button", { name: "ENTER THE JOURNEY" }).click();

  const section = page.getByTestId("magic-sequence");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();

  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="magic-sequence"]') as HTMLElement;
    window.scrollTo(0, el.offsetTop + el.offsetHeight - window.innerHeight);
  });
  await page.waitForTimeout(800);

  const paper = page.getByTestId("cv-paper");
  await expect(paper).toBeVisible();
  await expect(paper).toHaveAttribute("href", /John-Philip-Garcia\.pdf/);
  await page.screenshot({ path: "e2e/magic-cv.png", fullPage: false });
});
