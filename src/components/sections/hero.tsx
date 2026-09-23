import { site } from "@/content/site";
import { Accent, ButtonLink, Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

const TEAM_ROLES = [
  { role: "Tech lead", stack: "Node · AWS", status: "Matched" },
  { role: "Senior front-end", stack: "React · Next.js", status: "Matched" },
  { role: "AI engineer", stack: "Python · RAG", status: "Interviewing" },
  { role: "QA automation", stack: "Playwright", status: "Matched" },
] as const;

export function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute top-20 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" aria-hidden="true" />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="eyebrow flex animate-rise items-center gap-3 text-mist">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" />
              Nearshore engineering · Europe &amp; GCC
            </p>
            <h1
              className="mt-7 animate-rise text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance"
              style={{ animationDelay: "80ms" }}
            >
              Senior engineers for products that <Accent>need to ship.</Accent>
            </h1>
            <p
              className="mt-7 max-w-xl animate-rise text-lg leading-relaxed text-mist sm:text-xl"
              style={{ animationDelay: "160ms" }}
            >
              Startups and fast-growing companies rely on Alfapoint to build AI-enabled products, modernise their
              platforms and add vetted engineers to their teams, at a cost that makes sense.
            </p>
            <div className="mt-10 flex animate-rise flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <ButtonLink href={site.calendlyUrl}>Book a call</ButtonLink>
              <ButtonLink href="/services" variant="ghost">
                Explore services
              </ButtonLink>
            </div>
          </div>

          <TeamPanel />
        </div>
      </Container>
    </section>
  );
}

function TeamPanel() {
  return (
    <div
      className="relative animate-rise rounded-3xl border border-white/10 bg-ink-800/70 p-6 shadow-2xl shadow-black/40 backdrop-blur"
      style={{ animationDelay: "320ms" }}
      aria-label="Example: assembling a dedicated team"
      role="figure"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <p className="eyebrow text-mist">team.assemble()</p>
        <span className="rounded-full bg-lime/10 px-3 py-1 font-mono text-[11px] text-lime">day 7 of 10</span>
      </div>
      <ul className="mt-2 divide-y divide-white/5">
        {TEAM_ROLES.map((member, i) => (
          <li
            key={member.role}
            className="flex animate-rise items-center justify-between gap-4 py-4"
            style={{ animationDelay: `${480 + i * 120}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 font-mono text-xs text-mist">
                0{i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{member.role}</p>
                <p className="font-mono text-xs text-mist">{member.stack}</p>
              </div>
            </div>
            <span
              className={`flex items-center gap-1.5 text-xs ${
                member.status === "Matched" ? "text-lime" : "text-mist"
              }`}
            >
              {member.status === "Matched" && <Icon name="check" size={14} strokeWidth={2.2} />}
              {member.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-brand to-lime" />
      </div>
      <p className="mt-4 text-xs text-mist">
        Mid–senior engineers onboarded in up to 10 working days.
      </p>
    </div>
  );
}
