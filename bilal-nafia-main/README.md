# Afzal & Vafa — Wedding Invitation Website

A premium, luxury Muslim wedding invitation website built with pure HTML5, CSS3, and Vanilla JavaScript.

## Structure

```
afzal-vafa-invitation/
├── index.html              # Main HTML file
├── css/
│   ├── style.css           # Main styles, variables, sections
│   ├── responsive.css      # Media queries (320px → 1440px+)
│   └── animations.css      # AOS-like scroll animations, keyframes
├── js/
│   ├── main.js             # Gate/loading screen, nav, music player
│   ├── countdown.js        # Live countdown to 1 Aug 2026
│   └── animations.js       # Scroll reveal, parallax, gallery lightbox, RSVP
├── assets/
│   ├── images/
│   │   ├── couple.jpg      # Couple portrait (gate + opening section)
│   │   ├── couple1.jpg     # Alternate couple portrait (unused, spare)
│   │   ├── hero-bg.jpg     # Background photo (hero/countdown/events)
│   │   ├── hero-bg1.jpg    # Alternate background (unused, spare)
│   │   └── gallery-1..5.jpg # Gallery photos
│   └── music.mp3
└── README.md
```

## Couple Details

- **Groom:** Afzal, S/o Ashraf & Khairunnisa
- **Bride:** Vafa, D/o Musthafa & Thasni

## Event

| Event            | Date         | Time              | Venue                                              |
|------------------|--------------|-------------------|-----------------------------------------------------|
| Wedding Ceremony | 1 Aug 2026   | To be announced   | Iris Auditorium, Puthanathani, Tirur – Valanchery Road |

## Colors (unchanged from source template)

| Token    | Value     |
|----------|-----------|
| Cream    | `#F8F4ED` |
| Green    | `#2E5D50` |
| Gold     | `#C8A96A` |

## Fonts

- **Script (names):** Great Vibes
- **Serif (headings):** Playfair Display
- **Content (body):** Cormorant Garamond / Lato
- **Arabic:** Amiri

## Features

- ✅ Luxury tap-to-open gate with Bismillah + English translation
- ✅ Hero with parallax & entrance animations
- ✅ Live countdown to the wedding day
- ✅ Bride & Groom / Family section
- ✅ Events card with Google Maps link
- ✅ Love Story timeline
- ✅ Quote section (Quran verse)
- ✅ Gallery with lightbox (click to enlarge) & lazy loading
- ✅ RSVP form (name, phone, guests, message, attend/decline)
- ✅ Background music player with mute toggle
- ✅ Scroll-reveal animations
- ✅ Fully responsive (320px → 1440px+)
- ✅ SEO meta tags & Open Graph

## Notes for the couple

- The wedding **time** was left as "To be announced" — update it in `index.html`
  (search for "To be announced", 2 occurrences) once it's finalized, and update
  `js/countdown.js`'s `WEDDING_DATE` accordingly.
- The Google Maps link is a **search-query placeholder** for "Iris Auditorium,
  Puthanathani, Tirur – Valanchery Road" — swap in the exact Google Maps share
  link once you have it (2 occurrences in `index.html`).
- `og:url` / `canonical` use a placeholder domain `https://afzal-vafa.wedding/` —
  update once the site is deployed to its real address.
