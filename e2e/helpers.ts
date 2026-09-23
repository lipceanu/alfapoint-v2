import type { Page } from "@playwright/test";
import { services } from "../src/content/services";
import { jobs } from "../src/content/jobs";

export const PAGES = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/about",
  "/careers",
  ...jobs.map((j) => `/careers/${j.slug}`),
  "/contact",
];

/** Waits until the client app has started (reveal script running). */
export async function waitForAppReady(page: Page): Promise<void> {
  await page.locator("html[data-reveal-ready]").waitFor({ state: "attached" });
}

/** Scrolls through the page in viewport steps so lazy images and scroll reveals trigger. */
export async function scrollThrough(page: Page): Promise<void> {
  await waitForAppReady(page);
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    // "instant" overrides the site's CSS smooth scrolling so positions are final
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 300));
    // Give in-flight images up to 10s to finish decoding
    await Promise.race([
      Promise.allSettled([...document.images].filter((i) => !i.complete).map((i) => i.decode())),
      new Promise((r) => setTimeout(r, 10_000)),
    ]);
  });
}

export type Overflow = { tag: string; cls: string; right: number; text: string };

/** Visible elements that stick out past the right edge of the viewport. */
export async function findHorizontalOverflow(page: Page): Promise<{ docWidth: number; viewport: number; offenders: Overflow[] }> {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const offenders: Overflow[] = [];
    const clipped = (el: Element): boolean => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (["hidden", "clip"].includes(s.overflowX) || s.overflowX === "auto" || s.overflowX === "scroll") return true;
      }
      return false;
    };
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > viewport + 1 && !clipped(el)) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") ?? "").slice(0, 80),
          right: Math.round(r.right),
          text: (el.textContent ?? "").trim().slice(0, 40),
        });
      }
    });
    return { docWidth: document.documentElement.scrollWidth, viewport, offenders: offenders.slice(0, 5) };
  });
}
