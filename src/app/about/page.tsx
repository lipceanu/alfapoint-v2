import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import { FOUNDED_YEAR, companyStats } from "@/content/site";
import { PageHero } from "@/components/sections/page-hero";
import { Principles } from "@/components/sections/engagement";
import { Leadership, Locations } from "@/components/sections/leadership";
import { CtaBand } from "@/components/sections/cta-band";
import { Accent, Container, revealDelay } from "@/components/ui/primitives";

export const metadata: Metadata = pageMetadata({ path: "/about", title: "About", description: `Since ${FOUNDED_YEAR}, Alfapoint has helped startups and enterprises turn ideas into scalable digital products, with engineering teams in Moldova, Romania and Saudi Arabia.` });

export default function AboutPage() {
  const stats = companyStats();
  return (
    <>
      <PageHero
        eyebrow="About Alfapoint"
        title={
          <>
            Engineering partners, <Accent>not</Accent> just vendors.
          </>
        }
        lead={`Since ${FOUNDED_YEAR} we have helped businesses turn ideas into next-generation digital products. We are custom-software advocates who support organisations of every size through digital and technical transformation.`}
      />

      <section className="bg-paper py-24 text-ink-900 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6 text-lg leading-relaxed text-slate" data-reveal>
            <p className="text-2xl leading-snug font-medium text-ink-900">
              We are an international software development company that works like an extension of your own team.
            </p>
            <p>
              We deliver intuitive, scalable and cost-effective software to startups and large companies alike. We
              ask essential questions, bring technical and business advice, and are not afraid to share an
              unexpected insight if it makes your product better.
            </p>
            <p>
              We build close relationships across our team, creating a genuine sense of care and teamwork between
              people of many backgrounds and nationalities. When we hire, we look for curious, intelligent
              problem-solvers who take pride in what they build.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-3xl border border-ink-900/10 bg-ink-900/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="bg-paper p-6" data-reveal style={revealDelay(i * 80)}>
                <dd className="text-4xl font-semibold tracking-tight">
                  {stat.value}
                  <span className="text-brand">.</span>
                </dd>
                <dt className="mt-2 text-sm text-slate">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Leadership index="01" />
      <Locations />
      <Principles />
      <CtaBand />
    </>
  );
}
