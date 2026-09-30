import { expect, test, type Page } from "@playwright/test";
import { waitForAppReady } from "./helpers";

// Stub Calendly so tests don't depend on the network. The stub posts the same
// kind of message the real embed sends when its page has rendered.
async function stubCalendly(page: Page) {
  await page.route("https://calendly.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><h1 id="cal">Select a Date &amp; Time</h1>
        <script>setTimeout(() => parent.postMessage({ event: "calendly.event_type_viewed" }, "*"), 300)</script>`,
    }),
  );
}

const BOOKING_PAGES = [
  { path: "/", name: "home hero" },
  { path: "/services/ai-solutions", name: "service page" },
  { path: "/contact", name: "contact card" },
];

for (const { path, name } of BOOKING_PAGES) {
  test(`"Book a call" opens the Calendly pop-up in place (${name})`, async ({ page, context, isMobile }) => {
    await stubCalendly(page);
    await page.goto(path);
    await waitForAppReady(page);

    let newTabs = 0;
    context.on("page", () => newTabs++);

    const trigger = page.locator("main a[data-booking]").first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Book a call" });
    await expect(dialog).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(path);
    expect(newTabs).toBe(0);

    // Calendly frame loads with embed params and becomes visible once ready
    const frame = dialog.locator("iframe");
    await expect(frame).toHaveAttribute("src", /calendly\.com\/.+embed_type=PopupWidget/);
    await expect(page.frameLocator("dialog iframe").locator("#cal")).toBeVisible();
    await expect(frame).toHaveCSS("opacity", "1");

    // Page behind is scroll-locked
    await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

    // Full-screen on phones, centred window on larger screens
    const box = await dialog.boundingBox();
    const vp = page.viewportSize()!;
    if (vp.width < 640 || vp.height < 560) {
      expect(Math.round(box!.width)).toBe(vp.width);
      expect(box!.height).toBeGreaterThanOrEqual(vp.height - 1);
    } else {
      expect(box!.width).toBeLessThan(vp.width);
    }

    // Close button works and releases the scroll lock
    await dialog.getByRole("button", { name: "Close booking" }).click();
    await expect(dialog).toBeHidden();
    await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");

    // Can be reopened; Escape closes (keyboard devices)
    await trigger.click();
    await expect(dialog).toBeVisible();
    if (!isMobile) {
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });
}

test("clicking the backdrop closes the pop-up", async ({ page }) => {
  const vp = page.viewportSize()!;
  test.skip(vp.width < 640 || vp.height < 560, "pop-up is full-screen on phones (no backdrop)");
  await stubCalendly(page);
  await page.goto("/");
  await waitForAppReady(page);
  await page.locator("main a[data-booking]").first().click();
  const dialog = page.getByRole("dialog", { name: "Book a call" });
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test("Cmd/Ctrl-click still opens Calendly in a new tab", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "no modifier keys on touch devices");
  await context.route("https://calendly.com/**", (route) => route.fulfill({ contentType: "text/html", body: "cal" }));
  await page.goto("/");
  await waitForAppReady(page);
  // Record whether anything cancelled the browser's default link behaviour
  await page.evaluate(() => {
    window.addEventListener("click", (e) => ((window as unknown as { __prevented: boolean }).__prevented = e.defaultPrevented));
  });
  const newTab = context.waitForEvent("page");
  await page.locator("main a[data-booking]").first().click({ modifiers: ["ControlOrMeta"] });
  await newTab; // headless Chromium leaves background tabs blank, so only check it opened
  expect(await page.evaluate(() => (window as unknown as { __prevented: boolean }).__prevented)).toBe(false);
  await expect(page.getByRole("dialog", { name: "Book a call" })).toBeHidden();
});

test("without JavaScript, Book a call is still a working link", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const link = page.locator("main a[data-booking]").first();
  await expect(link).toHaveAttribute("href", /^https:\/\/calendly\.com\//);
  await expect(link).toHaveAttribute("target", "_blank");
  await context.close();
});

test("closing and immediately reopening the pop-up always works", async ({ page }) => {
  await stubCalendly(page);
  await page.goto("/");
  await waitForAppReady(page);
  const dialog = page.getByRole("dialog", { name: "Book a call" });
  for (let i = 0; i < 5; i++) {
    // Close and re-click in the same tick, before the async "close" event is delivered
    await page.evaluate(() => {
      const link = document.querySelector("main a[data-booking]") as HTMLElement;
      link.click();
    });
    await expect(dialog).toBeVisible();
    await page.evaluate(() => {
      document.querySelector("dialog")!.close();
      (document.querySelector("main a[data-booking]") as HTMLElement).click();
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("iframe")).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  }
});
