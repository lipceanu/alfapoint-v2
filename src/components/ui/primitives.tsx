import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icon";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

type ButtonVariant = "lime" | "ghost" | "ink";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  lime: "bg-lime text-ink-950 hover:bg-white",
  ghost: "border border-white/20 text-paper hover:border-lime hover:text-lime",
  ink: "bg-ink-900 text-paper hover:bg-brand",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function ButtonLink({ href, children, variant = "lime", className = "" }: ButtonLinkProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = `group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${BUTTON_STYLES[variant]} ${className}`;
  const content = (
    <>
      {children}
      <Icon
        name={href.startsWith("http") ? "arrowUpRight" : "arrow"}
        size={18}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );
  if (external) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

type EyebrowProps = { index?: string; children: ReactNode; tone?: "dark" | "light" };

export function Eyebrow({ index, children, tone = "dark" }: EyebrowProps) {
  const color = tone === "dark" ? "text-mist" : "text-slate";
  return (
    <p className={`eyebrow flex items-center gap-3 ${color}`}>
      {index && <span className={tone === "dark" ? "text-lime" : "text-brand-600"}>{index}</span>}
      <span className="h-px w-8 bg-current opacity-40" />
      {children}
    </p>
  );
}

type SectionHeaderProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeader({ index, eyebrow, title, lead, tone = "dark", className = "" }: SectionHeaderProps) {
  const leadColor = tone === "dark" ? "text-mist" : "text-slate";
  return (
    <div className={`max-w-3xl ${className}`} data-reveal>
      <Eyebrow index={index} tone={tone}>
        {eyebrow}
      </Eyebrow>
      <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {lead && <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${leadColor}`}>{lead}</p>}
    </div>
  );
}

/** Serif italic accent used inside headlines */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal italic tracking-normal">{children}</em>;
}

export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
