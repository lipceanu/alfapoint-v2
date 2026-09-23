/** Attribute that marks a link as "open the booking pop-up instead of navigating". */
export const BOOKING_ATTR = "data-booking";

/**
 * URL for Calendly's inline embed. `embed_domain` and `embed_type` are the
 * parameters Calendly's own pop-up widget sends; they switch the page to its
 * embedded layout.
 */
export function calendlyEmbedUrl(schedulingUrl: string, host: string): string {
  const url = new URL(schedulingUrl);
  if (url.protocol !== "https:" || !/(^|\.)calendly\.com$/.test(url.hostname)) {
    throw new Error(`Not a Calendly URL: ${schedulingUrl}`);
  }
  url.searchParams.set("embed_domain", host);
  url.searchParams.set("embed_type", "PopupWidget");
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}

/** True for the postMessage events Calendly's embed sends once its page is showing. */
export function isCalendlyReadyMessage(origin: string, data: unknown): boolean {
  if (origin !== "https://calendly.com") return false;
  const event = (data as { event?: unknown } | null)?.event;
  return typeof event === "string" && event.startsWith("calendly.");
}

type ClickLike = {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
};

/** Plain left clicks open the pop-up; modified clicks keep native new-tab/window behaviour. */
export function shouldOpenBookingPopup(event: ClickLike): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
