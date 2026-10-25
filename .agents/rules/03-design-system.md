---
trigger: always_on
description: "Midnight Cinema" premium dark design system for every UI change
---
# Design system — "Midnight Cinema"
Goal: premium, elegant, calm and cinematic. It must never look like a default template. Verify every screen at 1440px and 390px.

## Colour tokens (CSS variables in src/index.css, exposed to Tailwind via its current theme mechanism)
--bg #0A0A0D (warm near-black, never pure #000) | --bg-elevated #101015 | --surface #14141A | --surface-2 #1C1C24
--border rgba(255,255,255,.07) | --border-strong rgba(255,255,255,.14)
--text #F4F1EC (warm off-white, never pure #fff) | --text-muted #A09FA8 (minimum for meaningful secondary text)
--primary #E50914 (crimson: actions, active states, selection) | --primary-hover #FF2A38
--gold #D6B25E (ratings, premium badges, hairlines, eyebrow labels)
--success #3FB950 | --danger #F85149 (sparingly)
One accent family (crimson) plus gold as a rare highlight. No neon, no rainbow gradients, no other hues.

## Typography (Google Fonts, display=swap)
Headings: "Playfair Display" 600/700 — h1 clamp(2.25rem,5vw,4.25rem), tracking -0.02em, line-height 1.05; h2 clamp(1.5rem,3vw,2.25rem). Body/UI: "Inter" 400/500/600, 15–16px, line-height 1.6. Eyebrow: Inter 600, 11–12px, uppercase, tracking .24em, gold or crimson. Ratings and numbers: tabular-nums.

## Surfaces & depth
Cards: radius 16px, 1px --border, --surface; hover = translateY(-4px), --border-strong, shadow 0 24px 48px -24px rgba(0,0,0,.85), faint crimson glow rgba(229,9,20,.12).
Glass (header, floating controls): rgba(10,10,13,.72), backdrop-blur 16px, saturate 140%, hairline border.
Atmosphere: soft radial crimson glow (10–12% opacity) at the top of the page + fixed 3% film-grain overlay (SVG data-URI, pointer-events none).
Gold hairline divider between major sections: 1px linear-gradient(90deg, transparent, rgba(214,178,94,.5), transparent).
Shadows soft and deep, never harsh grey.

## Components
Button primary: crimson fill with a subtle top-to-bottom lighter gradient and 1px inner highlight, radius 12px, bold text, hover brightens + lifts 1px. Secondary: glass with hairline border. Ghost: text only. Sizes sm/md/lg, >=44px touch height on mobile. Focus ring: 2px crimson, 2px offset.
Inputs/selects: --surface-2, radius 12px, hairline border, custom chevron, crimson focus ring, muted placeholder, always-visible or sr-only labels.
Chips: pill, hairline border; selected = crimson 12% tint + crimson border + off-white text.
MovieCard: 2/3 poster, radius 16px; glass rating pill (gold star + tabular score) top-left; circular glass watchlist button top-right; hover reveals a bottom gradient; title always visible below (max 2 lines).
Hero: full-bleed backdrop, dual gradients (bottom to --bg, left to transparent), eyebrow + serif title + meta + 2-line overview + CTA pair, slow Ken-Burns scale (reduced-motion safe).
SectionHeading: gold eyebrow + serif title + optional "View all" + hairline.
Skeletons: shimmer over --surface-2, identical dimensions to final content (zero layout shift).
Empty/error states: centred, lucide icon in a glass circle, serif title, muted description, one clear action.
Thin rounded scrollbars; ::selection crimson at 35%.

## Layout & spacing
4px base unit. Container max 1280px; side padding 16/24/40px. Section rhythm 56px mobile / 96px desktop. Grid columns 2 (<640), 3 (sm), 4 (md), 5 (lg), 6 (xl), gap 16–24px. Poster aspect always 2/3.

## Motion
Easing cubic-bezier(.22,1,.36,1), 200–400ms. Page content fades/slides up 8px on mount; cards stagger (40ms steps, max 12). Everything disabled or reduced under prefers-reduced-motion.

## Do / Don't
DO: generous whitespace, strong hierarchy, consistent radii, restrained colour, crisp hairlines, real imagery as the hero of each screen.
DON'T: pure black/white, emoji as icons, heavy borders, more than two font families, low-contrast grey for important text, distracting decorative animation, default component-library looks without token overrides.

## Accessibility (applies to all UI)
Landmarks, one h1 per page, logical headings, skip link, visible :focus-visible, labelled inputs, 44px targets, meaningful alt text ("{title} poster"), decorative icons aria-hidden, role="status"/aria-live for loading and counts, role="alert" for errors, WCAG AA contrast, lazy images with reserved aspect boxes and onError fallbacks.
