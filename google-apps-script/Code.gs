/**
 * Backend for the wedding site — RSVPs (two programmes) + Wishes Wall.
 * Deploy this as a Web App (see ../RSVP-SETUP.md) bound to a Google Sheet.
 *
 * One Apps Script Web App serves three separate tabs:
 *   - "Bride Home Visit RSVP"  (no phone number collected)
 *   - "Wedding RSVP"           (phone number required)
 *   - "Wishes"                 (moderated — only Approved = TRUE rows are
 *                                returned to the website)
 *
 * Requests are routed by an `eventType` field:
 *   "bride_home_visit"  -> Bride Home Visit RSVP tab
 *   "wedding_reception"  -> Wedding RSVP tab
 *   "wish"               -> Wishes tab (Approved starts as FALSE)
 *
 * Each RSVP tab keeps a live summary block (via spreadsheet formulas, so
 * it always stays correct even if you edit rows by hand) showing:
 *   - Total Confirmed RSVPs
 *   - Total Declined RSVPs
 *   - Total Confirmed People  (SUM of guest counts where Attending = Yes —
 *     NOT a count of submissions)
 */

var BRIDE_SHEET_NAME = 'Bride Home Visit RSVP';
var WEDDING_SHEET_NAME = 'Wedding RSVP';
var WISHES_SHEET_NAME = 'Wishes';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var eventType = data.eventType || '';

  if (eventType === 'bride_home_visit') {
    appendBrideRsvp_(data);
  } else if (eventType === 'wedding_reception') {
    appendWeddingRsvp_(data);
  } else if (eventType === 'wish') {
    appendWish_(data);
  } else {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: 'Unknown eventType' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'wishes') {
    return ContentService
      .createTextOutput(JSON.stringify({ wishes: getApprovedWishes_() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('RSVP endpoint is live.');
}

/* ---------------------------------------------------------
   Bride's Home Visit RSVP  ·  no phone number
   --------------------------------------------------------- */
function appendBrideRsvp_(data) {
  var sheet = getOrCreateSheet_(BRIDE_SHEET_NAME);
  var guests = Number(data.guests) || 0;
  var attending = (data.attend === 'yes' || data.attend === 'attend') ? 'Yes' : 'No';

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:D1').setValues([['Timestamp', 'Name', 'Guests', 'Attending']]);
    sheet.getRange('A1:D1').setFontWeight('bold');

    sheet.getRange('F1').setValue('Total Confirmed People');
    sheet.getRange('G1').setFormula('=SUMIF(D2:D, "Yes", C2:C)');
    sheet.getRange('F2').setValue('Total Confirmed RSVPs');
    sheet.getRange('G2').setFormula('=COUNTIF(D2:D, "Yes")');
    sheet.getRange('F3').setValue('Total Declined RSVPs');
    sheet.getRange('G3').setFormula('=COUNTIF(D2:D, "No")');
    sheet.getRange('F1:F3').setFontWeight('bold');

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 7);
  }

  sheet.appendRow([new Date(), data.name || '', guests, attending]);
}

/* ---------------------------------------------------------
   Wedding & Reception RSVP  ·  phone number required
   --------------------------------------------------------- */
function appendWeddingRsvp_(data) {
  var sheet = getOrCreateSheet_(WEDDING_SHEET_NAME);
  var guests = Number(data.guests) || 0;
  var attending = (data.attend === 'yes' || data.attend === 'attend') ? 'Yes' : 'No';

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:F1').setValues([
      ['Timestamp', 'Name', 'Phone', 'Guests', 'Attending', 'Message']
    ]);
    sheet.getRange('A1:F1').setFontWeight('bold');

    sheet.getRange('H1').setValue('Total Confirmed People');
    sheet.getRange('I1').setFormula('=SUMIF(E2:E, "Yes", D2:D)');
    sheet.getRange('H2').setValue('Total Confirmed RSVPs');
    sheet.getRange('I2').setFormula('=COUNTIF(E2:E, "Yes")');
    sheet.getRange('H3').setValue('Total Declined RSVPs');
    sheet.getRange('I3').setFormula('=COUNTIF(E2:E, "No")');
    sheet.getRange('H1:H3').setFontWeight('bold');

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 9);
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    guests,
    attending,
    data.message || ''
  ]);
}

/* ---------------------------------------------------------
   Wishes  ·  moderated — Approved starts FALSE
   --------------------------------------------------------- */
function appendWish_(data) {
  var sheet = getOrCreateSheet_(WISHES_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:D1').setValues([['Timestamp', 'Name', 'Wish', 'Approved']]);
    sheet.getRange('A1:D1').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 4);
  }

  sheet.appendRow([new Date(), data.name || '', data.wish || '', false]);
}

function getApprovedWishes_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(WISHES_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  var wishes = [];

  rows.forEach(function (row) {
    var name = row[1];
    var wish = row[2];
    var approved = row[3];
    var isApproved = approved === true || String(approved).toLowerCase() === 'true';
    if (isApproved && name && wish) {
      wishes.push({ name: String(name), wish: String(wish) });
    }
  });

  // Most recent first.
  return wishes.reverse();
}

function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}
