# Véro Esthétique — Motion system

**Principle: motion as hospitality.** Things arrive the way Véro greets a
client: calmly, in order, never rushed, never showy. Motion only ever does
one of three jobs:

1. **Orient**: show what to read first (hero sequence, staggered reveals).
2. **Confirm**: acknowledge a hover, tap or open (buttons, menu, FAQ).
3. **Give depth**: a hint of physical space in her photos (light parallax).

If an animation does none of these, it isn't in the system.

## 1. Tokens

```css
:root {
  /* durations */
  --t-micro: 160ms;   /* press, colour changes */
  --t-court: 280ms;   /* hover, small UI changes */
  --t-moyen: 560ms;   /* menus, accordions, dialogs */
  --t-long:  900ms;   /* reveals: text and images */

  /* easings */
  --glisse: cubic-bezier(.22, 1, .36, 1);   /* default out: fast start, long soft landing */
  --douce:  cubic-bezier(.65, 0, .35, 1);   /* in-out: things that move between two states */
  --sortie: cubic-bezier(.4, 0, 1, 1);      /* in: things leaving the screen */

  /* distances */
  --d-texte: .45em;   /* text rise */
  --d-bloc:  16px;    /* block rise */
}
```

Rules: entrances use `--glisse`, state toggles use `--douce`, exits use
`--sortie` at ~70% of the entrance duration. Only `transform`, `opacity` and
`clip-path` are animated, so everything runs on the compositor.

## 2. Loading sequence (hero, ≈1.1 s total)

No loader screen. The page waits for the web fonts (max 500 ms) so text never
jumps, then plays:

| t (ms) | Element | Motion | Duration / easing |
| --- | --- | --- | --- |
| 0 | Hero photo | Curtain wipe from the right (`clip-path`), photo settles from 1.12× to 1× | 1100 / glisse |
| 150 | Eyebrow | Fade + rise 16px | 560 / glisse |
| 240, 320, 400 | Headline lines | Masked line reveal: each line rises out of its own clip | 900 / glisse |
| 560 | Intro sentence | Fade + rise | 700 / glisse |
| 680 | Call button + SMS link | Fade + rise | 700 / glisse |

The call button is fully visible at ~1.1 s; it's reachable (focusable,
clickable) from the first frame.

## 3. Text reveals

- **Headings (`data-m="texte"`)**: masked rise. `clip-path: inset(0 0 100% 0)`
  plus `translateY(.45em)` → `inset(0)` and no offset. 900 ms, glisse. Reads as
  type being set, not sliding.
- **Paragraphs and small blocks (default)**: fade + rise 16px. 700 ms, glisse.
- **Stagger**: items that enter together are ordered top-to-bottom,
  left-to-right, 80 ms apart, capped at 400 ms so nothing waits long.

## 4. Image transitions

- **Reveal (`data-m="image"`)**: curtain lifts from the bottom
  (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 1100 ms, glisse) while the
  photo inside settles from 1.12× to 1× (1400 ms, glisse). Hero wipes from the
  right instead, because it sits on the right.
- **Hover (gallery, price board)**: slow zoom to 1.035× over 1200 ms, glisse,
  with the caption rising in (280 ms).
- **Viewer (dialog)**: fades and rises 10px in 350 ms; backdrop fades in.

## 5. Parallax (light, `data-parallax`)

The photo moves inside its frame, never the frame itself, so layout never
shifts. Offset = distance of the frame's centre from the viewport centre ×
factor.

| Element | Factor | Max travel |
| --- | --- | --- |
| Hero photo | 0.06 | ~25px |
| Véro portrait | 0.05 | ~20px |
| Gallery: cabin, details | 0.04 | ~15px |

Images carry a base scale (1.08) so edges never show. Updated in one
`requestAnimationFrame` per scroll, only for frames currently on screen.

## 6. Scroll-triggered animations

- Reveals fire once when 6% of the element is inside the viewport (from the
  bottom), via `IntersectionObserver`. Nothing re-animates on scroll back up.
- **Menu lines draw**: each treatment family's top rule draws left to right
  (`scaleX 0 → 1`, 900 ms, glisse) as it enters. The price list "writes
  itself".

## 7. Pinned sections

**None that hijack scroll.** The visitor always controls the page. Two things
stay put because they help:

- **Header**: sticky, gains a hairline after 8px of scroll (280 ms).
- **Price board**: sticks beside the treatment list on desktop while you read
  the menu, so the prices and the real card stay side by side.

## 8. Hover states and micro-interactions

| Element | Interaction | Spec |
| --- | --- | --- |
| Primary button | Hover | background darkens (280 ms, douce), arrow slides 4px (280 ms, glisse) |
| Primary button | Press | scale .98 (160 ms) |
| Text links | Hover | underline retracts to the right, redraws from the left on leave (450 ms, glisse) |
| Nav links | Current section | rose underline draws in (400 ms, glisse) |
| Header phone | Hover | fills green (280 ms) |
| Price rows | Hover | text darkens, dotted rule strengthens (160 ms) |
| FAQ | Open/close | height animates (560 ms, glisse), answer fades in, "+" turns to "−" (350 ms) |
| Mobile menu | Open | panel fades and drops 8px (280 ms), links stagger in 40 ms apart |
| Mobile call bar | Appears | slides up once the hero button leaves the screen (350 ms, glisse); hides near the contact section |
| Film | Play | button scales on hover (400 ms), fades out on play (300 ms) |

## 9. Transitions between sections

No wipes or colour morphs between sections. The handover is the
choreography: each section's heading is set first (masked reveal), then its
content in reading order, then its images. The blush and green sections are
the only colour changes, and they arrive with the scroll, not over it.

## 10. Reduced motion and performance

- `prefers-reduced-motion: reduce`: no reveals (content visible
  immediately), no parallax, no zooms; only instant colour changes.
- No JavaScript: everything is visible (the hidden states only apply under
  `.js`).
- Parallax and reveals use `transform` / `opacity` / `clip-path` only; one
  passive scroll listener; observers stop watching once an element has
  revealed.
- `@property` registers `--zoom` so the image scale can animate on its own
  while parallax drives `translate`. Browsers without `@property` simply
  skip the scale animation.
