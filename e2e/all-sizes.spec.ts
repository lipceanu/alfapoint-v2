import { expect, test, type Page } from "@playwright/test";
import { PAGES } from "./helpers";

// Extremes included: Galaxy Fold (280px), ultrawide (3440px) and 4K (3840px)
const WIDTHS = [280, 320, 360, 375, 390, 414, 480, 600, 768, 834, 931, 1024, 1180, 1280, 1366, 1440, 1536, 1920, 2560, 3440, 3840];
const HEIGHTS = [480, 568, 720, 900, 1440];

const onePerEngine = ({ isMobile, browserName, viewport }: { isMobile: boolean; browserName: string; viewport: { width: number } | null }) =>
  isMobile || (browserName === "chromium" && viewport?.width !== 1440);

async function settle(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        // Time-based only: scroll-driven animations follow the scroll position and never "finish"
              .filter((a) => a.timeline === document.timeline && a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

test.describe("every page at every window size", () => {
  test.skip(onePerEngine, "runs once per engine (Chromium, Firefox, WebKit)");

  for (const path of PAGES) {
    test(`layout holds at ${WIDTHS.length * HEIGHTS.length} sizes: ${path}`, async ({ page }) => {
      test.setTimeout(240_000);
      await page.goto(path);
      await page.waitForTimeout(1200);
      const problems: string[] = [];
      for (const width of WIDTHS) {
        for (const height of HEIGHTS) {
          await page.setViewportSize({ width, height });
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
          await settle(page);
          const m = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const header = document.querySelector("header > div")!.getBoundingClientRect();
            const h1 = document.querySelector("main h1")!.getBoundingClientRect();
            // Visible elements sticking out past the right edge (ignoring intentionally clipped containers)
            const clipped = (el: Element) => {
              for (let p = el.parentElement; p; p = p.parentElement) {
                if (getComputedStyle(p).overflowX !== "visible") return true;
              }
              return false;
            };
            const spill = [...document.querySelectorAll("body *")]
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && r.right > vw + 1 && !clipped(el);
              })
              .slice(0, 2)
              .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(" ")[0]}`);
            const cutHeadings = [...document.querySelectorAll("h1, h2, h3")]
              .filter((el) => el.scrollWidth > el.clientWidth + 2)
              .map((el) => el.textContent!.trim().slice(0, 30));
            return { docW: document.documentElement.scrollWidth, vw, headerBottom: header.bottom, h1Top: h1.top, spill, cutHeadings };
          });
          const at = `${width}×${height}`;
          if (m.docW > m.vw + 1) problems.push(`${at}: page scrolls sideways (${m.docW} > ${m.vw}) ${m.spill.join(", ")}`);
          if (m.h1Top < m.headerBottom - 1) problems.push(`${at}: headline under header`);
          if (m.cutHeadings.length) problems.push(`${at}: cut-off heading "${m.cutHeadings[0]}"`);
        }
      }
      expect(problems, `${problems.length} problem sizes on ${path}`).toEqual([]);
    });
  }
});

test.describe("mobile menu on small and short screens", () => {
  test.skip(onePerEngine, "runs once per engine");
  const SIZES = [[280, 653], [320, 480], [320, 568], [375, 667], [414, 896], [740, 360], [667, 375]] as const;

  test("every menu link is reachable and tappable", async ({ page }) => {
    test.setTimeout(180_000); // 7 page loads; slow when run alongside the size sweeps
    const problems: string[] = [];
    for (const [width, height] of SIZES) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.locator("#mobile-menu");
      await expect(menu).toBeVisible();
      await settle(page);
      for (const link of await menu.getByRole("link").all()) {
        await link.scrollIntoViewIfNeeded();
        const box = await link.boundingBox();
        if (!box || box.y < 0 || box.y + box.height > height + 1) problems.push(`${width}×${height}: "${await link.textContent()}" not reachable`);
        else if (box.x + box.width > width + 1) problems.push(`${width}×${height}: "${await link.textContent()}" cut off`);
      }
      await page.getByRole("button", { name: "Close menu" }).click();
    }
    expect(problems).toEqual([]);
  });
});

test.describe("booking pop-up at every window size", () => {
  test.skip(onePerEngine, "runs once per engine");

  test("close button visible and enough room for the calendar", async ({ page }) => {
    test.setTimeout(240_000);
    await page.route("https://calendly.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<h1>cal</h1>" }));
    await page.goto("/");
    await page.waitForTimeout(800);
    const problems: string[] = [];
    for (const width of WIDTHS) {
      for (const height of HEIGHTS) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => (document.querySelector("main a[data-booking]") as HTMLElement).click());
        const dialog = page.getByRole("dialog", { name: "Book a call" });
        await expect(dialog).toBeVisible();
        const m = await page.evaluate(() => {
          const d = document.querySelector("dialog")!.getBoundingClientRect();
          const close = document.querySelector('dialog button[aria-label="Close booking"]')!.getBoundingClientRect();
          const frame = document.querySelector("dialog iframe")!.getBoundingClientRect();
          return { d, close, frameH: frame.height, frameW: frame.width, vw: innerWidth, vh: innerHeight };
        });
        const at = `${width}×${height}`;
        if (m.d.left < -1 || m.d.top < -1 || m.d.right > m.vw + 1 || m.d.bottom > m.vh + 1) problems.push(`${at}: pop-up exceeds the screen`);
        if (m.close.top < 0 || m.close.bottom > m.vh || m.close.right > m.vw || m.close.width < 40) problems.push(`${at}: close button not fully visible/tappable`);
        if (m.frameH < 250 && height > 480) problems.push(`${at}: calendar area only ${Math.round(m.frameH)}px tall`);
        if (m.frameW < Math.min(width, 320) - 1) problems.push(`${at}: calendar area only ${Math.round(m.frameW)}px wide`);
        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
      }
    }
    expect(problems).toEqual([]);
  });
});
