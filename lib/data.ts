// All site content lives here — edit this file to update the portfolio.

export const profile = {
  name: "Manikandan B",
  role: "Software Developer & Full-Stack Engineer",
  shortRole: "Software Developer",
  location: "Tamil Nadu, India",
  email: "baskarmanikandan48@gmail.com",
  phone: "+91 63797 63494",
  phoneHref: "tel:+916379763494",
  github: "https://github.com/B-Mani-kandan",
  githubHandle: "github.com/B-Mani-kandan",
  linkedin: "https://linkedin.com/in/manikandan-33",
  linkedinHandle: "in/manikandan-33",
  resume: "/Manikandan_B_Resume.pdf",
  heroIntro:
    "I build enterprise web apps, clean APIs and fast business websites with ASP.NET, Angular and React — software people actually enjoy using.",
  // About section — wrap a phrase in **double stars** to give it the animated highlight
  aboutLead:
    "I'm Manikandan — a full-stack developer from Tamil Nadu who turns **messy business workflows** into software that feels fast, clear and dependable.",
  aboutBody: [
    "Since 2024 I've been building **logistics, freight and HR platforms** at Invoking Systems — ASP.NET and C# APIs, SQL Server underneath, Angular and React on top. Real teams run their day on what I ship.",
    "Outside the day job I design and launch websites for real businesses — **three are live today**. I care about the details people feel: quick pages, honest code and screens that just make sense.",
  ],
  currently: { role: "Software Developer", company: "Invoking Systems", since: "Jan 2024" },
  education: {
    degree: "B.Tech, Information Technology",
    school: "Anjalai Ammal Mahalingam Engineering College",
    cgpa: "8.25",
  },
};

export const stats = [
  { value: "2+", label: "years in production" },
  { value: "3", label: "live client websites" },
  { value: "9", label: "projects shipped" },
  { value: "8.25", label: "B.Tech IT CGPA" },
];

export const marquee = ["ASP.NET", "C#", "Angular", "React", "Node.js", "Express.js", "SQL Server", "MongoDB", "TypeScript", "Tailwind CSS", "Firebase", "Java"];

export const COLORS = {
  accent: "#7CF5C4",
  orange: "#FF9B5C",
  violet: "#8B9CFF",
  yellow: "#F2E86D",
};

export type Service = {
  num: string; title: string; badge: string; color: string; lead: string;
  builds: string[]; detail: string; tech: string[];
};

export const services: Service[] = [
  {
    num: "01", title: "Enterprise Apps on .NET", badge: "Current role", color: COLORS.orange,
    lead: "Business systems that run real operations — shipments, billing and people — built in ASP.NET and C# every day at Invoking Systems.",
    builds: ["Logistics & freight forwarding modules", "HR and attendance platforms", "Role-based dashboards and approval workflows"],
    detail: "A layered ASP.NET + C# architecture with role-based auth, Angular on the front and SQL Server underneath — shaped so a new module plugs in without rewriting the old ones.",
    tech: ["ASP.NET", "C#", "Angular", "SQL Server", "Visual Studio"],
  },
  {
    num: "02", title: "APIs That Hold It Together", badge: "Core skill", color: COLORS.accent,
    lead: "Clean, predictable REST APIs that connect front ends, databases and partner systems — so data flows end to end without surprises.",
    builds: ["RESTful services with ASP.NET Web API", "Third-party and partner integrations", "Endpoints documented and tested in Postman"],
    detail: "Consistent DTOs, validation and error responses, async data access and stored procedures tuned for the heavy queries — so the UI team always knows exactly what comes back.",
    tech: ["Web API", "Node.js", "Express.js", "MongoDB", "SQL Server", "Postman"],
  },
  {
    num: "03", title: "Interfaces People Enjoy", badge: "Angular & React", color: COLORS.violet,
    lead: "Responsive screens that turn complicated workflows into a few clear clicks — on a desktop at the office or a phone on the dock.",
    builds: ["Reusable component libraries", "Data-heavy forms, tables and dashboards", "Pixel-tidy layouts on every screen size"],
    detail: "Typed Angular and React components with shared services and hooks, lazy-loaded routes and careful state handling — the second screen costs less than the first.",
    tech: ["Angular", "React", "TypeScript", "JavaScript", "Tailwind CSS", "Bootstrap"],
  },
  {
    num: "04", title: "Websites That Win Clients", badge: "3 live sites", color: COLORS.yellow,
    lead: "Fast, SEO-ready business websites that bring in enquiries — already live for freight and logistics companies.",
    builds: ["Service and landing pages that convert", "Enquiry and quote forms", "SEO, social previews and deployment"],
    detail: "Mobile-first builds with semantic HTML, Open Graph and Twitter cards, optimised images and quick hosting — handed over live and kept maintained.",
    tech: ["React", "HTML5", "CSS3", "Tailwind CSS", "Figma", "Firebase", "Vercel"],
  },
];

