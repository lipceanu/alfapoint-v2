# Alfapoint website v3

A rebuild of [alfa-point.com](https://www.alfa-point.com) with a modern design and a service line-up updated for 2026.
The previous site lives in a separate repository (`CreamyOmlette/alfapoint-v2`) and is left untouched.

## Stack

- Next.js 16 (App Router, fully static prerender), React 19, TypeScript
- Tailwind CSS v4, with design tokens in `src/app/globals.css` (`@theme`)
- Fonts via `next/font`: Schibsted Grotesk, Instrument Serif and JetBrains Mono
- Vercel Analytics
- Vitest for content and routing tests

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # content and routing tests (Vitest)
npm run e2e        # cross-browser and device tests (Playwright)
npm run lint
npm run build
```

### Cross-browser and device coverage

`npm run e2e` builds the site and checks every page in 7 profiles:

- Desktop Chrome, Firefox and Safari (WebKit), at 1440×900
- iPhone 15, in portrait and landscape
- Pixel 7 (Android)
- iPad

It checks HTTP status, console errors, fonts, broken images, horizontal overflow, scroll reveals, the mobile menu, keyboard skip link, FAQ accordions, legacy redirects, tap-target size, and no-JS / failed-JS fallbacks.
It also runs a width sweep from 320px to 2560px (17 widths) in all three engines.
Full-page screenshots are saved to `test-results/screens/`.
The first time, install the browsers with `npx playwright install chromium firefox webkit`.

Browser support follows Tailwind CSS v4: Safari 16.4+, Chrome/Edge 111+ and Firefox 128+.
Edge uses the same engine as Chrome, and Samsung Internet and Opera are also Chromium-based.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | **All copy and data**: services, engagement models, jobs, locations, leadership and legacy routes. Edit text here, not in components. |
| `src/app/` | Routes: `/`, `/services`, `/services/[slug]`, `/about`, `/careers`, `/careers/[slug]`, `/contact`, plus the sitemap and robots |
| `src/components/sections/` | Page sections (hero, services grid, engagement, leadership, CTA…) |
| `src/components/ui/` | Primitives (buttons, headings, icons, scroll-reveal observer) |
| `docs/` | Positioning research and the content checklist |

To add a service or job, add an entry in `src/content/services.ts` or `src/content/jobs.ts`. Its page, navigation, footer and sitemap entries are generated automatically.

## URLs carried over from v2

`src/content/routing.ts` keeps old links working:

- `/services/hr-services` → `/services/dedicated-teams` (308)
- `/services/data-science` → `/services/ai-solutions` (308)
- `/job` → `/careers` (308)
- `/home` is served as a **rewrite** of `/`, not a redirect. v2 sent `/` to `/home` with a permanent 308, which browsers cache, so redirecting `/home` back to `/` would loop for returning visitors.

## Deploying

The live site is on Vercel. Deploy this repository as a **new Vercel project** and check it on its preview URL. Move the `alfa-point.com` domain over only when you are ready to switch.
