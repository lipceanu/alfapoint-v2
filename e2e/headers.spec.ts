import { expect, test } from "@playwright/test";
import { waitForAppReady } from "./helpers";

// Plan PR 4. Header checks are browser-independent: run once.
test.describe("response headers", () => {
  test.skip(({ browserName, isMobile, viewport }) => isMobile || browserName !== "chromium" || viewport?.width !== 1440, "runs once");

  const SECURITY = {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    "content-security-policy": "frame-ancestors 'none'",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  };

  test("security headers on pages, assets and 404s", async ({ request }) => {
    for (const path of ["/", "/services/ai-solutions", "/contact", "/clients/abb.svg", "/does-not-exist"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      const h = res.headers();
      for (const [name, value] of Object.entries(SECURITY)) {
        expect(h[name], `${name} on ${path}`).toBe(value);
      }
    }
  });

  test("public images are cached briefly; HTML and 404s are not", async ({ request }) => {
    for (const path of ["/clients/abb.svg", "/team/dima.jpg", "/tech/react.svg"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()["cache-control"], path).toBe("public, max-age=3600, stale-while-revalidate=86400");
    }
    for (const path of ["/", "/about"]) {
      expect((await request.get(path)).headers()["cache-control"] ?? "", path).not.toContain("max-age=3600");
    }
    // A missing image: Vercel applies path-based header rules to 404s too (it can't
    // match on status), so allow the asset rule there, but never anything longer
    const missing = await request.get("/clients/does-not-exist.svg");
    expect(missing.status()).toBe(404);
    const cc = missing.headers()["cache-control"] ?? "";
    expect(cc === "" || /max-age=0\b/.test(cc) || cc === "public, max-age=3600, stale-while-revalidate=86400", cc).toBe(true);
  });

  test("the booking pop-up still embeds Calendly with these headers", async ({ page }) => {
    await page.route("https://calendly.com/**", (r) => r.fulfill({ contentType: "text/html", body: "<h1 id=cal>Calendly</h1>" }));
    await page.goto("/");
    await waitForAppReady(page);
    await page.evaluate(() => (document.querySelector("main a[data-booking]") as HTMLElement).click());
    await expect(page.frameLocator("dialog iframe").locator("#cal")).toBeVisible();
  });
});
