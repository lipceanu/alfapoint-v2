import Image from "next/image";
import { leadership, locations } from "@/content/site";
import { Accent, Container, SectionHeader, revealDelay } from "@/components/ui/primitives";

export function Leadership({ index = "04" }: { index?: string }) {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            index={index}
            eyebrow="Leadership"
            title={
              <>
                People you&apos;ll <Accent>actually</Accent> talk to.
              </>
            }
            lead="Our founders stay close to every engagement. We hire curious, thoughtful problem-solvers and build teams that take pride in their work."
          />
        </div>
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person, i) => (
            <li key={person.name} data-reveal style={revealDelay(i * 100)}>
              <figure className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-800">
                  <Image
                    src={person.photo}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/80 to-transparent" />
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                    className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-lime hover:text-ink-950"
                  >
                    <span className="text-sm font-bold">in</span>
                  </a>
                </div>
                <figcaption className="mt-5">
                  <p className="text-xl font-semibold">{person.name}</p>
                  <p className="text-sm text-mist">{person.role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function Locations() {
  return (
    <section className="border-t border-white/10 py-20">
      <Container>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {locations.map((loc, i) => (
            <li key={loc.city} className="bg-ink-900 p-8" data-reveal style={revealDelay(i * 90)}>
              <p className="eyebrow text-lime">{loc.role}</p>
              <p className="mt-6 text-3xl font-semibold tracking-tight">{loc.city}</p>
              <p className="mt-1 text-mist">{loc.country}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
