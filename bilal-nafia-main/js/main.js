// ===== MAIN JS =====
(function() {
  'use strict';

  var CFG = window.WEDDING_CONFIG || {};

  // ===== BACKGROUND MUSIC =====
  function initMusic() {
    var audio     = document.getElementById('bg-music');
    var muteBtn   = document.getElementById('mute-btn');
    var iconSound = document.getElementById('icon-sound');
    var iconMuted = document.getElementById('icon-muted');
    if (!audio || !muteBtn) return;

    var musicCfg = CFG.music || {};
    audio.volume = musicCfg.volume != null ? musicCfg.volume : 0.45;
    var started = false;

    function setMutedState(muted) {
      if (muted) {
        audio.pause();
        iconSound.style.display = 'none';
        iconMuted.style.display = '';
        muteBtn.classList.add('muted');
        muteBtn.setAttribute('aria-label', 'Unmute music');
      } else {
        audio.play().catch(function(){});
        iconSound.style.display = '';
        iconMuted.style.display = 'none';
        muteBtn.classList.remove('muted');
        muteBtn.setAttribute('aria-label', 'Mute music');
      }
    }

    // Try immediate autoplay
    window.addEventListener('load', function() {
      audio.play()
        .then(function() { started = true; })
        .catch(function(){});
    });

    function startOnInteraction() {
      if (!started) {
        audio.play().catch(function(){});
        started = true;
      }
    }

    document.addEventListener('click',      startOnInteraction, { once: true });
    document.addEventListener('scroll',     startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    muteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      startOnInteraction();
      setMutedState(!audio.paused);
    });
  }

  // ===== OPENING GATE (click-to-enter) =====
  function initGate() {
    var gate     = document.getElementById('gate');
    var enterBtn = document.getElementById('gate-enter');
    if (!gate || !enterBtn) return;

    var opened = false;

    function openGate() {
      if (opened) return;
      opened = true;

      gate.classList.add('gate-closing');
      document.body.classList.remove('gate-active');
      document.body.classList.add('page-loaded');

      window.setTimeout(function() {
        gate.classList.add('gate-hidden');
        gate.setAttribute('aria-hidden', 'true');
      }, 1100);
    }

    enterBtn.addEventListener('click', openGate);
    enterBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGate();
      }
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  function initMobileNav() {
    var burger   = document.querySelector('.nav-burger');
    var navLinks = document.querySelector('.nav-links');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // ===== INTERSECTION OBSERVER FOR SECTION TRACKING =====
  function initSectionTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function(s) { sectionObserver.observe(s); });
  }

  // ===== LIGHTBOX (gallery) =====
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lightbox-img');
    var lbClose  = document.getElementById('lightbox-close');
    if (!lightbox || !lbImg) return;

    document.querySelectorAll('.gallery-item img').forEach(function(img) {
      img.addEventListener('click', function() {
        lbImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initGate();
    initMobileNav();
    initSectionTracking();
    initLightbox();
  });
})();