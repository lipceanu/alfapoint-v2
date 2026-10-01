import { expect, test, type Page } from "@playwright/test";
import { waitForAppReady } from "./helpers";

// Interaction regressions found in the Codex-reviewed plan (docs/improvement-plan.md, PR 2).
// Runs once per engine: desktop Chrome, Firefox and Safari (viewport is set per test).
const onePerEngine = ({ isMobile, browserName, viewport }: { isMobile: boolean; browserName: string; viewport: { width: number } | null }) =>
  isMobile || (browserName === "chromium" && viewport?.width !== 1440);

const locked = (page: Page) =>
  page.evaluate(() => document.documentElement.style.overflow === "hidden" || document.body.style.overflow === "hidden");

test.describe("mobile menu", () => {
  test.skip(onePerEngine, "runs once per engine");

  test("closes and releases the scroll lock when the window widens past the breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/");
    await waitForAppReady(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    expect(await locked(page)).toBe(true);

    await page.setViewportSize({ width: 768, height: 700 });
    await expect.poll(() => locked(page)).toBe(false);
    await page.setViewportSize({ width: 767, height: 700 });
    await expect(page.locator("#mobile-menu")).toBeHidden();
    expect(await locked(page)).toBe(false);
    // The page can scroll again
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("keeps keyboard focus inside the menu and returns it to the toggle on Escape", async ({ page, browserName }) => {
    await page.setViewportSize({ width: 700, height: 800 }); // 640–767: header CTA is visible too
    await page.goto("/");
    await waitForAppReady(page);
    const toggle = page.getByRole("button", { name: "Open menu" });
    // Open with the keyboard: only keyboard users get focus moved into the menu
    await toggle.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    // Focus starts on the first menu link
    await expect(menu.getByRole("link").first()).toBeFocused();

    const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
    const backTab = browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab";
    const inMenuOrToggle = () =>
      page.evaluate(() => {
        const a = document.activeElement;
        return !!a && (!!a.closest("#mobile-menu") || a.getAttribute("aria-controls") === "mobile-menu");
      });
    const count = await menu.getByRole("link").count();
    for (let i = 0; i < count + 3; i++) {
      await page.keyboard.press(tab);
      expect(await inMenuOrToggle(), `forward step ${i}`).toBe(true);
    }
    for (let i = 0; i < count + 3; i++) {
      await page.keyboard.press(backTab);
      expect(await inMenuOrToggle(), `backward step ${i}`).toBe(true);
    }

    // Background is inert while open; the header CTA is not reachable
    expect(await page.evaluate(() => (document.getElementById("main") as HTMLElement).inert)).toBe(true);
    expect(await page.getByRole("link", { name: "Let's talk" }).first().evaluate((el) => !!el.closest("[inert]"))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    expect(await page.evaluate(() => (document.getElementById("main") as HTMLElement).inert)).toBe(false);
    expect(await page.getByRole("link", { name: "Let's talk" }).first().evaluate((el) => !!el.closest("[inert]"))).toBe(false);
  });
});

// Calendly stubs: "ready" posts the ready message, "silent" loads but never posts
async function stubCalendly(page: Page, mode: "ready" | "silent" | "hold") {
  const pending: Array<() => void> = [];
  await page.route("https://calendly.com/**", async (route) => {
    const body = `<!doctype html><h1 id="cal">Select a Date &amp; Time</h1>
      <script>
        window.addEventListener("message", (e) => { if (e.data === "post-ready") parent.postMessage({ event: "calendly.event_type_viewed" }, "*"); });
        ${mode === "ready" ? 'setTimeout(() => parent.postMessage({ event: "calendly.event_type_viewed" }, "*"), 50);' : ""}
      </script>`;
    if (mode === "hold") pending.push(() => route.fulfill({ contentType: "text/html", body }));
    else await route.fulfill({ contentType: "text/html", body });
  });
  return { release: () => pending.splice(0).forEach((f) => f()) };
}

const status = (page: Page) => page.locator("dialog").getAttribute("data-status");
const openBooking = (page: Page) => page.evaluate(() => (document.querySelector("main a[data-booking]") as HTMLElement).click());
const waitFrameLoad = (page: Page) =>
  page.waitForFunction(() => {
    const f = document.querySelector("dialog iframe") as HTMLIFrameElement | null;
    return !!f && f.dataset.loaded === "true";
  });

test.describe("booking pop-up robustness", () => {
  test.skip(onePerEngine, "runs once per engine");

  test("a previous opening's timer never affects a new opening", async ({ page }) => {
    await page.clock.install();
    await stubCalendly(page, "silent");
    await page.goto("/");
    await waitForAppReady(page);
    await page.clock.pauseAt(Date.now() + 1000);

    await openBooking(page);
    await waitFrameLoad(page);
    const first = await page.locator("dialog iframe").elementHandle();
    await page.clock.runFor(3000);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toBeHidden();

    await openBooking(page);
    await waitFrameLoad(page);
    // Every opening gets a fresh frame
    expect(await page.evaluate((el) => el !== document.querySelector("dialog iframe"), first)).toBe(true);
    await page.clock.runFor(4000); // past the first opening's 6 s deadline
    expect(await status(page)).toBe("loading");
    await page.clock.runFor(2500); // past the second opening's own deadline
    expect(await status(page)).toBe("unconfirmed");
    await expect(page.getByRole("link", { name: /Open Calendly in a new tab/ })).toBeVisible();
  });

  test("ignores a valid-looking Calendly message from a different frame", async ({ page }) => {
    await stubCalendly(page, "silent");
    await page.goto("/");
    await waitForAppReady(page);
    await openBooking(page);
    await waitFrameLoad(page);
    // A second Calendly-origin frame on the page posts a ready message
    await page.evaluate(() => {
      const f = document.createElement("iframe");
      f.src = "https://calendly.com/other";
      f.style.display = "none";
      f.onload = () => f.contentWindow!.postMessage("post-ready", "*");
      document.body.appendChild(f);
    });
    await page.waitForTimeout(500);
    expect(await status(page)).toBe("loading");
    // The real frame's message is accepted
    await page.evaluate(() => (document.querySelector("dialog iframe") as HTMLIFrameElement).contentWindow!.postMessage("post-ready", "*"));
    await expect.poll(() => status(page)).toBe("ready");
  });

  test("slow Calendly: shows fallback, then recovers when it finally loads", async ({ page }) => {
    await page.clock.install();
    const cal = await stubCalendly(page, "hold");
    await page.goto("/");
    await waitForAppReady(page);
    await page.clock.pauseAt(Date.now() + 1000);
    await openBooking(page);
    await page.clock.runFor(15_000);
    expect(await status(page)).toBe("slow");
    await expect(page.getByRole("link", { name: /Open Calendly in a new tab/ })).toBeVisible();

    cal.release();
    await waitFrameLoad(page);
    await page.clock.runFor(6000);
    expect(await status(page)).toBe("unconfirmed");
    await page.evaluate(() => (document.querySelector("dialog iframe") as HTMLIFrameElement).contentWindow!.postMessage("post-ready", "*"));
    await expect.poll(() => status(page)).toBe("ready");
    // Timers never downgrade "ready"
    await page.clock.runFor(20_000);
    expect(await status(page)).toBe("ready");
  });

  test("fallback link is visible and tappable on small and short screens", async ({ page }) => {
    await stubCalendly(page, "ready");
    for (const [w, h] of [[280, 653], [375, 667], [740, 360]] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/");
      await waitForAppReady(page);
      await openBooking(page);
      const link = page.getByRole("link", { name: /Open Calendly in a new tab/ });
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.x, `${w}×${h} left`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${w}×${h} right`).toBeLessThanOrEqual(w + 1);
      expect(box.y + box.height, `${w}×${h} bottom`).toBeLessThanOrEqual(h + 1);
      expect(box.height, `${w}×${h} tap height`).toBeGreaterThanOrEqual(24);
      await page.keyboard.press("Escape");
    }
  });
});

test.describe("focus indicator", () => {
  test.skip(({ browserName, isMobile, viewport }) => isMobile || browserName !== "chromium" || viewport?.width !== 1440, "desktop Chromium only");

  test("focus rings are never clipped by overflow-hidden containers", async ({ page }) => {
    const problems: string[] = [];
    for (const path of ["/", "/services/ai-solutions", "/contact"]) {
      await page.goto(path);
      await waitForAppReady(page);
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press("Tab");
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const offset = parseFloat(cs.outlineOffset) || 0;
          const width = parseFloat(cs.outlineWidth) || 0;
          const grow = Math.max(0, offset + width);
          const b = el.getBoundingClientRect();
          const ring = { l: b.left - grow, t: b.top - grow, r: b.right + grow, btm: b.bottom + grow };
          for (let p = el.parentElement; p; p = p.parentElement) {
            const o = getComputedStyle(p);
            if (["hidden", "clip"].includes(o.overflowX) || ["hidden", "clip"].includes(o.overflowY)) {
              const pr = p.getBoundingClientRect();
              if (ring.l < pr.left - 0.5 || ring.t < pr.top - 0.5 || ring.r > pr.right + 0.5 || ring.btm > pr.bottom + 0.5) {
                return `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`;
              }
            }
          }
          return "";
        });
        if (r) problems.push(`${path}: ${r}`);
      }
    }
    expect([...new Set(problems)]).toEqual([]);
  });
});

test.describe("motion", () => {
  test.skip(onePerEngine, "runs once per engine");

  test("no endless animations run on the page; each technology is listed once", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    await page.waitForTimeout(1500);
    const infinite = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations === Infinity)
        .map((a) => ((a.effect as KeyframeEffect).target as Element)?.className?.toString().slice(0, 40)),
    );
    expect(infinite).toEqual([]);
    const names = await page.getByRole("region", { name: "Technologies we work with" }).locator("li").allInnerTexts();
    expect(names.length).toBeGreaterThan(5);
    expect(new Set(names).size).toBe(names.length);
  });
});
