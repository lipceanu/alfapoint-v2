import Image from "next/image";
import { companyStats } from "@/content/site";
import { techMarquee } from "@/content/company";
import { Container, revealDelay } from "@/components/ui/primitives";

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
                {stat.value}
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

function TechMarquee() {
  const items = [...techMarquee, ...techMarquee];
  return (
    <div
      className="relative overflow-hidden border-t border-white/10 py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      aria-label="Technologies we work with"
      role="region"
    >
      <ul className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
        {items.map((tech, i) => (
          <li key={`${tech.name}-${i}`} className="flex items-center gap-3 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" aria-hidden={i >= techMarquee.length}>
            <Image src={tech.logo} alt="" width={28} height={28} loading="eager" unoptimized className="h-7 w-7 object-contain" />
            <span className="font-mono text-sm text-mist">{tech.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
