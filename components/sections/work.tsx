import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { LazyLogisticsGlobe } from "@/components/three/lazy";
import { enterprise, liveSites, moreProjects, profile, type EnterpriseApp, type LiveSite, type Shot } from "@/lib/data";

export function Work() {
  return (
    <section id="work" className="border-t border-line bg-bg-2">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 pb-[60px] pt-[120px]">
        <span className="font-mono text-[13px] text-accent">04 / selected work</span>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[clamp(36px,4.4vw,56px)] font-bold tracking-[-0.02em]">Things I&apos;ve built</h2>
            <p className="max-w-[560px] text-[15px] leading-relaxed text-dim">
              Real screenshots of real, running work. Hover a window to scroll through the page — click it to open the live site in a new tab.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <a href="#live" className="inline-flex min-h-10 items-center rounded-full bg-accent px-3.5 font-semibold text-bg">Live websites · {liveSites.length}</a>
            <a href="#enterprise" className="inline-flex min-h-10 items-center rounded-full border border-line-3 px-3.5 text-muted transition hover:border-accent hover:text-ink">Enterprise · {enterprise.length}</a>
            <a href="#more" className="inline-flex min-h-10 items-center rounded-full border border-line-3 px-3.5 text-muted transition hover:border-accent hover:text-ink">More · {moreProjects.length}</a>
          </div>
        </div>
      </div>

      {/* live websites */}
      <div id="live" className="mx-auto flex max-w-[1240px] flex-col gap-[90px] px-6 pb-10 pt-5">
        {liveSites.map((s) => (
          <LiveSiteRow key={s.domain} site={s} />
        ))}
      </div>

      {/* logistics globe band */}
      <div className="mx-auto max-w-[1240px] px-6 py-[60px]">
        <div className="flex flex-wrap overflow-hidden rounded-[28px] border border-line-2 bg-bg">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col justify-center gap-[22px] px-11 py-[52px]">
            <span className="font-mono text-xs text-orange">{"// specialty"}</span>
            <h3 className="font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
              Logistics is my
              <br />
              home turf.
            </h3>
            <p className="text-base leading-[1.65] text-muted">
              From internal freight-forwarding systems — shipment booking, container tracking, billing — to the public websites forwarders use to win
              customers, most of my work keeps cargo moving.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["4", "logistics products"],
                ["5+", "ops modules built"],
                ["24/7", "in daily use"],
              ].map(([v, l]) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <b className="font-display text-[30px]">{v}</b>
                  <span className="text-[13px] text-dim">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[480px] min-w-0 flex-[1_1_460px]">
            <LazyLogisticsGlobe className="absolute inset-0" />
            <span className="absolute bottom-[18px] right-[22px] font-mono text-[11px] text-faint">routes from Chennai ⟶ the world</span>
          </div>
        </div>
      </div>

      {/* enterprise */}
      <div id="enterprise" className="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pb-10 pt-[60px]">
        <h3 className="font-display text-[28px] font-bold">
          Enterprise systems <span className="text-lg font-semibold text-faint">@ Invoking Systems</span>
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-6">
          {enterprise.map((p) => (
            <EnterpriseCard key={p.title} app={p} />
          ))}
        </div>
      </div>

      {/* more */}
      <div id="more" className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 pb-[120px] pt-10">
        <h3 className="font-display text-[28px] font-bold">More projects</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {moreProjects.map((m) => (
            <a
              key={m.title}
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3.5 rounded-[18px] border border-line-2 bg-card p-[22px] transition hover:border-[#2E3A4E] hover:bg-card-2"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl font-display text-[17px] font-extrabold" style={{ background: m.tint, color: m.ink }}>
                  {m.initial}
                </span>
                <span className="font-mono text-[11px] text-faint">{m.kind}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <b className="font-display text-xl">{m.title}</b>
                <span className="text-sm leading-[1.55] text-dim">{m.desc}</span>
              </div>
              <span className="font-mono text-xs text-muted">{m.tags}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Seconds the hover-scroll takes to travel the whole page — longer pages scroll for longer. */
function scrollDuration(shotH: number) {
  return Math.min(8, Math.max(2, (shotH - 900) / 600));
}

/**
 * A browser window showing a real full-page screenshot. The top of the page shows at rest;
 * hovering the surrounding `.shot` link scrolls smoothly through the whole page.
 */
function BrowserShot({ shot, domain, name, color }: { shot: Shot; domain: string; name: string; color: string }) {
  const scrolls = shot.shotH > 900;
  return (
    <div className="overflow-hidden rounded-2xl border border-line-3 bg-card-2">
      <div className="flex items-center gap-3 border-b border-line-2 bg-card px-3.5 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC46B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6BDB8F]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#131822] px-3 py-1.5 font-mono text-xs text-dim">
          <Lock size={12} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{domain}</span>
        </div>
        <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-faint transition group-hover:text-accent" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        <div
          className="shot-track absolute inset-x-0"
          style={{ "--dur": `${scrollDuration(shot.shotH)}s`, "--shift": `${(-(shot.shotH - 900) / shot.shotH) * 100}%` } as CSSProperties}
        >
          <Image
            src={shot.image}
            alt={`${name} — website screenshot`}
            width={1440}
            height={shot.shotH}
            sizes="(max-width: 768px) 100vw, 680px"
            className="block h-auto w-full"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span
          className="pointer-events-none absolute bottom-4 right-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold text-[#07090d] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ background: color }}
        >
          Open site <ArrowUpRight size={14} aria-hidden="true" />
        </span>
        {scrolls && (
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 font-mono text-[11px] text-white/90 opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
            scrolling full page…
          </span>
        )}
      </div>
    </div>
  );
}

function LiveSiteRow({ site: s }: { site: LiveSite }) {
  return (
    <article className={`site-row flex flex-wrap items-center gap-12 ${s.reverse ? "flex-row-reverse" : ""}`}>
      <div className="min-w-0 flex-[1_1_560px] [perspective:1600px]">
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${s.name} (${s.domain}) in a new tab`}
          data-scrolls={s.shotH > 900 || undefined}
          className="shot browser3d group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ transform: `perspective(1600px) rotateX(6deg) rotateY(${s.reverse ? 14 : -14}deg)`, "--glow": s.color } as CSSProperties}
        >
          <BrowserShot shot={s} domain={s.domain} name={s.name} color={s.color} />
        </a>
      </div>

      <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-[18px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent px-2.5 py-[5px] font-mono text-xs text-accent">
            <span className="dot h-1.5 w-1.5 rounded-full bg-accent" />
            live
          </span>
          <span className="font-mono text-xs text-faint">
            {s.num} · {s.kind}
          </span>
        </div>
        <h3 className="font-display text-[clamp(32px,3.6vw,46px)] font-extrabold leading-none tracking-[-0.02em]">{s.name}</h3>
        <p className="text-[17px] leading-[1.65] text-muted">{s.desc}</p>
        <ul className="flex flex-col gap-2">
          {s.points.map((pt) => (
            <li key={pt} className="flex gap-2.5 text-[15px] text-ink-2">
              <span style={{ color: s.color }}>✓</span>
              {pt}
            </li>
          ))}
        </ul>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex min-h-[50px] items-center gap-2 self-start rounded-full bg-accent px-6 text-[15px] font-bold text-bg transition hover:brightness-110"
        >
          Visit live site <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function EnterpriseCard({ app: p }: { app: EnterpriseApp }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${p.product} ${p.title} (${p.domain}) in a new tab`}
      data-scrolls={p.shotH > 900 || undefined}
      className="shot lift group flex flex-col overflow-hidden rounded-[22px] border border-line-2 bg-card outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{ "--glow": p.ink } as CSSProperties}
    >
      <div className="border-b border-line-2 p-4 sm:p-5" style={{ background: `radial-gradient(120% 90% at 50% 0%, ${p.ink}2e, transparent 70%)` }}>
        <BrowserShot shot={p} domain={p.domain} name={p.product} color={p.ink} />
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-[26px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[5px] font-mono text-xs" style={{ borderColor: p.ink, color: p.ink }}>
            <span className={`h-1.5 w-1.5 rounded-full ${p.statusDone ? "" : "animate-pulse"}`} style={{ background: p.ink }} />
            {p.status}
          </span>
          <span className="font-mono text-xs text-faint">{p.year}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[.14em]" style={{ color: p.ink }}>
            {p.product}
          </span>
          <h4 className="font-display text-[28px] font-bold leading-tight">{p.title}</h4>
        </div>
        <p className="text-[15px] leading-relaxed text-muted">{p.desc}</p>
        <ul className="flex flex-col gap-1.5">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-2.5 text-[14px] text-ink-2">
              <span style={{ color: p.ink }}>✓</span>
              {pt}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-[#222A38] px-2.5 py-1.5 font-mono text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5" style={{ color: p.ink }}>
            Open app <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  );
}
