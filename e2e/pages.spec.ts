import { expect, test } from "@playwright/test";
import { PAGES, findHorizontalOverflow, scrollThrough } from "./helpers";

for (const path of PAGES) {
  test(`page renders cleanly: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      // Vercel Analytics' script only exists when deployed on Vercel
      // (locally it 404s; with nosniff, Firefox reports that against the page URL, so match the text too)
      if (msg.location().url.includes("/_vercel/insights/") || msg.text().includes("/_vercel/insights/")) return;
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

test("client logos are fully visible on the first screen, without scrolling", async ({ page }) => {
  await page.goto("/");
  const logos = page.getByRole("list", { name: "Clients we have worked with" });
  await expect(logos.getByRole("img")).toHaveCount(5);
  for (const name of ["European Parliament", "Shell", "BP", "ABB", "KSB"]) {
    await expect(logos.getByRole("img", { name })).toBeVisible();
  }
  await page.waitForTimeout(1300); // entrance animation
  const { bottom, right, vh, vw } = await logos.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { bottom: r.bottom, right: r.right, vh: window.innerHeight, vw: window.innerWidth };
  });
  expect(bottom, "logos end above the fold").toBeLessThanOrEqual(vh);
  expect(right, "logos fit the screen width").toBeLessThanOrEqual(vw);
  // All logos load and sit on one line
  const tops = await logos.getByRole("img").evaluateAll((imgs) =>
    imgs.map((i) => {
      const r = i.getBoundingClientRect();
      return { mid: r.top + r.height / 2, ok: (i as HTMLImageElement).naturalWidth > 0 };
    }),
  );
  expect(tops.every((t) => t.ok)).toBe(true);
  expect(Math.max(...tops.map((t) => t.mid)) - Math.min(...tops.map((t) => t.mid))).toBeLessThan(4);
});
