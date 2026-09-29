import type { Metadata } from "next";
import { pageMetadata } from "@/content/metadata";
import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { ServicesGrid } from "@/components/sections/services-grid";
import { EngagementModels, Principles, ProcessTimeline } from "@/components/sections/engagement";
import { Leadership, Locations } from "@/components/sections/leadership";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ServicesGrid />
      <EngagementModels />
      <Principles />
      <ProcessTimeline />
      <Leadership />
      <Locations />
      <CtaBand />
    </>
  );
}
