/* ============================================================
   RSVP  ·  submits name / phone / guest count / attendance
   to a Google Sheet via a Google Apps Script Web App.

   SETUP: see RSVP-SETUP.md in the project root. Once you've
   deployed the Apps Script web app, paste its URL below.
   ============================================================ */
(function () {
  'use strict';

  // Paste your deployed Google Apps Script Web App URL here.
  var RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyC2BJzgG8_X05plD3xruk9XaPn3C9nVeG-LiAXS8F_AiCT9QbMvUyrcIygYdOi5d63/exec";

  function initRSVP() {
    var form = document.getElementById('rsvpForm');
    if (!form) return;

    var statusEl = document.getElementById('rsvpStatus');
    var submitBtn = form.querySelector('.rsvp-submit');
    var btnText = form.querySelector('.rsvp-btn-text');

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'rsvp-status' + (type ? ' rsvp-status--' + type : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = form.querySelector('[name="name"]');
      var guestsEl = form.querySelector('[name="guests"]');
      var name = nameEl ? nameEl.value.trim() : '';
      var guests = guestsEl ? parseInt(guestsEl.value, 10) : 1;

      if (!name) {
        setStatus('Please enter your name.', 'error');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!guests || guests < 1) {
        setStatus('Please enter how many members are coming.', 'error');
        if (guestsEl) guestsEl.focus();
        return;
      }

      var attendEl = form.querySelector('[name="attend"]:checked');
      var phoneEl = form.querySelector('[name="phone"]');
      var messageEl = form.querySelector('[name="message"]');

      var data = {
        name: name,
        phone: phoneEl ? phoneEl.value.trim() : '',
        guests: guests,
        attend: attendEl ? attendEl.value : 'yes',
        message: messageEl ? messageEl.value.trim() : ''
      };

      if (!RSVP_ENDPOINT || RSVP_ENDPOINT.indexOf('PASTE_') === 0) {
        setStatus('RSVP isn\u2019t connected yet \u2014 please let the couple know directly.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending\u2026';
      setStatus('', '');

      fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        // text/plain avoids a CORS preflight that Apps Script can't answer;
        // the script still reads e.postData.contents as JSON on its side.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      })
        .then(function () {
          setStatus('Jazakallah Khair! Your RSVP for ' + guests +
            (guests === 1 ? ' member has' : ' members has') + ' been received.', 'success');
          form.reset();
        })
        .catch(function () {
          setStatus('Something went wrong. Please try again.', 'error');
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Send RSVP';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVP);
  } else {
    initRSVP();
  }
})();
