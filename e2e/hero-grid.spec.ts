import { expect, test } from "@playwright/test";

// Every combination of common widths and heights, including short desktop
// windows (e.g. a laptop with devtools or a non-maximised browser).
const WIDTHS = [320, 360, 375, 390, 414, 480, 600, 768, 834, 931, 1024, 1180, 1280, 1366, 1440, 1536, 1920, 2560];
const HEIGHTS = [480, 568, 598, 640, 700, 720, 768, 800, 900, 1080, 1440];

type Box = { top: number; bottom: number; right: number } | null;

test.describe("homepage first screen at every width × height", () => {
  test.skip(
    ({ isMobile, browserName, viewport }) => isMobile || (browserName === "chromium" && viewport?.width !== 1440),
    "grid runs once per engine (Chromium, Firefox, WebKit)",
  );

  test("hero never hides under the header, never overlaps, and keeps logos on screen", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/");
    await page.waitForTimeout(1500); // entrance animations finish
    const problems: string[] = [];

    for (const width of WIDTHS) {
      for (const height of HEIGHTS) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        // Elements hidden at other sizes replay their entrance animation when shown again; wait for them
        await page.evaluate(() =>
          Promise.all(
            document
              .getAnimations()
              .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
              .map((a) => a.finished.catch(() => undefined)),
          ),
        );
        const m = await page.evaluate(() => {
          const box = (el: Element | null): Box => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0 || getComputedStyle(el).display === "none") return null;
            return { top: r.top, bottom: r.bottom, right: r.right };
          };
          const hero = document.querySelector("main section")!;
          return {
            header: box(document.querySelector("header > div")),
            eyebrow: box(hero.querySelector("p.eyebrow")),
            h1: box(hero.querySelector("h1")),
            lead: box(hero.querySelector("h1 + p")),
            cta: box(hero.querySelector("a[data-booking]")?.parentElement ?? null),
            logos: box(hero.querySelector('[aria-label="Clients we have worked with"]')?.parentElement ?? null),
            vw: document.documentElement.clientWidth,
            vh: window.innerHeight,
          };
        });
        const at = `${width}×${height}`;
        const first = m.eyebrow ?? m.h1!;
        if (first.top < m.header!.bottom - 1) problems.push(`${at}: content under header (${Math.round(first.top)} < ${Math.round(m.header!.bottom)})`);
        const stack = [m.eyebrow, m.h1, m.lead, m.cta, m.logos].filter(Boolean) as NonNullable<Box>[];
        for (let i = 1; i < stack.length; i++) {
          if (stack[i].top < stack[i - 1].bottom - 1) problems.push(`${at}: elements ${i - 1} and ${i} overlap`);
        }
        for (const b of stack) if (b.right > m.vw + 1) problems.push(`${at}: element spills off the right edge`);
        if (m.logos!.bottom > m.vh + 1) problems.push(`${at}: logos below the fold by ${Math.round(m.logos!.bottom - m.vh)}px`);
      }
    }
    expect(problems, `${problems.length} problem sizes`).toEqual([]);
  });
});
