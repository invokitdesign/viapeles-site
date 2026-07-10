# VIAPELES — one-page site

Static site (HTML + CSS + vanilla JS). No build step, no dependencies.
Recreated from the design handoff (`Website Viapeles Luxuoso`).

## Run locally
Any static server, e.g.:
```
python -m http.server 8090
```
Then open http://localhost:8090/

## Files
- `index.html` — markup (PT is the default in-HTML content; works without JS via `<noscript>` fallback)
- `styles.css` — all styles, brand tokens as CSS variables in `:root`
- `script.js` — all behavior (see below)
- `assets/` — logos (`viapeles-logo.png`, `viapeles-logo-light.png`, `Logotipo-original.png`)

## Premium finishes (behavior in `script.js` + `styles.css`)
- **Preloader** — wordmark + counter + fill bar, then a curtain lift that triggers the hero reveal
- **Masked type reveals** — hero H1 lines rise from behind a mask; section H2s rise word-by-word (IntersectionObserver)
- **Smooth scroll** — [Lenis](https://github.com/darkroomengineering/lenis) inertia scrolling, loaded from unpkg CDN. Desktop only; **falls back to native scroll** if the CDN is unreachable or on touch / reduced-motion.
- **Custom cursor** — dot + lerping ring, grows on interactive elements, shows a `↗` glyph over collection images. Only on fine-pointer devices.
- **Magnetic elements** — logo, CTAs and toggle drift toward the cursor
- **3D tilt + parallax** — collection images tilt on hover; hero + image frames parallax on scroll
- **Film grain** overlay, **hero vignette + Ken-Burns zoom**, **scroll-progress bar**, **animated counters** (20+/300+/48h)
- All motion respects `prefers-reduced-motion` (preloader, parallax, grain, tilt, cursor all disabled).

> **Offline note:** the only external runtime dependency is the Lenis script (smooth scroll) and Google Fonts. If you need a fully self-contained build, self-host `lenis.min.js` and the font files — everything else is local.

## How i18n works
Copy lives in the `COPY` object in `script.js` (PT + EN). Translatable elements
carry `data-i18n="key"`; the toggle rewrites their text and swaps the WhatsApp
message. Choice is persisted to `localStorage`.

## ⚠️ Replace before launch
1. **WhatsApp number** — `WA_NUMBER` at the top of `script.js` (currently `351000000000`).
2. **Contact details** — phone, email, address, hours in `index.html` (`.contact__fields`).
3. **Images** — the four slots currently hold **premium example photos from
   [Unsplash](https://unsplash.com)** (free license, commercial use OK), colour-graded
   to the brand palette. Swap them for the client's own photography when available —
   just replace these files (same names) or edit the `src`s:
   - `assets/hero.jpg` — hero background (leather artisan at the bench)
   - `assets/collection-01.jpg` — Peles & Couros (swatch board of different leather-grain textures)
   - `assets/collection-02.jpg` — Tecidos (automotive-sector seat fabric)
   - `assets/collection-03.jpg` — Acessórios (draped satin)

   Collection imagery is intentionally **sculptural / dimensional** (twinbru-style
   flowing material) so the horizontal reel's coverflow 3D reads well — keep that
   quality when swapping in the client's own shots.

   Images use `object-fit: cover`; if a file is missing, collection slots fall back to a
   warm beige block and the hero to the espresso background. For a real brand launch,
   prefer owned photography (Unsplash images aren't exclusive).

## Notes
## Typography — per Manual de Normas (two families only)
The site uses exactly the two brand typefaces, nothing else:
- **The Seasons** — **titles / headings only** (`--serif`), family name `"the-seasons"`,
  served via **Adobe Fonts** (`<link href="https://use.typekit.net/mpo0vhn.css">`). Weights
  available: 400 + 700, normal + italic.
- **Lexend Zetta** (Google Fonts) — **all running text + labels** (`--body` / `--zetta`),
  weight 300 (Light) for body.

Rule: serif only on titles; everything else is the sans (Lexend Zetta). Cormorant and Jost
were removed. The footer "Fale connosco →" CTA was removed.

> **Deploy note:** the Adobe Fonts web project must list the production domain in its
> allowed-domains settings (Adobe Fonts → the project → Settings), or The Seasons will
> fall back to Georgia/serif on the live site. It already works on localhost for dev.
- The `assets/` also includes `Logotipo-original.png` (untrimmed) for re-export.
