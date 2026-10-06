import { Lock } from "lucide-react";
import { LogisticsGlobe } from "@/components/three/logistics-globe";
import { enterprise, liveSites, moreProjects, profile, type LiveSite } from "@/lib/data";

export function Work() {
  return (
    <section id="work" className="border-t border-line bg-bg-2">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 pb-[60px] pt-[120px]">
        <span className="font-mono text-[13px] text-accent">04 / selected work</span>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(36px,4.4vw,56px)] font-bold tracking-[-0.02em]">Things I&apos;ve built</h2>
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
                ["3", "logistics products"],
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
            <LogisticsGlobe />
            <span className="absolute bottom-[18px] right-[22px] font-mono text-[11px] text-faint">routes from Chennai ⟶ the world</span>
          </div>
        </div>
      </div>

      {/* enterprise */}
      <div id="enterprise" className="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pb-10 pt-[60px]">
        <h3 className="font-display text-[28px] font-bold">
          Enterprise systems <span className="text-lg font-semibold text-faint">@ Invoking Systems</span>
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-6">
          {enterprise.map((p) => (
            <article key={p.title} className="tilt flex flex-col overflow-hidden rounded-[22px] border border-line-2 bg-card">
              <div className="flex h-[230px] gap-3 border-b border-line-2 p-[22px]" style={{ background: p.bg }}>
                <div className="flex w-[54px] flex-col gap-2.5 rounded-[10px] bg-[rgba(7,9,13,.55)] px-2.5 py-3">
                  <span className="h-1.5 rounded" style={{ background: p.ink }} />
                  <span className="h-1.5 rounded bg-line-3" />
                  <span className="h-1.5 rounded bg-line-3" />
                  <span className="h-1.5 rounded bg-line-3" />
                </div>
                <div className="flex flex-1 flex-col gap-2.5">
                  <div className="grid grid-cols-3 gap-2.5">
                    {p.kpis.map((k) => (
                      <div key={k.l} className="flex flex-col gap-1 rounded-[10px] bg-[rgba(7,9,13,.6)] px-3 py-2.5">
                        <span className="text-[10px] text-dim">{k.l}</span>
                        <b className="font-display text-lg" style={{ color: p.ink }}>
                          {k.v}
                        </b>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-1 items-end gap-1.5 rounded-[10px] bg-[rgba(7,9,13,.6)] p-3">
                    {p.chart.map((h, i) => (
                      <span key={i} className="flex-1 rounded-t-[3px] opacity-75" style={{ height: `${h}%`, background: p.ink }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-[26px]">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-2xl font-bold">{p.title}</h4>
                  <span className="whitespace-nowrap font-mono text-xs text-faint">{p.year}</span>
                </div>
                <p className="text-[15px] leading-relaxed text-muted">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-[#222A38] px-2.5 py-1.5 font-mono text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
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

function LiveSiteRow({ site: s }: { site: LiveSite }) {
  const m = s.mock;
  return (
    <article className={`site-row flex flex-wrap items-center gap-12 ${s.reverse ? "flex-row-reverse" : ""}`}>
      <div className="min-w-0 flex-[1_1_560px] [perspective:1600px]">
        <div
          className="browser3d overflow-hidden rounded-2xl border border-line-3 bg-card-2 shadow-[0_50px_100px_-30px_rgba(0,0,0,.85)]"
          style={{ transform: `perspective(1600px) rotateX(6deg) rotateY(${s.reverse ? 14 : -14}deg)` }}
        >
          <div className="flex items-center gap-3 border-b border-line-2 bg-card px-3.5 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFC46B]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6BDB8F]" />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#131822] px-3 py-1.5 font-mono text-xs text-dim">
              <Lock size={12} aria-hidden="true" /> {s.domain}
            </div>
          </div>
          <div className="relative flex h-[360px] flex-col overflow-hidden" style={{ background: m.bg }}>
            <div className="flex items-center justify-between px-[26px] py-[18px]">
              <span className="font-card text-[15px] font-extrabold tracking-[.04em]" style={{ color: m.logo }}>
                {m.logoText}
              </span>
              <div className="hidden items-center gap-4 sm:flex">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-10 rounded" style={{ background: m.line }} />
                ))}
                <span className="rounded-md px-3.5 py-[7px] text-[11px] font-bold" style={{ background: m.cta, color: m.ctaInk }}>
                  Get a quote
                </span>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-5 px-[26px] pb-[26px] pt-2.5">
              <div className="flex flex-[1_1_55%] flex-col gap-3.5">
                <span className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: m.cta }}>
                  {m.eyebrow}
                </span>
                <span className="font-display text-[30px] font-extrabold leading-[1.05]" style={{ color: m.ink }}>
                  {m.headline}
                </span>
                <span className="h-[7px] w-[85%] rounded" style={{ background: m.line }} />
                <span className="h-[7px] w-[65%] rounded" style={{ background: m.line }} />
                <div className="mt-1 flex flex-wrap gap-2">
                  {m.pills.map((pl, i) => (
                    <span key={i} className="rounded-full border px-2.5 py-1.5 text-[10px] font-bold" style={{ borderColor: m.line, color: m.ink }}>
                      {pl}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-full flex-[1_1_45%] [perspective:600px]">
                <div className="absolute inset-2.5 grid grid-cols-3 content-end gap-1.5 [transform:rotateX(18deg)_rotateY(-22deg)]">
                  {m.blocks.map((b, i) => (
                    <span key={i} className="h-[34px] rounded shadow-[inset_0_-6px_0_rgba(0,0,0,.18)]" style={{ background: b }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <span className="text-accent">✓</span>
              {pt}
            </li>
          ))}
        </ul>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex min-h-[50px] items-center gap-2.5 self-start rounded-full bg-accent px-6 text-[15px] font-bold text-bg transition hover:brightness-110"
        >
          Visit live site ↗
        </a>
      </div>
    </article>
  );
}
