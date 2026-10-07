"use client";

import { useEffect, useRef, useState } from "react";
import { buildSteps } from "@/lib/data";
import { Eyebrow } from "@/components/sections/services";

const LAST = buildSteps.length - 1;

/**
 * How I build products — scroll-driven timeline.
 *
 * Desktop: the section pins while you scroll through it; the line grows from dot
 * to dot and each step lights up and fades in as the line reaches it.
 * Phone: no pinning — the line grows down the side as the steps scroll by.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let target = 0;
    let shown = still ? 1 : 0;

    // where the scroll says the line should be, 0–1
    const measure = () => {
      if (still) return 1;
      const vh = window.innerHeight;
      let p: number;
      if (desktop.matches) {
        // pinned distance: first 8% holds the empty line, last 20% holds the finished one
        const r = section.getBoundingClientRect();
        p = (-r.top / (r.height - vh) - 0.08) / 0.72;
      } else {
        const r = list.getBoundingClientRect();
        p = (vh * 0.7 - r.top) / r.height;
      }
      return Math.min(1, Math.max(0, p));
    };

    // the line eases toward the scroll position, so a fast flick still draws smoothly
    const frame = () => {
      raf = 0;
      shown += (target - shown) * 0.08;
      if (Math.abs(target - shown) < 0.001) shown = target;
      list.style.setProperty("--p", String(shown));
      // a step lights up once the line has reached its dot
      setReached(shown <= 0.002 ? -1 : Math.min(LAST, Math.floor(shown * LAST + 0.02)));
      if (shown !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      target = measure();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-x-clip border-t border-line bg-bg font-hero md:h-[480svh]">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-center px-6 py-[120px] md:sticky md:top-[72px] md:h-[calc(100svh_-_72px)] md:py-0">
        {/* soft accent glow, top right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px]"
        />
        <Eyebrow num="05" label="How I build products" />
        <h2 className="relative mt-7 max-w-[1000px] text-[clamp(40px,min(6.4vw,10svh),92px)] font-bold leading-[0.98] tracking-[-0.045em]">
          A repeatable path from brief to shipped feature.
        </h2>

        <ol
          ref={listRef}
          className="relative mt-[clamp(48px,8svh,88px)] grid gap-12 [--p:0] md:grid-cols-5 md:gap-8"
        >
          {/* track + progress line: down the side on phones, across from first to last dot on desktop */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[6px] top-[6px] w-px bg-line-3 md:bottom-auto md:right-[calc(20%_-_31.6px)] md:h-px md:w-auto"
          >
            <span className="absolute inset-0 origin-top bg-accent shadow-[0_0_12px_rgba(124,245,196,.6)] [scale:1_var(--p)] md:origin-left md:[scale:var(--p)_1]" />
          </span>

          {buildSteps.map((st, i) => {
            const on = i <= reached;
            return (
              <li key={st.num} className="relative pl-10 md:pl-0">
                <span
                  className={`absolute left-0 top-0 h-[13px] w-[13px] rounded-full transition-all duration-500 md:static md:block ${
                    on
                      ? "scale-100 bg-accent shadow-[0_0_0_5px_rgba(124,245,196,.12),0_0_18px_rgba(124,245,196,.55)]"
                      : "scale-75 bg-line-3"
                  }`}
                />
                <div
                  className="transition-[opacity,translate] duration-700 ease-out"
                  style={{ opacity: on ? 1 : 0.12, translate: on ? "0 0" : "0 18px" }}
                >
                  <span className="block font-mono text-[13px] text-faint md:mt-12">{st.num}</span>
                  <h3 className="mt-4 whitespace-nowrap text-[clamp(24px,2.3vw,34px)] font-bold leading-tight tracking-[-0.03em]">
                    {st.title}
                  </h3>
                  <p className="mt-4 max-w-[300px] text-base leading-[1.7] text-dim">{st.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
