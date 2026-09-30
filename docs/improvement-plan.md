# Alfapoint website improvement plan (v5, revised after final validation)

Decisions carried forward:
- **Keep Vercel Analytics.** It predates the rebuild. The owner declined adding tracking, not removing this. Disclose it accurately in the privacy policy (URL, referrer, device, approximate location, temporary hashed visitor ID; cookieless) and tell the owner.
- **Preserve** the `/home` rewrite, canonicals, sitemap, robots, the 404 page and the no-JS/failsafe reveal tests.

Also preserve the Analytics console-error exemption in e2e/pages.spec.ts while Analytics remains.
Test rule: bug fixes get a regression test that reproduces the bug on the current code. Other changes get preservation and behaviour tests. Every PR also passes the full suite.

## Order and PRs

### PR 1: restore Calendly's cookie banner (smallest, legal risk first)
- Remove `hide_gdpr_banner=1` from `calendlyEmbedUrl` (booking.ts:16).
- Unit test: the URL does not contain `hide_gdpr_banner`.
- Manual check: with the real embed at 375 px and 1440 px, Calendly's banner appears and scheduling still works.

### PR 2: interaction and accessibility fixes

**2a Mobile menu (header.tsx)**
- **Breakpoint crossing:** a `matchMedia("(min-width: 768px)")` change listener closes the menu (`setOpenOnPath(null)`) and clears both locks: `documentElement.style.overflow` and `body.style.overflow`. Focus is not restored here, because the toggle is hidden at md+.
- **Inertness while open:** use `inert={open}` (React 19 boolean) on the individual background elements: the skip link, `main`, `footer`, the header logo link, the desktop nav, and the "Let's talk" CTA link. **Not** the toggle's wrapper.
- **Focus management:**
  - on open, focus moves to the first menu link;
  - **One keydown handler**, active only while the menu is open, handles both keys:
    - **Tab and Shift+Tab** wrap within [toggle + menu links + menu CTA];
    - **Escape** closes the menu and returns focus to the toggle. This replaces the current window Escape listener (header.tsx:29), which then no longer runs while the booking dialog is open.
  - The toggle button also closes the menu and restores focus to itself.
  - Closing by clicking a link or crossing the breakpoint does not restore focus.
- **Tests:**
  - 375 px: open, resize to 768 px, then back to 767 px. The menu is closed, the page scrolls, and neither element has overflow hidden.
  - Tab and Shift+Tab never leave [toggle + menu].
  - Escape returns focus to the toggle.
  - 640–767 px: the header "Let's talk" CTA is inert while the menu is open and usable after it closes.

**2b Booking dialog (booking-dialog.tsx)**
- **Status transitions:**
  - `loading` → `ready` directly, as soon as a valid ready message arrives.
  - `loading` → `unconfirmed`, 6 s after *this frame's* load event with no message. The frame is shown with a visible fallback link.
  - `loading` → `slow`, 15 s after opening with no load. The fallback link is shown over a blank area.
  - `slow` → `unconfirmed`, 6 s after a late load event with no message. The 6 s timer always starts from the frame's load event, whatever the status was.
  - `slow` or `unconfirmed` → `ready` if a valid message arrives later.
  - **Timers never downgrade `ready`.**
- **A valid message** has `origin === "https://calendly.com"`, `event.source === currentIframe.contentWindow`, and a ready event name (`event_type_viewed`, `date_and_time_selected`, `profile_page_viewed`).
- **Scoping:** each opening gets an incrementing id. The iframe is keyed by that id, so every opening creates a fresh frame. Timers and the message listener are created in an effect for that opening and cleared on close.
- **Fallback link:** "Trouble loading? Open Calendly in a new tab", a small line under the frame, visible at every size and wrapping at 280 px. It replaces the `hidden sm:inline` header link.
- **Tests:**
  - **Race:** `page.clock.install()` before navigation, then `page.clock.pauseAt()` before opening, so no time passes except through explicit `runFor()` calls. Use a stub that loads but never posts.
    - Open, wait for frame 1's load, then advance 3 s. Close and reopen, and wait for frame 2's load.
    - Advance 4 s: this passes frame 1's deadline. Opening 2 must still be `loading`.
    - Advance 2.5 s more: opening 2 is now `unconfirmed`.
  - **Wrong source:** the page also contains a hidden iframe from the stubbed calendly.com origin that posts a valid ready message to the parent. The dialog must not become `ready`.
  - **Fresh frame:** after close and reopen, the iframe element is a different node.
  - **Slow then late load:** the stub route is **held** (not fulfilled) with the clock paused. `runFor(15 s)` → `slow`. Then fulfil the route with a no-message page, wait for the frame's load, and `runFor(6 s)` → `unconfirmed` with the frame visible. Then have the frame post a valid ready message (the stub page listens for a trigger from the test) → `ready`.
  - **Fallback visibility:** the fallback link is fully visible and tappable at 280×653, 375×667 and 740×360.

**2c Focus indicator (globals.css)**
- **Default two-colour ring**, visible on dark and light surfaces:
  - `:focus-visible { outline: 3px solid var(--color-lime); outline-offset: 2px; box-shadow: 0 0 0 2px var(--color-ink-950); }`
  - The box-shadow covers the 2 px gap at the element's edge, so the ring is dark next to the element with lime outside.
