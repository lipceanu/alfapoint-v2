import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedServices, getService, services } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/content/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { Icon } from "@/components/ui/icon";
import { ButtonLink, Container, SectionHeader, revealDelay } from "@/components/ui/primitives";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ path: `/services/${service.slug}`, title: service.title, description: service.summary });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero eyebrow={service.title} title={service.headline} lead={service.intro}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.calendlyUrl}>Book a call</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Get in touch
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-paper py-24 text-ink-900 sm:py-28">
        <Container>
          <SectionHeader tone="light" index="01" eyebrow="What we do" title="Capabilities" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((cap, i) => (
              <li
                key={cap.title}
                className={`bg-paper p-8 ${i === service.capabilities.length - 1 ? lastCellSpan(service.capabilities.length) : ""}`}
                data-reveal
                style={revealDelay((i % 3) * 80)}
              >
                <span className="font-mono text-xs text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{cap.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{cap.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow text-mist">What you get</p>
            <ul className="mt-6 grid gap-4">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-4 border-b border-white/10 pb-4 text-lg">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-ink-950">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={revealDelay(100)}>
            <p className="eyebrow text-mist">Ideal for</p>
            <ul className="mt-6 grid gap-4">
              {service.idealFor.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-ink-800/50 p-5 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-12 text-mist">
              {service.slug === "dedicated-teams" ? "Roles we provide" : "Tools & technologies"}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-paper/85">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 text-ink-900 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <SectionHeader tone="light" index="02" eyebrow="FAQ" title="Questions, answered." />
          <FaqList faqs={service.faqs} />
        </Container>
      </section>

      <RelatedServices slug={service.slug} />
      <CtaBand />
    </>
  );
}

/** Stretch the final card across empty columns in the 2-col (sm) and 3-col (lg) grids. */
function lastCellSpan(count: number): string {
  const sm = count % 2 === 1 ? "sm:col-span-2" : "";
  const lg = ["lg:col-span-1", "lg:col-span-3", "lg:col-span-2"][count % 3];
  return `${sm} ${lg}`;
}

function RelatedServices({ slug }: { slug: string }) {
  const related = getRelatedServices(slug);
  return (
    <section className="pt-24 sm:pt-28">
      <Container>
        <p className="eyebrow text-mist">Related services</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {related.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 p-7 transition-colors hover:border-lime/50"
              >
                <span className="text-lime">
                  <Icon name={s.icon} />
                </span>
                <span className="mt-6 text-xl font-semibold">{s.title}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-mist">{s.summary}</span>
                <Icon name="arrow" size={18} className="mt-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
