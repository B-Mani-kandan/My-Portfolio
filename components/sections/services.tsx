"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { services } from "@/lib/data";

/**
 * What I do — the left column sticks while the services scroll past on the right.
 * The big number rolls to the service in the middle of the screen, and the list
 * under it marks which one you're reading.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    // the active service is the last one whose top has passed the middle of the screen
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let idx = 0;
      blockRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = services[active];

  return (
    <section id="services" className="relative border-t border-line bg-bg-2 font-hero">
      <div className="mx-auto max-w-[1280px] px-6 pt-[120px]">
        <Eyebrow num="02" label="What I do" />
        <h2 className="mt-7 max-w-[1000px] text-[clamp(40px,6.4vw,92px)] font-bold leading-[0.98] tracking-[-0.045em]">
          Four ways I turn ideas into working software.
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-x-16 px-6 pb-[120px] pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* left: sticky number + index */}
        <div className="hidden md:block">
          <div className="sticky top-[96px] flex h-[calc(100svh_-_140px)] max-h-[760px] flex-col justify-between">
            <div
              className="h-[clamp(160px,17vw,250px)] overflow-hidden text-[clamp(160px,17vw,250px)] font-extrabold leading-none tracking-[-0.06em]"
              aria-hidden="true"
            >
              <div
                className="transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)]"
                // the reel holds every number, so one step is 1/n of its height
                style={{ transform: `translateY(-${(active * 100) / services.length}%)` }}
              >
                {services.map((s) => (
                  <div key={s.num} className="h-[clamp(160px,17vw,250px)]" style={{ color: s.color }}>
                    {s.num}
                  </div>
                ))}
              </div>
            </div>

            <ul className="flex flex-col gap-4">
              {services.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.num}>
                    <a
                      href={`#service-${s.num}`}
                      className={`group flex items-center gap-5 text-[clamp(17px,1.5vw,21px)] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                        on ? "text-ink" : "text-faint hover:text-muted"
                      }`}
                    >
                      <span
                        className="h-px transition-all duration-500"
                        style={{ width: on ? 56 : 24, background: on ? s.color : "var(--color-line-3)" }}
                      />
                      {s.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* right: the services */}
        <div>
          {services.map((s, i) => (
            <article
              key={s.num}
              id={`service-${s.num}`}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              className="flex min-h-[78svh] flex-col justify-center border-t border-line-2 py-16 first:border-t-0 md:first:pt-6"
            >
              <span className="mb-4 text-[88px] font-extrabold leading-none tracking-[-0.06em] md:hidden" style={{ color: s.color }}>
                {s.num}
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <h3 className="text-[clamp(30px,3.4vw,48px)] font-bold leading-[1.05] tracking-[-0.035em]">{s.title}</h3>
                <span
                  className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: s.color, borderColor: `color-mix(in srgb, ${s.color} 45%, transparent)` }}
                >
                  {s.badge}
                </span>
              </div>
              <p className="mt-6 max-w-[620px] text-[clamp(17px,1.45vw,20px)] leading-[1.65] text-ink-2">{s.lead}</p>

              <span className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-faint">What I build</span>
              <ul className="mt-5 flex flex-col gap-4">
                {s.builds.map((b, j) => (
                  <li key={b} className="flex items-center gap-4 text-[clamp(16px,1.3vw,19px)] text-ink">
                    <span className="h-px w-5 shrink-0" style={{ background: j === 1 ? s.color : "var(--color-line-3)" }} />
                    {b}
                  </li>
                ))}
              </ul>

              <details className="group mt-12 border-y border-line-2">
                <summary className="flex min-h-[72px] list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  The technical detail
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-3 text-muted transition-transform duration-300 group-open:rotate-45">
                    <Plus size={18} />
                  </span>
                </summary>
                <div className="pb-7">
                  <p className="max-w-[600px] text-[15px] leading-[1.7] text-dim">{s.detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tech.map((t) => (
                      <span key={t} className="rounded-md border border-line-2 bg-card px-2.5 py-1 font-mono text-xs text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            </article>
          ))}

          <a href="#contact" className="group mt-4 inline-flex items-center gap-4 text-lg font-semibold">
            See how I can help
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--c)] transition-colors duration-300 group-hover:bg-[var(--c)] group-hover:text-bg"
              style={{ "--c": current.color } as React.CSSProperties}
            >
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.18em]">
      <span className="text-accent">{num}</span>
      <span className="h-px w-10 bg-line-3" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
