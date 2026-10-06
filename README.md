# Manikandan B — Portfolio

Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn project structure · Three.js

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Requires Node.js 18.18+ (20 or 22 recommended).

## Make the contact form send email

The form posts to `/api/contact`, which sends through [Resend](https://resend.com) (free tier is plenty).

1. Create a Resend account → **API Keys** → create a key.
2. Copy `.env.example` to `.env.local` and paste the key into `RESEND_API_KEY`.
3. Restart `npm run dev`.

Until you verify your own domain in Resend, keep `CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>`.
That test sender only delivers to the email you signed up to Resend with — so sign up with
`baskarmanikandan48@gmail.com`. Without a key, the form shows a friendly error and offers your email address.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. Import it at vercel.com → New Project (framework: Next.js, no settings to change).
3. Add the three environment variables from `.env.example` under **Settings → Environment Variables**.
4. Deploy.

## Where things are

| What | File |
| --- | --- |
| **All text, projects, jobs, links** | `lib/data.ts` |
| Page order | `app/page.tsx` |
| Colours & fonts (theme tokens) | `app/globals.css` (`@theme`) |
| Hero + head tracking | `components/sections/hero.tsx`, `components/ui/head-tracker.tsx` |
| Lanyard ID card | `components/ui/id-card-lanyard.tsx` (used in `components/sections/about.tsx`) |
| 3D skill sphere / globe / wave | `components/three/*` |
| Contact form + API | `components/sections/contact.tsx`, `app/api/contact/route.ts` |
| Résumé PDF, photo | `public/Manikandan_B_Resume.pdf`, `public/me.jpg` |

### Swapping the hero video frames

The hero draws still frames to a canvas instead of seeking a video (no lag, sharp on any screen).

- `public/frames/h/01–48.webp` — head turning **left → right**
- `public/frames/up/01–08.webp` — centre → **looking up**
- `public/frames/down/01–06.webp` — centre → **looking down**

To use a new AI video, export frames with ffmpeg, e.g. for a 2-second left→right sweep starting at 1s:

```bash
ffmpeg -ss 1.0 -t 2.0 -i video.mp4 -vf "scale=1920:1080:flags=lanczos" -c:v libwebp -quality 86 public/frames/h/%02d.webp
```

If the number of frames changes, update the `length` values at the top of `components/sections/hero.tsx`.
`headY` on `<HeadTracker>` sets where the head sits (0 = top, 1 = bottom) so up/down feels right.

### shadcn

`components.json` is set up, so `npx shadcn@latest add button` (etc.) drops components into `components/ui`.

### Still to fill in

- **Prodigy Book** — description, highlights and mock headline in `lib/data.ts` (marked `TODO`).
