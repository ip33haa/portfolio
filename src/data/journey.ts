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
    body: "I started with curiosity — a passion for technology, problem solving, and the desire to build things that make a difference.",
    cameraNote: "CAMERA: Slow zoom in towards the tree, from the wide dome view into the center.",
    color: "#e8e2d6",
    accent: "#c9a27a",
  },
  {
    id: "crystal-1",
    number: "03",
    title: "WATER — MY FIRST STEPS",
    subtitle: "Early Roles & Foundations",
    body: "I started as a developer, learning, experimenting, and building my foundation in web technologies. Each project taught me something new and sharpened my skills.",
    technologies: ["ASP.NET", "PHP", "JavaScript", "HTML/CSS", "MySQL"],
    crystal: 1,
    color: "#9fe9ff",
    accent: "#3ec8f0",
  },
  {
    id: "crystal-2",
    number: "04",
    title: "WIND — GROWING STRONGER",
    subtitle: "Full Stack & Modern Web",
    body: "I embraced modern frameworks and became a full stack developer, working with React, Next.js, Angular, and .NET. This phase helped me build scalable and maintainable applications.",
    technologies: ["React", "Next.js", "Angular", "C#/.NET", "Node.js", "TypeScript"],
    crystal: 2,
    color: "#d4b4ff",
    accent: "#9b6dff",
  },
  {
    id: "crystal-3",
    number: "05",
    title: "EARTH — BUILDING SYSTEMS",
    subtitle: "Architecture & Cloud",
    body: "I learned to design better systems with Clean Architecture, CQRS, and cloud deployments on Azure. I started working with microservices, DevOps, and real-world production environments.",
    technologies: [".NET Core", "Microservices", "Azure", "Docker", "CI/CD"],
    crystal: 3,
    color: "#9ff3d2",
    accent: "#3dcaa0",
  },
  {
    id: "crystal-4",
    number: "06",
    title: "FIRE — CREATIVE & INNOVATION",
    subtitle: "Design, 3D & AI",
    body: "I expanded into creative tech, 3D visualization, and AI automations. I used Blender, Three.js, n8n, and AI tools like Ollama, Cursor AI, Claude, and GitHub Copilot to build smarter and more immersive solutions.",
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
    color: "#ffc07a",
    accent: "#f08a2a",
  },
  {
    id: "crystal-5",
    number: "07",
    title: "ICE — TIPON ERP SYSTEM",
    subtitle: "Enterprise Systems & Business Operations",
    body: "I moved from building individual applications toward designing connected business systems.\n\nThe TIPON ERP System represents this stage of my journey — bringing complex business operations into a unified digital environment.",
    technologies: ["React", ".NET", "REST APIs", "SQL", "Cloud", "Enterprise Architecture"],
    crystal: 5,
    color: "#7ad7ff",
    accent: "#2aa8e0",
  },
  {
    id: "crystal-6",
    number: "08",
    title: "SPIRIT — WHAT'S NEXT",
    subtitle: "Automation & Future",
    body: "Now, I'm focused on AI-driven development, workflow automation, and creating solutions that help businesses grow faster and smarter.\n\nI'm excited for what's next — more innovation, more impact, more possibilities.",
    technologies: ["n8n", "AI", "LLMs", "Google API", "Vercel", "GitHub Copilot"],
    crystal: 6,
    color: "#ffb0de",
    accent: "#e85aad",
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
