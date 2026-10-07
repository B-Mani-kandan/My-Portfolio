"use client";

import { useEffect, useRef, useState } from "react";
import { techCategories, techStack, type TechCategory } from "@/lib/data";
import { Eyebrow } from "@/components/sections/services";
import { TunnelField } from "@/components/three/tunnel-field";

/** Tiles per row on wide screens — a funnel that narrows toward the bottom. */
const STACK_ROWS = [10, 8, 6, 4];

const catColor = Object.fromEntries(techCategories.map((c) => [c.id, c.color])) as Record<TechCategory, string>;

function rows<T>(items: T[]) {
  const out: T[][] = [];
  let i = 0;
  for (const n of STACK_ROWS) {
    out.push(items.slice(i, i + n));
    i += n;
  }
  if (i < items.length) out.push(items.slice(i));
  return out.filter((r) => r.length);
}

export function Stack() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [focus, setFocus] = useState<TechCategory | null>(null);

  // tiles drop in one by one the first time the grid scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tile = (t: (typeof techStack)[number]) => {
    const i = techStack.indexOf(t);
    const color = catColor[t.cat];
    const dim = focus !== null && focus !== t.cat;
    return (
      <li
        key={t.name}
        className="transition-[opacity,translate] duration-700 ease-out"
        style={{
          opacity: shown ? (dim ? 0.18 : 1) : 0,
          translate: shown ? "0 0" : "0 24px",
          transitionDelay: shown && focus === null ? `${i * 35}ms` : "0ms",
        }}
      >
        <div
          className="group flex h-[92px] w-[84px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[.035] backdrop-blur-md transition-[translate,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--c)] hover:bg-white/[.07] hover:shadow-[0_14px_40px_-12px_var(--c)] sm:h-[104px] sm:w-[92px]"
          style={{ "--c": color } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/tech/${t.icon}.svg`}
            alt=""
            width={38}
            height={38}
            loading="lazy"
            className={`h-[34px] w-[34px] object-contain transition-transform duration-300 group-hover:scale-110 sm:h-[38px] sm:w-[38px] ${t.invert ? "invert" : ""}`}
          />
          <span className="px-1 text-center text-[11.5px] font-medium leading-tight text-ink-2">{t.name}</span>
        </div>
      </li>
    );
  };

  return (
    <section id="skills" className="relative overflow-hidden border-t border-line bg-[#050409] font-hero">
      <TunnelBackdrop />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center px-6 py-[120px]">
        <Eyebrow num="03" label="What I work with" />
        <h2 className="mt-6 bg-[linear-gradient(180deg,#f2f5fa_10%,#b9a6ff_120%)] bg-clip-text text-center text-[clamp(52px,9vw,128px)] font-medium leading-none tracking-[-0.03em] text-transparent">
          TECH STACK
        </h2>

        {/* category legend — hover or tap one to spotlight its tiles */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5" onMouseLeave={() => setFocus(null)}>
          {techCategories.map((c) => {
            const on = focus === c.id;
            const count = techStack.filter((t) => t.cat === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onMouseEnter={() => setFocus(c.id)}
                onFocus={() => setFocus(c.id)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus(on ? null : c.id)}
                className="inline-flex min-h-10 items-center gap-2.5 rounded-full border px-4 text-[13px] font-semibold transition-colors duration-300"
                style={{
                  borderColor: on ? c.color : "rgba(255,255,255,.12)",
                  background: on ? `color-mix(in srgb, ${c.color} 14%, transparent)` : "rgba(255,255,255,.03)",
                  color: on ? c.color : "var(--color-ink-2)",
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                {c.label}
                <span className="font-mono text-[11px] text-faint">{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>

        <div ref={ref} className="mt-14 w-full">
          {/* wide screens: the funnel */}
          <div className="hidden flex-col items-center gap-3.5 xl:flex">
            {rows(techStack).map((r, ri) => (
              <ul key={ri} className="flex justify-center gap-3.5">
                {r.map(tile)}
              </ul>
            ))}
          </div>
          {/* smaller screens: a centred wrap */}
          <ul className="flex flex-wrap justify-center gap-3 xl:hidden">{techStack.map(tile)}</ul>
        </div>
      </div>
    </section>
  );
}

/** Endless purple tunnel with a glass orb flying through it, plus glow and vignette so the tiles stay readable. */
function TunnelBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,#1b0d33_0%,#0c0718_50%,#050409_100%)]">
      <div className="tunnel-glow absolute left-1/2 top-[56%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(138,92,255,.28),rgba(90,50,200,.1)_55%,transparent)] blur-3xl" />
      <TunnelField className="absolute inset-0 block h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_45%,#050409_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(to_bottom,#050409,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,#050409,transparent)]" />
    </div>
  );
}
