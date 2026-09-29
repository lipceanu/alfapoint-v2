import { expect, test } from "@playwright/test";

const isMobileWidth = (width: number | undefined) => (width ?? 1440) < 768;

test("primary navigation matches screen size", async ({ page, viewport }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main" });
  const menuButton = page.getByRole("button", { name: "Open menu" });
  if (isMobileWidth(viewport?.width)) {
    await expect(mainNav).toBeHidden();
    await expect(menuButton).toBeVisible();
  } else {
    await expect(mainNav).toBeVisible();
    await expect(menuButton).toBeHidden();
  }
});

test("mobile menu opens, locks scroll, closes with Escape and on navigation", async ({ page, viewport }) => {
  test.skip(!isMobileWidth(viewport?.width), "mobile menu only below 768px");
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("link", { name: "Dedicated Teams" }).click();
  await expect(page).toHaveURL(/\/services\/dedicated-teams$/);
  await expect(menu).toBeHidden();
  await page.waitForLoadState("load"); // let the navigation finish before starting another

  // Same-page anchor link must also close the menu
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await menu.getByRole("link", { name: "How we work" }).click();
  await expect(menu).toBeHidden();
});

test("desktop nav links route correctly", async ({ page, viewport }) => {
  test.skip(isMobileWidth(viewport?.width), "desktop nav only at 768px and up");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("One partner");
  await nav.getByRole("link", { name: "Careers" }).click();
  await expect(page).toHaveURL(/\/careers$/);
});

test("FAQ accordions expand and collapse", async ({ page }) => {
  await page.goto("/services/dedicated-teams");
  const first = page.locator("details").first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).not.toHaveAttribute("open", "");
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator("p")).toBeVisible();
  await first.locator("summary").click();
  await expect(first).not.toHaveAttribute("open", "");
});

test("skip link moves focus to main content", async ({ page, viewport, browserName }) => {
  test.skip(isMobileWidth(viewport?.width), "keyboard test on desktop/tablet");
  await page.goto("/");
  // Safari only tabs to links with Option held (default macOS setting)
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("external links open safely in a new tab", async ({ page }) => {
  await page.goto("/");
  const unsafe = await page.$$eval('a[target="_blank"]', (links) =>
    links.filter((a) => !(a.getAttribute("rel") ?? "").includes("noopener")).map((a) => a.getAttribute("href")),
  );
  expect(unsafe).toEqual([]);
});

test("legacy v2 URLs keep working", async ({ page }) => {
  for (const [from, to] of [
    ["/services/hr-services", "/services/dedicated-teams"],
    ["/services/data-science", "/services/ai-solutions"],
    ["/job", "/careers"],
  ]) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  }
  const res = await page.goto("/home");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator("h1")).toContainText("Senior engineers");
});

test("unknown pages show the 404 page", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("different branch");
});
