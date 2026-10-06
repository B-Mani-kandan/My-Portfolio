import { gitLog, jobs } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-16 px-6 py-[120px]">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <span className="font-mono text-[13px] text-accent">06 / experience</span>
          <h2 className="font-display text-[clamp(36px,4.4vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
            Where I&apos;ve
            <br />
            shipped code
          </h2>
          <div className="mt-4 overflow-x-auto whitespace-nowrap rounded-[14px] border border-line-2 bg-card px-[18px] py-4 font-mono text-xs leading-[1.9] text-muted">
            <div>
              <span className="text-accent">$</span> git log --oneline career
            </div>
            {gitLog.map((c) => (
              <div key={c.hash}>
                <span className="text-[#FFC46B]">{c.hash}</span> {c.head && <span className="text-[#7CD8F5]">(HEAD -&gt; main) </span>}
                {c.msg}
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-[2_1_560px] flex-col">
          {jobs.map((j) => (
            <div key={j.company} className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line-2 py-[30px]">
              <div className="flex flex-[0_0_160px] flex-col gap-2 pt-[5px]">
                <span className="font-mono text-[13px] text-dim">{j.when}</span>
                {j.current && (
                  <span className="self-start rounded-full border border-accent px-[9px] py-1 font-mono text-[11px] text-accent">current</span>
                )}
              </div>
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2.5">
                <h3 className="font-display text-[22px] font-bold">
                  {j.role} <span className="font-semibold text-faint">@ {j.company}</span>
                </h3>
                <ul className="flex list-disc flex-col gap-1 pl-[18px] text-[15px] leading-[1.65] text-muted">
                  {j.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
