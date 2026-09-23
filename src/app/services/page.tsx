import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { EngagementModels, ProcessTimeline } from "@/components/sections/engagement";
import { CtaBand } from "@/components/sections/cta-band";
import { Accent } from "@/components/ui/primitives";

export const metadata: Metadata = pageMetadata({ path: "/services", title: "Services", description: "Product discovery, custom software development, AI solutions, cloud and modernisation, dedicated teams, UI/UX design and Saudi Arabia & GCC delivery." });

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            One partner from <Accent>first sketch</Accent> to scale.
          </>
        }
        lead="Whether you need to validate an idea, ship a platform, add AI to your product or grow your engineering team, we bring senior people and a proven delivery process."
      />
      <ServicesGrid showHeader={false} />
      <EngagementModels />
      <ProcessTimeline />
      <CtaBand />
    </>
  );
}
