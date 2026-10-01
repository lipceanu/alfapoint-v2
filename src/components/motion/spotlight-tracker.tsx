"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position to cards marked `data-spotlight` (as --spot-x/--spot-y),
 * which CSS turns into a soft glow. Mouse/trackpad only: touch devices never hover.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const update = () => {
      frame = 0;
      const card = (last?.target as Element | null)?.closest?.<HTMLElement>("[data-spotlight]");
      if (!card || !last) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${last.clientX - r.left}px`);
      card.style.setProperty("--spot-y", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
