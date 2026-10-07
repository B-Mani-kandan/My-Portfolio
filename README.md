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

## Contact form

The form sends straight from the browser to [Web3Forms](https://web3forms.com), which emails each message
to the inbox the access key was created with. The key lives in `components/sections/contact.tsx`
(`WEB3FORMS_KEY`) — it's public by design, so no server or environment variables are needed.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. Import it at vercel.com → New Project (framework: Next.js, no settings to change).
3. Deploy.

## Where things are

| What | File |
| --- | --- |
| **All text, projects, jobs, links** | `lib/data.ts` |
| Page order | `app/page.tsx` |
| Colours & fonts (theme tokens) | `app/globals.css` (`@theme`) |
| Hero + head tracking | `components/sections/hero.tsx`, `components/ui/head-tracker.tsx` |
| Lanyard ID card | `components/ui/id-card-lanyard.tsx` (used in `components/sections/about.tsx`) |
| 3D skill sphere / globe / wave | `components/three/*` |
| Contact form (Web3Forms) | `components/sections/contact.tsx` |
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
