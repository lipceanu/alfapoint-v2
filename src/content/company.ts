export type EngagementModel = {
  name: string;
  bestFor: string;
  description: string;
  billing: string;
};

export const engagementModels: readonly EngagementModel[] = [
  {
    name: "Discovery sprint",
    bestFor: "New ideas & uncertain scope",
    description:
      "A short, fixed-price engagement that turns your idea into a prototype, architecture and reliable estimate.",
    billing: "Fixed price",
  },
  {
    name: "Project delivery",
    bestFor: "Defined scope & outcomes",
    description:
      "We own delivery end-to-end, from analysis and design to development, QA and launch, while optimising cost, time and scope.",
    billing: "Fixed scope or time & materials",
  },
  {
    name: "Dedicated team",
    bestFor: "Long-term product development",
    description:
      "A cross-functional team working only on your product, run by our delivery manager or integrated with your own.",
    billing: "Monthly per team",
  },
  {
    name: "Staff augmentation",
    bestFor: "Adding capacity or skills fast",
    description:
      "Individual engineers join your team, follow your processes and report directly to you.",
    billing: "Monthly per engineer",
  },
];

export type Principle = { title: string; body: string };

export const principles: readonly Principle[] = [
  {
    title: "Radical transparency",
    body: "You see everything: backlog, code, environments and time spent. Regular demos and written progress reports keep expectations aligned.",
  },
  {
    title: "Senior by default",
    body: "Every team is led by experienced engineers and a delivery manager, so you never have to coordinate developers unless you want to.",
  },
  {
    title: "Flexible commitment",
    body: "Priorities change. A few weeks' notice is all it takes to scale a team up, down or change the contract.",
  },
  {
    title: "AI-augmented delivery",
    body: "Our engineers use AI coding and testing tools under human review to move faster without cutting corners on quality or security.",
  },
];

export type ProcessStep = { title: string; body: string };

export const processSteps: readonly ProcessStep[] = [
  {
    title: "Intro call",
    body: "A 30-minute conversation about your goals, constraints and timeline.",
  },
  {
    title: "Proposal",
    body: "We recommend a team, engagement model and plan, usually within a few days.",
  },
  {
    title: "Kick-off",
    body: "Access, tools and rituals are set up and the team is introduced to your stakeholders.",
  },
  {
    title: "Delivery",
    body: "Work ships in short iterations with demos, reports and a single point of contact.",
  },
  {
    title: "Scale & support",
    body: "We grow, adjust or hand over the team and keep your product healthy after launch.",
  },
];

export const techMarquee: readonly { name: string; logo: string }[] = [
  { name: "React", logo: "/tech/react.svg" },
  { name: "Vue", logo: "/tech/vue.svg" },
  { name: "Angular", logo: "/tech/angular.svg" },
  { name: "Node.js", logo: "/tech/node.svg" },
  { name: "Go", logo: "/tech/golang.svg" },
  { name: "Java", logo: "/tech/java.svg" },
  { name: "PHP", logo: "/tech/php.svg" },
  { name: "Laravel", logo: "/tech/laravel.svg" },
  { name: "Symfony", logo: "/tech/symfony.svg" },
  { name: "AWS", logo: "/tech/aws.svg" },
  { name: "Kubernetes", logo: "/tech/kubernetes.svg" },
  { name: "DigitalOcean", logo: "/tech/digital-Ocean.svg" },
  { name: "Bitbucket", logo: "/tech/bitbucket.svg" },
];
