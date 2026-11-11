# Véro Esthétique — Creative direction

## The idea: « Soins en cours »

On Véro's door hangs a round sign: *Soins en cours — merci de ne pas déranger.*
That sign is the whole concept. The website is not a brochure about a beauty
institute; it **is the hour you spend inside it**. Scrolling is time passing in
the cabin. A small clock in the corner counts the minutes of your soin, from
00 at the door to 60 when you step back out.

Every beauty site promises "a moment for you". This one stages it, minute by
minute, with the institute's real light, real objects and real woman.

## Visual narrative (the hour, chapter by chapter)

| Minute | Chapter | What happens |
| --- | --- | --- |
| 00′ | **La porte** | Darkness lifts into late-afternoon sun. Véro opens her door, palm shadows move across her. "Le monde peut attendre." |
| 05′ | **Le panneau** | The round sign fills the frame. Around it float the things you left outside: emails, the 2 p.m. meeting, the shopping, the phone. As you scroll they blur and dissolve, one by one, until only the sign and silence remain. |
| 12′ | **La cabine** | The camera walks into the treatment room: the photograph grows from a framed picture to the full screen. |
| 20′ | **Véro** | The person, not the brand. Portrait, her words, and her short film shown in a rose-gold "psyché" mirror, the shape of the mirror on her wall. |
| 30′ | **La carte** | The treatment menu, set like a printed card: four families, real prices from the institute's card, nothing invented. |
| 45′ | **Les attentions** | A still life of the small things: towel, flowers, hand mirror, PHYT'S booklet. |
| 55′ | **Avant de venir** | The practical questions, quietly. |
| 60′ | **La sortie** | Back to deep green. "Prenez votre heure." The phone number becomes the final image. |

## Art direction

Taken entirely from the photographs, never from a template.

- **Ground**: the deep sage of the cabin wall (night, opening and closing) and
  raw linen (the middle of the hour, daylight).
- **Light**: golden late sun filtered through palm fronds. A soft palm-shadow
  layer drifts over key moments: the site's atmospheric signature. Light is
  never a fill colour; it is always something that *falls on* things.
- **Accent**: rose gold, taken from the hand mirror and the wall mirror. Used
  only for hairlines, numerals and the mirror rim. Never for buttons.
- **Blush**: Véro's tunic. Used as light on dark grounds, for the italic voice.

## Palette

| Token | Hex | Source |
| --- | --- | --- |
| `--cabine` | `#1E3328` | Cabin wall in shadow |
| `--sauge` | `#2F4A3B` | Cabin wall |
| `--lichen` | `#9BAA8E` | Business card ground |
| `--lin` | `#EFE8DC` | Linen, sheets |
| `--lin-clair` | `#F7F2EA` | Window light on linen |
| `--poudre` | `#EBCFC4` | Véro's tunic |
| `--or-rose` | `#B98068` | Hand mirror |
| `--graphite` | `#2B2C2A` | PHYT'S towel, body text |
| `--soleil` | `#F3D49B` | Golden hour (light only) |

## Typography

- **Fraunces** (variable: optical size, softness, "wonk"). Display at very
  large optical size with softness turned up. It has the warmth and slight
  handmade irregularity of Véro herself, where a Didone would be cold and
  generic "luxury". Italic carries the intimate voice.
- **Source Sans 3** for reading text and small labels. Labels are set in
  small caps with wide tracking and tabular figures, like time on a clock.
- Scale is extreme on purpose: headlines up to ~14vw, captions at 12px. Little
  in between. Calm comes from contrast and space, not from a medium size.

## Composition

- No centred hero over a photo, no card grids, no three-column feature rows,
  no numbered "01/02/03" sections.
- Off-axis framing: images bleed off one edge, text crosses image boundaries.
- Generous, unequal margins. The page breathes like a person lying down.

## Motion language: « respiration »

- One rhythm: a slow breath (~6 s). Ambient motion (palm sway, light drift)
  follows it.
- Things never slide in from the side. They **come into focus**, from soft
  blur to sharp, like eyes adjusting to light or steam clearing from a mirror.
- Long, decelerating eases only. Nothing bounces, nothing spins.
- Scroll-linked scenes (the sign, the cabin) are driven directly by scroll
  position, so the visitor controls time.
- `prefers-reduced-motion`: every scene resolves to its final, still state.

## Emotional arc

Arrival (warmth, a smile at the door) → letting go (the outside world
dissolves) → being looked after (the room, the person) → choosing (the card)
→ leaving lighter, with a number to call.

## Constraints kept

- No invented facts: no address, hours, or prices beyond the institute's card.
- No trackers, cookies or third-party requests. Fonts are self-hosted.
- Booking stays phone and SMS only.
