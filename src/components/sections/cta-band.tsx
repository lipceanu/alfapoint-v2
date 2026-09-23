import { site } from "@/content/site";
import { Accent, ButtonLink, Container } from "@/components/ui/primitives";

type CtaBandProps = {
  title?: React.ReactNode;
  body?: string;
};

export function CtaBand({
  title = (
    <>
      Have a product to build or a team to <Accent>scale?</Accent>
    </>
  ),
  body = "Book a 30-minute call with our leadership. You'll get an honest view on scope, team and budget, even if we're not the right fit.",
}: CtaBandProps) {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div
          className="grain relative overflow-hidden rounded-[2rem] bg-brand px-6 py-16 sm:px-14 sm:py-20"
          data-reveal
        >
          <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-lime/30 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-white sm:text-6xl">
                {title}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white">{body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
              <ButtonLink href={site.calendlyUrl} booking>
                Book a call
              </ButtonLink>
              <ButtonLink href={`mailto:${site.email}`} variant="ghost" className="border-white/40">
                {site.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
