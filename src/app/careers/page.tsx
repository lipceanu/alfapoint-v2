import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import Link from "next/link";
import { jobs } from "@/content/jobs";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/page-hero";
import { Icon } from "@/components/ui/icon";
import { Accent, ButtonLink, Container, SectionHeader, revealDelay } from "@/components/ui/primitives";

export const metadata: Metadata = pageMetadata({ path: "/careers", title: "Careers", description: "Join Alfapoint and work on modern products with international clients. See open engineering roles." });

const PERKS = [
  { title: "Remote-friendly", body: "Work from our hubs or remotely across the EU." },
  { title: "International products", body: "Build for clients in Europe, the Middle East and beyond." },
  { title: "Senior peers", body: "Learn alongside experienced engineers, architects and designers." },
  { title: "Room to grow", body: "Modern stacks, AI tooling and a clear path to lead." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build things you&apos;re <Accent>proud</Accent> of.
          </>
        }
        lead="We look for curious, thoughtful problem-solvers. If you care about craft and like working with people who do too, you'll fit right in."
      >
        <ButtonLink href="#open-roles">See open roles</ButtonLink>
      </PageHero>

      <section className="border-y border-white/10 bg-ink-950 py-16">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((perk, i) => (
              <li key={perk.title} data-reveal style={revealDelay(i * 80)}>
                <p className="text-lg font-semibold">{perk.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{perk.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="open-roles" className="scroll-mt-20 bg-paper py-24 text-ink-900 sm:py-28">
        <Container>
          <SectionHeader tone="light" eyebrow={`${jobs.length} open roles`} title="Open positions" />
          <ul className="mt-12 border-t border-ink-900/15">
            {jobs.map((job) => (
              <li key={job.slug} data-reveal>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group grid gap-3 border-b border-ink-900/15 py-8 transition-colors md:grid-cols-[2fr_1fr_2fr_auto] md:items-center"
                >
                  <span className="text-2xl font-semibold tracking-tight group-hover:text-brand">{job.title}</span>
                  <span className="text-slate">{job.location}</span>
                  <span className="flex flex-wrap gap-2">
                    {job.technologies.map((t) => (
                      <span key={t} className="rounded-full border border-ink-900/15 px-3 py-1 font-mono text-xs">
                        {t}
                      </span>
                    ))}
                  </span>
                  <Icon name="arrow" className="transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-slate">
            Don&apos;t see your role? Send your CV to{" "}
            <a href={`mailto:${site.careersEmail}`} className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              {site.careersEmail}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
