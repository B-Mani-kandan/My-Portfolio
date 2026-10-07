"use client";

import { useState } from "react";
import { Check, Loader2, Mail, Phone, Send } from "lucide-react";
import { WaveField } from "@/components/three/wave-field";
import { contactTopics, profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

// Web3Forms access key — public by design: it can only deliver messages to your own inbox.
const WEB3FORMS_KEY = "d4348448-5612-407e-a3ba-08d929876e1a";

const field =
  "min-h-12 rounded-xl border border-[#222A38] bg-card-2 px-4 py-3.5 text-[15px] font-medium text-ink outline-none transition placeholder:text-faint focus:border-accent focus:bg-[#0F141D]";

export function Contact() {
  const [topic, setTopic] = useState(contactTopics[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    data.append("access_key", WEB3FORMS_KEY);
    data.append("topic", topic);
    data.append("subject", `Portfolio: ${topic} — ${name}`);
    data.append("from_name", "Manikandan B Portfolio");
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-bg-2">
      <WaveField className="pointer-events-none absolute inset-x-0 bottom-0 block h-[420px] w-full opacity-90" />

      <div className="relative z-10 mx-auto flex max-w-[1240px] flex-wrap gap-14 px-6 pb-40 pt-[120px]">
        {/* left: info */}
        <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-6">
          <span className="font-mono text-[13px] text-accent">07 / contact</span>
          <h2 className="font-display text-[clamp(40px,4.6vw,68px)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            Let&apos;s build
            <br />
            something great.
          </h2>
          <p className="max-w-[460px] text-lg leading-relaxed text-muted">
            Need a website for your business, a developer for your team, or help with an ASP.NET / Angular project? Drop a message — I usually reply within a day.
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <a href={`mailto:${profile.email}`} className="flex min-h-11 items-center gap-3.5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#222A38] text-accent">
                <Mail size={18} />
              </span>
              <span className="flex flex-col">
                <small className="text-xs text-faint">Email</small>
                <span className="font-semibold">{profile.email}</span>
              </span>
            </a>
            <a href={profile.phoneHref} className="flex min-h-11 items-center gap-3.5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#222A38] text-accent">
                <Phone size={18} />
              </span>
              <span className="flex flex-col">
                <small className="text-xs text-faint">Phone</small>
                <span className="font-semibold">{profile.phone}</span>
              </span>
            </a>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Social href={profile.github} label="GitHub" icon={<GithubIcon />} />
            <Social href={profile.linkedin} label="LinkedIn" icon={<LinkedinIcon />} />
            <Social href={profile.resume} label="Résumé PDF" />
          </div>

          <div className="overflow-hidden rounded-[14px] border border-line-2 bg-card">
            <div className="flex justify-between border-b border-line-2 px-3.5 py-2.5 font-mono text-[11px] text-faint">
              <span>request preview</span>
              <span className="text-accent">live</span>
            </div>
            <pre className="m-0 overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.8] text-ink-2">
              <span className="text-orange">POST</span> api.web3forms.com/submit{"\n"}
              {"{\n"}
              {"  "}<span className="text-[#7CD8F5]">&quot;to&quot;</span>: <span className="text-accent">&quot;{profile.email}&quot;</span>,{"\n"}
              {"  "}<span className="text-[#7CD8F5]">&quot;topic&quot;</span>: <span className="text-accent">&quot;{topic}&quot;</span>,{"\n"}
              {"  "}<span className="text-[#7CD8F5]">&quot;replyWithin&quot;</span>: <span className="text-accent">&quot;24h&quot;</span>{"\n"}
              {"}"}
            </pre>
          </div>
        </div>

        {/* right: form */}
        <div className="min-w-0 flex-[1_1_460px]">
          <div className="rounded-[22px] border border-line-2 bg-[rgba(11,14,20,.92)] p-8 backdrop-blur">
            {status === "sent" ? (
              <div className="flex flex-col items-center gap-4 px-3 py-16 text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-bg">
                  <Check size={28} strokeWidth={3} />
                </span>
                <h3 className="font-display text-[28px] font-bold">Message sent!</h3>
                <p className="text-base text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 min-h-11 rounded-full border border-line-3 px-[22px] text-sm font-semibold text-ink-2 transition hover:border-accent"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-[18px]" noValidate={false}>
                <h3 className="mb-1 font-display text-[26px] font-bold">Send a message</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                  <label className="flex flex-col gap-2 text-[13px] font-semibold text-muted">
                    Your name
                    <input name="name" required maxLength={100} placeholder="Jane Doe" className={field} autoComplete="name" />
                  </label>
                  <label className="flex flex-col gap-2 text-[13px] font-semibold text-muted">
                    Email
                    <input type="email" name="email" required maxLength={200} placeholder="jane@company.com" className={field} autoComplete="email" />
                  </label>
                </div>

                {/* honeypot: hidden from people, bots tick it — Web3Forms drops those */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <fieldset className="flex flex-col gap-2.5">
                  <legend className="mb-2 text-[13px] font-semibold text-muted">I&apos;m reaching out about</legend>
                  <div className="flex flex-wrap gap-2">
                    {contactTopics.map((t) => {
                      const on = t === topic;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setTopic(t)}
                          className={`min-h-11 rounded-full border px-4 text-[13px] font-semibold transition ${
                            on ? "border-accent bg-accent text-bg" : "border-line-3 text-ink-2 hover:border-accent"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="flex flex-col gap-2 text-[13px] font-semibold text-muted">
                  Message
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    placeholder="Tell me a bit about the project or role…"
                    className={`${field} resize-y`}
                  />
                </label>

                {status === "error" && (
                  <p role="alert" className="rounded-xl border border-[#5c2a2a] bg-[#1d1012] px-4 py-3 text-sm text-[#ffb4b4]">
                    {error} You can also email me directly at{" "}
                    <a className="underline" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-accent px-6 text-base font-bold text-bg transition hover:brightness-110 disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      Sending… <Loader2 size={18} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Social({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-3 px-[18px] text-sm font-semibold text-ink-2 transition hover:border-accent hover:text-accent"
    >
      {icon}
      {label}
    </a>
  );
}

export function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
