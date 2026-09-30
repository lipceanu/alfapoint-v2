"use client";

import { useEffect, useRef, useState } from "react";
import { BOOKING_ATTR, calendlyEmbedUrl, isCalendlyReadyMessage, shouldOpenBookingPopup } from "@/content/booking";
import { Icon } from "@/components/ui/icon";

/** How long to wait for Calendly before offering the "open in new tab" fallback. */
const SLOW_LOAD_MS = 15_000;
/** If Calendly never posts a ready message, reveal the frame this long after it loads. */
const READY_FALLBACK_MS = 6000;

/**
 * Site-wide Calendly pop-up. Any link with `data-booking` opens it; without JS
 * (or on Cmd/Ctrl-click) the link still opens Calendly in a new tab.
 */
export function BookingDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // A fresh object per click, so re-opening the same link always triggers the open effect
  const [booking, setBooking] = useState<{ href: string } | null>(null);
  const link = booking?.href ?? null;
  const [status, setStatus] = useState<"loading" | "ready" | "slow">("loading");

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>(`a[${BOOKING_ATTR}]`);
      if (!anchor || !shouldOpenBookingPopup(event)) return;
      event.preventDefault();
      setStatus("loading");
      setBooking({ href: anchor.href });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !booking) return;
    if (!dialog.open) dialog.showModal();
    // Lock page scroll behind the modal (html + body for iOS Safari)
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const slow = window.setTimeout(() => setStatus((s) => (s === "loading" ? "slow" : s)), SLOW_LOAD_MS);
    // Calendly posts messages once its scheduling page has rendered
    const onMessage = (e: MessageEvent) => isCalendlyReadyMessage(e.origin, e.data) && setStatus("ready");
    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(slow);
      window.removeEventListener("message", onMessage);
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [booking]);

  const close = () => dialogRef.current?.close();

  let src: string | null = null;
  if (link) {
    try {
      src = calendlyEmbedUrl(link, window.location.host);
    } catch {
      src = null;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Book a call"
      // "close" fires asynchronously; if the pop-up was already reopened by then, keep it
      onClose={() => !dialogRef.current?.open && setBooking(null)}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm windowed:h-[min(760px,90dvh)] windowed:w-[min(1000px,92vw)] windowed:rounded-3xl"
    >
      {link && (
        <div className="relative flex h-full flex-col bg-white text-ink-900 windowed:rounded-3xl">
          <div className="flex items-center justify-between gap-4 border-b border-ink-900/10 px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] [@media(max-height:500px)]:py-1 pr-[max(1.25rem,env(safe-area-inset-right))] pl-[max(1.25rem,env(safe-area-inset-left))]">
            <p className="font-semibold">Book a 30-minute call</p>
            <div className="flex items-center gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full px-3 py-2 text-sm text-slate hover:text-ink-900 sm:inline"
              >
                Open in new tab
              </a>
              <button
                type="button"
                onClick={close}
                autoFocus
                aria-label="Close booking"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink-900/5 transition-colors hover:bg-ink-900/10"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {status !== "ready" && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center" role="status">
                {status === "loading" ? (
                  <span className="flex items-center gap-3 text-slate">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    Loading available times…
                  </span>
                ) : (
                  <span className="text-slate">
                    Calendly is taking longer than usual.{" "}
                    <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline">
                      Open it in a new tab
                    </a>
                  </span>
                )}
              </div>
            )}
            {src ? (
              <iframe
                title="Calendly scheduling"
                src={src}
                onLoad={() => window.setTimeout(() => setStatus("ready"), READY_FALLBACK_MS)}
                className={`h-full w-full border-0 transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
                allow="payment"
              />
            ) : null}
          </div>
        </div>
      )}
    </dialog>
  );
}
