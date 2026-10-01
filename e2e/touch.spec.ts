import { expect, test, type Page } from "@playwright/test";
import { PAGES, waitForAppReady } from "./helpers";

// Touch devices must never show keyboard focus rings after taps (reported on a real iPhone).
test.describe("touch interaction shows no keyboard focus rings", () => {
  test.skip(({ hasTouch }) => !hasTouch, "touch devices only");

  const focusRing = (page: Page) =>
    page.evaluate(() => {
      const el = document.querySelector(":focus-visible");
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      // A ring can be drawn as an outline or as a box-shadow (our two-colour focus style)
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      return ring ? `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"` : null;
    });

  test("opening and using the menu by tap", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 768, "menu only below 768px");
    await page.route("https://calendly.com/**", (r) => r.fulfill({ contentType: "text/html", body: "cal" }));
    await page.goto("/");
    await waitForAppReady(page);
    await page.getByRole("button", { name: "Open menu" }).tap();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.waitForTimeout(400);
    expect(await focusRing(page), "after opening menu").toBeNull();
    // Real iOS Safari draws a ring for any programmatic focus, so focus must not be moved into the menu on tap
    expect(await page.evaluate(() => !!document.activeElement?.closest("#mobile-menu")), "focus moved into menu").toBe(false);
    await page.getByRole("button", { name: "Close menu" }).tap();
    await page.waitForTimeout(300);
    expect(await focusRing(page), "after closing menu").toBeNull();
    await page.getByRole("button", { name: "Open menu" }).tap();
    await page.locator("#mobile-menu").getByRole("link", { name: "About" }).tap();
    await expect(page).toHaveURL(/\/about$/);
    await page.waitForTimeout(400);
    expect(await focusRing(page), "after navigating from menu").toBeNull();
  });

  test("opening and closing the booking pop-up by tap", async ({ page }) => {
    await page.route("https://calendly.com/**", (r) =>
      r.fulfill({ contentType: "text/html", body: `<h1>cal</h1><script>setTimeout(()=>parent.postMessage({event:"calendly.event_type_viewed"},"*"),50)</script>` }),
    );
    await page.goto("/");
    await waitForAppReady(page);
    await page.locator("main a[data-booking]").first().tap();
    await expect(page.getByRole("dialog", { name: "Book a call" })).toBeVisible();
    await page.waitForTimeout(400);
    expect(await focusRing(page), "after opening pop-up").toBeNull();
    // ...and must not land on a control (e.g. the close button) on tap
    expect(await page.evaluate(() => document.activeElement?.matches("button, a") ?? false), "focus on a control").toBe(false);
    await page.getByRole("button", { name: "Close booking" }).tap();
    await page.waitForTimeout(300);
    expect(await focusRing(page), "after closing pop-up").toBeNull();
  });

  test("tapping through every page leaves no focus ring", async ({ page }) => {
    test.setTimeout(120_000);
    for (const path of PAGES) {
      await page.goto(path);
      await waitForAppReady(page);
      // Tap the first FAQ (if any) and an empty spot, the most common taps that don't navigate
      const faq = page.locator("details summary").first();
      if (await faq.count()) {
        await faq.scrollIntoViewIfNeeded();
        await faq.tap();
      }
      await page.mouse.click(5, 300);
      await page.waitForTimeout(200);
      expect(await focusRing(page), path).toBeNull();
    }
  });
});

test.describe("keyboard users still get focus moved into overlays", () => {
  test.skip(({ isMobile, browserName, viewport }) => isMobile || (browserName === "chromium" && viewport?.width !== 1440), "desktop engines");

  test("menu opened with Enter focuses its first link; pop-up opened with Enter focuses inside it", async ({ page, browserName }) => {
    await page.route("https://calendly.com/**", (r) => r.fulfill({ contentType: "text/html", body: "cal" }));
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/");
    await waitForAppReady(page);
    await page.getByRole("button", { name: "Open menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mobile-menu").getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.locator("main a[data-booking]").first().focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Book a call" });
    await expect(dialog).toBeVisible();
    // Focus is inside the dialog; Tab reaches the close button
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
    await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  });
});

test.describe("header while the menu is open", () => {
  test.skip(({ isMobile }) => !isMobile, "phones");

  test("header bar is solid and matches the menu panel", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 768, "menu only below 768px");
    await page.goto("/");
    await waitForAppReady(page);
    await page.getByRole("button", { name: "Open menu" }).tap();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    const panel = await page.evaluate(() => getComputedStyle(document.getElementById("mobile-menu")!).backgroundColor);
    // The header fades its background over 300 ms: wait for the final colour
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector("header")!).backgroundColor)).toBe(panel);
  });
});
