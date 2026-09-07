/**
 * RSVP backend for the wedding site.
 * Deploy this as a Web App (see ../RSVP-SETUP.md) bound to a Google Sheet.
 *
 * Each RSVP is appended as a row. A summary block (columns H:I) keeps a
 * live running total of how many members are coming, using spreadsheet
 * formulas so it always stays correct even if you edit rows by hand.
 */

var SHEET_NAME = 'RSVP';

function doPost(e) {
  var sheet = getSheet_();
  var data = JSON.parse(e.postData.contents);

  var guests = Number(data.guests) || 0;
  var attending = (data.attend === 'yes' || data.attend === 'attend') ? 'Yes' : 'No';

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    guests,
    attending,
    data.message || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('RSVP endpoint is live.');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:F1').setValues([
      ['Timestamp', 'Name', 'Phone', 'Guests', 'Attending', 'Message']
    ]);
    sheet.getRange('A1:F1').setFontWeight('bold');

    // Live summary — these are formulas, so they auto-update as rows are added.
    sheet.getRange('H1').setValue('Total Members Coming');
    sheet.getRange('I1').setFormula('=SUMIF(E2:E, "Yes", D2:D)');
    sheet.getRange('H2').setValue('Total RSVPs Accepted');
    sheet.getRange('I2').setFormula('=COUNTIF(E2:E, "Yes")');
    sheet.getRange('H3').setValue('Total RSVPs Declined');
    sheet.getRange('I3').setFormula('=COUNTIF(E2:E, "No")');
    sheet.getRange('H1:H3').setFontWeight('bold');

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 9);
  }

  return sheet;
}
