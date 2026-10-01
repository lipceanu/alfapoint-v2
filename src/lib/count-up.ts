export type StatParts = { prefix: string; number: number; suffix: string };

/** "50+" → { prefix: "", number: 50, suffix: "+" }; null if there is no number to count. */
export function parseStat(value: string): StatParts | null {
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  if (!match) return null;
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

/** The text to show at `progress` (0–1) of the count-up; always ends on the real value. */
export function formatAt(parts: StatParts, progress: number): string {
  const p = Math.min(1, Math.max(0, progress));
  return `${parts.prefix}${Math.round(parts.number * p)}${parts.suffix}`;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
