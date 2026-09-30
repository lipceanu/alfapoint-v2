import { expect, test } from "@playwright/test";

const PHONES = [
  { label: "+373 (69) 719 888", href: "tel:+37369719888" },
  { label: "+373 (69) 905 471", href: "tel:+37369905471" },
];

test("contact page and footer show both phone numbers as tap-to-call links", async ({ page }) => {
  await page.goto("/contact");
  for (const scope of [page.locator("main"), page.locator("footer")]) {
    for (const { label, href } of PHONES) {
      const link = scope.getByRole("link", { name: label });
      await expect(link).toHaveAttribute("href", href);
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
    }
  }
  await expect(page.getByText("+41 22 568 01 59")).toHaveCount(0);
});
