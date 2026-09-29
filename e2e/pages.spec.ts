import { expect, test } from "@playwright/test";
import { PAGES, findHorizontalOverflow, scrollThrough } from "./helpers";

for (const path of PAGES) {
  test(`page renders cleanly: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      // Vercel Analytics' script only exists when deployed on Vercel
      if (msg.location().url.includes("/_vercel/insights/")) return;
      errors.push(`console: ${msg.text()} (${msg.location().url})`);
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    // Exactly one visible H1, and the fixed header is on screen
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("header").first()).toBeInViewport();

    // Web fonts actually loaded (not falling back to system fonts)
    const fontsOk = await page.evaluate(async () => {
      await document.fonts.ready;
      return ["Schibsted Grotesk", "Instrument Serif", "JetBrains Mono"].map((f) =>
        [...document.fonts].some((ff) => ff.family.includes(f) && ff.status === "loaded"),
      );
    });
    expect(fontsOk[0], "body font loaded").toBe(true);

    await scrollThrough(page);

    // Every scroll-reveal element has been revealed
    const hidden = await page.$$eval("[data-reveal]:not(.is-visible)", (els) => els.length);
    expect(hidden, "unrevealed [data-reveal] elements").toBe(0);

    // Every image decoded successfully
    const brokenImages = await page.$$eval("img", (imgs) =>
      imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src")),
    );
    expect(brokenImages, "broken images").toEqual([]);

    // Nothing pushes the page wider than the screen
    const overflow = await findHorizontalOverflow(page);
    expect(overflow.docWidth, JSON.stringify(overflow.offenders)).toBeLessThanOrEqual(overflow.viewport);
    expect(overflow.offenders).toEqual([]);

    expect(errors).toEqual([]);
  });
}

test("footer is reachable and shows current year", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer).toContainText(String(new Date().getFullYear()));
});

test("content stays visible if JavaScript never runs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const lastSection = page.locator("[data-reveal]").last();
  await lastSection.scrollIntoViewIfNeeded();
  await expect(lastSection).toBeVisible();
  expect(await lastSection.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await context.close();
});

test("reveal failsafe shows content when the app fails to start", async ({ page }) => {
  // Block all Next.js JS chunks: the inline flag still runs, the app does not
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.goto("/");
  const lastSection = page.locator("[data-reveal]").last();
  await lastSection.scrollIntoViewIfNeeded();
  await expect
    .poll(() => lastSection.evaluate((el) => getComputedStyle(el).opacity), { timeout: 6000 })
    .toBe("1");
});
