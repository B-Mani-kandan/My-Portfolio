"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/lib/data";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Stack" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#experience", label: "Experience" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // transparent over the hero video; solid bar once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-3.5">
        <a href="#top" className="flex min-h-11 items-center gap-2.5">
          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border-[1.5px] border-accent font-mono text-[13px] font-semibold text-accent">
            MB
          </span>
          <span className="font-script text-[26px] font-bold leading-none text-white">{profile.name}</span>
        </a>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`transition ${solid ? "text-muted hover:text-ink" : "text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,.45)] hover:text-white"}`}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 font-bold text-bg transition hover:brightness-110">
            Hire me
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-3 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line px-6 pb-5 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-muted">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-5 font-bold text-bg">
            Hire me
          </a>
        </div>
      )}
    </header>
  );
}
