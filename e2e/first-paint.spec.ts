import { expect, test } from "@playwright/test";

// Plan PR 3: the headline (Largest Contentful Paint element) must not wait for an entrance animation
const onePerEngine = ({ isMobile, browserName, viewport }: { isMobile: boolean; browserName: string; viewport: { width: number } | null }) =>
  isMobile || (browserName === "chromium" && viewport?.width !== 1440);

test.describe("first paint", () => {
  test.skip(onePerEngine, "runs once per engine");

  for (const path of ["/", "/services", "/services/ai-solutions", "/about", "/careers", "/contact"]) {
    test(`headline is visible immediately, with no entrance animation: ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // No waiting: read the H1's styles as early as possible
      const h1 = await page.evaluate(() => {
        const el = document.querySelector("main h1")!;
        const cs = getComputedStyle(el);
        return { animation: cs.animationName, delay: cs.animationDelay, opacity: cs.opacity, inline: el.getAttribute("style") };
      });
      expect(h1.animation).toBe("none");
      expect(h1.opacity).toBe("1");
      expect(h1.inline ?? "").not.toContain("animation-delay");
    });
  }

  test("with reduced motion, nothing has an animation or transition delay", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 375, height: 700 } });
    const page = await context.newPage();
    await page.route("https://calendly.com/**", (r) => r.fulfill({ contentType: "text/html", body: "cal" }));
    const delayed = () =>
      page.evaluate(() => {
        const out: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          for (const pseudo of [null, "::before", "::after"]) {
            const cs = getComputedStyle(el, pseudo);
            const delays = [...cs.animationDelay.split(","), ...cs.transitionDelay.split(",")].map((d) => parseFloat(d));
            if (delays.some((d) => d > 0)) out.push(`${el.tagName.toLowerCase()}${pseudo ?? ""}.${(el.getAttribute("class") ?? "").split(" ")[0]}`);
          }
        }
        return out.slice(0, 5);
      });
    await page.goto("/");
    expect(await delayed(), "homepage").toEqual([]);
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await delayed(), "open menu").toEqual([]);
    await page.keyboard.press("Escape");
    await page.evaluate(() => (document.querySelector("main a[data-booking]") as HTMLElement).click());
    await expect(page.getByRole("dialog", { name: "Book a call" })).toBeVisible();
    expect(await delayed(), "open booking dialog").toEqual([]);
    await context.close();
  });
});
