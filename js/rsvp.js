/* ============================================================
   RSVP + Wishes Wall
   Submits to a single Google Apps Script Web App, using an
   eventType field so one backend can serve both programmes
   plus the Wishes Wall.

   SETUP: see RSVP-SETUP.md in the project root. Once you've
   deployed the Apps Script web app, paste its URL below.
   ============================================================ */
(function () {
  'use strict';

  // Paste your deployed Google Apps Script Web App URL here.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbx2Wsr5WMZO-6M7TctIgUGph1bjpRq_fpf3swJsoyy5dKVI-wx_mYB5n9FMR3cla_PF/exec';

  function isConfigured() {
    return !!ENDPOINT && ENDPOINT.indexOf('PASTE_') !== 0;
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = 'rsvp-status' + (type ? ' rsvp-status--' + type : '');
  }

  /* ---------------------------------------------------------
     RSVP forms (Bride's Home Visit + Wedding & Reception)
     --------------------------------------------------------- */
  function initRsvpForm(formId, statusId, successMessage) {
    var form = document.getElementById(formId);
    if (!form) return;

    var statusEl = document.getElementById(statusId);
    var submitBtn = form.querySelector('.rsvp-submit');
    var btnText = form.querySelector('.rsvp-btn-text');
    var eventType = form.getAttribute('data-event-type') || 'rsvp';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = form.querySelector('[name="name"]');
      var guestsEl = form.querySelector('[name="guests"]');
      var name = nameEl ? nameEl.value.trim() : '';
      var guests = guestsEl ? parseInt(guestsEl.value, 10) : 1;

      if (!name) {
        setStatus(statusEl, 'Please enter your name.', 'error');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!guests || guests < 1) {
        setStatus(statusEl, 'Please enter how many people are attending.', 'error');
        if (guestsEl) guestsEl.focus();
        return;
      }

      var attendEl = form.querySelector('[name="attend"]:checked');
      var phoneEl = form.querySelector('[name="phone"]');
      var messageEl = form.querySelector('[name="message"]');

      if (phoneEl && phoneEl.hasAttribute('required') && !phoneEl.value.trim()) {
        setStatus(statusEl, 'Please enter your phone number.', 'error');
        phoneEl.focus();
        return;
      }

      var data = {
        eventType: eventType,
        name: name,
        guests: guests,
        attend: attendEl ? attendEl.value : 'yes'
      };
      if (phoneEl) data.phone = phoneEl.value.trim();
      if (messageEl) data.message = messageEl.value.trim();

      if (!isConfigured()) {
        setStatus(statusEl, 'RSVP isn\u2019t connected yet \u2014 please let the couple know directly.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending\u2026';
      setStatus(statusEl, '', '');

      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        // text/plain avoids a CORS preflight that Apps Script can't answer;
        // the script still reads e.postData.contents as JSON on its side.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      })
        .then(function () {
          setStatus(statusEl, successMessage, 'success');
          form.reset();
        })
        .catch(function () {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Send RSVP';
        });
    });
  }

  /* ---------------------------------------------------------
     Wishes Wall  ·  submit + fetch approved wishes
     --------------------------------------------------------- */
  function initWishForm() {
    var form = document.getElementById('wishForm');
    if (!form) return;

    var statusEl = document.getElementById('wishStatus');
    var submitBtn = form.querySelector('.rsvp-submit');
    var btnText = form.querySelector('.rsvp-btn-text');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = form.querySelector('[name="name"]');
      var wishEl = form.querySelector('[name="wish"]');
      var name = nameEl ? nameEl.value.trim() : '';
      var wish = wishEl ? wishEl.value.trim() : '';

      if (!name) {
        setStatus(statusEl, 'Please enter your name.', 'error');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!wish) {
        setStatus(statusEl, 'Please write a wish for the couple.', 'error');
        if (wishEl) wishEl.focus();
        return;
      }

      if (!isConfigured()) {
        setStatus(statusEl, 'Wishes aren\u2019t connected yet \u2014 please share it with the couple directly.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending\u2026';
      setStatus(statusEl, '', '');

      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ eventType: 'wish', name: name, wish: wish })
      })
        .then(function () {
          setStatus(statusEl, 'Jazakallah Khair! Your wish has been received and will appear once approved.', 'success');
          form.reset();
        })
        .catch(function () {
          setStatus(statusEl, 'Something went wrong. Please try again.', 'error');
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Send Your Wish';
        });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderWishes(grid, wishes) {
    grid.innerHTML = '';

    if (!wishes || !wishes.length) {
      var empty = document.createElement('p');
      empty.className = 'wishes-status';
      empty.textContent = 'Be the first to leave a wish.';
      grid.appendChild(empty);
      return;
    }

    wishes.forEach(function (w) {
      var card = document.createElement('article');
      card.className = 'wish-card';
      card.innerHTML =
        '<svg class="ico wish-quote-ico" aria-hidden="true"><use href="#i-jasmine"></use></svg>' +
        '<p class="wish-text">\u201C' + escapeHtml(w.wish) + '\u201D</p>' +
        '<p class="wish-author">\u2014 ' + escapeHtml(w.name) + '</p>';
      grid.appendChild(card);
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      Array.prototype.forEach.call(grid.querySelectorAll('.wish-card'), function (card) { io.observe(card); });
    } else {
      Array.prototype.forEach.call(grid.querySelectorAll('.wish-card'), function (card) {
        card.classList.add('is-in');
      });
    }
  }

  function loadWishes() {
    var grid = document.getElementById('wishesGrid');
    if (!grid) return;

    if (!isConfigured()) {
      grid.innerHTML = '<p class="wishes-status">Be the first to leave a wish.</p>';
      return;
    }

    fetch(ENDPOINT + '?action=wishes', { method: 'GET' })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        renderWishes(grid, (json && json.wishes) || []);
      })
      .catch(function () {
        grid.innerHTML = '<p class="wishes-status">Be the first to leave a wish.</p>';
      });
  }

  function init() {
    initRsvpForm(
      'rsvpBrideForm',
      'brideRsvpStatus',
      'Thank you for confirming your presence. We look forward to welcoming you.'
    );
    initRsvpForm(
      'rsvpWeddingForm',
      'rsvpWeddingStatus',
      'Thank you for confirming your presence. We look forward to celebrating with you.'
    );
    initWishForm();
    loadWishes();

    // Lightweight periodic refresh so newly-approved wishes appear without
    // reloading the page — every 2 minutes, only while the tab is visible.
    setInterval(function () {
      if (document.visibilityState === 'visible') loadWishes();
    }, 120000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
