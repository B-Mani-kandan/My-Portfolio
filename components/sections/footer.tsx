"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Mail, Phone } from "lucide-react";
import { FooterRobot } from "@/components/three/footer-robot";
import { GithubIcon, LinkedinIcon } from "@/components/sections/contact";
import { Reveal, useInView } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

const MESSAGES = [
  "Thanks for scrolling all the way down 👋",
  "Psst… Mani is open to new work ✨",
  "Build passed · 0 bugs (probably) 😄",
  "Click me — I can fly! 🚀",
];
const HOP_LINES = ["3… 2… 1… liftoff! 🚀", "To the moon! 🌙", "Wheee! I can fly! ✨"];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 overflow-x-clip border-t border-line bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,245,196,.1),transparent)] blur-2xl"
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-x-10 gap-y-6 px-6 py-8 md:grid-cols-[240px_1fr_auto]">
        <RobotCorner />

        {/* middle: a short sign-off */}
        <Reveal delay={100} className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Got an idea?</span>
          <p className="text-[clamp(22px,2.4vw,30px)] font-bold leading-tight tracking-[-0.02em]">
            Let&apos;s build something <span className="font-script text-[1.35em] font-bold text-accent">great</span> together.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink-2 transition hover:text-accent"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {profile.email}
            </span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        {/* right: socials + back to top */}
        <Reveal delay={200} className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex gap-2.5">
            <Icon href={profile.github} label="GitHub">
              <GithubIcon />
            </Icon>
            <Icon href={profile.linkedin} label="LinkedIn">
              <LinkedinIcon />
            </Icon>
            <Icon href={`mailto:${profile.email}`} label="Email">
              <Mail size={17} />
            </Icon>
            <Icon href={profile.phoneHref} label="Phone">
              <Phone size={17} />
            </Icon>
          </div>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "/");
            }}
            className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-line-3 px-4 text-sm font-semibold text-ink-2 transition hover:border-accent hover:text-accent"
          >
            Back to top
            <ArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </Reveal>
      </div>

      {/* bottom line */}
      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 font-mono text-[12.5px] text-faint md:justify-between">
          <span>
            © {year} · Designed &amp; built by{" "}
            <span className="font-script text-[17px] font-bold text-ink">{profile.name}</span>{" "}
            <span className="beat inline-block text-[#ff6b8b]">♥</span>
          </span>
          <BuildLine />
        </div>
      </div>
    </footer>
  );
}

/** The robot, with a speech bubble that types out a new line every few seconds. */
function RobotCorner() {
  const [msg, setMsg] = useState(0);
  const [hopLine, setHopLine] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const text = hopLine ?? MESSAGES[msg];

  useEffect(() => {
    const id = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  // typewriter for whatever the bubble currently says
  useEffect(() => {
    let i = 0;
    setTyped("");
    const chars = Array.from(text);
    const id = setInterval(() => {
      i++;
      setTyped(chars.slice(0, i).join(""));
      if (i >= chars.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [text]);

  const onJump = () => {
    setHopLine(HOP_LINES[Math.floor(Math.random() * HOP_LINES.length)]);
    setTimeout(() => setHopLine(null), 2900);
  };

  return (
    <Reveal className="relative mx-auto -mt-[110px] w-[240px]">
      <div className="pointer-events-none absolute left-1/2 top-[96px] z-10 w-max max-w-[240px] -translate-x-1/2 rounded-xl rounded-bl-sm border border-line-3 bg-card-2 px-3 py-1.5 text-xs font-medium text-ink-2 shadow-[0_10px_24px_-10px_rgba(0,0,0,.8)] md:left-[62%] md:translate-x-0">
        {typed}
        <span className="caret ml-0.5 text-accent">▍</span>
      </div>
      {/* tall canvas: the empty headroom reaches up over the section above, so the robot can fly high */}
      <FooterRobot className="block aspect-[2/3] w-full cursor-pointer" onJump={onJump} />
      {/* same pill as the ID card's "Drag to swing" hint */}
      <div className="pointer-events-none mx-auto -mt-3 flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgba(10,12,16,.72)] px-3.5 py-[7px] font-mono text-[11px] text-[#f3f0e9]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[13px] w-[13px] shrink-0 opacity-75" aria-hidden="true">
          <path d="M9 9V4.5a1.5 1.5 0 0 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2.1L9 16" />
        </svg>
        Click me · I can fly
      </div>
    </Reveal>
  );
}

/** "$ npm run build" that types itself out once the footer is on screen. */
function BuildLine() {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const full = "npm run build ✓ passed · 0 errors · 0 warnings";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setN((v) => (v >= full.length ? v : v + 1)), 40);
    return () => clearInterval(id);
  }, [inView]);
  const shown = full.slice(0, n);
  const cut = shown.indexOf("✓");
  return (
    <span ref={ref}>
      <span className="text-accent">$</span> {cut < 0 ? shown : shown.slice(0, cut)}
      {cut >= 0 && <span className="text-accent">{shown.slice(cut)}</span>}
      <span className="caret text-accent">▍</span>
    </span>
  );
}

function Icon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-3 text-ink-2 transition hover:-translate-y-1 hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}
