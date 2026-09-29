import { PageHero } from "@/components/sections/page-hero";
import { Accent, ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title={
        <>
          This page took a <Accent>different branch.</Accent>
        </>
      }
      lead="The page you're looking for doesn't exist or has moved."
    >
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/services" variant="ghost">
          Browse services
        </ButtonLink>
      </div>
    </PageHero>
  );
}
