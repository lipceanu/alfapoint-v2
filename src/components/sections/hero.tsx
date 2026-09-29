import { site } from "@/content/site";
import { Accent, ButtonLink, Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { ClientLogos } from "./client-logos";

const TEAM_ROLES = [
  { role: "Tech lead", stack: "Node · AWS", status: "Matched" },
  { role: "Senior front-end", stack: "React · Next.js", status: "Matched" },
  { role: "AI engineer", stack: "Python · RAG", status: "Interviewing" },
  { role: "QA automation", stack: "Playwright", status: "Matched" },
] as const;

export function Hero() {
  return (
    // Fills exactly one screen so the client logos always sit on the first screen
    <section className="grain relative flex min-h-svh flex-col overflow-hidden pt-24 pb-8 sm:pt-32 sm:pb-10 short:pt-20 short:pb-4">
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute top-20 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" aria-hidden="true" />

      <Container className="relative flex flex-1 items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow flex animate-rise items-center gap-3 text-mist short:hidden">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-lime" />
              Nearshore engineering · Europe &amp; GCC
            </p>
            <h1
              className="mt-5 animate-rise text-[clamp(2.25rem,4.2vw+1rem,4.75rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:mt-7 short:mt-0 short:text-[2.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              Senior engineers for products that <Accent>need to ship.</Accent>
            </h1>
            <p
              className="mt-5 max-w-xl animate-rise text-lg leading-relaxed text-mist sm:mt-7 sm:text-xl short:hidden"
              style={{ animationDelay: "160ms" }}
            >
              <span className="sm:hidden">Your one-stop software partner, from idea to scale.</span>
              <span className="hidden sm:inline">
                Your one-stop software partner. From discovery and design to engineering, AI, cloud and dedicated
                teams, Alfapoint takes products from idea to scale, at a cost that makes sense.
              </span>
            </p>
            <div className="mt-7 flex animate-rise flex-wrap gap-3 sm:mt-10 short:mt-5" style={{ animationDelay: "240ms" }}>
              <ButtonLink href={site.calendlyUrl} booking>
                Book a call
              </ButtonLink>
              <ButtonLink href="/services" variant="ghost" className="max-sm:hidden short:hidden">
                Explore services
              </ButtonLink>
            </div>
          </div>

          <div className="max-lg:hidden">
            <TeamPanel />
          </div>
        </div>
      </Container>

      <Container className="relative">
        <ClientLogos
          className="mt-10 animate-rise border-t border-white/10 pt-6 short:mt-4 short:pt-3"
          style={{ animationDelay: "320ms" }}
        />
      </Container>
    </section>
  );
}

function TeamPanel() {
  return (
    <div
      className="relative animate-rise rounded-3xl border border-white/10 bg-ink-800/70 p-6 shadow-2xl shadow-black/40 backdrop-blur"
      style={{ animationDelay: "400ms" }}
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
