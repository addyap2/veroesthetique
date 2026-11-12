# Pre-launch audit and checklist

Audit of the bright, clean salon site, measured with Lighthouse 12 (simulated
mobile and desktop), axe (via Lighthouse), keyboard testing and a local server
that reproduces the production headers from `vercel.json`.

## Results

| | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Before (mobile) | 90 | 96 | 100 | 100 | 3.5 s | 0 |
| **After (mobile)** | **98** | **96\*** | **100** | **100** | **2.5 s** | **0** |
| **After (desktop)** | **100** | **96\*** | **100** | **100** | **0.5 s** | **0** |

\* The single remaining flag is the decorative cream copy of the hero headline
(`aria-hidden`, only ever visible over the dark photo). axe measures it against
the cream page behind it, which never happens on screen. Real contrast is fine.

## Issues found and fixed

| # | Area | Issue | Impact | Severity | Fix (done) |
| --- | --- | --- | --- | --- | --- |
| 1 | Brand | Logo didn't match Véro's real identity (business card) | Clients don't recognise the brand they know | High | Wordmark rebuilt from the card: script "Véro" in rose gold (Great Vibes, subset to 4 letters, 1.7 KB), serif "Esthétique", spaced "Beauté". Matching favicon and touch icon. |
| 2 | Accessibility | Sage eyebrows/labels 4.38:1 on cream, 3.67:1 on blush | Hard to read for low-vision users (WCAG AA fail) | High | Sage darkened to `#4F6B53` (5.67:1 / 4.74:1). |
| 3 | Accessibility | Rose accent 2.83:1 on blush (Véro heading), 3.39:1 on cream for small text | Fails AA | High | Rose darkened to `#9D5F50` (4.82:1 cream, 4.03:1 blush, large text). |
| 4 | Accessibility | Grey text 3.99:1 on blush | Fails AA in the Véro section | Medium | Grey darkened to `#5F635D` (5.88:1 / 4.92:1). |
| 5 | Accessibility | Logo link name ("Véro Esthétique, accueil") didn't contain its visible text | Voice-control users can't say what they see | Medium | Visible text + visually hidden ", retour à l'accueil". |
| 6 | Performance | 300 KB of fonts, italic not preloaded but used in the hero | Slower first paint, late headline swap | High | Fraunces subset and pinned to used axes: 270 KB → 116 KB. Source Sans 29 → 22 KB. All hero fonts preloaded. Font wait capped at 300 ms. |
| 7 | Performance | No cache policy on assets | Every visit re-downloads images and fonts | Medium | `vercel.json`: assets cached 7 days (+1 day stale-while-revalidate), CSS/JS 1 hour. |
| 8 | Performance | Image `sizes` hints wrong after layout changes | Larger downloads than displayed | Low | Corrected for hero, price board, portrait, gallery. |
| 9 | SEO / sharing | No canonical, no share image, no structured data, no sitemap/robots | Poor link previews on WhatsApp/Facebook; weaker local search | High | Share image (1200×630) from the business card. Build adds canonical, `og:url`, `og:image`, `BeautySalon` JSON-LD, `sitemap.xml`, `robots.txt` using `SITE_URL` or Vercel's production domain. |
| 10 | Security | No security headers | Clickjacking, MIME sniffing, no CSP | Medium | CSP (scripts by hash, no inline styles, no third parties), HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP, frame-ancestors none. Tested locally: no violations. |
| 11 | Error handling | Default Vercel 404 | Dead end for mistyped links | Low | Branded `404.html` with home link and phone number (returns HTTP 404). |
| 12 | Code | Inline `style` attribute on privacy page | Blocks a strict CSP | Low | Replaced by a class. |

## Open items (need Véro or a decision)

