import type { SVGProps } from "react";
import type { IconName } from "@/content/services";

type GlyphName = IconName | "arrow" | "arrowUpRight" | "check" | "plus" | "menu" | "close";

const PATHS: Record<GlyphName, string> = {
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z",
  code: "m8 8-4 4 4 4m8-8 4 4-4 4M13.5 5l-3 14",
  spark: "M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8",
  cloud: "M7 18h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.5 9.5 4.25 4.25 0 0 0 7 18Zm5-6v6m-3-3 3-3 3 3",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0-1.2-5.75M18 20h3a5 5 0 0 0-5-5",
  pen: "m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm10-12.5 3 3M4 20h16",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  arrowUpRight: "M7 17 17 7m-9 0h9v9",
  check: "m5 12.5 4.5 4.5L19 7.5",
  plus: "M12 5v14M5 12h14",
  menu: "M4 8h16M4 16h16",
  close: "m6 6 12 12M18 6 6 18",
};

type IconProps = SVGProps<SVGSVGElement> & { name: GlyphName; size?: number };

export function Icon({ name, size = 24, strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
