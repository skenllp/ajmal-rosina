# RSVP Google Sheets Setup Guide

## Step 1 — Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet
2. Name it **"Ajmal & Rosina — Wedding RSVP"**

## Step 2 — Open Apps Script
1. In the spreadsheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste the full contents of **`google-apps-script.js`** from this project
4. Click **Save** (💾)

## Step 3 — Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type" → choose **Web app**
3. Set the following:
   - **Description**: Wedding RSVP
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## Step 4 — Paste URL into rsvp.js
1. Open `js/rsvp.js` in this project
2. Find the line:
   ```js
   var ENDPOINT = '...';
   ```
3. Replace the URL with your copied Web App URL
4. Save the file

## Step 5 — Test It
1. Open the website and submit an RSVP
2. Go back to your Google Sheet — you should see two new sheets:
   - **RSVP** — all wedding RSVPs with name, phone, guests count, etc.
   - **Wishes** — all wishes (set "Approved" column to "yes" to show on site)

## Viewing Total Guest Count
In your RSVP sheet, you can add a summary anywhere:

| Formula | What it shows |
|---------|--------------|
| `=COUNTA(B:B)-1` | Total number of RSVPs |
| `=SUMIF(G:G,"wedding_reception",D:D)` | Total people attending wedding |
| `=COUNTIF(E:E,"yes")` | Number who confirmed attendance |
| `=COUNTIF(E:E,"no")` | Number who declined |

## Re-deploying after code changes
If you update the Apps Script code, you must create a **new deployment** (not edit existing):
1. Deploy → New deployment
2. Use the **new** URL in `rsvp.js`
