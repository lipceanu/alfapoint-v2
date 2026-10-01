import Image from "next/image";
import { companyStats } from "@/content/site";
import { techMarquee } from "@/content/company";
import { Container, revealDelay } from "@/components/ui/primitives";
import { CountUp } from "@/components/motion/count-up";

export function StatsStrip() {
  const stats = companyStats();
  return (
    <section className="border-y border-white/10 bg-ink-950">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="border-white/10 py-10 pr-4 odd:border-r lg:border-r lg:pl-8 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0 even:pl-6"
              data-reveal
              style={revealDelay(i * 80)}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-5xl font-semibold tracking-tight sm:text-6xl">
                <CountUp value={stat.value} />
                <span className="text-lime">.</span>
              </dd>
              <dd className="mt-2 max-w-[14rem] text-sm text-mist">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <TechMarquee />
    </section>
  );
}

/** Static list (no motion): moving content that runs for more than 5 s fails WCAG 2.2.2 */
function TechMarquee() {
  return (
    <div className="border-t border-white/10 py-8" aria-label="Technologies we work with" role="region">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {techMarquee.map((tech) => (
            <li key={tech.name} className="group flex items-center gap-3">
              <Image
                src={tech.logo}
                alt=""
                width={28}
                height={28}
                unoptimized
                className="h-7 w-7 object-contain opacity-60 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
              />
              <span className="font-mono text-sm text-mist">{tech.name}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
