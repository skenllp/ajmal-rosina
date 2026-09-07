# Muhammed Ajmal & Rosina Thesni — Wedding Invitation Website

A cinematic, scroll-driven Muslim wedding invitation website with a tap-to-open
cover, an animated reveal video transition, ambient particles, scroll-reveal
sections, a live countdown, and a hand-drifted photo wall — pure HTML5 / CSS3 /
Vanilla JS, no frameworks.

## Structure

```
ajmal-rosina/
├── index.html          # Main HTML file — all page copy lives here
├── open.png             # Landing cover background (decorative arch frame)
├── hero.png              # Full-bleed hero photo (after the reveal video)
├── og.png                # Social share preview image
├── vedio.mp4              # Opening reveal / transition video (unchanged)
├── css/
│   ├── style.css          # Design tokens, typography, section styles
│   └── scenes.css         # Scene transition / scroll-reveal choreography
├── js/
│   ├── main.js             # Gate open, reveal video, countdown, photo wall, audio
│   └── particles.js         # Ambient particle field
├── assets/
│   ├── audio/music.mp3       # Background music
│   └── images/
│       ├── decorations/        # Section background washes (SVG)
│       └── gallery/             # 3 real couple photographs
└── README.md
```

## Couple Details

- **Groom:** Muhammed Ajmal, S/o Mr. Abdul Azeez & Mrs. Mumthaz
- **Bride:** Rosina Thesni, D/o Mr. Abdul Majeed & Mrs. Rasiya

## The Big Day

| Event                | Date              | Time              | Venue            |
|-----------------------|-------------------|--------------------|-------------------|
| Wedding & Reception   | Saturday, 14 November 2026 | 3:00 PM – 7:00 PM | AJWA Auditorium   |

Location: https://maps.app.goo.gl/FLLLdQAFnZa43i4R9?g_st=ic

## Timeline / Story Milestones

1. **Family Meet** — 18 September 2026
   > "Two families met, two hearts aligned, and a lifelong journey began."
2. **Nikah — Sacred Union** — 28 September 2025
   > "Held together by faith, bound by love, forever sealed in a sacred vow."
3. **The Big Day** — Saturday, 14 November 2026, 3:00 PM – 7:00 PM, AJWA Auditorium

## What was kept from the original template

- The tap-to-open **landing cover** and its **reveal-video transition** (`vedio.mp4`)
  are unchanged — this is the "opening" experience the site is built around.
- All scroll animations, the particle field, the photo-wall physics, and the
  audio-disc player are unchanged (`js/main.js`, `js/particles.js`, `css/scenes.css`).
- The commented-out "ceremony" section (a duplicate of the reception details in
  the original template) has been removed — this invitation has a single combined
  Wedding & Reception event, matching the "Big Day" timeline entry.

## What was customized

- `index.html` — title, meta tags, structured content in every section: landing
  cover, hero alt text, wedding details + countdown copy, our-story, timeline,
  bride & groom, parents & family, the Big Day event card (with a live
  "Get Directions" link), gallery, thank-you and footer.
- `js/main.js` — the countdown target, updated to `2026-11-14T15:00:00+05:30`.
- `open.png` — replaced with a decorative Islamic arch frame background.
- `hero.png` — replaced with a real couple photograph (full-bleed).
- `og.png` — replaced with a real couple photograph (social share preview).
- `assets/images/gallery/` — replaced with 3 real couple photographs.
- `assets/audio/music.mp3` — replaced with the provided background track.

## Editing content

This template does not use a separate config file — all copy lives directly
in `index.html`, matching each section's markup (landing, hero, details,
story, timeline, couple, family, reception, gallery, thankyou, footer).
The countdown target date is set in `js/main.js` near the top of the
"Countdown" block.

- `og:url` / canonical-style links use a placeholder domain
  `https://ajmal-rosina.skenllp.com/` — update once the site is deployed.
