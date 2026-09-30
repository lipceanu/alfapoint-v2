import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import { locations, phoneHref, site } from "@/content/site";
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
            {CHANNELS.slice(0, 2).map((c, i) => (
              <ChannelCard key={c.label} channel={c} delay={i * 80} />
            ))}
            <PhoneCard delay={2 * 80} />
            {CHANNELS.slice(2).map((c, i) => (
              <ChannelCard key={c.label} channel={c} delay={(i + 3) * 80} />
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

type Channel = (typeof CHANNELS)[number];

function ChannelCard({ channel: c, delay }: { channel: Channel; delay: number }) {
  return (
    <li data-reveal style={revealDelay(delay)}>
      <a
        href={c.href}
        {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(c.booking ? { [BOOKING_ATTR]: "", "aria-haspopup": "dialog" as const } : {})}
        className={`group flex h-full items-end justify-between gap-6 rounded-3xl p-8 transition-colors ${
          c.primary ? "bg-lime text-ink-950 hover:bg-white" : "border border-white/10 hover:border-lime/50"
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
  );
}

/** Two numbers can't share one link, so each gets its own tap-to-call row. */
function PhoneCard({ delay }: { delay: number }) {
  return (
    <li data-reveal style={revealDelay(delay)} className="flex h-full flex-col rounded-3xl border border-white/10 p-6 sm:p-8">
      <span className="eyebrow block text-mist">Phone</span>
      <span className="mt-auto grid gap-3 pt-8">
        {site.phones.map((phone) => (
          <a
            key={phone}
            href={phoneHref(phone)}
            className="group flex items-center justify-between gap-3 text-xl font-semibold tracking-tight transition-colors hover:text-lime xs:text-2xl sm:gap-6 sm:text-3xl"
          >
            {/* Narrow phones may wrap between digit groups; wider screens keep one line */}
            <span>{phone}</span>
            <Icon name="arrow" size={24} className="shrink-0 transition-transform group-hover:translate-x-1 sm:size-7" />
          </a>
        ))}
      </span>
    </li>
  );
}
