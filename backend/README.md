# Backend setup

From project root run `npm install`, then copy `backend/.env.example` to `backend/.env`.

Configure `GOOGLE_APPS_SCRIPT_URL` (deployed URL ending `/exec`), `GHA_SHARED_SECRET` (same secret in Apps Script Script Properties), and `FRONTEND_ORIGIN=http://localhost:5173`.

Start with `npm run dev:backend`. Health check: http://localhost:4000/api/health

Apps Script:
1. Open your Google Sheet -> Extensions -> Apps Script.
2. Paste `google-apps-script/Code.gs`.
3. Project Settings -> Script properties:
   - GHA_SPREADSHEET_ID = ID from spreadsheet URL
   - GHA_SHARED_SECRET = long random secret
   - GHA_SHEET_TAB = Assessments
4. Run `setupSheet` once and approve Google permissions.
5. Deploy -> New deployment -> Web app; Execute as Me; access Anyone only if hospital IT permits.
6. Copy the /exec URL to backend/.env.

Never expose secrets in React, source control, logs or chat. This is a lightweight integration; hospital IT/privacy approval is required before real patient data or production use.
