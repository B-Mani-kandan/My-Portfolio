"use client";

import { ArrowRight, Briefcase, Download, GraduationCap, MapPin } from "lucide-react";
import { IDCardLanyard } from "@/components/ui/id-card-lanyard";
import { Eyebrow } from "@/components/sections/services";
import { Highlighted, Reveal, useInView } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-14 px-6 pb-[120px]">
        {/* lanyard lives in its own positioned stage so it hangs inside the section */}
        <div className="relative mx-auto h-[720px] w-full max-w-[360px] flex-[0_1_360px]">
          <IDCardLanyard
            contained
            anchorX="50%"
            anchorY={6}
            ropeLength={150}
            zIndex={5}
            name={profile.name}
            role={profile.shortRole}
            brand="MANIKANDAN"
            brandTagline="Full-Stack Dev"
            pillars={["Build", "Ship", "Scale"]}
            location="Tamil Nadu, IN"
            idNumber="MB-2024"
            validThru="12/2029"
            extraRowLabel="Stack"
            extraRowValue=".NET · Angular"
            site={profile.githubHandle}
            photoUrl="/me.png"
            githubUrl={profile.github}
            linkedinUrl={profile.linkedin}
          />
        </div>

        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7 pt-[110px]">
          <Eyebrow num="01" label="About me" />
          <Headline />

          <Reveal delay={150}>
            <p className="text-[clamp(20px,1.75vw,25px)] font-medium leading-[1.55] tracking-[-0.01em] text-ink">
              <Highlighted text={profile.aboutLead} />
            </p>
          </Reveal>
          {profile.aboutBody.map((para, i) => (
            <Reveal key={i} delay={250 + i * 120}>
              <p className="text-[17px] leading-[1.8] text-muted">
                <Highlighted text={para} />
              </p>
            </Reveal>
          ))}

          {/* quick facts */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
            <Fact delay={0} icon={<Briefcase size={17} />} label="Currently">
              <b className="text-[16px]">{profile.currently.role}</b>
              <span className="text-sm text-dim">
                {profile.currently.company} · since {profile.currently.since}
              </span>
            </Fact>
            <Fact delay={120} icon={<GraduationCap size={18} />} label="Education">
              <b className="text-[16px]">{profile.education.degree}</b>
              <span className="text-sm text-dim">CGPA {profile.education.cgpa}</span>
            </Fact>
            <Fact delay={240} icon={<MapPin size={17} />} label="Based in">
              <b className="text-[16px]">{profile.location}</b>
              <span className="text-sm text-dim">Open to remote &amp; on-site</span>
            </Fact>
          </div>

          <Reveal delay={100}>
            <EditorCard />
          </Reveal>

          <Reveal delay={150} className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-accent px-6 text-[15px] font-bold text-bg transition hover:brightness-110"
            >
              Let&apos;s work together
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line-3 px-6 text-[15px] font-semibold text-ink-2 transition hover:border-accent hover:text-accent"
            >
              <Download size={16} /> Download résumé
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The heading rises in word by word; "playground" gets the accent gradient. */
function Headline() {
  const [ref, inView] = useInView<HTMLHeadingElement>(0.4);
  const lines = [
    ["Code", "is", "my", "craft."],
    ["Problems", "are", "my", "playground."],
  ];
  let n = 0;
  return (
    <h2 ref={ref} className="font-display text-[clamp(36px,4.4vw,56px)] font-bold leading-[1.08] tracking-[-0.02em]">
      {lines.map((words, li) => (
        <span key={li} className="block">
          {words.map((w) => {
            const i = n++;
            const accent = w === "playground.";
            return (
              <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
                <span
                  className={`inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                    accent ? "bg-[linear-gradient(90deg,var(--color-accent),var(--color-violet))] bg-clip-text text-transparent" : ""
                  }`}
                  style={{ transform: inView ? "translateY(0)" : "translateY(110%)", transitionDelay: `${i * 70}ms` }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function Fact({ icon, label, delay, children }: { icon: React.ReactNode; label: string; delay: number; children: React.ReactNode }) {
  return (
    <Reveal delay={delay}>
      <div className="tilt flex h-full flex-col gap-2 rounded-2xl border border-line-2 bg-card p-[22px]">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-faint">
          <span className="text-accent">{icon}</span>
          {label}
        </span>
        {children}
      </div>
    </Reveal>
  );
}

function EditorCard() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const kw = "text-[#B9A6FF]";
  const ty = "text-[#7CD8F5]";
  const st = "text-accent";
  const code: React.ReactNode[] = [
    <><span className={kw}>public sealed class</span> <span className={ty}>Developer</span></>,
    <>{"{"}</>,
    <>    <span className={kw}>public string</span> Name    =&gt; <span className={st}>&quot;{profile.name}&quot;</span>;</>,
    <>    <span className={kw}>public string</span> Role    =&gt; <span className={st}>&quot;Full-Stack Developer&quot;</span>;</>,
    <>    <span className={kw}>public int</span>    Years   =&gt; <span className="text-orange">2</span>;</>,
    <>    <span className={kw}>public</span> <span className={ty}>string</span>[] Stack =&gt; [<span className={st}>&quot;C#&quot;</span>, <span className={st}>&quot;.NET&quot;</span>, <span className={st}>&quot;Angular&quot;</span>, <span className={st}>&quot;React&quot;</span>];</>,
    <> </>,
    <>    <span className="text-faint">{"// coffee in, scalable software out"}</span></>,
    <>    <span className={kw}>public</span> <span className={ty}>Task</span>&lt;<span className={ty}>Product</span>&gt; <span className="text-[#FFC46B]">ShipAsync</span>(<span className={ty}>Idea</span> idea)</>,
    <>        =&gt; Build(idea).Test().Deploy();</>,
    <>{"}"}<span className="caret text-accent">▍</span></>,
  ];
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-line-2 bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
      <div className="flex items-stretch border-b border-line-2 bg-bg-2 font-mono text-xs">
        <span className="flex items-center gap-1.5 px-3.5">
          <i className="h-[9px] w-[9px] rounded-full bg-[#FF6B6B]" />
          <i className="h-[9px] w-[9px] rounded-full bg-[#FFC46B]" />
          <i className="h-[9px] w-[9px] rounded-full bg-[#6BDB8F]" />
        </span>
        <span className="border-x border-t-2 border-line-2 border-t-accent bg-card px-3.5 py-2.5 text-ink">Developer.cs</span>
        <span className="px-3.5 py-2.5 text-faint">stack.json</span>
      </div>
      <div className="flex overflow-x-auto py-4 font-mono text-[13px] leading-[1.8]">
        <div className="select-none whitespace-pre px-3.5 text-right text-[#3A4456]">
          {code.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="whitespace-pre pr-4 text-ink-2">
          {/* lines type in one after another once the card is on screen */}
          {code.map((l, i) => (
            <div key={i} className={inView ? "type-line" : "opacity-0"} style={{ animationDelay: `${0.2 + i * 0.18}s` }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
