import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob, jobs } from "@/content/jobs";
import { site } from "@/content/site";
import { pageMetadata } from "@/content/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink, Container } from "@/components/ui/primitives";

export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return {};
  return pageMetadata({
    path: `/careers/${job.slug}`,
    title: job.title,
    description: `${job.seniority} ${job.title} at Alfapoint · ${job.location}. ${job.technologies.join(", ")}.`,
  });
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const applyHref = `mailto:${site.careersEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;

  return (
    <>
      <PageHero eyebrow={`${job.seniority} · ${job.location}`} title={job.title}>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={applyHref}>Apply now</ButtonLink>
          <ul className="flex flex-wrap gap-2">
            {job.technologies.map((t) => (
              <li key={t} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </PageHero>

      <section className="bg-paper py-20 text-ink-900 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-2">
          <JobList title="What you bring" items={job.requirements} />
          <JobList title="What you'll do" items={job.responsibilities} />
        </Container>
        <Container className="mt-16">
          <div className="rounded-3xl bg-ink-900 p-8 text-paper sm:p-12">
            <p className="max-w-3xl text-xl leading-relaxed">{job.closing}</p>
            <p className="mt-6 text-mist">
              Send your CV to{" "}
              <a href={applyHref} className="text-lime underline underline-offset-4">
                {site.careersEmail}
              </a>{" "}
              or reach out through any channel that suits you.
            </p>
          </div>
          <Link href="/careers#open-roles" className="mt-10 inline-block text-sm font-semibold text-brand-600 hover:underline">
            ← All open roles
          </Link>
        </Container>
      </section>
    </>
  );
}

function JobList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-slate">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