- **Links inside `overflow-hidden` containers** (the service-grid cards, services-grid.tsx:23) get a class `focus-inset` with **both colours inside** the element: `outline: 3px solid var(--color-ink-950); outline-offset: -3px; box-shadow: inset 0 0 0 6px var(--color-lime)`. That gives a dark band 0–3 px inside the edge, then lime 3–6 px. Dark has ≥ 12:1 contrast against the paper card; lime has ≥ 12:1 against ink if the card is dark (hover). Nothing is drawn outside, so nothing can be clipped or covered.
- **Tests (desktop Chromium, one project):**
  - Tab through the homepage, a service page and the contact page. For every focused element, the ring box (its rect grown by offset + width) sits inside the rect of every `overflow: hidden|clip` ancestor. If it doesn't, the element must have a negative outline-offset.
  - Take focused screenshots of representative controls for visual review: a lime button on dark, a ghost button, a service card, a footer link, the open dialog's close button and the menu.

**2d Motion (stats-strip.tsx, hero.tsx, globals.css)**
- **Tech list:** replace the marquee with a static, wrapping list. Each technology appears once. Remove the duplication, the edge mask, `w-max` and the animation.
- **Hero status dot:** make it static.
- **Test:** after load, `document.getAnimations()` contains no infinite-iteration animations while no dialog is open. The booking spinner is only running when the dialog is loading. Each tech name appears exactly once and nothing overflows at 280 px.

### PR 3: headline paints immediately; reduced motion
- Remove `animate-rise` and the inline delay from the H1 in hero.tsx and page-hero.tsx. Other hero elements keep their entrance.
- Reduced motion: `animation-delay: 0s !important; transition-delay: 0s !important`, on `*`, `::before` and `::after`. This overrides inline `--reveal-delay` and `animationDelay`.
- **Tests:**
  - Right after `domcontentloaded`, with no waiting, the H1 has `animation-name: none` and opacity 1.
  - With `reducedMotion: "reduce"`, no element or pseudo-element has a non-zero animation or transition delay. Checked on the homepage, the open mobile menu and the open booking dialog.
  - The reveal-ready marker and the no-JS/failsafe tests still pass.
- **Measure:** the median of 3 mobile Lighthouse runs, before (live) and after (preview). Report the numbers; promise nothing.

### PR 4: security and asset cache headers (next.config.ts `headers()`)
- **`/:path*`:**
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: frame-ancestors 'none'` (this directive only)
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **`/clients/:path*`, `/team/:path*`, `/tech/:path*`:** `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`. Cached copies can be up to about 25 hours old (1 h fresh + 24 h stale).
- **Framing:** no workflow needs to embed this site in a frame. The Vercel toolbar uses frames of its own, but `frame-ancestors` and X-Frame-Options only control who may frame *this* site, not the frames we embed, so neither the toolbar nor Calendly is affected.
- **Tests:**
  - The local production server returns the headers on HTML and on an asset.
  - The asset rule doesn't apply to HTML or to 404 responses.
  - The booking iframe still renders its stub, and the real Calendly is checked manually.
  - After merging, verify the headers on production with curl.
  - Header tests run on one project, not all 18.

### PR 5: share and search metadata
- **OG image:** a fixed `public/og.png` (1200×630), rendered once from an HTML template in brand colours with the logo and tagline, then committed. Use no file convention, to avoid duplicate image tags.
  - A shared descriptor, `OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Alfapoint: software engineering partner for ambitious product teams" }`, goes in the root `openGraph.images` **and** in `pageMetadata()`'s openGraph. Without it, nested pages drop the image, because their openGraph replaces the parent's (verified against the resolver).
  - Twitter: `twitter: { card: "summary_large_image" }` only in the root metadata. It's inherited, and the twitter image falls back to the OG image.
- **Icons:** `src/app/icon.png` (512×512) and `src/app/apple-icon.png` (180×180), using the file conventions.
- **JSON-LD:** a server-rendered `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />` in the root layout.
  - Contents: `@context: "https://schema.org"`, `@type: "Organization"`, name, url, absolute logo URL, email. No addresses, and no `sameAs` unless confirmed.
- **Tests (one project):**
  - Every page has og:image, twitter:card=summary_large_image and twitter:image, all resolving to an absolute `https://www.alfa-point.com/og.png`.
  - Fetch that URL's pathname and query against the **test server**: expect 200 image/png, 1200×630.
  - The apple-touch-icon link resolves locally to a 180×180 png.
  - The JSON-LD parses and contains the expected fields.
  - Visual inspection of og.png.

### PR #3 (already open): footer
- Also remove the bottom-bar cities line (footer.tsx:58).

### Later, blocked on owner facts (gather now)
- **Privacy policy:**
  - The draft lives in `docs/privacy-draft.md` only, not published, until the owner provides the legal entity, address, privacy contact, CV/email handling, retention and processors (Vercel incl. Analytics, Calendly, email provider, etc.) with their locations, and a lawyer reviews it.
  - When it's published: `/privacy` goes in the footer, sitemap, e2e inventory and link crawl.
  - A privacy link inside the booking dialog must close the dialog before navigating, with a test.
- **Claims:** verify or remove 50+ ("engineers & designers"), 90% (site.ts:37, engagement.tsx:51), 10/20 working days (hero panel, stats, services.ts incl. the FAQ at ~352), "up to 25% lower" (services.ts:330), "one business day" (contact metadata), the client logos (permission and relationship), and the job ads.
  - Update the unit tests that depend on positions or the .NET job, the hard-coded PHP job in responsive.spec.ts (and assert 200 responses in the sweeps), and the dialog-name selectors in booking.spec.ts and all-sizes.spec.ts if the name changes.
  - Make the CTA wording consistent once the Calendly event length is confirmed.
- **Proof:** one approved case study or testimonial first.

### Excluded
New analytics, A/B tests, a blog, an Arabic version, an estimator, a web manifest, a full CSP.