export const buildSteps = [
  { num: "01", title: "Understand", body: "Sit with the people who will use it and map the workflow, the screens and the data before code." },
  { num: "02", title: "Model", body: "Design SQL Server tables, keys and stored procedures so business rules live right next to the data." },
  { num: "03", title: "Connect", body: "Build ASP.NET Web APIs with validation, auth and clear error responses, all tested in Postman." },
  { num: "04", title: "Craft", body: "Turn the flow into responsive Angular or React screens made from reusable, typed components." },
  { num: "05", title: "Ship & tune", body: "Review, cross-browser test and deploy, then profile slow queries and pages and make them fast." },
];

export const techCategories = [
  { id: "lang", label: "Languages", color: COLORS.orange },
  { id: "front", label: "Frontend", color: COLORS.accent },
  { id: "back", label: "Backend", color: COLORS.violet },
  { id: "data", label: "Databases", color: COLORS.yellow },
  { id: "tools", label: "Tools", color: "#7CD8F5" },
] as const;

export type TechCategory = (typeof techCategories)[number]["id"];

/**
 * Tech stack tiles, in display order. On wide screens they're laid out in rows of
 * 10 / 8 / 6 / 4 (a funnel), so keep the total at 28 or update STACK_ROWS in stack.tsx.
 * `icon` is a file in /public/tech; `invert` flips a black logo to white for the dark page.
 */
export const techStack: { name: string; icon: string; cat: TechCategory; invert?: boolean }[] = [
  { name: "C", icon: "c", cat: "lang" },
  { name: "C++", icon: "cplusplus", cat: "lang" },
  { name: "Java", icon: "java", cat: "lang" },
  { name: "C#", icon: "csharp", cat: "lang" },
  { name: "JavaScript", icon: "javascript", cat: "lang" },
  { name: "TypeScript", icon: "typescript", cat: "lang" },
  { name: "HTML5", icon: "html5", cat: "front" },
  { name: "CSS3", icon: "css3", cat: "front" },
  { name: "Tailwind CSS", icon: "tailwindcss", cat: "front" },
  { name: "Bootstrap", icon: "bootstrap", cat: "front" },

  { name: "Angular", icon: "angular", cat: "front" },
  { name: "React", icon: "react", cat: "front" },
  { name: "ASP.NET", icon: "dotnetcore", cat: "back" },
  { name: "Web API", icon: "openapi", cat: "back" },
  { name: "Node.js", icon: "nodejs", cat: "back" },
  { name: "Express.js", icon: "express", cat: "back", invert: true },
  { name: "Spring Boot", icon: "spring", cat: "back" },
  { name: "SQL Server", icon: "microsoftsqlserver", cat: "data" },

  { name: "MySQL", icon: "mysql", cat: "data" },
  { name: "MongoDB", icon: "mongodb", cat: "data" },
  { name: "Firebase", icon: "firebase", cat: "data" },
  { name: "Git", icon: "git", cat: "tools" },
  { name: "GitHub", icon: "github", cat: "tools", invert: true },
  { name: "Postman", icon: "postman", cat: "tools" },

  { name: "VS Code", icon: "vscode", cat: "tools" },
  { name: "Visual Studio", icon: "visualstudio", cat: "tools" },
  { name: "Figma", icon: "figma", cat: "tools" },
  { name: "Vercel", icon: "vercel", cat: "tools", invert: true },
];

