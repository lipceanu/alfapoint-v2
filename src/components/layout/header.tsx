"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Icon } from "@/components/ui/icon";

export function Header() {
  const pathname = usePathname();
  // The menu belongs to the path it was opened on, so navigating closes it.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const setOpen = (next: boolean) => setOpenOnPath(next ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu only exists below the md breakpoint: close it when the window widens
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => desktop.matches && setOpenOnPath(null);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Lock both html and body: iOS Safari ignores overflow on body alone
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // Everything outside the header is inert while the full-screen menu is open
    const background = document.querySelectorAll<HTMLElement>('#main, body > footer, a[href="#main"]');
    background.forEach((el) => (el.inert = true));
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const focusables = () => [
      toggleRef.current!,
      ...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
    ];
    // Single keyboard handler while open: Tab stays inside [toggle + menu]; Escape closes
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOnPath(null);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (index <= 0 ? items.length - 1 : index - 1) : index >= items.length - 1 ? 0 : index + 1;
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      background.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => href !== "/" && !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-white/10 bg-ink-950/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link href="/" inert={open} aria-label={`${site.name} home`} className="flex h-11 w-[122px] items-center text-paper">
          <span className="logo-mask block h-7 w-full" />
        </Link>

        <nav aria-label="Main" inert={open} className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 items-center rounded-full px-4 text-sm transition-colors hover:text-lime ${
                isActive(item.href) ? "text-lime" : "text-paper/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            inert={open}
            className="hidden h-11 items-center rounded-full bg-lime px-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-white sm:inline-flex"
          >
            Let&apos;s talk
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 md:hidden"
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen(!open);
              if (open) toggleRef.current?.focus();
            }}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setOpenOnPath(null)}
          className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-ink-950 px-5 pb-10 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col border-t border-white/10 pt-6">
            {mainNav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="animate-rise border-b border-white/10 py-4 text-3xl font-semibold tracking-tight"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="eyebrow mt-8 text-mist">Services</p>
          <ul className="mt-3 grid gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-paper/80 hover:text-lime">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-10 flex items-center justify-between rounded-full bg-lime px-6 py-4 font-semibold text-ink-950"
          >
            Let&apos;s talk <Icon name="arrow" size={20} />
          </Link>
        </div>
      )}
    </header>
  );
}
