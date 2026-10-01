import Link from "next/link";
import { services } from "@/content/services";
import { Icon } from "@/components/ui/icon";
import { Accent, Container, SectionHeader, revealDelay } from "@/components/ui/primitives";

export function ServicesGrid({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="services" className="bg-paper py-24 text-ink-900 sm:py-32">
      <Container>
        {showHeader && (
          <SectionHeader
            tone="light"
            index="01"
            eyebrow="Services"
            title={
              <>
                Everything you need to take a product from <Accent>idea</Accent> to scale.
              </>
            }
            lead="Seven practices, one accountable partner. Start with the one you need today and add the rest as you grow."
          />
        )}
        <ul className={`grid gap-px overflow-hidden rounded-3xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3 ${showHeader ? "mt-16" : ""}`}>
          {services.map((service, i) => (
            <li
              key={service.slug}
              className={i === 0 ? "lg:col-span-2" : ""}
              data-reveal
              style={revealDelay((i % 3) * 80)}
            >
              <Link
                href={`/services/${service.slug}`}
                data-spotlight
                className="focus-inset group relative flex h-full min-h-[280px] flex-col bg-paper p-8 transition-colors duration-500 hover:bg-ink-900 hover:text-paper"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand transition-colors duration-500 group-hover:bg-lime group-hover:text-ink-950">
                    <Icon name={service.icon} />
                  </span>
                  <span className="font-mono text-xs text-slate group-hover:text-mist">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-auto pt-10 text-2xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-slate transition-colors duration-500 group-hover:text-mist">
                  {service.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:text-lime">
                  Learn more
                  <Icon name="arrow" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
          <li className="bg-brand p-8 text-white" data-reveal>
            <div className="flex h-full min-h-[280px] flex-col justify-between gap-6">
              <p className="max-w-md text-2xl leading-snug font-semibold tracking-tight">
                Not sure where to start? A short discovery call will <Accent>point you</Accent> the right way.
              </p>
              <Link
                href="/contact"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-white"
              >
                Talk to us <Icon name="arrow" size={18} />
              </Link>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  );
}
