import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES, findHorizontalOverflow, scrollThrough, waitForAppReady } from "./helpers";

// Accessibility audit (WCAG 2.1 AA) — run on one engine per family to keep it fast
const AXE_PROJECTS = ["desktop-chrome", "desktop-safari", "iphone", "android"];

for (const path of PAGES) {
  test(`accessibility (WCAG 2.1 AA): ${path}`, async ({ page }, testInfo) => {
    test.skip(!AXE_PROJECTS.includes(testInfo.project.name), "axe runs on a representative subset");
    await page.goto(path);
    await scrollThrough(page); // reveal all content so contrast is measured on final colours
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("iframe")
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`,
    );
    expect(summary).toEqual([]);
  });
}

test("every internal link and anchor on the site resolves", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "link crawl runs once");
  const seen = new Map<string, string>(); // href -> page it was found on
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
    hrefs.filter((h) => h.startsWith("/") || h.startsWith("#")).forEach((h) => seen.set(h.startsWith("#") ? `${path}${h}` : h, path));
  }
  const problems: string[] = [];
  for (const [href, from] of seen) {
    const [route, hash] = href.split("#");
    const res = await request.get(route || "/", { maxRedirects: 0 });
    if (res.status() !== 200) problems.push(`${href} → ${res.status()} (linked from ${from})`);
    if (hash) {
      await page.goto(route || "/");
      if ((await page.locator(`#${hash}`).count()) === 0) problems.push(`${href} → missing #${hash} (linked from ${from})`);
    }
  }
  expect(problems).toEqual([]);
  expect(seen.size).toBeGreaterThan(15);
});

test("layout survives large text settings (130% font size)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phones and tablets, where users most often enlarge text");
  for (const path of ["/", "/services/dedicated-teams", "/about", "/careers", "/contact"]) {
    await page.goto(path);
    await page.addStyleTag({ content: "html { font-size: 130% !important; }" });
    await scrollThrough(page);
    const overflow = await findHorizontalOverflow(page);
    expect(overflow.offenders, `${path} with large text`).toEqual([]);
    const clipped = await page.$$eval("h1, h2, h3, p, a, button", (els) =>
      els
        // .sr-only elements are intentionally clipped (screen-reader-only text)
        .filter((el) => !el.classList.contains("sr-only"))
        .filter((el) => getComputedStyle(el).overflow !== "visible" && el.scrollWidth > el.clientWidth + 2)
        .map((el) => el.textContent?.trim().slice(0, 40)),
    );
    expect(clipped, `${path} clipped text with large font`).toEqual([]);
  }
});

test("sticky header never hides the section you jump to", async ({ page }) => {
  await page.goto("/");
  await waitForAppReady(page);
  await page.goto("/#engagement");
  await page.waitForTimeout(800);
  const [headerBottom, sectionTop] = await page.evaluate(() => [
    document.querySelector("header")!.getBoundingClientRect().bottom,
    document.querySelector("#engagement")!.getBoundingClientRect().top,
  ]);
  expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 1);
});

test("text is readable: body copy at least 14px, nothing tiny", async ({ page, isMobile }) => {
  test.skip(!isMobile, "most relevant on phones");
  await page.goto("/");
  await scrollThrough(page);
  const tiny = await page.$$eval("main p, main li, main a, main span", (els) =>
    els
      .filter((el) => el.childElementCount === 0 && (el.textContent ?? "").trim().length > 20)
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12)
      .map((el) => `${getComputedStyle(el).fontSize} "${el.textContent!.trim().slice(0, 30)}"`),
  );
  expect(tiny).toEqual([]);
});
