import { marquee, stats } from "@/lib/data";

export function Stats() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 rounded-2xl border border-line bg-[#0A0D13] px-5 py-[18px]">
            <b className="font-display text-[30px]">{s.value}</b>
            <span className="text-sm text-dim">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line bg-bg-2 py-[22px]">
      <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-[28px] font-bold text-[#2E3747]">
        {items.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-12">
            {m}
            <span className="text-lg text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
