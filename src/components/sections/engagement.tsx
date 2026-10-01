import type React from "react";
import { engagementModels, principles, processSteps } from "@/content/company";
import { Accent, Container, SectionHeader, revealDelay } from "@/components/ui/primitives";

export function EngagementModels() {
  return (
    <section id="engagement" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeader
          index="02"
          eyebrow="Engagement models"
          title={
            <>
              Work with us the way that <Accent>fits</Accent> your stage.
            </>
          }
          lead="From a fixed-price discovery sprint to a long-term dedicated team, every model comes with senior oversight and full transparency."
        />
        <ol className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {engagementModels.map((model, i) => (
            <li
              key={model.name}
              data-spotlight
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-ink-800/50 p-7 transition-colors duration-500 hover:border-lime/50"
              data-reveal
              style={revealDelay(i * 90)}
            >
              <span className="font-mono text-xs text-lime">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{model.name}</h3>
              <p className="eyebrow mt-2 text-mist">{model.bestFor}</p>
              <p className="mt-5 flex-1 leading-relaxed text-mist">{model.description}</p>
              <p className="mt-8 border-t border-white/10 pt-4 font-mono text-xs text-paper/70">{model.billing}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function Principles() {
  return (
    <section className="border-t border-white/10 bg-ink-950 py-24 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeader
          index="03"
          eyebrow="How we work"
          title={
            <>
              Built on trust, <Accent>proven</Accent> by retention.
            </>
          }
          lead="90% of our clients come back after their first project. These are the principles behind that number."
          className="lg:sticky lg:top-32 lg:self-start"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <article
              key={p.title}
              className="rounded-3xl border border-white/10 p-7"
              data-reveal
              style={revealDelay((i % 2) * 90)}
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-mist">{p.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProcessTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const light = tone === "light";
  return (
    <section className={`${light ? "bg-paper text-ink-900" : ""} timeline-scope relative overflow-clip py-24 sm:py-32`}>
      <div className={`${light ? "bg-blueprint-light" : "bg-blueprint"} absolute inset-0`} aria-hidden="true" />
      <Container className="relative">
        <SectionHeader
          tone={tone === "light" ? "light" : "dark"}
          eyebrow="Getting started"
          title={
            <>
              From first call to first commit in <Accent>days.</Accent>
            </>
          }
        />
        {/* As the list scrolls through the screen, connectors fill and numbers light up, step by step */}
        <ol className="timeline mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="relative"
              data-reveal
              style={{ ...revealDelay(i * 90), "--i": i } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`timeline-dot grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-sm ${
                    light ? "bg-ink-900 text-lime" : "bg-lime text-ink-950"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`relative hidden h-px flex-1 md:block ${light ? "bg-ink-900/15" : "bg-white/15"}`}>
                  <span className="timeline-fill absolute inset-0 hidden origin-left bg-brand" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${light ? "text-slate" : "text-mist"}`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
