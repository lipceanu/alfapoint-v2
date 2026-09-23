# Content to verify before launch

New copy was written from the research in [`positioning-research.md`](./positioning-research.md).
The items below are claims or placeholders that someone at Alfapoint must confirm, adjust or remove before the site goes live.

## Claims to confirm
- [ ] **"AI-augmented delivery"** principle (`src/content/company.ts`). Keep it only if engineers really use AI coding and testing tools under review.
- [ ] **Saudi Arabia & GCC service** (`services.ts` → `saudi-arabia-gcc`). Confirm the Riyadh presence is active, and that the team can actually deliver the Nafath, ZATCA and Mada integrations, the PDPL-aware architecture and in-region hosting. Remove anything you can't back up.
- [ ] **Arabic/RTL localisation** capability under UI/UX.
- [ ] **AI & Agentic Solutions**: confirm the team has shipped LLM/RAG or agent work. The tool list (LangGraph, pgvector, dbt, Snowflake…) is a suggestion; trim it to what the team actually uses.
- [ ] **Cloud & Modernisation**: Terraform, Azure, FinOps. Confirm or remove.
- [ ] **Discovery & MVP**: the fixed-price discovery and fixed-price MVP offer. Is this a real commercial model?
- [ ] **Stats** (`site.ts`): "50+ engineers", "90% return after first project", "10 working days". These were carried over from v2; check they're still accurate. "Years" is calculated from 2016.
- [ ] **Location roles** ("Engineering hub", "EU delivery", "GCC clients"). These labels are guesses.
- [ ] **Careers perks** (`src/app/careers/page.tsx`).
- [ ] **Open roles**: are the PHP and .NET vacancies still open?

## Contact details
- [ ] v2 used both `info@alfa-point.com` (general) and `office@alfa-point.com` (careers). Kept as-is; confirm both inboxes are monitored.
- [ ] The phone number is a Swiss number (+41). Confirm it's still correct.
- [ ] The Calendly link `calendly.com/d-lipceanu/30min` is personal. Consider a shared team link.

## Recommended additions (not built; they need real material)
Competitors in the region lean heavily on proof. In priority order:
1. **Case studies with metrics** (industry → problem → stack → result). This is the biggest gap.
2. **Client logos and named testimonials** (with permission).
3. **Clutch profile/rating** widget.
4. **Certifications and partner badges**: ISO 27001 is close to standard among Romanian peers, and so is an AWS or Google partner tier. Only show what you hold.
5. A **security & data protection** page (GDPR, NDA, PDPL for KSA).
6. **Arabic version** of the site if Saudi Arabia is a priority market.
7. A contact **form**. The current version uses email and Calendly only, to avoid shipping an unprotected endpoint. A form needs validation, spam protection and a mail provider.

Do not add testimonials, logos or certifications that aren't real.
