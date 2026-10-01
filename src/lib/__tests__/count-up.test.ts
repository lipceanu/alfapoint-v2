import { describe, expect, it } from "vitest";
import { easeOutCubic, formatAt, parseStat } from "../count-up";

describe("parseStat", () => {
  it("splits a number from its prefix and suffix", () => {
    expect(parseStat("50+")).toEqual({ prefix: "", number: 50, suffix: "+" });
    expect(parseStat("90%")).toEqual({ prefix: "", number: 90, suffix: "%" });
    expect(parseStat("10")).toEqual({ prefix: "", number: 10, suffix: "" });
    expect(parseStat("~3x")).toEqual({ prefix: "~", number: 3, suffix: "x" });
  });

  it("returns null when there is nothing to count", () => {
    expect(parseStat("ISO")).toBeNull();
    expect(parseStat("")).toBeNull();
  });
});

describe("formatAt", () => {
  const parts = { prefix: "", number: 50, suffix: "+" };
  it("starts at zero and ends exactly on the real value", () => {
    expect(formatAt(parts, 0)).toBe("0+");
    expect(formatAt(parts, 1)).toBe("50+");
  });
  it("rounds intermediate frames and clamps progress", () => {
    expect(formatAt(parts, 0.5)).toBe("25+");
    expect(formatAt(parts, -1)).toBe("0+");
    expect(formatAt(parts, 2)).toBe("50+");
  });
});

describe("easeOutCubic", () => {
  it("runs from 0 to 1 and is front-loaded", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});
