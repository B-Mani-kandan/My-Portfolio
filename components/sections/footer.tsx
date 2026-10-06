import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 py-7 font-mono text-[13px] text-faint">
        <span>
          © {new Date().getFullYear()} <span className="font-script text-xl font-bold text-ink">{profile.name}</span>
        </span>
        <span>
          <span className="text-accent">$</span> build passed · 0 errors · 0 warnings
        </span>
        <span>&lt;/EOF&gt; designed &amp; built in Tamil Nadu</span>
      </div>
    </footer>
  );
}
