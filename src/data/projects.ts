export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  role: string;
  year?: string;
  technologies: string[];
  image: string;
  github?: string;
  liveUrl?: string;
  liveUrls?: ProjectLink[];
  overview: string;
  problem?: string;
  myRole: string;
  whatIBuilt: string;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  glow: string;
};

export const projects: Project[] = [
  {
    slug: "tipon-erp",
    title: "TIPON ERP System",
    shortDescription:
      "A chapter of enterprise work: connecting business operations into one digital environment.",
    role: "Enterprise systems",
    technologies: ["React", ".NET", "REST APIs", "SQL", "Cloud", "Enterprise Architecture"],
    image: "/images/crystal-05-tipon.webp",
    overview:
      "The TIPON ERP System represents a shift from building individual applications toward designing connected business systems — bringing complex operations into a unified digital environment.",
    myRole:
      "This crystal marks the enterprise chapter of the journey: thinking in workflows, roles, and interconnected processes rather than isolated features.",
    whatIBuilt:
      "Focus areas include ERP workflows, business operations, dashboards, data management, role-based access, interconnected processes, enterprise application architecture, and operational visibility. Visual motifs stay abstract — data, dashboards, and process — not literal UI screenshots.",
    architecture:
      "Enterprise application architecture with interconnected services, operational dashboards, and role-based access.",
    glow: "#2aa8e0",
  },
  {
    slug: "my-money-house",
    title: "My Money House Platforms",
    shortDescription:
      "Concurrent Australian FinTech broker platforms, including a 3D virtual tour.",
    role: "Senior Full Stack Developer",
    year: "2026 – Present",
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Tailwind CSS",
      "MySQL",
      "PHP",
      "Blender",
      "Three.js",
    ],
    image: "/images/crystal-04.webp",
    liveUrls: [
      { label: "MMH", href: "https://mmh-v2.mymoneyhouse.com.au" },
      { label: "Lendux", href: "https://lendux-v2.mymoneyhouse.com.au" },
      { label: "MPH", href: "https://mph.mymoneyhouse.com.au" },
    ],
    overview:
      "Multiple concurrent Australian FinTech broker platforms rebuilt with React, Next.js, and Node.js, including a 3D virtual tour built with Blender and Three.js.",
    myRole:
      "Senior Full Stack Developer at My Money House, leading full stack development across MMH, Lendux, MPH, and related production sites.",
    whatIBuilt:
      "Modern frontends and backends using React, Next.js, Node.js, TypeScript, and Tailwind CSS, backed by MySQL and PHP. 3D assets and interactive visuals for property and interior showcases, including a 3D virtual tour. AI-driven workflow automations with n8n, GHL, and Google API integrations. Hosting, deployment, and server configuration via cPanel.",
    glow: "#f08a2a",
  },
  {
    slug: "mega-rewards",
    title: "Mega Rewards E-Commerce",
    shortDescription: "E-commerce platform with integrated AI automation.",
    role: "Senior Full Stack Developer",
    year: "2026 – Present",
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "n8n"],
    image: "/images/crystal-06.webp",
    liveUrl: "https://e-commerce.megarewards.au",
    overview:
      "E-commerce platform (e-commerce.megarewards.au) built with modern full stack tooling and integrated AI automation.",
    myRole:
      "Full stack delivery as part of concurrent Australian FinTech and e-commerce platforms at My Money House.",
    whatIBuilt:
      "An e-commerce experience using modern full stack tooling, with AI-driven workflow automations to support business processes.",
    glow: "#e85aad",
  },
  {
    slug: "ace",
    title: "Advisor Credit Exchange (ACE)",
    shortDescription:
      "FinTech lending platform connecting wealth managers with banks.",
    role: "Software Engineer",
    year: "2021 – 2023",
    technologies: ["ASP.NET Core", "Angular", "Telerik UI", "SignalR"],
    image: "/images/crystal-02.webp",
    overview:
      "Advisor Credit Exchange is a FinTech solution connecting wealth managers with banks, with real-time dashboards and complex business rule enforcement.",
    myRole:
      "Software Engineer at Norima Consulting Inc., collaborating with cross-functional teams to deliver features aligned with financial compliance and business requirements.",
    whatIBuilt:
      "Contributed to the ACE platform using ASP.NET Core and Angular. Built dynamic dashboards and real-time backend communication using Telerik UI and SignalR.",
    glow: "#9b6dff",
  },
  {
    slug: "crs",
    title: "Compliance Request System (CRS)",
    shortDescription:
      "Enterprise audit-tracking system for access-control workflows.",
    role: "Programming Analyst",
    year: "2023",
    technologies: [
      "ASP.NET Core MVC",
      "MS SQL Server",
      "Clean Architecture",
      "CQRS",
      "AWS",
    ],
    image: "/images/crystal-03.webp",
    overview:
      "Enterprise audit-tracking system using Clean Architecture and CQRS, automating access-control workflows for a large organization.",
    myRole:
      "Programming Analyst at Rockwell. Documented complex business logic for access control workflows and coordinated production deployments via AWS.",
    whatIBuilt:
      "The User Access Request (Compliance Request System) using ASP.NET Core MVC and MS SQL Server, applying Clean Architecture and CQRS for maintainability.",
    architecture: "Clean Architecture and CQRS on ASP.NET Core MVC with MS SQL Server.",
    glow: "#3dcaa0",
  },
  {
    slug: "map-cargo",
    title: "Map Cargo Global Logistics",
    shortDescription:
      "Full-stack web platform for international freight management.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: ["ASP.NET Core", "C#", "React", "Angular", "REST APIs"],
    image: "/images/crystal-03.webp",
    overview:
      "Full-stack web platform for international freight management, integrating logistics tooling and client-facing portals.",
    myRole:
      ".NET Developer at Offshore Business Processing, delivering scalable full-stack solutions across logistics and freight forwarding.",
    whatIBuilt:
      "High-performance REST APIs using ASP.NET Core, C#, and Clean Architecture, with React and Angular frontends for logistics tooling and client-facing portals.",
    architecture: "Clean Architecture REST APIs with React and Angular clients.",
    glow: "#3dcaa0",
  },
  {
    slug: "fta",
    title: "Freight Trade Alliance (FTA)",
    shortDescription: "Logistics and trade alliance platform.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: ["ASP.NET Core", "React"],
    image: "/images/crystal-01.webp",
    overview:
      "Logistics and trade alliance platform built with ASP.NET Core and a React frontend.",
    myRole:
      "Full-stack development within Offshore Business Processing logistics platforms.",
    whatIBuilt: "ASP.NET Core backend with a React frontend for alliance and trade workflows.",
    glow: "#3ec8f0",
  },
  {
    slug: "obp-portals",
    title: "OBP Corporate & Careers Portals",
    shortDescription: "Primary job and corporate sites for Offshore Business Processing.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: [".NET", "React"],
    image: "/images/dome-wide.webp",
    liveUrls: [
      { label: "Careers", href: "https://obpcareers.com" },
      { label: "Corporate", href: "https://offshorebusinessprocessing.com" },
    ],
    overview:
      "Primary job and corporate sites (obpcareers.com, offshorebusinessprocessing.com) built with .NET and React.",
    myRole: ".NET Developer delivering public-facing corporate and careers experiences.",
    whatIBuilt: "Corporate and careers portals using .NET and React.",
    glow: "#7ad7ff",
  },
  {
    slug: "medblast",
    title: "MedBlast Healthcare Platform",
    shortDescription:
      "Responsive candidate-sourcing platform for healthcare, with SEO-focused UI.",
    role: "Front-End Developer & UI/UX Designer",
    year: "2023",
    technologies: ["JavaScript", "Figma", "SEO"],
    image: "/images/crystal-01.webp",
    overview:
      "Responsive candidate-sourcing platform for the healthcare industry with SEO optimization and Figma-driven design.",
    myRole:
      "Front-End Developer & UI/UX Designer at MedBlast. Designed professional UI/UX mockups in Figma, presented proposals to stakeholders, and drove implementation decisions.",
    whatIBuilt:
      "Responsive and accessible web interfaces using modern JavaScript and component-based design. Optimized platform performance and SEO metadata.",
    results:
      "Performance and SEO metadata work measurably improved search rankings and user engagement.",
    glow: "#3ec8f0",
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    shortDescription: "Full-stack portfolio site featuring 3D virtual tour assets.",
    role: "Full Stack Developer",
    technologies: ["React", "Three.js", "Blender"],
    image: "/images/dome-final.webp",
    liveUrl: "https://johnphilipgarcia.com",
    overview:
      "Full-stack portfolio site (johnphilipgarcia.com) featuring 3D virtual tour assets.",
    myRole: "Personal project spanning full-stack delivery and 3D visualization.",
    whatIBuilt: "A portfolio experience with 3D virtual tour assets.",
    glow: "#c9a27a",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
