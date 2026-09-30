import { describe, expect, it } from "vitest";
import { getRelatedServices, getService, services } from "../services";
import { getJob, jobs } from "../jobs";
import { legacyRedirects, legacyRewrites } from "../routing";
import { companyStats, FOUNDED_YEAR, mainNav, phoneHref, site, yearsOnMarket } from "../site";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function staticRoutes(): Set<string> {
  return new Set([
    "/",
    "/services",
    "/about",
    "/careers",
    "/contact",
    ...services.map((s) => `/services/${s.slug}`),
    ...jobs.map((j) => `/careers/${j.slug}`),
  ]);
}

describe("services", () => {
  it("have unique, URL-safe slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(SLUG_PATTERN));
  });

  it("each have enough content to render a full page", () => {
    services.forEach((s) => {
      expect(s.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(s.outcomes.length).toBeGreaterThan(0);
      expect(s.faqs.length).toBeGreaterThan(0);
      expect(s.summary.length).toBeLessThan(140);
    });
  });

  it("getService finds by slug and returns undefined otherwise", () => {
    expect(getService("ai-solutions")?.title).toBe("AI & Agentic Solutions");
    expect(getService("hr-services")).toBeUndefined();
  });

  it("getRelatedServices excludes the current service and wraps around", () => {
    const last = services[services.length - 1];
    const related = getRelatedServices(last.slug, 3);
    expect(related).toHaveLength(3);
    expect(related.map((s) => s.slug)).not.toContain(last.slug);
    expect(related[0].slug).toBe(services[0].slug);
  });

  it("getRelatedServices falls back to the first services for unknown slugs", () => {
    expect(getRelatedServices("nope", 2).map((s) => s.slug)).toEqual(
      services.slice(0, 2).map((s) => s.slug),
    );
  });
});

describe("jobs", () => {
  it("have unique slugs and complete descriptions", () => {
    const slugs = jobs.map((j) => j.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    jobs.forEach((j) => {
      expect(j.slug).toMatch(SLUG_PATTERN);
      expect(j.requirements.length).toBeGreaterThan(0);
      expect(j.responsibilities.length).toBeGreaterThan(0);
    });
    expect(getJob(jobs[0].slug)).toBe(jobs[0]);
    expect(getJob("missing")).toBeUndefined();
  });

  it("closing paragraph matches the job's own stack (regression from v2)", () => {
    const dotnet = getJob("dotnet-engineer");
    expect(dotnet?.closing).toContain(".NET");
    expect(dotnet?.closing).not.toMatch(/laravel|php/i);
  });
});

describe("routing", () => {
  const routes = staticRoutes();

  it("legacy redirects and rewrites point at pages that exist", () => {
    [...legacyRedirects, ...legacyRewrites].forEach(({ destination }) =>
      expect(routes.has(destination)).toBe(true),
    );
  });

  it("never redirects /home, to avoid loops with the old cached / -> /home 308", () => {
    expect(legacyRedirects.map((r) => r.source)).not.toContain("/home");
    expect(legacyRewrites.map((r) => r.source)).toContain("/home");
  });

  it("main navigation targets exist", () => {
    mainNav.forEach(({ href }) => expect(routes.has(href.split("#")[0])).toBe(true));
  });
});

describe("site stats", () => {
  it("computes years on market from the founding year", () => {
    expect(yearsOnMarket(new Date("2026-06-01"))).toBe(2026 - FOUNDED_YEAR);
    expect(companyStats(new Date("2030-01-01"))[1].value).toBe(String(2030 - FOUNDED_YEAR));
  });
});

describe("phone numbers", () => {
  it("lists both Moldovan numbers in display format", () => {
    expect(site.phones).toEqual(["+373 (69) 719 888", "+373 (69) 905 471"]);
  });

  it("builds tap-to-call links with digits only", () => {
    expect(phoneHref("+373 (69) 719 888")).toBe("tel:+37369719888");
    expect(phoneHref("+373 (69) 905 471")).toBe("tel:+37369905471");
  });
});
