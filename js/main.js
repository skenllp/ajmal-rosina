/* ============================================================
   Cinematic flow controller
   Gate opening → hero → scroll journey
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;
  var gate = document.getElementById('gate');
  var gateEnterBtn = document.getElementById('gate-enter');
  var heroImg = document.getElementById('heroImg');

  /* ---------------------------------------------------------
     0 · Ambient audio  ·  disc control + play after gate open
     --------------------------------------------------------- */
  var bgAudio = document.getElementById('bgAudio');
  var audioBtn = document.getElementById('audioBtn');
  var audioStarted = false;

  function setAudioUi(playing) {
    if (!audioBtn) return;
    audioBtn.classList.toggle('is-playing', playing);
    audioBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    audioBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

  function showAudioControl() {
    if (!audioBtn) return;
    audioBtn.hidden = false;
    requestAnimationFrame(function () {
      audioBtn.classList.add('is-visible');
    });
  }

  function startAmbientAudio() {
    if (!bgAudio || audioStarted) return;
    audioStarted = true;
    showAudioControl();

    bgAudio.volume = 0.72;
    var play = bgAudio.play();
    if (play && play.then) {
      play.then(function () {
        setAudioUi(true);
      }).catch(function () {
        /* Autoplay blocked — control stays visible so guest can tap */
        setAudioUi(false);
        var unlock = function () {
          if (bgAudio && bgAudio.paused) {
            bgAudio.play().then(function () { setAudioUi(true); }).catch(function () {});
          }
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
      });
    } else if (!bgAudio.paused) {
      setAudioUi(true);
    }
  }

  function toggleAmbientAudio() {
    if (!bgAudio) return;
    if (bgAudio.paused) {
      var play = bgAudio.play();
      if (play && play.then) {
        play.then(function () { setAudioUi(true); }).catch(function () { setAudioUi(false); });
      } else {
        setAudioUi(!bgAudio.paused);
      }
    } else {
      bgAudio.pause();
      setAudioUi(false);
    }
  }

  if (audioBtn) audioBtn.addEventListener('click', toggleAmbientAudio);
  if (bgAudio) {
    bgAudio.addEventListener('play', function () { setAudioUi(true); });
    bgAudio.addEventListener('pause', function () { setAudioUi(false); });
    bgAudio.addEventListener('ended', function () { setAudioUi(false); });
  }

  /* ---------------------------------------------------------
     1 · Image fallback chain + graceful placeholders
     --------------------------------------------------------- */
  function markMissing(img) {
    img.classList.add('failed');
    var host = img.parentElement;
    if (!host) return;

    if (img.classList.contains('cover-img') || img.classList.contains('section-bg') || img.classList.contains('bleed') || img.id === 'heroImg') {
      if (host.classList.contains('landing-media') || host.classList.contains('scene-frame') || host.classList.contains('scene') || host.id === 'reveal') {
        host.classList.add('fallback-on');
      }
    } else if (host.classList.contains('portrait') || host.classList.contains('tile') || host.classList.contains('photo-card__paper')) {
      var emptyHost = host.classList.contains('photo-card__paper') ? host.closest('.photo-card') || host : host;
      emptyHost.classList.add('is-empty');
      emptyHost.setAttribute('data-label', img.getAttribute('data-placeholder') || 'Photo');
      if (host.classList.contains('photo-card__paper')) {
        host.setAttribute('data-label', img.getAttribute('data-placeholder') || 'Photo');
      }
    }
  }

  function wireImage(img) {
    var queue = (img.getAttribute('data-fallbacks') || '')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    img.addEventListener('error', function () {
      if (queue.length) { img.src = queue.shift(); return; }
      markMissing(img);
    });

    if (img.complete && img.naturalWidth === 0) {
      if (queue.length) img.src = queue.shift();
      else markMissing(img);
    }
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('img[data-fallbacks], img[data-placeholder]'),
    wireImage
  );

  /* ---------------------------------------------------------
     2 · Scroll lock
     --------------------------------------------------------- */
  function blockTouch(e) { if (body.classList.contains('is-locked')) e.preventDefault(); }
  document.addEventListener('touchmove', blockTouch, { passive: false });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function jumpToTop() {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }

  function unlockScroll() {
    body.classList.remove('is-locked');
    jumpToTop();
  }

  /* ---------------------------------------------------------
     3 · Gate opening logic
     --------------------------------------------------------- */
  var opened = false;

  function openGate() {
    if (opened) return;
    opened = true;

    gate.classList.add('gate-closing');
    body.classList.remove('gate-active');
    body.classList.add('page-loaded', 'is-revealed');

    // Start music with the gate opening
    startAmbientAudio();

    window.setTimeout(function () {
      gate.classList.add('gate-hidden');
      gate.setAttribute('aria-hidden', 'true');
      
      // Initialize everything after gate closes
      unlockScroll();
      initReveals();
      initGalleryWall();
      activateLazySections();
      
      var heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.classList.add('loaded', 'text-ready');
        heroEl.setAttribute('aria-busy', 'false');
      }
    }, 1100);
  }

  if (gateEnterBtn) {
    gateEnterBtn.addEventListener('click', openGate);
    gateEnterBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGate();
      }
    });
  }

  if (gate) {
    gate.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('button')) return;
      openGate();
    });
  }

  /* ---------------------------------------------------------
     4 · Hero gate  ·  never show until bg is loaded + decoded
     --------------------------------------------------------- */
  var heroEl = document.getElementById('hero');
  var heroIsReady = false;
  var TEXT_REVEAL_MS = 520;

  var HERO_CANDIDATES = (
    (heroImg && heroImg.getAttribute('data-candidates')) ||
    'hero.png'
  ).split(',').map(function (s) { return s.trim(); }).filter(Boolean);

  function loadAndDecodeUrl(url) {
    return new Promise(function (resolve, reject) {
      var probe = new Image();
      probe.decoding = 'async';

      function succeed() {
        if (probe.decode) {
          probe.decode().then(function () { resolve(url); }).catch(function () { resolve(url); });
        } else {
          resolve(url);
        }
      }

      probe.onload = succeed;
      probe.onerror = function () { reject(new Error('fail ' + url)); };
      probe.src = url;

      if (probe.complete && probe.naturalWidth > 0) succeed();
    });
  }

  function firstAvailable(urls, index) {
    index = index || 0;
    if (index >= urls.length) {
      return Promise.reject(new Error('no hero asset'));
    }
    return loadAndDecodeUrl(urls[index]).catch(function () {
      return firstAvailable(urls, index + 1);
    });
  }

  function applyHeroUrl(url) {
    if (!heroImg || !url) return Promise.resolve();
    heroImg.src = url;
    if (heroImg.decode) {
      return heroImg.decode().catch(function () {});
    }
    return Promise.resolve();
  }

  // Preload hero image on page load
  if (document.readyState === 'complete') {
    firstAvailable(HERO_CANDIDATES).then(applyHeroUrl);
  } else {
    window.addEventListener('load', function() {
      firstAvailable(HERO_CANDIDATES).then(applyHeroUrl);
    });
  }

  /* ---------------------------------------------------------
     6 · Scroll reveals  ·  start only after the site is visible
     --------------------------------------------------------- */
  var revealsStarted = false;
  function initReveals() {
    if (revealsStarted) return;
    revealsStarted = true;

    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     7 · Lazy sections  ·  hydrate gallery / portrait srcs late
     --------------------------------------------------------- */
  function activateLazySections() {
    /* Native lazy already covers gallery + portraits. This only
       upgrades any data-src deferrals if present. */
    Array.prototype.forEach.call(
      document.querySelectorAll('#gallery img[data-src], #couple img[data-src]'),
      function (img) {
        if (!img.getAttribute('src')) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        }
      }
    );
  }

  /* ---------------------------------------------------------
     7b · Gallery photo wall  ·  enter / float / parallax / touch
     --------------------------------------------------------- */
  function initGalleryWall() {
    var wall = document.getElementById('photoWall');
    if (!wall) return;

    var cards = wall.querySelectorAll('.photo-card');
    if (!cards.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealCard(card) {
      if (card.classList.contains('is-in')) return;
      card.classList.add('is-in');
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(cards, revealCard);
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          revealCard(en.target);
          io.unobserve(en.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      Array.prototype.forEach.call(cards, function (card) { io.observe(card); });
    }

    /* Touch bounce + soft glow */
    Array.prototype.forEach.call(cards, function (card) {
      var clearTouch = function () {
        card.classList.remove('is-touched');
      };
      card.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        card.classList.add('is-touched');
        window.setTimeout(clearTouch, 560);
      }, { passive: true });
    });

    if (reduceMotion) return;

    /* Subtle scroll parallax — different speeds per card */
    var ticking = false;
    var speeds = [];
    Array.prototype.forEach.call(cards, function (card, i) {
      var raw = parseFloat(card.getAttribute('data-speed'));
      speeds[i] = isNaN(raw) ? ((i % 2 === 0) ? 0.05 : -0.04) : raw;
    });

    function updateParallax() {
      ticking = false;
      var vh = window.innerHeight || 1;
      var mid = vh * 0.5;
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (!card.classList.contains('is-in')) continue;
        var rect = card.getBoundingClientRect();
        /* Skip far-offscreen work */
        if (rect.bottom < -80 || rect.top > vh + 80) continue;
        var offset = (rect.top + rect.height * 0.5 - mid) * speeds[i];
        /* Clamp to keep motion almost invisible */
        if (offset > 18) offset = 18;
        if (offset < -18) offset = -18;
        card.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     8 · Countdown  ·  14 Nov 2026, 15:00 IST
     --------------------------------------------------------- */
  (function countdown() {
    var target = new Date('2026-11-14T15:00:00+05:30').getTime();
    var d = document.getElementById('cdD'),
        h = document.getElementById('cdH'),
        m = document.getElementById('cdM'),
        s = document.getElementById('cdS');
    if (!d || isNaN(target)) return;

    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    function tick() {
      var left = target - Date.now();
      if (left <= 0) {
        d.textContent = h.textContent = m.textContent = s.textContent = '00';
        clearInterval(timer);
        return;
      }
      var sec = Math.floor(left / 1000);
      d.textContent = pad(Math.floor(sec / 86400));
      h.textContent = pad(Math.floor(sec / 3600) % 24);
      m.textContent = pad(Math.floor(sec / 60) % 60);
      s.textContent = pad(sec % 60);
    }
    tick();
    var timer = setInterval(tick, 1000);
  })();

  /* ---------------------------------------------------------
     9 · Particles + THANK YOU finale
     --------------------------------------------------------- */
  function bootParticles() {
    if (!window.KeralaParticles) return;
    window.KeralaParticles.init();

    var stage = document.getElementById('finaleStage');
    if (!stage || !('IntersectionObserver' in window)) return;

    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.6) {
          window.KeralaParticles.finale(stage);
        } else if (!en.isIntersecting && en.boundingClientRect.top > 0) {
          window.KeralaParticles.reset();
        }
      });
    }, { threshold: [0, 0.6, 0.95] });

    fo.observe(stage);
  }

  if (document.readyState === 'complete') bootParticles();
  else window.addEventListener('load', bootParticles);

  /* ---------------------------------------------------------
     10 · Smooth anchor
     --------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

})();
