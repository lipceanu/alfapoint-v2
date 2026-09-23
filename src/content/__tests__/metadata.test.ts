import { describe, expect, it } from "vitest";
import { pageMetadata } from "../metadata";
import { site } from "../site";

describe("pageMetadata", () => {
  it("keeps canonical and og:url in sync", () => {
    const meta = pageMetadata({ path: "/about", title: "About", description: "x" });
    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({ url: "/about", siteName: site.name, title: `About | ${site.name}` });
  });

  it("falls back to site defaults for the home page", () => {
    const meta = pageMetadata({ path: "/" });
    expect(meta.title).toBeUndefined();
    expect(meta.description).toBe(site.description);
    expect(meta.openGraph).toMatchObject({ url: "/" });
  });
});
