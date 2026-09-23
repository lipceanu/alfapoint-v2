export type IconName =
  | "compass"
  | "code"
  | "spark"
  | "cloud"
  | "team"
  | "pen"
  | "globe";

export type Capability = { title: string; body: string };
export type Faq = { question: string; answer: string };

export type Service = {
  slug: string;
  title: string;
  /** Short label for nav, footer and chips */
  shortTitle: string;
  icon: IconName;
  /** One line used on cards */
  summary: string;
  headline: string;
  intro: string;
  capabilities: readonly Capability[];
  outcomes: readonly string[];
  stack: readonly string[];
  idealFor: readonly string[];
  faqs: readonly Faq[];
};

export const services: readonly Service[] = [
  {
    slug: "product-discovery-mvp",
    title: "Product Discovery & MVP",
    shortTitle: "Discovery & MVP",
    icon: "compass",
    summary:
      "Validate the idea, de-risk the scope and ship a working first version in weeks, not quarters.",
    headline: "From idea to a product users can touch, fast",
    intro:
      "Most failed products were built right but built the wrong thing. Our discovery sprint pairs a business analyst, a product designer and a solution architect with your team to turn assumptions into a validated scope, a clickable prototype and a fixed, honest estimate. Then we build the MVP.",
    capabilities: [
      {
        title: "Discovery workshop",
        body: "Goals, users, constraints and success metrics captured in one to two weeks of structured sessions.",
      },
      {
        title: "Clickable prototype",
        body: "Key user journeys designed and tested with real users before a line of production code is written.",
      },
      {
        title: "Architecture & estimate",
        body: "A technical blueprint, a prioritised backlog and a transparent estimate you can take to your board or investors.",
      },
      {
        title: "MVP build",
        body: "A focused cross-functional team ships the first release in fixed-length iterations with a demo every sprint.",
      },
      {
        title: "Technical audit",
        body: "Already have a codebase? We review architecture, code quality, security and delivery practices and hand you a remediation plan.",
      },
    ],
    outcomes: [
      "Validated scope and roadmap",
      "Interactive prototype",
      "Solution architecture document",
      "Fixed-scope MVP proposal",
    ],
    stack: ["Figma", "Miro", "React", "Next.js", "Node.js", "Flutter"],
    idealFor: [
      "Founders preparing a first release or a funding round",
      "Enterprises testing a new digital product line",
      "Teams inheriting a codebase they need to assess",
    ],
    faqs: [
      {
        question: "How long does discovery take?",
        answer:
          "Typically two to four weeks, depending on the number of user groups and integrations. You receive the prototype, architecture and estimate at the end, and they are yours to keep whether or not we build the product.",
      },
      {
        question: "Can the MVP be fixed-price?",
        answer:
          "Yes. Once discovery has produced a clear scope, we can commit to a fixed price and timeline for the MVP. Anything outside that scope is agreed separately before work starts.",
      },
    ],
  },
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    shortTitle: "Software Development",
    icon: "code",
    summary:
      "Web, mobile and backend products engineered end-to-end by a team that understands your business.",
    headline: "Software built around your business, not the other way round",
    intro:
      "We are a full-stack engineering company. Every project is led by a senior delivery manager and built by a cross-functional team, so you get working software every sprint without coordinating developers yourself. We ask hard questions early and bring technical and business advice, not just code.",
    capabilities: [
      {
        title: "Web platforms",
        body: "Customer-facing apps, portals and SaaS products built with modern frameworks and scalable backends.",
      },
      {
        title: "Mobile apps",
        body: "Native iOS and Android or cross-platform with Flutter and React Native, from first release to app-store scale.",
      },
      {
        title: "APIs & integrations",
        body: "Robust APIs and integrations with payments, CRMs, ERPs and third-party services.",
      },
      {
        title: "Quality assurance",
        body: "Manual and automated testing built into every sprint so releases ship without surprises.",
      },
      {
        title: "Support & evolution",
        body: "Long-term maintenance, monitoring and feature development once your product is live.",
      },
    ],
    outcomes: [
      "Production-ready releases every sprint",
      "Automated test coverage",
      "Transparent reporting and demos",
      "Full ownership of code and IP",
    ],
    stack: [
      "React",
      "Next.js",
      "Vue",
      "Angular",
      "Node.js",
      "PHP / Laravel",
      "Java",
      "Go",
      "Python",
      ".NET",
      "Flutter",
      "React Native",
      "Swift",
      "Kotlin",
      "PostgreSQL",
      "MongoDB",
    ],
    idealFor: [
      "Startups building a product from scratch",
      "Scale-ups that need to deliver more than their in-house team can",
      "Companies replacing spreadsheets and off-the-shelf tools with software that fits",
    ],
    faqs: [
      {
        question: "How does the engagement process work?",
        answer:
          "We start with a call to understand your goals, then scope the work, agree the team and model, and begin delivery in sprints with regular demos and progress reports.",
      },
      {
        question: "What is the typical duration of a project?",
        answer:
          "It depends on complexity and scope. Smaller products can launch in a few months; larger platforms are delivered incrementally, with usable releases along the way.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. All source code, designs and documentation are transferred to you under the contract.",
      },
    ],
  },
  {
    slug: "ai-solutions",
    title: "AI & Agentic Solutions",
    shortTitle: "AI & Agents",
    icon: "spark",
    summary:
      "Put AI to work inside real products and workflows: assistants, agents, automation and data pipelines.",
    headline: "Useful AI, shipped into production",
    intro:
      "AI pilots are easy; AI in production is not. We help you pick the use cases that pay back, build them on solid data foundations and run them safely, with evaluation, guardrails and cost control built in from day one.",
    capabilities: [
      {
        title: "AI readiness assessment",
        body: "We map your processes and data, then rank AI opportunities by value, feasibility and risk.",
      },
      {
        title: "LLM features & RAG",
        body: "Assistants, search and summarisation grounded in your own documents and data, with the model chosen to fit cost and privacy needs.",
      },
      {
        title: "AI agents & automation",
        body: "Agents that take multi-step actions across your tools, with human approval where it matters.",
      },
      {
        title: "Data engineering",
        body: "Pipelines, warehouses and dashboards that turn raw data into decisions and feed your models reliably.",
      },
      {
        title: "Machine learning",
        body: "Forecasting, classification and recommendation models trained, deployed and monitored in production.",
      },
    ],
    outcomes: [
      "Prioritised AI use-case roadmap",
      "Production AI features with evaluation",
      "Automated reporting and insights",
      "Guardrails, monitoring and cost tracking",
    ],
    stack: [
      "Python",
      "OpenAI / Anthropic / open-weight models",
      "LangGraph",
      "pgvector",
      "Airflow",
      "dbt",
      "Snowflake",
      "BigQuery",
      "Power BI",
    ],
    idealFor: [
      "Product teams adding AI features to an existing app",
      "Operations teams automating repetitive back-office work",
      "Leaders who need a clear, costed AI plan",
    ],
    faqs: [
      {
        question: "Will our data be used to train public models?",
        answer:
          "No. We design solutions so your data stays within your chosen environment, and we select providers and hosting that meet your privacy and residency requirements.",
      },
      {
        question: "We don't have clean data yet. Can we still start?",
        answer:
          "Yes. Many projects begin with data engineering. The readiness assessment tells you which use cases work with the data you have today and what to fix first.",
      },
    ],
  },
  {
    slug: "cloud-devops-modernisation",
    title: "Cloud, DevOps & Modernisation",
    shortTitle: "Cloud & Modernisation",
    icon: "cloud",
    summary:
      "Scalable, secure, cost-efficient infrastructure, and a safe path off legacy systems.",
    headline: "Infrastructure that scales and costs less to run",
    intro:
      "We design cloud platforms, automate delivery pipelines and modernise legacy applications in stages, so the business keeps running while the technology moves forward. Security and cost visibility are built in, not bolted on.",
    capabilities: [
      {
        title: "Cloud architecture & migration",
        body: "Well-architected platforms on AWS, Google Cloud or Azure, with migrations planned to avoid downtime.",
      },
      {
        title: "DevOps & CI/CD",
        body: "Automated build, test and deployment pipelines, infrastructure as code and container orchestration.",
      },
      {
        title: "Legacy modernisation",
        body: "Monoliths decomposed and outdated stacks upgraded step by step, with no risky big-bang rewrites.",
      },
      {
        title: "Cloud cost optimisation",
        body: "FinOps reviews that right-size resources and cut waste, with dashboards so savings stick.",
      },
      {
        title: "DevSecOps & reliability",
        body: "Security scanning, observability, backups and incident runbooks for production confidence.",
      },
    ],
    outcomes: [
      "Faster, safer releases",
      "Lower and predictable cloud bills",
      "Modernised, maintainable codebase",
      "Monitoring and on-call readiness",
    ],
    stack: [
      "AWS",
      "Google Cloud",
      "Azure",
      "DigitalOcean",
      "Kubernetes",
      "Docker",
      "Terraform",
      "GitHub Actions",
      "GitLab CI",
      "Jenkins",
      "Prometheus",
      "Grafana",
    ],
    idealFor: [
      "Products outgrowing their first infrastructure",
      "Companies with a costly or fragile legacy system",
      "Teams that want to release more often with less risk",
    ],
    faqs: [
      {
        question: "Can you modernise without stopping development?",
        answer:
          "Yes. We use incremental patterns such as strangler-fig migration so new features keep shipping while legacy parts are replaced behind the scenes.",
      },
    ],
  },
  {
    slug: "dedicated-teams",
    title: "Dedicated Teams & Staff Augmentation",
    shortTitle: "Dedicated Teams",
    icon: "team",
    summary:
      "Vetted mid-to-senior engineers who join your team in days and work as your own.",
    headline: "Scale your engineering team in days, not months",
    intro:
      "Skip months of hiring. We present engineers matched to your stack and culture, and they integrate directly into your processes and tools. You keep full control of priorities and daily work; we handle recruitment, retention, HR and administration.",
    capabilities: [
      {
        title: "Team extension",
        body: "Add individual engineers to your existing team to close skill gaps or increase capacity.",
      },
      {
        title: "Dedicated squads",
        body: "A complete, self-managing team with a tech lead, engineers, QA and design as needed, focused only on your product.",
      },
      {
        title: "Rare specialists",
        body: "Hard-to-find profiles such as solution architects, ML engineers or platform engineers, sourced from our network.",
      },
      {
        title: "Flexible scaling",
        body: "Scale up or down with a few weeks' notice as your roadmap changes.",
      },
    ],
    outcomes: [
      "Mid–senior engineers in up to 10 working days",
      "Rare specialists in up to 20 working days",
      "Up to 25% lower hiring and retention costs",
      "English-speaking engineers (B1+) in EU-friendly time zones",
    ],
    stack: [
      "Web (front-end and back-end)",
      "Mobile",
      "QA (manual & automated)",
      "DevOps & Cloud",
      "Data & ML",
      "Tech leads & architects",
      "Product & project managers",
      "UI/UX designers",
    ],
    idealFor: [
      "Fast-growing startups that need to hire ahead of the roadmap",
      "Enterprises with a hiring freeze but a delivery deadline",
      "Teams that need a specific skill for a defined period",
    ],
    faqs: [
      {
        question: "How long does it take to get started?",
        answer:
          "We present a shortlist of matched engineers within days. Mid-to-senior developers typically start within 10 working days, and rare specialists within 20.",
      },
      {
        question: "Who manages the engineers day to day?",
        answer:
          "You do. Engineers integrate into your team and tools and follow your priorities, like your own employees. We handle HR, retention and administration in the background.",
      },
      {
        question: "How do you make sure an engineer is the right fit?",
        answer:
          "We start from your technical and cultural requirements, run technical interviews, and let you interview the shortlisted candidates before anyone starts.",
      },
      {
        question: "What language do the engineers speak?",
        answer:
          "All engineers work in English, with a minimum B1 level, so they integrate smoothly into international teams.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX & Product Design",
    shortTitle: "UI/UX Design",
    icon: "pen",
    summary:
      "Research-led product design and design systems that make complex software simple to use.",
    headline: "Products people understand the first time they use them",
    intro:
      "Our product designers work alongside engineers from day one, so what gets designed is what gets built. We combine user research, interaction design and scalable design systems to make your product intuitive, accessible and on-brand.",
    capabilities: [
      {
        title: "User research",
        body: "Interviews, usability tests and analytics reviews that ground decisions in real behaviour.",
      },
      {
        title: "UX & interaction design",
        body: "Flows, wireframes and interactive prototypes for web, mobile and desktop.",
      },
      {
        title: "UI & visual design",
        body: "Polished, accessible interfaces that express your brand.",
      },
      {
        title: "Design systems",
        body: "Reusable component libraries in Figma and code that keep products consistent as they grow.",
      },
      {
        title: "Arabic & RTL localisation",
        body: "Interfaces designed right-to-left from the start for Arabic-speaking markets.",
      },
    ],
    outcomes: [
      "Validated user journeys",
      "High-fidelity prototypes",
      "Production-ready design system",
      "Accessibility (WCAG) review",
    ],
    stack: ["Figma", "FigJam", "Maze", "Storybook", "Tailwind CSS"],
    idealFor: [
      "New products that need a strong first impression",
      "Mature products with growing UX debt",
      "Teams expanding into new languages and markets",
    ],
    faqs: [
      {
        question: "Can you work with our existing brand guidelines?",
        answer:
          "Yes. We extend your existing brand into a product design system, or help evolve it if the product needs it.",
      },
    ],
  },
  {
    slug: "saudi-arabia-gcc",
    title: "Saudi Arabia & GCC Delivery",
    shortTitle: "Saudi Arabia & GCC",
    icon: "globe",
    summary:
      "Arabic-first digital products built with Saudi data, security and platform requirements in mind.",
    headline: "Digital products built for the Saudi market",
    intro:
      "With a presence in Riyadh and engineering hubs in Europe, we help organisations deliver on Vision 2030 digital goals. Regulatory, localisation and integration requirements are part of the architecture from the first workshop, not an afterthought before launch.",
    capabilities: [
      {
        title: "PDPL-aware architecture",
        body: "Data flows, consent and retention designed with the Personal Data Protection Law in mind.",
      },
      {
        title: "In-region hosting",
        body: "Cloud deployments that keep data in-kingdom or in-region where your requirements demand it.",
      },
      {
        title: "Local platform integrations",
        body: "Integration with national identity, e-invoicing and payment services such as Nafath, ZATCA and Mada.",
      },
      {
        title: "Arabic-first experiences",
        body: "Bilingual Arabic and English products designed right-to-left from the start.",
      },
      {
        title: "Security controls",
        body: "Secure development practices aligned with national cybersecurity frameworks.",
      },
    ],
    outcomes: [
      "Compliance considered from day one",
      "Bilingual AR/EN product",
      "Local integrations delivered",
      "Nearshore cost efficiency",
    ],
    stack: ["AWS / in-region cloud", "Next.js", "Flutter", "Node.js", ".NET", "Odoo"],
    idealFor: [
      "Saudi companies launching or modernising digital services",
      "International businesses entering the GCC market",
      "Public-sector and regulated projects that need a delivery partner",
    ],
    faqs: [
      {
        question: "Do you have a local presence?",
        answer:
          "Yes. We have a presence in Riyadh, supported by our engineering teams in Moldova and Romania.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(slug: string, count = 3): readonly Service[] {
  const index = services.findIndex((service) => service.slug === slug);
  if (index === -1) return services.slice(0, count);
  return Array.from(
    { length: Math.min(count, services.length - 1) },
    (_, offset) => services[(index + offset + 1) % services.length],
  );
}
