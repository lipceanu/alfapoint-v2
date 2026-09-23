import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import { locations, site } from "@/content/site";
import { BOOKING_ATTR } from "@/content/booking";
import { PageHero } from "@/components/sections/page-hero";
import { Icon } from "@/components/ui/icon";
import { Accent, Container, revealDelay } from "@/components/ui/primitives";

export const metadata: Metadata = pageMetadata({ path: "/contact", title: "Contact", description: "Book a call with Alfapoint or write to us. We reply within one business day." });

const CHANNELS = [
  {
    label: "Book a 30-minute call",
    value: "Pick a time that suits you",
    href: site.calendlyUrl,
    primary: true,
    booking: true,
  },
  { label: "Email", value: site.email, href: `mailto:${site.email}`, primary: false, booking: false },
  { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, primary: false, booking: false },
  { label: "Careers", value: site.careersEmail, href: `mailto:${site.careersEmail}`, primary: false, booking: false },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk about what you&apos;re <Accent>building.</Accent>
          </>
        }
        lead="Tell us about your product, your team or your idea. You'll speak directly with our leadership, not a sales script."
      />
      <section className="pb-24 sm:pb-32">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {CHANNELS.map((c, i) => (
              <li key={c.label} data-reveal style={revealDelay(i * 80)}>
                <a
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(c.booking ? { [BOOKING_ATTR]: "", "aria-haspopup": "dialog" as const } : {})}
                  className={`group flex h-full items-end justify-between gap-6 rounded-3xl p-8 transition-colors ${
                    c.primary
                      ? "bg-lime text-ink-950 hover:bg-white"
                      : "border border-white/10 hover:border-lime/50"
                  }`}
                >
                  <span>
                    <span className={`eyebrow block ${c.primary ? "text-ink-950/70" : "text-mist"}`}>{c.label}</span>
                    <span className="mt-8 block text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-3xl">
                      {c.value}
                    </span>
                  </span>
                  <Icon
                    name={c.href.startsWith("http") && !c.booking ? "arrowUpRight" : "arrow"}
                    size={28}
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
            {locations.map((l) => (
              <li key={l.city}>
                <p className="eyebrow text-lime">{l.role}</p>
                <p className="mt-3 text-xl font-semibold">{l.city}</p>
                <p className="text-mist">{l.country}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
