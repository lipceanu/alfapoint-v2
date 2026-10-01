import { expect, test } from "@playwright/test";
import { waitForAppReady } from "./helpers";

// Dynamic elements: one-shot or user-driven only, never looping, off for reduced motion.
const desktopEngines = ({ isMobile, browserName, viewport }: { isMobile: boolean; browserName: string; viewport: { width: number } | null }) =>
  isMobile || (browserName === "chromium" && viewport?.width !== 1440);

test.describe("hero team card assembles once", () => {
  test.skip(desktopEngines, "desktop engines (the card shows at lg+)");

  test("ends on the final state and then stops moving", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("figure", { name: "Example: assembling a dedicated team" });
    await expect(card).toBeVisible();
    await page.waitForTimeout(4500);
    const state = await card.evaluate((el) => ({
      running: document.getAnimations().filter((a) => el.contains((a.effect as KeyframeEffect).target as Node) && a.playState === "running").length,
      searchingVisible: [...el.querySelectorAll(".assemble-before")].some((s) => getComputedStyle(s).opacity !== "0"),
      progress: getComputedStyle(el.querySelector(".assemble-progress")!).transform,
      day: getComputedStyle(el.querySelector(".assemble-day")!).getPropertyValue("--day").trim(),
    }));
    expect(state.running, "animations still running").toBe(0);
    expect(state.searchingVisible).toBe(false);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(state.progress);
    expect(state.day).toBe("7");
    await expect(card).toContainText("Matched");
    await expect(card).toContainText("Interviewing");
    await expect(card.locator(".sr-only")).toHaveText("day 7 of 10");
  });
});

test.describe("stats count up", () => {
  test.skip(desktopEngines, "desktop engines");

  test("start at zero below the fold and finish on the real values", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.goto("/");
    await waitForAppReady(page);
    const strip = page.locator("section dl").first();
    const visible = () => strip.locator("dd span[aria-hidden='true']").allTextContents();
    expect((await visible()).every((t) => /^0/.test(t)), "starts at 0 when below the fold").toBe(true);
    await strip.scrollIntoViewIfNeeded();
    await expect.poll(visible, { timeout: 4000 }).toEqual(["50+", "10", "90%", "10"]);
    // Screen readers always get the real values
    expect(await strip.locator("dd .sr-only").allTextContents()).toEqual(["50+", "10", "90%", "10"]);
  });

  test("with reduced motion, real values show immediately", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 700 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await waitForAppReady(page);
    const vals = await page.locator("section dl").first().locator("dd span[aria-hidden='true']").allTextContents();
    expect(vals).toEqual(["50+", "10", "90%", "10"]);
    await ctx.close();
  });
});

test.describe("spotlight hover", () => {
  test.skip(desktopEngines, "desktop engines");

  test("glow follows the mouse on service cards", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    const card = page.locator('main a[href="/services/ai-solutions"]');
    await card.scrollIntoViewIfNeeded();
    // Let the card's fade-in finish so its position is final
    await expect(card.locator("xpath=..")).toHaveClass(/is-visible/);
    await page.waitForTimeout(1000);
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 60);
    await page.mouse.move(box.x + 50, box.y + 70);
    // Within 2 px: engines place cards at sub-pixel positions
    const spot = (prop: string) => card.evaluate((el, p) => parseFloat(el.style.getPropertyValue(p)), prop);
    await expect.poll(() => spot("--spot-x")).toBeCloseTo(50, -0.5);
    expect(Math.abs((await spot("--spot-y")) - 70)).toBeLessThanOrEqual(2);
    expect(Math.abs((await spot("--spot-x")) - 50)).toBeLessThanOrEqual(2);
    await expect.poll(() => card.evaluate((el) => getComputedStyle(el, "::before").opacity)).toBe("1");
  });
});

test.describe("touch devices get no hover glow", () => {
  test.skip(({ hasTouch }) => !hasTouch, "touch only");

  test("tapping a card does not set the spotlight", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    const card = page.locator('main a[href="/services/ai-solutions"]');
    await card.scrollIntoViewIfNeeded();
    expect(await card.evaluate((el) => getComputedStyle(el, "::before").content)).toBe("none");
  });
});

test.describe("process timeline draws on scroll", () => {
  test.skip(desktopEngines, "desktop engines");

  test("connectors fill as the section scrolls through (where supported)", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    const supported = await page.evaluate(() => CSS.supports("animation-timeline: view()"));
    const fills = page.locator(".timeline-fill");
    if (!supported) {
      // Static fallback: the plain grey connectors, no fill element shown
      expect(await fills.first().evaluate((el) => getComputedStyle(el).display)).toBe("none");
      return;
    }
    const ol = page.locator("ol.timeline");
    // Before the section: empty
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    const scaleAt = () => fills.evaluateAll((els) => els.map((e) => new DOMMatrix(getComputedStyle(e).transform).a));
    expect((await scaleAt()).every((s) => s < 0.05)).toBe(true);
    // Scroll so the list sits in the middle of the screen, then past it: all filled
    await ol.evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
    await page.waitForTimeout(300);
    await expect.poll(scaleAt).toEqual([1, 1, 1, 1, 1]);
  });

  test("reduced motion keeps the static timeline", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/");
    expect(await page.locator(".timeline-fill").first().evaluate((el) => getComputedStyle(el).display)).toBe("none");
    await ctx.close();
  });
});