| # | Item | Why it matters | Severity | Action |
| --- | --- | --- | --- | --- |
| A | ~~Video has no captions or transcript~~ | Transcribed locally with Whisper (small model), corrected by context; French captions (`assets/video/vero.fr.vtt`) on by default, plus an on-page transcript | Done | Confirmed by listening: « remise en beauté ». |
| B | **Business card spells "Esthêtique"** (ê) | Typo on her printed material; also visible in the share image | Medium | Tell Véro; the site itself uses the correct "Esthétique". Replace `assets/images/partage.jpg` if she gets a corrected file. |
| C | ~~No address, area or opening hours~~ | Resolved from her Planity page: address, access, parking, hours, full price list, online booking, Instagram, click-to-load Google Maps | Done | Ask Véro to confirm prices periodically (they're copied from Planity). |
| D | **Legal notice (mentions légales)**: page written, 7 blanks to fill | Required in France for a business site | High | Fill the « À COMPLÉTER » fields in `mentions-legales.html` (name, legal form, SIRET, e-mail, VAT, publication director, consumer mediator). The build publishes the page and its footer link only once all are filled. |
| E | **Photo and video rights** | Public use of the provided media | Medium | Written OK from Véro. |
| F | **Analytics** | No way to know if calls come from the site | Low | Optional. If wanted: cookieless analytics (e.g. Vercel Web Analytics), track `tel:`/`sms:` clicks, update the privacy page and CSP. |
| H | **GitHub repo homepage points to `veroesthetique.vercel.app`**, which doesn't exist | Wrong link for anyone visiting the repo | Low | The live site is `https://veroesthetique-phi.vercel.app`. Update the repo's website field, or attach a custom domain. |
| G | **Image widths** | Some 960px images shown at ~600px on desktop (≈100 KB) | Low | Add 720px WebP variants if desired. |

## Launch checklist

**Mobile and fallbacks**
- [x] Layout checked at 375, 1024 and 1440 px; no horizontal scroll
- [x] Call button visible without scrolling on a 375×812 phone; sticky call bar after it scrolls away
- [x] Mobile menu opens, closes with Escape and after choosing a link
- [x] Without JavaScript: all content visible, plain green headline, links open photos directly
- [x] Reduced motion: no reveals, parallax or zooms
- [ ] Real-device check: iPhone Safari and an Android phone (tap the call and SMS links for real)

**Calls to action**
- [x] `tel:+33782772946` and `sms:+33782772946` on every CTA; number visible on desktop
- [ ] Véro confirms the number and the prices shown

**Assets**
- [x] All images WebP with `srcset`, explicit width/height (CLS 0)
- [x] Originals untouched (SHA-256 checked by `npm run check`)
- [x] Fonts self-hosted, subset, OFL licences included
- [x] Favicon (SVG), Apple touch icon, share image

**Performance**
- [x] Lighthouse mobile 98, desktop 100; LCP 2.5 s mobile / 0.5 s desktop; TBT 0
- [x] Video loads only on demand (`preload="none"`)
- [x] Cache headers for assets

**Accessibility**
- [x] Text contrast AA everywhere (see note on the decorative headline copy)
- [x] Skip link, visible focus, logical heading order, `lang="fr"`
- [x] Keyboard: menu, FAQ, photo viewer (focus returns), video button
- [x] French captions on by default and an on-page transcript for the video
- [ ] Quick VoiceOver pass on iPhone

**Cross-browser**
- [x] Chrome (tested)
- [ ] Safari macOS/iOS, Firefox, Samsung Internet: check hero colour cut, logo gradient text, FAQ, dialog
- Progressive features degrade safely: `@property`, `::details-content`, `interpolate-size`, `text-wrap`

**SEO metadata**
- [x] Title, description, `lang`, Open Graph, Twitter card
- [x] Canonical, `og:image`, JSON-LD, sitemap and robots generated at build when the domain is known
- [ ] Set `SITE_URL` in Vercel if using a custom domain (otherwise the Vercel production domain is used)
- [ ] After launch: add the site to Google Search Console and create/claim the Google Business Profile with the same name, phone and address

**Analytics** (optional, item F)
- [ ] Decide; if yes, cookieless only, and update `confidentialite.html` + CSP

**Error handling**
- [x] Branded 404 page with HTTP 404
- [x] Video fallback link; photo viewer falls back to opening the image

**Deployment**
- [x] `npm run check` and `npm run build` pass; GitHub Actions runs both on every push
- [x] `vercel.json`: build command, `dist/` output, headers
- [ ] After deploy: check headers with `curl -I https://<domain>/`, view source for canonical/og tags, test the share preview (e.g. send the link in WhatsApp)
- [ ] Custom domain + HTTPS, then redeploy so canonical URLs use it

## Note: Google Maps loads automatically

At the owner's request the map is embedded directly (lazy-loaded near the *Infos pratiques* section) instead of click-to-load. Google may set cookies without prior consent, which the CNIL generally expects for third-party cookies. The privacy and legal pages describe this. To return to click-to-load, restore the version from commit `6156d40`.
