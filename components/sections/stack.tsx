import { SkillSphere } from "@/components/three/skill-sphere";
import { skillCategories, sphereSkills } from "@/lib/data";

export function Stack() {
  return (
    <section id="skills" className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-[120px]">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[13px] text-accent">03 / stack</span>
          <h2 className="font-display text-[clamp(36px,4.4vw,56px)] font-bold tracking-[-0.02em]">Tools I build with</h2>
        </div>
        <div className="flex flex-wrap items-stretch gap-8">
          <div className="min-w-0 flex-[1_1_460px]">
            <SkillSphere skills={sphereSkills} />
          </div>
          <div className="grid min-w-0 flex-[1_1_440px] grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
            {skillCategories.map((c) => (
              <div key={c.title} className="cat relative flex flex-col gap-4 overflow-hidden rounded-[20px] border border-line-2 bg-card p-6">
                <span className="absolute -right-5 -top-5 h-[110px] w-[110px] rounded-full border border-dashed opacity-35" style={{ borderColor: c.color }} />
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border font-mono text-[15px] font-semibold"
                    style={{ borderColor: c.color, color: c.color }}
                  >
                    {c.glyph}
                  </span>
                  <span className="font-mono text-xs text-faint">{String(c.items.length).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[22px] font-bold">{c.title}</h3>
                  <span className="text-sm text-dim">{c.note}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.items.map((it) => (
                    <span key={it} className="rounded-lg border border-[#222A38] px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-ink">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
