# RSVP + Wishes Wall → Google Sheet setup

The site has **three** things that talk to Google Sheets through one Apps
Script Web App:

1. **RSVP for Bride's Home Visit** (`#rsvpBrideForm`) — name, number of
   people attending, attending yes/no. **No phone number is collected.**
2. **RSVP for Wedding** (`#rsvpWeddingForm`) — name, phone, number of
   people attending, attending yes/no, optional message.
3. **Wishes Wall** (`#wishForm`) — name + wish, moderated before it's
   shown publicly on the site.

Each goes to its own tab in the same spreadsheet, and each RSVP tab keeps
a live, always-correct **total number of people attending** (not a count
of submissions) using spreadsheet formulas.

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like "Ajmal & Rosina — RSVPs".
2. You don't need to add any headers or columns yourself — the script
   creates each tab automatically the first time it's needed.

## 2. Add the Apps Script

1. In the sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder code in `Code.gs` and paste in the contents of
   `google-apps-script/Code.gs` from this project.
3. Click **Save** (the disk icon), and name the project (e.g. "Wedding API").

## 3. Deploy it as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, and authorize the script when prompted (you'll see an
   "unverified app" warning since it's your own script — click **Advanced
   → Go to (project name)** to proceed).
5. Copy the **Web app URL** it gives you — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Connect the site to the sheet

1. Open `js/rsvp.js`.
2. Replace this line near the top:
   ```js
   var ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
   with your Web app URL:
   ```js
   var ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
3. Save, re-upload/redeploy the site, and submit a test RSVP and a test wish.

## Reading the results

Open the Google Sheet — it will contain three tabs:

### "Bride Home Visit RSVP"
Columns: `Timestamp, Name, Guests, Attending`. No phone number column.
Summary box in columns F–G:

| | |
|---|---|
| **Total Confirmed People** | live `SUMIF` of the Guests column, counting only "Yes" rows |
| **Total Confirmed RSVPs** | `COUNTIF` of "Yes" rows |
| **Total Declined RSVPs** | `COUNTIF` of "No" rows |

### "Wedding RSVP"
Columns: `Timestamp, Name, Phone, Guests, Attending, Message`. Same style
of summary box, in columns H–I.

### "Wishes"
Columns: `Timestamp, Name, Wish, Approved`. Every new wish is inserted
with `Approved = FALSE`. **The website only shows wishes where you've
manually set `Approved` to `TRUE`** — this is the moderation step, so
open the sheet, review new wishes, and flip the checkbox/value to `TRUE`
for the ones you want public.

The website polls `?action=wishes` for approved wishes on load and every
couple of minutes while the tab is open, so newly-approved wishes appear
without anyone having to edit the site.

## Privacy

- The Bride's Home Visit and Wedding RSVP tabs (including phone numbers,
  guest counts, and messages) are only visible to you in the Google Sheet
  — the website never reads or displays them.
- The `?action=wishes` endpoint only ever returns `name` + `wish` for
  rows marked `Approved = TRUE`. It never returns phone numbers, RSVP
  data, or unapproved wishes.

## Notes

- If you ever change the deployment (e.g. redeploy a new version), Apps
  Script gives you a new URL unless you choose **Manage deployments →
  Edit → same deployment** — update `js/rsvp.js` if the URL changes.
- Every form works without JavaScript errors even before you connect the
  endpoint — it will just show a friendly "not connected yet" message
  instead of silently failing.
