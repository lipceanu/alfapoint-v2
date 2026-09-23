import { expect, test } from "@playwright/test";
import { findHorizontalOverflow, scrollThrough } from "./helpers";

// Width sweep: runs once per desktop engine (Chromium, Firefox, WebKit)
const WIDTHS = [320, 360, 375, 390, 414, 480, 600, 768, 820, 900, 1024, 1180, 1280, 1366, 1440, 1920, 2560];
const SWEEP_PAGES = ["/", "/services", "/services/dedicated-teams", "/about", "/careers", "/careers/php-backend-engineer", "/contact"];

test.describe("width sweep", () => {
  test.skip(({ isMobile }) => isMobile, "sweep runs on desktop engines only");

  for (const width of WIDTHS) {
    test(`no overflow or clipped headings at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of SWEEP_PAGES) {
        await page.goto(path);
        await scrollThrough(page);
        const overflow = await findHorizontalOverflow(page);
        expect(overflow.offenders, `${path} @ ${width}px`).toEqual([]);
        expect(overflow.docWidth, `${path} @ ${width}px`).toBeLessThanOrEqual(width);

        // Headings must fit inside their box (no text cut off by overflow)
        const clipped = await page.$$eval("h1, h2, h3", (els) =>
          els.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent?.slice(0, 40)),
        );
        expect(clipped, `${path} @ ${width}px clipped headings`).toEqual([]);
      }
    });
  }
});

test("buttons stay tappable (min 40px) on touch devices", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch devices only");
  await page.goto("/");
  const small = await page.$$eval("header a, header button, main a[class*='rounded-full'], main button", (els) =>
    els
      .map((el) => ({ text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30), r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40))
      .map(({ text, r }) => `${text} ${Math.round(r.width)}x${Math.round(r.height)}`),
  );
  expect(small).toEqual([]);
});

test("full-page screenshots for visual review", async ({ page }, testInfo) => {
  for (const path of ["/", "/services/ai-solutions", "/contact"]) {
    await page.goto(path);
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const name = `${testInfo.project.name}${path === "/" ? "-home" : path.replaceAll("/", "-")}.png`;
    await page.screenshot({ path: `test-results/screens/${name}`, fullPage: true });
  }
});
