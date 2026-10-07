<div align="center">

# Manikandan B — Portfolio

**Full-stack developer · ASP.NET · C# · Angular · React**

I build enterprise web apps, clean APIs and fast business websites — software people actually enjoy using.
This repo is my personal site: a single-page portfolio with a video hero, scroll-driven storytelling and a few 3D surprises.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r169-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

[**Get in touch**](mailto:baskarmanikandan48@gmail.com) · [**LinkedIn**](https://linkedin.com/in/manikandan-33) · [**GitHub**](https://github.com/B-Mani-kandan) · [**Résumé**](public/Manikandan_B_Resume.pdf)

</div>

---

## ✨ Highlights

| | |
| --- | --- |
| 🎬 **Video hero** | Full-screen looping video under a transparent nav that turns solid as you scroll. |
| 🪪 **Swinging ID card** | A physics-simulated lanyard card in the About section — drag it, throw it, click to flip it. It sways gently on its own. |
| 🔢 **Scroll-driven "What I do"** | The section pins while you read; a giant number rolls 01 → 04 as each service reaches the middle of the screen. |
| 🌌 **3D tech-stack tunnel** | 28 tech logos in a funnel layout over a three.js tunnel, with a glass orb that flies toward you and loops seamlessly. |
| 🧭 **Build timeline** | "How I build products" — a timeline line draws itself dot by dot as you scroll, lighting up each step. |
| 🤖 **Footer robot** | A glossy little three.js robot that types on a laptop, follows your cursor, waves, and hops when you click it. |
| 🎯 **Custom cursor** | A dot with four rotating corner brackets that grows over links (mouse devices only). |
| 🔗 **Real section URLs** | `/about`, `/work`, `/contact`… open the page already scrolled to that section, and back/forward work. |
| ✉️ **Working contact form** | Sends straight to my inbox through Web3Forms — no server needed. |
| ♿ **Respects reduced motion** | Every animation calms down or stops for visitors who ask their device for less motion. |

## 🧱 Built with

- **[Next.js 15](https://nextjs.org/)** (App Router, static generation) + **React 19**
- **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com/)** with design tokens in `@theme`
- **[Three.js](https://threejs.org/)** for the tunnel, the robot and the background effects
- **[Lucide](https://lucide.dev/)** icons, **[Devicon](https://devicon.dev/)** tech logos (self-hosted in `public/tech`)
- **Fontsource** self-hosted fonts — Plus Jakarta Sans, Manrope, Syne, Caveat, JetBrains Mono
- **[Web3Forms](https://web3forms.com/)** for the contact form

## 🗺️ What's on the page

| # | Section | What it shows |
| --- | --- | --- |
| — | Hero | Video background, intro and a live `developer.ts` code card |
| 01 | About | Who I am, current role, education, and the swinging ID card |
| 02 | What I do | Four services, with a sticky rolling number |
| 03 | Tech stack | Languages, frontend, backend, databases and tools |
| 04 | Selected work | Live client websites and enterprise systems |
| 05 | Process | How I take a feature from brief to production |
| 06 | Experience | Where I've worked and what I shipped |
| 07 | Contact | Message form, email, phone and socials |

## 🚀 Run it locally

Requires **Node.js 18.18+** (20 or 22 recommended).

```bash
git clone https://github.com/B-Mani-kandan/My-Portfolio.git
cd My-Portfolio
npm install
npm run dev          # → http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

> Stop the dev server before running `npm run build` — both use the `.next` folder.

## ✏️ Make it yours

Almost everything you'd want to change lives in **one file: [`lib/data.ts`](lib/data.ts)**.

| To change… | Edit |
| --- | --- |
| Name, role, intro, about text, links | `profile` in `lib/data.ts` |
| Services ("What I do") | `services` |
| Process steps | `buildSteps` |
| Tech stack tiles & categories | `techStack`, `techCategories` (logos go in `public/tech/`) |
| Projects & live sites | `liveSites`, `enterprise`, `moreProjects` |
| Jobs | `jobs` |
| Nav links / section URLs | `sections` |
| Colours & fonts | `@theme` in [`app/globals.css`](app/globals.css) |
| Hero video | Replace `public/hero/Portfolio_Video.mp4` (H.264 MP4, ideally 1080p, under ~10 MB) |
| Photo & résumé | `public/me.png`, `public/Manikandan_B_Resume.pdf` |
| Contact form key | `WEB3FORMS_KEY` in [`components/sections/contact.tsx`](components/sections/contact.tsx) |

In `profile.aboutLead` / `aboutBody`, wrap a phrase in `**double stars**` to give it the animated highlight.

## 📁 Project structure

```
app/
  page.tsx               home page
  [section]/page.tsx     /about, /work, … (same page, opens scrolled to that section)
  layout.tsx             fonts, metadata, custom cursor
  globals.css            theme tokens + animations
components/
  site.tsx               the whole one-page site
  sections/              hero, about, services, stack, work, process, experience, contact, nav, footer
  three/                 tunnel-field, footer-robot, logistics-globe, wave-field + shared scene hook
  ui/                    id-card-lanyard, bracket-cursor, reveal, section-scroller
lib/data.ts              all site content
public/                  hero video, tech logos, photo, résumé
```

## ✉️ Contact form

The form posts from the browser to Web3Forms, which emails each message to the inbox the access key was created with.
The key is public by design (it can only deliver to that inbox), so there's no server or environment variable to set up.
Spam is filtered with a hidden honeypot field.

## ☁️ Deploy

The site is fully static, so it deploys anywhere. On **Vercel**:

1. Import this repo at [vercel.com/new](https://vercel.com/new) — framework preset: Next.js.
2. Deploy. No settings or environment variables needed.

---

<div align="center">

Designed & built by **Manikandan B** in Tamil Nadu, India 💚

If you'd like to work together — [say hello](mailto:baskarmanikandan48@gmail.com).

</div>
