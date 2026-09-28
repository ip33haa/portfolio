export type JourneyScene = {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  body: string;
  technologies?: string[];
  cameraNote?: string;
  crystal?: 1 | 2 | 3 | 4 | 5 | 6;
  color: string;
  accent: string;
};

export const journey: JourneyScene[] = [
  {
    id: "welcome",
    number: "01",
    title: "WELCOME",
    body: "Every journey begins with a spark.\n\nThis is the story of how I started, what I've built, and the experiences that shaped me — represented by the six crystals around the Tree of Growth.",
    color: "#d8d6d0",
    accent: "#7ad7ff",
  },
  {
    id: "beginning",
    number: "02",
    title: "THE BEGINNING",
    subtitle: "The Root of My Journey",
    body: "The root of my journey.\n\nI started with curiosity — a passion for technology, problem solving, and the desire to build things that make a difference.",
    color: "#e8e2d6",
    accent: "#c9a27a",
  },
  {
    id: "crystal-1",
    number: "03",
    title: "BLUEPRINT — MY FIRST STEPS",
    subtitle: "Early Roles & Foundations",
    body: "Early roles and foundations.\n\nI started as a developer, learning, experimenting, and building my foundation in web technologies. Like a wireframe blueprint, each project shaped my technical structure.\n\nKey tech: ASP.NET, PHP, JavaScript, HTML/CSS, MySQL.",
    crystal: 1,
    color: "#9fe9ff",
    accent: "#38bdf8",
  },
  {
    id: "crystal-2",
    number: "04",
    title: "JADE — GROWING STRONGER",
    subtitle: "Full Stack & Modern Web",
    body: "I embraced modern frameworks and sharpened my craft, becoming a full stack developer working with React, Next.js, Angular, and .NET. This phase gave me the agility and speed to build scalable applications.",
    technologies: ["React", "Next.js", "Angular", "C#/.NET", "Node.js", "TypeScript"],
    crystal: 2,
    color: "#bbf7d0",
    accent: "#22c55e",
  },
  {
    id: "crystal-3",
    number: "05",
    title: "EARTH — BUILDING SYSTEMS",
    subtitle: "Architecture & Cloud",
    body: "Like solid bedrock, I learned to design resilient systems with Clean Architecture, CQRS, and cloud deployments on Azure. I engineered microservices, DevOps pipelines, and enterprise-grade infrastructure.",
    technologies: [".NET Core", "Microservices", "Azure", "Docker", "CI/CD"],
    crystal: 3,
    color: "#a7f3d0",
    accent: "#10b981",
  },
  {
    id: "crystal-4",
    number: "06",
    title: "CYBER — CREATIVE & INNOVATION",
    subtitle: "Design, 3D & AI",
    body: "I expanded into creative tech, digital matrix architectures, 3D visualization, and AI automations. I used Blender, Three.js, n8n, and modern AI tools like Ollama, Cursor AI, Claude, and GitHub Copilot to build smarter and more immersive solutions.",
    technologies: [
      "Three.js",
      "Blender",
      "n8n",
      "Ollama",
      "Cursor AI",
      "Claude",
      "GitHub Copilot",
    ],
    crystal: 4,
    color: "#d9f99d",
    accent: "#84cc16",
  },
  {
    id: "crystal-5",
    number: "07",
    title: "AMETHYST — TIPON ERP SYSTEM",
    subtitle: "Enterprise Systems & Business Operations",
    body: "I moved from building individual applications toward designing connected, high-frequency business systems.\n\nThe TIPON ERP System represents this stage of my journey — bringing complex business operations into a unified digital nexus.",
    technologies: ["React", ".NET", "REST APIs", "SQL", "Cloud", "Enterprise Architecture"],
    crystal: 5,
    color: "#e9d5ff",
    accent: "#a855f7",
  },
  {
    id: "crystal-6",
    number: "08",
    title: "MAGMA — WHAT'S NEXT",
    subtitle: "Automation & Future",
    body: "Now, I'm channeling the fiery energy of AI-driven development, workflow automation, and creating solutions that ignite business growth.\n\nI'm excited for what's next — more innovation, more impact, more possibilities.",
    technologies: ["n8n", "AI", "LLMs", "Google API", "Vercel", "GitHub Copilot"],
    crystal: 6,
    color: "#fed7aa",
    accent: "#f97316",
  },
  {
    id: "whole",
    number: "09",
    title: "THE WHOLE JOURNEY",
    subtitle: "Six Crystals. One Story.",
    body: "Each crystal represents a chapter of my journey — from humble beginnings, to full-stack solutions, and now towards a future of automation and AI.",
    color: "#f0ece4",
    accent: "#c9a27a",
  },
  {
    id: "growing",
    number: "10",
    title: "STILL GROWING",
    body: "This isn't just a portfolio.\n\nIt's a living story.\n\nI'm John Philip Garcia — a full stack developer, problem solver, and lifelong learner.\n\nLet's build what's next.",
    color: "#f4efe6",
    accent: "#7ad7ff",
  },
];

export const crystalNav = journey.filter((scene) => scene.crystal);
