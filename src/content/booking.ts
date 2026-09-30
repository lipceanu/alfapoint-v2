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
  // Calendly's cookie banner stays on: hiding it does not stop its cookies, and
  // this site has no consent manager of its own.
  return url.toString();
}

/**
 * Calendly events that mean the scheduling page is actually on screen.
 * (`calendly.page_height` and others can arrive before anything is drawn.)
 */
const CALENDLY_READY_EVENTS = new Set([
  "calendly.event_type_viewed",
  "calendly.date_and_time_selected",
  "calendly.profile_page_viewed",
]);

/** True when a postMessage from Calendly's embed says its page is showing. */
export function isCalendlyReadyMessage(origin: string, data: unknown): boolean {
  if (origin !== "https://calendly.com") return false;
  const event = (data as { event?: unknown } | null)?.event;
  return typeof event === "string" && CALENDLY_READY_EVENTS.has(event);
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
