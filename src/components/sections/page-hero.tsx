import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="grain relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-24">
      <div
        className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_30%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="absolute -top-20 right-0 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" aria-hidden="true" />
      <Container className="relative">
        <div className="animate-rise">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        {/* No entrance animation: the headline is the page's largest paint */}
        <h1
          className="mt-6 max-w-4xl text-[clamp(2.125rem,6vw,4.75rem)] leading-[1] font-semibold tracking-[-0.03em] text-balance hyphens-auto sm:hyphens-manual"
        >
          {title}
        </h1>
        {lead && (
          <p
            className="mt-7 max-w-2xl animate-rise text-lg leading-relaxed text-mist sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            {lead}
          </p>
        )}
        {children && (
          <div className="mt-10 animate-rise" style={{ animationDelay: "240ms" }}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
