# Véro Esthétique — Visual direction

**Bright, clean salon.** Light, photo-led, obvious. A visitor should know in a
few seconds what Véro offers, roughly what it costs, and how to book.

## Principles

- **Clarity first.** Services and prices are on the first scroll. The phone
  number is never more than one tap away (header, hero, sticky bar on
  mobile, contact band).
- **Her photos do the work.** Real photos of Véro and the institute, shown
  large and clean with rounded corners and soft shadows. No filters, no
  effects on top.
- **No gimmicks.** No scroll-jacking, pinned scenes or heavy animation. Only a
  short fade-up as sections appear, switched off for reduced-motion users.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--blanc` | `#FFFDF9` | Page background |
| `--creme` | `#FAF5EF` | Alternate sections |
| `--rose` | `#F5E4DD` | "Véro" section, accents on dark |
| `--rose-fonce` | `#C98C79` | Italic accents, details |
| `--sauge` | `#5F7D63` | Eyebrows, secondary accents |
| `--sauge-clair` | `#E6ECE3` | Notes and callouts |
| `--vert` | `#233A2D` | Headings, buttons, contact band |
| `--texte` | `#3A3D39` | Body text |

## Typography

- **Fraunces** for headings, used calmly (low softness, regular weight), with
  italic in rose for one accent per heading.
- **Source Sans 3** for body text, navigation and buttons.

## Layout

Hero (text + large photo, call and SMS buttons) → three key facts → four
treatment cards with prices → Véro → the institute (photos + video) →
questions → contact band → footer.

## Constraints kept

- No invented facts: no address, hours or prices beyond the institute's card.
- No trackers, cookies or third-party requests. Fonts are self-hosted.
- Booking by phone and SMS only.

## Hero: « De la page à la lumière »

**Concept.** The headline is set very large and crosses from the cream page
into the sunlit doorway photo of Véro. At the photo's edge the letters change
colour, green on paper and cream on the photo, as if the words step into the
light with her. One image, one sentence, one call button: the value (a warm,
personal institute; book Véro directly) lands in the first second.

- **Composition (desktop):** text column left, photo bleeding to the right
  edge at full height. Lines that are long enough run past the column into
  the photo; short lines stop before it, so the crossing feels set by hand.
- **Composition (mobile):** photo first; the first headline line overlaps the
  bottom of the photo in cream over a soft shade, the rest continues in green
  below.
- **Typography:** Fraunces at display size (up to ~7.6rem), tight leading,
  italic rose for "votre moment."; Source Sans for the subheadline and button.
- **Imagery and light:** the real photo, with its own late sun and palm
  shadows. No added effects, no 3D: the light is already in the picture.
- **Headline:** *Votre beauté, vos envies, votre moment.* (her business-card
  line). **Subheadline:** what she does, in one sentence. **CTA:** "Appeler
  Véro | 07 82 77 29 46" plus a quiet SMS link.
- **Entrance:** photo curtain from the right, then the lines set one by one
  (both colours move together), then subheadline and button (≈1.1 s).
- **Interaction and scroll:** light parallax inside the photo; the colour cut
  is recalculated on resize and font load so it always sits exactly on the
  photo edge.
- **Technique:** the headline exists twice: the real heading (green) sits
  under the photo, and a decorative copy (cream, `aria-hidden`) sits above it,
  clipped to the photo's rectangle. Screen readers read it once. Without
  JavaScript, only the green heading shows.