export type LiveSite = {
  num: string; kind: string; name: string; domain: string; url: string; reverse: boolean;
  desc: string; points: string[];
  mock: { bg: string; logo: string; logoText: string; line: string; cta: string; ctaInk: string; ink: string; eyebrow: string; headline: string; pills: string[]; blocks: string[] };
};

export const liveSites: LiveSite[] = [
  {
    num: "01", kind: "Freight forwarding website", name: "Zion Forwarders", domain: "zionforwarders.in", url: "https://zionforwarders.in/", reverse: false,
    desc: "Public website for an international freight forwarder — presenting ocean and air freight, customs clearance, warehousing and end-to-end logistics to customers worldwide.",
    points: ["Service pages for sea, air, customs & warehousing", "Responsive layout, SEO & social-share metadata", "Built in the brand's deep-blue identity"],
    mock: {
      bg: "#0F4C81", logo: "#FFFFFF", logoText: "ZION FORWARDERS", line: "rgba(255,255,255,.28)", cta: "#FFC46B", ctaInk: "#0B2A47", ink: "#FFFFFF",
      eyebrow: "Global freight partner", headline: "Your trusted logistics partner.", pills: ["Ocean", "Air", "Customs", "Warehousing"],
      blocks: ["#FFC46B", "#E8EEF5", "#3A7BC0", "#E8EEF5", "#FF8A5C", "#FFC46B", "#3A7BC0", "#FFC46B", "#E8EEF5"],
    },
  },
  {
    num: "02", kind: "Global logistics website", name: "TransitSync Global", domain: "transitsyncglobal.com", url: "https://transitsyncglobal.com/", reverse: true,
    desc: "A modern site for a global logistics company — smart freight forwarding, supply-chain management and import/export services, positioned as a technology-led operator.",
    points: ["Services: forwarding, supply chain, import & export", "Mobile-first, SEO-optimised build", "Open Graph & Twitter cards for sharing"],
    mock: {
      bg: "#0B1B2E", logo: "#7CD8F5", logoText: "TRANSITSYNC", line: "rgba(124,216,245,.25)", cta: "#13C4A3", ctaInk: "#06241F", ink: "#EAF6FB",
      eyebrow: "Smart freight forwarding", headline: "Global logistics, in sync.", pills: ["Forwarding", "Supply chain", "Import / Export"],
      blocks: ["#13C4A3", "#1E3A5C", "#7CD8F5", "#1E3A5C", "#13C4A3", "#2C5A85", "#7CD8F5", "#13C4A3", "#1E3A5C"],
    },
  },
  {
    // TODO: fill in Prodigy Book's details
    num: "03", kind: "Business website", name: "Prodigy Book", domain: "prodigybook.in", url: "http://www.prodigybook.in/", reverse: false,
    desc: "[One or two lines on what Prodigy Book is and who it serves.]",
    points: ["[Key feature or page you built]", "[Second highlight]", "[Tech used]"],
    mock: {
      bg: "#F6F1E7", logo: "#2B1E5C", logoText: "PRODIGY BOOK", line: "rgba(43,30,92,.18)", cta: "#6C4CF5", ctaInk: "#FFFFFF", ink: "#1B1438",
      eyebrow: "[Tagline]", headline: "[Prodigy Book headline]", pills: ["[Feature]", "[Feature]", "[Feature]"],
      blocks: ["#6C4CF5", "#E7DFFB", "#FF9B5C", "#E7DFFB", "#6C4CF5", "#FFC46B", "#E7DFFB", "#6C4CF5", "#FF9B5C"],
    },
  },
];

