import { expect, test } from "@playwright/test";
import { PAGES } from "./helpers";

// Plan PR 5. Browser-independent: run once.
test.describe("share and search metadata", () => {
  test.skip(({ browserName, isMobile, viewport }) => isMobile || browserName !== "chromium" || viewport?.width !== 1440, "runs once");

  test("every page has a large share image that resolves", async ({ page, request }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const meta = await page.evaluate(() => {
        const get = (sel: string) => document.querySelector(sel)?.getAttribute("content") ?? null;
        return {
          og: get('meta[property="og:image"]'),
          ogW: get('meta[property="og:image:width"]'),
          ogH: get('meta[property="og:image:height"]'),
          ogAlt: get('meta[property="og:image:alt"]'),
          card: get('meta[name="twitter:card"]'),
          tw: get('meta[name="twitter:image"]'),
        };
      });
      expect(meta.og, `${path} og:image`).toBe("https://www.alfa-point.com/og.png");
      expect([meta.ogW, meta.ogH], `${path} size`).toEqual(["1200", "630"]);
      expect(meta.ogAlt, `${path} alt`).toBeTruthy();
      expect(meta.card, `${path} twitter:card`).toBe("summary_large_image");
      expect(meta.tw, `${path} twitter:image`).toBe("https://www.alfa-point.com/og.png");
    }
    // Fetch the production URL's path against the test server
    const img = await request.get(new URL("https://www.alfa-point.com/og.png").pathname);
    expect(img.status()).toBe(200);
    expect(img.headers()["content-type"]).toBe("image/png");
    const bytes = await img.body();
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]); // PNG IHDR width/height
  });

  test("app icons are linked and load", async ({ page, request }) => {
    await page.goto("/");
    for (const [rel, size] of [["icon", 512], ["apple-touch-icon", 180]] as const) {
      const href = await page.locator(`link[rel="${rel}"][type="image/png"], link[rel="${rel}"][sizes="${size}x${size}"]`).first().getAttribute("href");
      expect(href, rel).toBeTruthy();
      const res = await request.get(new URL(href!, "http://x").pathname + new URL(href!, "http://x").search);
      expect(res.status(), rel).toBe(200);
      const bytes = await res.body();
      expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], rel).toEqual([size, size]);
    }
  });

  test("Organization structured data is valid and factual", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0]);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Alfapoint",
      url: "https://www.alfa-point.com",
      logo: "https://www.alfa-point.com/icon.png",
      email: "info@alfa-point.com",
    });
    expect(data.address).toBeUndefined(); // no unconfirmed postal addresses
    expect(blocks[0]).not.toContain("<");
  });
});
