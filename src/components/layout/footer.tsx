import Link from "next/link";
import { locations, mainNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "@/components/ui/primitives";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-950 pt-20 pb-10">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="logo-mask block h-8 w-[140px] text-paper" aria-label={site.name} role="img" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">{site.tagline}.</p>
            <div className="mt-8 grid gap-1 text-sm">
              <a href={`mailto:${site.email}`} className="w-fit text-paper hover:text-lime">
                {site.email}
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="w-fit text-paper hover:text-lime">
                {site.phone}
              </a>
            </div>
          </div>

          <FooterColumn title="Services" className="md:col-span-3">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.shortTitle}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="md:col-span-2">
            {mainNav
              .filter((item) => item.href !== "/services")
              .map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Locations" className="md:col-span-3">
            {locations.map((l) => (
              <li key={l.city} className="text-sm">
                <span className="text-paper">{l.city}</span>
                <span className="text-mist"> · {l.country}</span>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Decorative oversized logo (a graphic, not text, so it isn't read or contrast-checked) */}
        <div aria-hidden="true" className="logo-mask pointer-events-none mt-20 aspect-[130/30] w-full text-white/[0.05]" />

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-mist sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">Chișinău · Bucharest · Riyadh</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="eyebrow text-mist">{title}</p>
      <ul className="mt-5 grid gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-paper/85 transition-colors hover:text-lime">
        {children}
      </Link>
    </li>
  );
}