export const enterprise = [
  {
    title: "Logistics & Freight Forwarding System", year: "2024 — now", bg: "#0F1A17", ink: COLORS.accent,
    desc: "Modules for shipment booking, container tracking, billing, documentation and operational workflows — powered by ASP.NET Web APIs.",
    tags: ["ASP.NET", "C#", "Web API", "SQL Server", "Angular"],
    kpis: [{ l: "Bookings", v: "Live" }, { l: "Tracking", v: "Live" }, { l: "Billing", v: "Live" }],
    chart: [40, 55, 48, 70, 62, 80, 58, 74, 88, 66, 92, 78],
  },
  {
    title: "HRM Attendance Management", year: "2024", bg: "#12131F", ink: COLORS.violet,
    desc: "A complete attendance application — check-ins, leave and reports — with an Angular front end over C# services and tuned SQL Server procedures.",
    tags: ["Angular", "C#", "SQL Server"],
    kpis: [{ l: "Check-ins", v: "Daily" }, { l: "Leave", v: "Flow" }, { l: "Reports", v: "Auto" }],
    chart: [82, 78, 90, 86, 74, 30, 28, 88, 84, 92, 80, 35],
  },
];

export const moreProjects = [
  { initial: "B", title: "BurgerHouse", kind: "internship", tint: "#2A1A10", ink: COLORS.orange, desc: "Full-stack restaurant app with REST APIs, deployed on Vercel.", tags: "React · Node.js · Vercel" },
  { initial: "L", title: "Lyceum Hub", kind: "academic", tint: "#28250E", ink: COLORS.yellow, desc: "Cloud-based learning management platform — my main B.Tech project.", tags: "Cloud · LMS" },
  { initial: "Li", title: "Library Management", kind: "mini project", tint: "#1E1428", ink: "#D9A6FF", desc: "CRUD book & member management with role-based access.", tags: "CRUD · RBAC" },
  { initial: "Y", title: "Yelp Camp", kind: "course", tint: "#0F2230", ink: "#7CD8F5", desc: "Campground listings and reviews with authentication.", tags: "Node.js · MongoDB" },
];

export const jobs = [
  {
    when: "Jan 2024 — Present", current: true, role: "Software Developer", company: "Invoking Systems",
    points: [
      "Building enterprise web apps in ASP.NET and C#, including a Logistics & Freight Forwarding Management System.",
      "Designed RESTful APIs with ASP.NET Web API and integrated them with Angular and React front ends.",
      "Shipped a full HRM Attendance app; optimised SQL Server schemas, stored procedures and complex queries.",
    ],
  },
  {
    when: "Aug — Sept 2023", current: false, role: "Full Stack Developer Intern", company: "Exposys Data Labs",
    points: ["Built full-stack features for the BurgerHouse app with React.js and Node.js.", "Created REST APIs, responsive cross-browser UI, and deployed on Vercel."],
  },
  {
    when: "Jun — Aug 2021", current: false, role: "Front-End Developer Intern", company: "Logritha Technologies",
    points: ["Developed responsive interfaces for a school management system with HTML, CSS, JavaScript and Bootstrap."],
  },
];

export const gitLog = [
  { hash: "a91f3e2", head: true, msg: "feat: freight & HRM systems" },
  { hash: "7c02b18", msg: "feat: ship 3 client websites" },
  { hash: "4e5d9a0", msg: "feat: BurgerHouse on Vercel" },
  { hash: "19b7c44", msg: "chore: B.Tech IT, CGPA 8.25" },
  { hash: "0000001", msg: "init: first <html> tag, 2021" },
];

export const contactTopics = ["Full-time role", "Business website", "Freelance project", "Just saying hi"];

/** Sections that have their own URL (/about, /work…). The nav links come from here too. */
export const sections = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
