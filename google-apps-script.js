/**
 * ============================================================
 *  Ajmal & Rosina Wedding — Google Apps Script
 *  Paste this entire file into script.google.com
 *  and deploy as a Web App (Anyone can access).
 * ============================================================
 *
 *  SHEET STRUCTURE (auto-created):
 *    Sheet "RSVP"   → Timestamp | Name | Phone | Guests | Attend | Message | Event Type
 *    Sheet "Wishes" → Timestamp | Name | Wish | Approved
 *
 *  TOTAL COUNT FORMULA (put this in any cell you like):
 *    =SUMIF(RSVP!G:G, "wedding_reception", RSVP!D:D)
 *    This sums the "Guests" column only for wedding RSVPs.
 * ============================================================
 */

var SHEET_NAME_RSVP   = 'RSVP';
var SHEET_NAME_WISHES = 'Wishes';

/* ── Entry point for all POST requests (RSVP + Wishes) ── */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Invalid JSON' });
  }

  if (data.eventType === 'wish') {
    saveWish(data);
  } else {
    saveRsvp(data);
  }

  return jsonResponse({ ok: true });
}

/* ── Entry point for GET requests (load approved wishes) ── */
function doGet(e) {
  if (e.parameter && e.parameter.action === 'wishes') {
    return jsonResponse({ ok: true, wishes: getApprovedWishes() });
  }
  return jsonResponse({ ok: true, message: 'Wedding RSVP API is live.' });
}

/* ── Save RSVP row ── */
function saveRsvp(data) {
  var sheet = getOrCreateSheet(SHEET_NAME_RSVP, [
    'Timestamp', 'Name', 'Phone', 'Guests', 'Attend', 'Message', 'Event Type'
  ]);

  sheet.appendRow([
    new Date(),
    data.name    || '',
    data.phone   || '',
    data.guests  || 1,
    data.attend  || 'yes',
    data.message || '',
    data.eventType || 'rsvp'
  ]);
}

/* ── Save Wish row ── */
function saveWish(data) {
  var sheet = getOrCreateSheet(SHEET_NAME_WISHES, [
    'Timestamp', 'Name', 'Wish', 'Approved'
  ]);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.wish || '',
    'no'   // set to 'yes' manually to show on the Wishes Wall
  ]);
}

/* ── Fetch wishes where Approved = "yes" ── */
function getApprovedWishes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_WISHES);
  if (!sheet) return [];

  var rows = sheet.getDataRange().getValues();
  var wishes = [];

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][3]).toLowerCase() === 'yes') {
      wishes.push({ name: rows[i][1], wish: rows[i][2] });
    }
  }
  return wishes;
}

/* ── Helper: get or create a sheet with headers ── */
function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);

    // Style the header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');

    // Auto-resize columns
    for (var i = 1; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 180);
    }
  }

  return sheet;
}

/* ── Helper: return JSON response with CORS headers ── */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
