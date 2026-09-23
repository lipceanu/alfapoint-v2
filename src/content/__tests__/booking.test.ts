import { describe, expect, it } from "vitest";
import { calendlyEmbedUrl, isCalendlyReadyMessage, shouldOpenBookingPopup } from "../booking";
import { site } from "../site";

const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };

describe("calendlyEmbedUrl", () => {
  it("adds Calendly's pop-up embed parameters", () => {
    const url = new URL(calendlyEmbedUrl(site.calendlyUrl, "www.alfa-point.com"));
    expect(url.origin + url.pathname).toBe(site.calendlyUrl);
    expect(url.searchParams.get("embed_domain")).toBe("www.alfa-point.com");
    expect(url.searchParams.get("embed_type")).toBe("PopupWidget");
  });

  it("keeps existing query parameters", () => {
    const url = new URL(calendlyEmbedUrl("https://calendly.com/team/intro?month=2026-10", "x.com"));
    expect(url.searchParams.get("month")).toBe("2026-10");
  });

  it("refuses anything that is not an https Calendly URL", () => {
    expect(() => calendlyEmbedUrl("https://evil.example/calendly.com", "x.com")).toThrow();
    expect(() => calendlyEmbedUrl("http://calendly.com/a", "x.com")).toThrow();
    expect(() => calendlyEmbedUrl("https://calendly.com.evil.io/a", "x.com")).toThrow();
  });
});

describe("shouldOpenBookingPopup", () => {
  it("opens on a plain left click", () => {
    expect(shouldOpenBookingPopup(click)).toBe(true);
  });

  it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)("keeps native behaviour with %s", (key) => {
    expect(shouldOpenBookingPopup({ ...click, [key]: true })).toBe(false);
  });

  it("ignores middle clicks and already-handled events", () => {
    expect(shouldOpenBookingPopup({ ...click, button: 1 })).toBe(false);
    expect(shouldOpenBookingPopup({ ...click, defaultPrevented: true })).toBe(false);
  });
});

describe("isCalendlyReadyMessage", () => {
  it("accepts Calendly events from calendly.com only", () => {
    expect(isCalendlyReadyMessage("https://calendly.com", { event: "calendly.event_type_viewed" })).toBe(true);
    expect(isCalendlyReadyMessage("https://evil.example", { event: "calendly.event_type_viewed" })).toBe(false);
    expect(isCalendlyReadyMessage("https://calendly.com", { event: "other" })).toBe(false);
    expect(isCalendlyReadyMessage("https://calendly.com", "calendly.x")).toBe(false);
    expect(isCalendlyReadyMessage("https://calendly.com", null)).toBe(false);
  });
});
