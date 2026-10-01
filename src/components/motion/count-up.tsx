"use client";

import { useEffect, useRef } from "react";
import { easeOutCubic, formatAt, parseStat } from "@/lib/count-up";

const DURATION_MS = 1200;

/**
 * Counts up to `value` once, when scrolled into view. The real value is always
 * rendered (for SEO, screen readers and no-JS); only the visible digits animate.
 * Skipped for reduced motion, and for numbers already on screen at load (no flash).
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parts = parseStat(value);
    if (!el || !parts) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.textContent = formatAt(parts, 0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          el.textContent = formatAt(parts, easeOutCubic(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
    </>
  );
}
