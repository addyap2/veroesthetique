# Design audit — bright, clean salon site (commit f56137f)

The direction stays **bright, clean salon**. The goal of this pass is polish
and identity, not effects. Ranked by visual impact × ease.

| # | Problem | Why it hurts | Change | Impact | Effort |
| --- | --- | --- | --- | --- | --- |
| 1 | **Photos repeated and mismatched.** The details photo appears 3 times (hero card, Regard card, gallery), PHYT'S 2×, cabin 2×. Épilations is illustrated with the "Soins en cours — ne pas déranger" sign. One gallery photo is hidden with CSS. | The fastest tell of a template site: stock-like filler and padding. It also makes the institute look smaller than it is. | Every photo used **once**, for a reason: doorway in the hero, the real price board beside the menu, portrait and film with Véro, cabin/details/PHYT'S/sign in the gallery. | Very high | Low |
| 2 | **Treatments as four product cards** with hover lifts, and "Tarifs sur la carte de l'institut" repeated twice. | SaaS feature-card pattern; the prices, which visitors actually want, are buried at the bottom of cards. | A real **salon menu**: four families set like a printed price list, treatments listed, prices with dotted leaders, the photographed price board next to it. | Very high | Medium |
| 3 | **Hero is a generic split**: rounded photo card with drop shadow, a floating "vignette" card, a three-box "atouts" strip repeating the hero text, phone number repeated under the buttons. | Floating badges and feature strips are template furniture; they add clutter, not information. | Photo **bleeds to the edge of the screen**, full height. One headline, one sentence, one primary call button showing the number, one quiet SMS link. Strip and vignette removed. | High | Low |
| 4 | **Five background bands** (white, cream, blush, cream, green). | Striped page, no rhythm; every section shouts equally. | Warm white throughout, **one blush moment** (Véro), **one green close** (contact). Separation by space and hairlines. | High | Low |
| 5 | **Shape language is SaaS**: 18px radii, soft drop shadows on everything, pill buttons, boxed FAQ. | Reads as an app UI kit, not a beauty institute. | Small 4px radii, **no drop shadows**, hairline borders, rectangular buttons, FAQ as a hairline list. | High | Low |
| 6 | **Monotone section headers**: every section is eyebrow + h2 + grey paragraph, same size, same place. | Flat hierarchy; nothing leads. | Fewer eyebrows, larger confident headings with one italic rose accent, varied alignment (menu header left, gallery header split, contact centred). | Medium | Low |
| 7 | **Video squeezed** into a gallery column with heavy native controls. | Her best asset (24 s of her talking) looks like an afterthought. | Video moves to the **Véro section**, beside her portrait and words, as a framed vertical film with a clear play button. | Medium | Low |
| 8 | **Micro-interactions are default**: hover = lift or colour swap. | Nothing feels considered. | Animated underlines on links, arrow nudge on the main button, slow subtle zoom with caption reveal in the gallery, active-section marker in the nav, staggered fade-ups. | Medium | Low |
| 9 | **Mobile**: the hero call button sits right at the fold; the sticky call bar only appears after scrolling. | The main conversion is a tap away from being missed. | Shorter hero photo on phones so the call button is above the fold; sticky bar keeps appearing once the hero button is off-screen. | Medium | Low |
| 10 | **Photo quality varies** (white vignette on the cabin photo, different white balances). | Inconsistency reads as amateur. | Crop the cabin vignette; warm, gentle unified grade via CSS filter (very light). | Low-medium | Low |

## Not doing, on purpose

- No scroll-pinned scenes, 3D or heavy motion: rejected direction, and they
  cost speed and clarity.
- No invented content: no reviews, address, hours or prices beyond the card.
