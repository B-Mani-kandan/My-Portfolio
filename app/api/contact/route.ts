import { NextResponse } from "next/server";

/**
 * POST /api/contact
 * Sends the contact-form message to your inbox using Resend (https://resend.com).
 *
 * Environment variables (see .env.example):
 *   RESEND_API_KEY     – your Resend API key (required to actually send)
 *   CONTACT_TO_EMAIL   – where messages go (defaults to the profile email)
 *   CONTACT_FROM_EMAIL – verified sender, e.g. "Portfolio <hello@yourdomain.com>".
 *                        Defaults to Resend's test sender, which only delivers to
 *                        the email you signed up to Resend with.
 */

export const runtime = "nodejs";

const TO = process.env.CONTACT_TO_EMAIL || "baskarmanikandan48@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TOPICS = new Set(["Full-time role", "Business website", "Freelance project", "Just saying hi"]);

// tiny in-memory rate limit: 5 messages / 10 minutes per IP (per server instance)
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // honeypot filled → pretend success, drop silently
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topic = TOPICS.has(String(body.topic)) ? String(body.topic) : "General";

  if (!name || name.length > 100) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 10 || message.length > 5000)
    return NextResponse.json({ error: "Your message should be between 10 and 5000 characters." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many messages — please try again in a few minutes." }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set — message not sent:", { name, email, topic });
    return NextResponse.json({ error: "The contact form isn't configured yet." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `Portfolio: ${topic} — ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      html: `<p><b>From:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br><b>Topic:</b> ${escapeHtml(topic)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Couldn't send your message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
