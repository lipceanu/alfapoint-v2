export type Job = {
  slug: string;
  title: string;
  location: string;
  seniority: string;
  technologies: readonly string[];
  requirements: readonly string[];
  responsibilities: readonly string[];
  closing: string;
};

const DEGREE_NOTE =
  "A degree in Computer Science, Software Engineering or a related field (or equivalent experience) is a plus, but not mandatory.";

const SHARED_SOFT_SKILLS = [
  "Solid understanding of engineering best practices, including Git and agile methodologies.",
  "Excellent problem-solving skills and attention to detail.",
  "Strong communication and teamwork skills in English.",
  "Self-motivated, able to work independently and meet deadlines.",
];

export const jobs: readonly Job[] = [
  {
    slug: "php-backend-engineer",
    title: "PHP Backend Software Engineer",
    location: "France, EU · Remote",
    seniority: "Mid–Senior",
    technologies: ["PHP", "Laravel", "AWS", "Git"],
    requirements: [
      DEGREE_NOTE,
      "Proven experience building web applications with Laravel and PHP.",
      "Deep understanding of the Laravel and PHP ecosystems.",
      "Familiarity with front-end technologies (HTML, CSS, JavaScript) and their integration with Laravel.",
      "Experience with relational databases such as MySQL or PostgreSQL.",
      "Knowledge of RESTful APIs and web services.",
      ...SHARED_SOFT_SKILLS,
    ],
    responsibilities: [
      "Develop and maintain high-quality Laravel applications that meet performance, security and scalability requirements.",
      "Take part in code reviews to maintain quality and share knowledge.",
      "Collaborate with front-end developers, designers and product managers.",
      "Troubleshoot and resolve defects efficiently.",
      "Identify and remove performance bottlenecks.",
      "Apply security best practices to protect applications against threats.",
      "Keep clear documentation for code, processes and systems.",
    ],
    closing:
      "If you are a passionate mid–senior engineer with Laravel/PHP expertise and ready to contribute to exciting projects, we would love to hear from you.",
  },
  {
    slug: "dotnet-engineer",
    title: ".NET Software Engineer",
    location: "Germany, EU · Remote",
    seniority: "Mid–Senior",
    technologies: ["C#", "ASP.NET", ".NET Core", "JavaScript", "REST APIs"],
    requirements: [
      DEGREE_NOTE,
      "Demonstrated experience building applications on the .NET stack.",
      "Proficiency across the .NET ecosystem, including C#, ASP.NET and .NET Core.",
      "Experience with relational databases such as SQL Server or Oracle.",
      "Knowledge of web technologies (HTML, CSS, JavaScript) and their integration with .NET.",
      "Knowledge of RESTful APIs and web services.",
      ...SHARED_SOFT_SKILLS,
    ],
    responsibilities: [
      "Design, build and maintain high-quality .NET applications that meet performance, security and scalability standards.",
      "Take part in code reviews to uphold quality and share knowledge.",
      "Collaborate with front-end developers, UX/UI designers and product managers.",
      "Identify and resolve defects efficiently.",
      "Recognise and address performance bottlenecks.",
      "Apply security best practices to safeguard applications.",
      "Keep clear documentation for code, processes and systems.",
    ],
    closing:
      "If you are a passionate mid–senior engineer with .NET expertise and ready to contribute to exciting projects, we would love to hear from you.",
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}
