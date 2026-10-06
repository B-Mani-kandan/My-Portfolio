"use client";

import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      // desktop: fills the whole screen, nav floats on top. phone: video on top, text flows below.
      className="relative overflow-hidden bg-hero font-hero text-white md:h-svh md:min-h-[680px]"
    >
      {/* full-bleed character scene */}
      <div className="pointer-events-none relative h-[62svh] w-full md:absolute md:inset-0 md:h-full">
        <video
          className="h-full w-full object-cover object-[62%_32%]"
          src="/hero/Portfolio_Video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Manikandan at his laptop in a park"
        />
        {/* shade the edges so the text stays readable */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-hero)_0%,transparent_45%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(11,20,17,.75)_0%,rgba(11,20,17,.35)_35%,transparent_60%)] md:block" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(11,20,17,.7),transparent)]" />
      </div>

      {/* top corners */}
      <div className="absolute inset-x-[clamp(20px,5vw,72px)] top-[88px] z-10 flex flex-wrap items-center justify-between gap-3 text-[13px] font-medium text-white/70">
        <span className="inline-flex items-center gap-2">
          <span className="dot h-[7px] w-[7px] rounded-full bg-accent" />
          Available for freelance &amp; full-time
        </span>
        <span>Based in {profile.location}</span>
      </div>

      {/* bottom: name block + code card */}
      <div className="relative z-10 -mt-24 flex flex-wrap items-end justify-between gap-x-12 gap-y-7 px-5 pb-12 md:absolute md:inset-x-[clamp(20px,5vw,72px)] md:bottom-[clamp(32px,6vh,64px)] md:mt-0 md:px-0 md:pb-0">
        <div className="flex min-w-0 max-w-[720px] flex-col gap-2.5">
          <span className="text-[clamp(16px,1.4vw,19px)] font-medium text-white/75 [text-shadow:0_1px_12px_rgba(0,0,0,.5)]">Hey there, I&apos;m</span>
          <h1 className="m-0 whitespace-nowrap font-script text-[clamp(56px,9vw,136px)] font-bold leading-[0.85] tracking-[-0.01em]">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-[clamp(17px,1.6vw,22px)] font-bold tracking-[-0.01em]">{profile.role}</p>
          <p className="max-w-[470px] text-[clamp(14px,1.15vw,16px)] leading-relaxed text-white/65">{profile.heroIntro}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex min-h-12 items-center rounded-full bg-white px-[26px] text-[15px] font-bold text-[#0B1411] transition hover:bg-white/90"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center rounded-full border border-white/30 bg-white/[.08] px-[26px] text-[15px] font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <CodeCard />
      </div>
    </section>
  );
}

function CodeCard() {
  const s = { str: "text-accent", num: "text-orange", kw: "text-[#B9A6FF]", cmt: "text-white/40" };
  const lines: React.ReactNode[] = [
    <><span className={s.kw}>const</span> developer = {"{"}</>,
    <>  name: <span className={s.str}>&quot;{profile.name}&quot;</span>,</>,
    <>  stack: [<span className={s.str}>&quot;C#&quot;</span>, <span className={s.str}>&quot;.NET&quot;</span>, <span className={s.str}>&quot;Angular&quot;</span>, <span className={s.str}>&quot;React&quot;</span>],</>,
    <>  experience: <span className={s.num}>&quot;2+ years&quot;</span>,</>,
    <>  shipped: <span className={s.num}>9</span>, <span className={s.cmt}>{"// 3 live sites"}</span></>,
    <>  status: <span className={s.str}>&quot;open to work&quot;</span><span className="caret text-accent">▍</span></>,
    <>{"};"}</>,
  ];
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/12 bg-[rgba(8,14,12,.72)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3.5 py-2.5">
        <span className="h-[9px] w-[9px] rounded-full bg-[#FF6B6B]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#FFC46B]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#6BDB8F]" />
        <span className="ml-2 font-mono text-[11px] text-white/50">developer.ts</span>
      </div>
      <div className="overflow-x-auto whitespace-pre px-4 pb-4 pt-3.5 font-mono text-[12.5px] leading-[1.8] text-[#D6DCE6]">
        {lines.map((l, i) => (
          <div key={i} className="type-line" style={{ animationDelay: `${0.3 + i * 0.6}s` }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
