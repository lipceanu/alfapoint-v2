export const FOUNDED_YEAR = 2016;

export const site = {
  name: "Alfapoint",
  url: "https://www.alfa-point.com",
  tagline: "Software engineering partner for ambitious product teams",
  description:
    "Alfapoint is a nearshore software engineering company with teams in Moldova, Romania and Saudi Arabia. We build AI-enabled products, modernise platforms and extend engineering teams for startups and scale-ups worldwide.",
  email: "info@alfa-point.com",
  careersEmail: "office@alfa-point.com",
  phone: "+41 22 568 01 59",
  calendlyUrl: "https://calendly.com/d-lipceanu/30min",
} as const;

export type Location = {
  country: string;
  city: string;
  role: string;
};

export const locations: readonly Location[] = [
  { country: "Republic of Moldova", city: "Chișinău", role: "Engineering hub" },
  { country: "Romania", city: "Bucharest", role: "EU delivery" },
  { country: "Saudi Arabia", city: "Riyadh", role: "GCC clients" },
];

export function yearsOnMarket(now: Date = new Date()): number {
  return now.getFullYear() - FOUNDED_YEAR;
}

export type Stat = { value: string; label: string };

export function companyStats(now: Date = new Date()): readonly Stat[] {
  return [
    { value: "50+", label: "engineers & designers" },
    { value: `${yearsOnMarket(now)}`, label: "years shipping software" },
    { value: "90%", label: "clients return after the first project" },
    { value: "10", label: "working days to onboard a mid–senior engineer" },
  ];
}

export type Leader = {
  name: string;
  role: string;
  photo: string;
  linkedin: string;
};

export const leadership: readonly Leader[] = [
  {
    name: "Dumitru Lipceanu",
    role: "Chief Executive Officer",
    photo: "/team/dima.jpg",
    linkedin: "https://www.linkedin.com/in/dumitru-lipceanu-9706b693/",
  },
  {
    name: "Vladislav Matvei",
    role: "Chief Technology Officer",
    photo: "/team/vladislav-matvei.jpg",
    linkedin: "https://www.linkedin.com/in/vlad-matvei-2b782997/",
  },
  {
    name: "Alisa Rudenko",
    role: "Chief Operating Officer",
    photo: "/team/alisa.jpg",
    linkedin: "https://www.linkedin.com/in/alisa-rudenko-9a8b08244/",
  },
];

export type NavItem = { label: string; href: string };

export const mainNav: readonly NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "How we work", href: "/#engagement" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export type ClientLogo = {
  name: string;
  logo: string;
  /** Intrinsic size of the SVG (its viewBox) */
  width: number;
  height: number;
  /** Rendered height, tuned so wide and tall marks carry similar visual weight */
  sizeClass: string;
};

/** Organisations Alfapoint has worked with (carried over from the previous site). */
export const clients: readonly ClientLogo[] = [
  { name: "European Parliament", logo: "/clients/eu.svg", width: 236, height: 50, sizeClass: "h-5 sm:h-7" },
  { name: "Shell", logo: "/clients/shell.svg", width: 71, height: 80, sizeClass: "h-7 sm:h-10" },
  { name: "BP", logo: "/clients/bp.svg", width: 60, height: 80, sizeClass: "h-7 sm:h-10" },
  { name: "ABB", logo: "/clients/abb.svg", width: 131, height: 50, sizeClass: "h-5 sm:h-7" },
  { name: "KSB", logo: "/clients/ksb.svg", width: 114, height: 50, sizeClass: "h-5 sm:h-7" },
];
