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
  screenshots?: ProjectLink[];
  overview: string;
  situation: string;
  task: string;
  action: string;
  result: string;
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
      "TIPON is the enterprise chapter of the journey — moving from standalone apps toward a connected business system.",
    situation:
      "Business operations were spread across disconnected applications, which made it hard to see work as one process instead of isolated features.",
    task:
      "Help design and build toward a unified ERP environment covering workflows, roles, data, and operational visibility.",
    action:
      "Worked with React, .NET, REST APIs, SQL, and cloud-oriented enterprise architecture. Focused on ERP workflows, dashboards, data management, role-based access, and how processes connect across the business.",
    result:
      "The system became a single digital environment for complex operations, marking a shift from building individual applications to designing interconnected business systems.",
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
    image: "/images/projects/mmh-v2.png",
    liveUrls: [
      { label: "MMH v2", href: "https://mmh-v2.mymoneyhouse.com.au/" },
      { label: "My Money House", href: "https://mymoneyhouse.com.au/" },
      { label: "MPH", href: "https://mph.mymoneyhouse.com.au/" },
      { label: "My Property House", href: "https://www.mypropertyhouse.com.au/" },
      { label: "Lendux", href: "https://lendux-v2.mymoneyhouse.com.au/" },
    ],
    screenshots: [
      { label: "MMH v2", href: "/images/projects/mmh-v2.png" },
      { label: "My Money House", href: "/images/projects/mymoneyhouse.png" },
      { label: "MPH", href: "/images/projects/mph.png" },
      { label: "My Property House", href: "/images/projects/mypropertyhouse.png" },
      { label: "Lendux", href: "/images/projects/lendux.png" },
    ],
    overview:
      "Senior full stack work across concurrent Australian FinTech broker platforms, plus 3D property visualization.",
    situation:
      "My Money House needed several broker platforms (MMH, Lendux, MPH) to run in production at once, with modern frontends, reliable backends, and richer property presentation.",
    task:
      "Lead full stack development across those platforms while also delivering 3D assets and automations that support day-to-day operations.",
    action:
      "Built and maintained frontends and backends with React, Next.js, Node.js, TypeScript, and Tailwind CSS, backed by MySQL and PHP. Produced 3D assets and interactive visuals in Blender and Three.js, including a 3D virtual tour. Added AI-driven workflow automations with n8n, GHL, and Google API integrations, and handled hosting and cPanel deployments.",
    result:
      "Multiple live broker sites now run on a shared modern stack, with 3D tour experiences and automations supporting lead handling and operations.",
    glow: "#f08a2a",
  },
  {
    slug: "mega-rewards",
    title: "Mega Rewards E-Commerce",
    shortDescription: "E-commerce platform with integrated AI automation.",
    role: "Senior Full Stack Developer",
    year: "2026 – Present",
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "n8n"],
    image: "/images/projects/megarewards.png",
    liveUrl: "https://e-commerce.megarewards.au/",
    screenshots: [{ label: "Mega Rewards", href: "/images/projects/megarewards.png" }],
    overview:
      "E-commerce delivery alongside the My Money House platform work, with AI automation in the mix.",
    situation:
      "The business needed an e-commerce channel that could sit alongside the FinTech platforms without becoming a separate, disconnected process.",
    task:
      "Deliver the Mega Rewards storefront on a modern full stack, and connect it to workflow automation.",
    action:
      "Built the e-commerce experience with React, Next.js, Node.js, and TypeScript, and wired AI-driven automations with n8n to support business processes.",
    result:
      "The store is live at e-commerce.megarewards.au, with automation supporting operations instead of purely manual handling.",
    glow: "#e85aad",
  },
  {
    slug: "jzl",
    title: "JZL — Oils, Websites, Automation",
    shortDescription:
      "Cinematic product site and digital studio for oils, websites, and n8n automation.",
    role: "Full Stack Developer",
    technologies: ["Next.js", "React", "Tailwind CSS", "Canvas API", "n8n"],
    image: "/images/projects/jzl.png",
    liveUrl: "https://jzl-seven.vercel.app/",
    screenshots: [{ label: "JZL", href: "/images/projects/jzl.png" }],
    overview:
      "JZL is a live cinematic site for chili garlic oils plus services for websites and workflow automation.",
    situation:
      "The brand needed a product story that felt premium, not a generic shop grid, while still pointing to website and automation services.",
    task:
      "Build a scroll-driven experience that presents the oils and the studio offering in one place.",
    action:
      "Shipped a Next.js and Tailwind scrollytelling page with canvas animation, services for custom websites, n8n automation, and contact.",
    result:
      "The live site at jzl-seven.vercel.app carries both the product story and the services funnel.",
    glow: "#e8a35a",
  },
  {
    slug: "casa-vista",
    title: "CasaVista 360° Virtual Tour",
    shortDescription: "Panorama virtual tour for a two-storey residence.",
    role: "Full Stack / 3D",
    technologies: ["Three.js", "Blender", "React"],
    image: "/images/projects/casa-vista.png",
    liveUrl: "https://virtual-tour-neon-beta.vercel.app/",
    screenshots: [{ label: "CasaVista", href: "/images/projects/casa-vista.png" }],
    overview:
      "A 360° property tour with room navigation, finishes, and an auto-tour path.",
    situation:
      "A still photo set cannot show how a house actually feels room to room.",
    task:
      "Deliver an interactive panorama tour that visitors can walk without being on site.",
    action:
      "Built CasaVista with 360 views, floor switching, room list, and tour controls for a two-storey residence.",
    result:
      "The tour is live at virtual-tour-neon-beta.vercel.app for clients to explore the property in the browser.",
    glow: "#c9a27a",
  },
  {
    slug: "jpb-dimensions",
    title: "JPB Dimensions | 360° Virtual Tours",
    shortDescription: "360° virtual tour product for property presentation.",
    role: "Full Stack / 3D",
    technologies: ["Three.js", "Blender", "React"],
    image: "/images/projects/jpb-dimensions.png",
    liveUrl: "https://jpb-solution.vercel.app/",
    screenshots: [{ label: "JPB Dimensions", href: "/images/projects/jpb-dimensions.png" }],
    overview:
      "A second live 360° tour experience for presenting spaces interactively.",
    situation:
      "Property and interior work needed another tour surface besides a single branded CasaVista instance.",
    task:
      "Ship a dedicated virtual-tour site under JPB Dimensions.",
    action:
      "Built the JPB Dimensions tour experience and published it on Vercel.",
    result:
      "The tour is live at jpb-solution.vercel.app.",
    glow: "#d4b48a",
  },
  {
    slug: "ace",
    title: "Advisor Credit Exchange (ACE)",
    shortDescription:
      "FinTech lending platform connecting wealth managers with banks.",
    role: "Software Engineer",
    year: "2021 – 2023",
    technologies: ["ASP.NET Core", "Angular", "Telerik UI", "SignalR"],
    image: "/images/projects/ace.png",
    liveUrl: "https://norimaconsulting.com/portfolio/advisor-credit-exchange-ace/",
    screenshots: [{ label: "ACE — Norima", href: "/images/projects/ace.png" }],
    overview:
      "FinTech lending work at Norima Consulting, connecting wealth managers with banks under real business rules.",
    situation:
      "Wealth managers and banks needed a shared lending platform where dashboards stayed current and financial rules could be enforced consistently.",
    task:
      "As a Software Engineer, deliver ACE features with cross-functional teams while staying aligned with compliance and business requirements.",
    action:
      "Contributed to the platform with ASP.NET Core and Angular. Built dynamic dashboards and real-time backend communication using Telerik UI and SignalR.",
    result:
      "Norima’s public case study documents ACE as a multi-custodial, multi-lender exchange used by wealth platforms and advisors for credit options such as securities-backed, unsecured, and mortgage lending.",
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
      "Enterprise access-control and audit tracking for a large organization at Rockwell.",
    situation:
      "Access-control requests and audits were hard to follow as a single, maintainable workflow inside a large organization.",
    task:
      "As a Programming Analyst, document the business logic and deliver an audit-tracking system that could be deployed and operated in production.",
    action:
      "Built the User Access Request (Compliance Request System) with ASP.NET Core MVC and MS SQL Server, using Clean Architecture and CQRS. Coordinated production deployments via AWS.",
    result:
      "Access-control requests moved into a structured system that is easier to maintain, audit, and deploy than ad-hoc tracking.",
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
    image: "/images/projects/map-cargo.png",
    liveUrl: "https://www.mapcargo.com/",
    screenshots: [{ label: "Map Cargo", href: "/images/projects/map-cargo.png" }],
    overview:
      "International freight tooling and client portals delivered at Offshore Business Processing.",
    situation:
      "International freight work needed a web platform that could serve both logistics operations and clients, not just a single internal tool.",
    task:
      "As a .NET Developer, deliver scalable APIs and frontends for freight management.",
    action:
      "Built high-performance REST APIs with ASP.NET Core, C#, and Clean Architecture, and React and Angular clients for logistics tooling and client-facing portals.",
    result:
      "The public site is live at mapcargo.com, with operations and clients working through the freight platform instead of fragmented tooling.",
    glow: "#3dcaa0",
  },
  {
    slug: "fta",
    title: "Freight Trade Alliance (FTA)",
    shortDescription: "Logistics and trade alliance platform.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: ["ASP.NET Core", "React"],
    image: "/images/projects/fta.png",
    liveUrl: "https://ftalliance.com.au/",
    screenshots: [{ label: "Freight Trade Alliance", href: "/images/projects/fta.png" }],
    overview:
      "Alliance and trade workflows for logistics, built as part of the OBP platform set.",
    situation:
      "Trade alliance work needed a dedicated place for alliance and freight workflows, not a generic logistics screen.",
    task:
      "Deliver an FTA platform with an ASP.NET Core backend and a React frontend.",
    action:
      "Built the backend and React UI for alliance and trade workflows within Offshore Business Processing logistics platforms.",
    result:
      "The alliance site is live at ftalliance.com.au as Australia’s freight and trade industry platform, alongside the other OBP logistics systems.",
    glow: "#3ec8f0",
  },
  {
    slug: "obp-portals",
    title: "OBP Corporate & Careers Portals",
    shortDescription: "Primary job and corporate sites for Offshore Business Processing.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: [".NET", "React"],
    image: "/images/projects/obp-corporate.png",
    liveUrls: [
      { label: "Corporate", href: "https://www.offshorebusinessprocessing.com/" },
      { label: "Careers", href: "https://www.obpcareers.com/" },
    ],
    screenshots: [
      { label: "Corporate", href: "/images/projects/obp-corporate.png" },
      { label: "Careers", href: "/images/projects/obp-careers.png" },
    ],
    overview:
      "Public-facing careers and corporate sites for Offshore Business Processing.",
    situation:
      "OBP needed clear public sites for hiring and for the company itself, not only internal logistics tools.",
    task:
      "Deliver the primary careers and corporate web experiences on .NET and React.",
    action:
      "Built obpcareers.com and offshorebusinessprocessing.com as .NET and React portals.",
    result:
      "The company has live careers and corporate sites that candidates and clients can actually use.",
    glow: "#7ad7ff",
  },
  {
    slug: "the-hub",
    title: "The HUB",
    shortDescription:
      "Internal social platform for OBP employees — Friendster, Facebook, Instagram, X, YouTube, and Spotify in one place.",
    role: ".NET Developer",
    year: "2023 – 2026",
    technologies: [".NET", "React", "SQL"],
    image: "/images/dome-wide.webp",
    overview:
      "The HUB is Offshore Business Processing’s internal social network, combining feed, profiles, media, and music-style features employees already know from public apps.",
    situation:
      "OBP staff were split across Friendster-style profiles, Facebook-style feeds, Instagram-style media, X-style posts, YouTube-style video, and Spotify-style listening — none of it lived in one company space.",
    task:
      "Build a single internal platform where those social patterns exist together for employees.",
    action:
      "Designed and developed The HUB as a combined social workspace: profiles and friends, a company feed, photo and video sharing, short posts, and music listening features in one product.",
    result:
      "Employees can use one OBP platform instead of stitching together separate public social apps for work community.",
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
    image: "/images/projects/medblast.png",
    liveUrl: "https://medblast.com/",
    screenshots: [{ label: "MedBlast", href: "/images/projects/medblast.png" }],
    overview:
      "Healthcare candidate-sourcing with design, front-end implementation, and SEO in the same brief.",
    situation:
      "MedBlast needed a candidate-sourcing platform that looked professional on every device and could actually be found in search.",
    task:
      "As Front-End Developer and UI/UX Designer, own the mockups, stakeholder presentations, and the implemented interface.",
    action:
      "Designed UI/UX in Figma, presented proposals, and built responsive, accessible interfaces with modern JavaScript. Optimized performance and SEO metadata.",
    result:
      "The platform shipped with a coherent design system and improved search presence and engagement compared with the previous experience.",
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
      "A personal site used to show full-stack delivery and 3D visualization in one place.",
    situation:
      "A standard résumé list does not show how 3D, front-end, and product thinking actually feel together.",
    task:
      "Build a portfolio that carries both software work and 3D tour assets.",
    action:
      "Designed and built johnphilipgarcia.com as a full-stack React experience with Three.js and Blender assets.",
    result:
      "The live site is a single place to walk through the work, including 3D virtual tour pieces, instead of a static page of links.",
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
