# RSVP → Google Sheet setup

The RSVP section on the site (`#rsvp`) posts each response — name, phone,
**number of members coming**, attending yes/no, and an optional message —
to a Google Sheet. The sheet keeps a live, always-correct **total of how
many members are coming** using formulas, so you never have to add it up
by hand.

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like "Ajmal & Rosina — RSVPs".
2. You don't need to add any headers or columns yourself — the script
   creates them automatically the first time someone RSVPs.

## 2. Add the Apps Script

1. In the sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder code in `Code.gs` and paste in the contents of
   `google-apps-script/Code.gs` from this project.
3. Click **Save** (the disk icon), and name the project (e.g. "RSVP API").

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
   var RSVP_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
   with your Web app URL:
   ```js
   var RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
3. Save, re-upload/redeploy the site, and submit a test RSVP.

## Reading the results

Open the Google Sheet — a tab named **RSVP** will contain one row per
response (Timestamp, Name, Phone, Guests, Attending, Message), and a
summary box in columns H–I:

| | |
|---|---|
| **Total Members Coming** | live sum of the Guests column, counting only "Yes" responses |
| **Total RSVPs Accepted** | count of "Yes" responses |
| **Total RSVPs Declined** | count of "No" responses |

These are spreadsheet formulas (`SUMIF` / `COUNTIF`), so the total updates
instantly as responses come in — no need to re-run anything.

## Notes

- If you ever change the deployment (e.g. redeploy a new version), Apps
  Script gives you a new URL unless you choose **Manage deployments →
  Edit → same deployment** — update `js/rsvp.js` if the URL changes.
- The form works without JavaScript errors even before you connect the
  endpoint — it will just show a friendly "not connected yet" message
  instead of silently failing.
