/**
 * ============================================================
 *  WEDDING CONFIGURATION — BILAL & NAFIA
 *  Edit this file to update all wedding details across the site
 * ============================================================
 */
window.WEDDING_CONFIG = {

  /* ── SEO & METADATA ─────────────────────────────────────── */
  seo: {
    title:             'Bilal & Nafia — Wedding Invitation',
    description:       'With the blessings of Allah, Mrs. Shahidha cordially invites you to the wedding of her beloved son Bilal Kottarathil with Nafia Nafeesa on 08–09 August 2026 at TBS Villa, Kuthuparamba.',
    ogTitle:           'Bilal & Nafia — Wedding Invitation',
    ogDescription:     'You are warmly invited to the wedding of Bilal Kottarathil & Nafia Nafeesa — 08–09 August 2026.',
    ogImage:           'og-image.jpg',
    canonicalUrl:      'https://bilal-nafia.skenllp.com/',
    themeColor:        '#C8A96A',
  },

  /* ── COUPLE ─────────────────────────────────────────────── */
  groom: {
    firstName:         'Bilal',
    fullName:          'Bilal Kottarathil',
    role:              'The Groom',
    parentLabel:       'Beloved Son of',
    parents: [
      { name: 'Late Mr. Beeran',  prefix: '' },
      { name: 'Mrs. Shahidha',    prefix: '&' },
    ],
  },

  bride: {
    firstName:         'Nafia',
    fullName:          'Nafia Nafeesa',
    role:              'The Bride',
    parentLabel:       'Beloved Daughter of',
    parents: [
      { name: 'Late Muhammed Harif P.P', prefix: '' },
    ],
    grandParentLabel:  'Granddaughter of',
    grandParents: [
      { name: 'Late Pallimoopan Ummer', prefix: '' },
      { name: 'Late K.P. Ummer',        prefix: '&' },
    ],
  },

  /* ── HOSTING FAMILY ─────────────────────────────────────── */
  host: {
    familyName:        'KOTTARATHIL FAMILY',
    hostName:          'Mrs. Shahidha',
    hostTitle:         'wife of Late Mr. Beeran',
    inviteIntro:       'cordially invites you and your family to grace the wedding ceremony of her beloved son',
    navLogo:           'B & N',
  },

  /* ── DATES ───────────────────────────────────────────────── */
  dates: {
    displayRange:      '08 • 09 August 2026',
    displayDot:        '08 · 09 · 2026',
  },

  /* ── COUNTDOWN ───────────────────────────────────────────── */
  countdown: {
    nikkah: {
      label:   'Nikkah Ceremony',
      // After Maghrib ≈ 18:45 IST on 08 Aug 2026
      target:  '2026-08-08T18:45:00',
    },
    reception: {
      label:   'Reception',
      target:  '2026-08-09T12:00:00',
    },
  },

  /* ── EVENTS ──────────────────────────────────────────────── */
  events: [
    {
      id:        'nikkah',
      type:      'Sacred Ceremony',
      title:     'Nikkah',
      icon:      'fas fa-mosque',
      dayName:   'Saturday',
      date:      '08 August 2026',
      time:      'After Maghrib Prayer',
      venue: {
        name:    'TBS VILLA',
        address: 'Old Road, Ambilad,\nKuthuparamba',
      },
      mapsUrl:   'https://maps.app.goo.gl/yiRkUqKZtf1FQHo99',
      mapsLabel: 'Open Google Maps',
    },
    {
      id:        'reception',
      type:      'Celebration',
      title:     'Reception',
      icon:      'fas fa-star',
      dayName:   'Sunday',
      date:      '09 August 2026',
      time:      '12:00 PM Onwards',
      venue: {
        name:    'To Be Updated',
        address: '',
      },
      // Set mapsUrl to '' to hide the button until venue is confirmed
      mapsUrl:   '',
      mapsLabel: 'Open Google Maps',
    },
  ],

  /* ── GALLERY IMAGES ──────────────────────────────────────── */
  gallery: [
    { src: 'assets/images/gallery-1.jpg', alt: 'Bilal & Nafia — Photo 1' },
    { src: 'assets/images/gallery-2.jpg', alt: 'Bilal & Nafia — Photo 2' },
    { src: 'assets/images/gallery-3.jpg', alt: 'Bilal & Nafia — Photo 3' },
    { src: 'assets/images/gallery-4.jpg', alt: 'Bilal & Nafia — Photo 4' },
    { src: 'assets/images/gallery-5.jpg', alt: 'Bilal & Nafia — Photo 5' },
  ],

  /* ── MUSIC ───────────────────────────────────────────────── */
  music: {
    src:    'assets/music.mp3',
    volume: 0.45,
  },

  /* ── REGARDS SECTION ─────────────────────────────────────── */
  regards: {
    heading: 'THANKS & LOVING',
    columns: [
      {
        role:   'Elder Brother',
        names:  ['(Late) Bahabood Kottarathil'],
      },
      {
        role:   'Sister family',
        names:  ['Sathar & Bahaboodiya Kottarathil', 'Daughter - Fathima Kottarathil'],
      },
    ],
  },

  /* ── FOOTER ──────────────────────────────────────────────── */
  footer: {
    message:     'We look forward to celebrating this special day with you.',
    tagline:     'Best Compliments from Dear and Near Ones',
  },

};
