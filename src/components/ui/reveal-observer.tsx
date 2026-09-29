"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Portion of the viewport an element must enter before it is revealed. */
const REVEAL_LINE = 0.92;

/**
 * Adds `is-visible` to every `[data-reveal]` element once it has reached the
 * viewport, including elements scrolled *past* (fast flicks, anchor jumps,
 * restored scroll positions), which an IntersectionObserver alone can miss.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    let frame = 0;

    const check = () => {
      frame = 0;
      const line = window.innerHeight * REVEAL_LINE;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
      if (pending.length === 0) stop();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    document.documentElement.setAttribute("data-reveal-ready", "");
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    check();
    return stop;
  }, [pathname]);

  return null;
}
