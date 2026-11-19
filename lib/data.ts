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
    "Outside the day job I design and launch websites for real businesses — **five are live today**. I care about the details people feel: quick pages, honest code and screens that just make sense.",
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
  { value: "5", label: "live client websites" },
  { value: "11", label: "projects shipped" },
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
    num: "04", title: "Websites That Win Clients", badge: "5 live sites", color: COLORS.yellow,
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

/**
 * Project screenshots live in /public/work. Each is a full-page capture at 1440px wide —
 * the card shows the top of it and scrolls through the whole page on hover.
 * `shotH` is the image's pixel height (width is always 1440). Refresh them with
 * `node scripts/capture-shots.mjs public/work name=url ...`.
 */
export type Shot = { image: string; shotH: number };

export type LiveSite = Shot & {
  num: string; kind: string; name: string; domain: string; url: string; reverse: boolean;
  color: string; desc: string; points: string[];
};

export const liveSites: LiveSite[] = [
  {
    num: "01", kind: "Freight forwarding website", name: "Zion Forwarders", domain: "zionforwarders.in", url: "https://zionforwarders.in/", reverse: false,
    image: "/work/zion.jpg", shotH: 2895, color: "#2FB8B0",
    desc: "Public website for an international freight forwarder — ocean and air freight, customs clearance, DGR handling and FCL / LCL shipping, presented with an interactive 3D container ship.",
    points: ["Interactive 3D container-ship hero", "Service pages for sea, air, customs & warehousing", "Track-shipment entry point, SEO & social metadata"],
  },
  {
    num: "02", kind: "Logistics company website", name: "Argo Worldwide Logistics", domain: "ndlweb.f-studio.in", url: "https://ndlweb.f-studio.in/", reverse: true,
    image: "/work/argo.jpg", shotH: 3222, color: "#E5262B",
    desc: "A bold, image-led site for an India · Dubai freight forwarder — one accountable team for ocean, air, land transport, customs clearance and Jebel Ali warehousing.",
    points: ["Five-service journey with an animated truck preloader", "Layered photo hero with route & mode badges", "Careers, contact and get-a-quote flows"],
  },
  {
    num: "03", kind: "Industrial automation website", name: "Foutema Automation", domain: "foutema.com", url: "http://www.foutema.com/", reverse: false,
    image: "/work/foutema.jpg", shotH: 3414, color: "#3A5BB0",
    desc: "Corporate website for Foutema Automation Technology — SMT fixtures, carriers, spares & consumables and custom assembly-line automation for electronics manufacturers.",
    points: ["Product & services catalogue for SMT lines", "Built in React with animated card hero", "Enquiry flow and full product-range footer"],
  },
  {
    num: "04", kind: "Global logistics website", name: "TransitSync Global", domain: "transitsyncglobal.com", url: "https://transitsyncglobal.com/", reverse: true,
    image: "/work/transitsync.jpg", shotH: 5200, color: "#F2C94C",
    desc: "A modern site for a global logistics company — smart freight forwarding, supply-chain management and import/export services, positioned as a technology-led operator.",
    points: ["Ocean, air, heavy-lift & warehousing service pages", "Mobile-first, SEO-optimised build", "Open Graph & Twitter cards for sharing"],
  },
  {
    num: "05", kind: "SaaS product website", name: "Prodigy Book", domain: "prodigybook.in", url: "http://www.prodigybook.in/", reverse: false,
    image: "/work/prodigybook.jpg", shotH: 2360, color: "#4F6BF5",
    desc: "Marketing site for Prodigy Book, the HR & attendance platform I built — it walks teams from the problems they have today to a single place to manage their whole workforce.",
    points: ["Live product dashboard preview in the hero", "Problems → transformation → how-it-works story", "Lead capture into the HRM app"],
  },
];

export type EnterpriseApp = Shot & {
  title: string; product: string; status: string; statusDone: boolean; year: string; url: string; domain: string;
  ink: string; desc: string; points: string[]; tags: string[];
};

export const enterprise: EnterpriseApp[] = [
  {
    title: "Logistics ERP", product: "F-Studio ERP", status: "Migrating to .NET 10", statusDone: false, year: "2024 — now",
    url: "https://dev-fstudio.f-studio.in/", domain: "dev-fstudio.f-studio.in", image: "/work/erp.jpg", shotH: 900, ink: "#FF8A4C",
    desc: "A freight-forwarding ERP that runs day-to-day operations — re-engineering the legacy application onto .NET 10 with a rebuilt, faster interface.",
    points: ["Bookings, ocean / air / road / customs jobs", "Documentation, billing & live tracking", "Legacy modules ported to .NET 10 Web APIs"],
    tags: [".NET 10", "C#", "Web API", "SQL Server", "Angular"],
  },
  {
    title: "HRM & Attendance", product: "Prodigy Book", status: "Completed · in use", statusDone: true, year: "2024 — 2025",
    url: "http://hrmdev.f-studio.in/login", domain: "hrmdev.f-studio.in", image: "/work/hrm.jpg", shotH: 900, ink: COLORS.violet,
    desc: "A complete HR platform built end to end — attendance, leave and approvals through to payroll, with payslips calculated straight from attendance.",
    points: ["Check-ins, WFH, leave & approval workflows", "Payroll, allowances & downloadable payslips", "Employee directory, org chart & dashboards"],
    tags: ["Angular", "C#", "ASP.NET Web API", "SQL Server"],
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
