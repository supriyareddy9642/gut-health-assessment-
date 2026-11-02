# Gut Health Assessment

React/Vite frontend + Express/Node backend + Google Apps Script -> Google Sheets.

## Install
From project root:
```bash
npm install
```

## Apps Script setup
1. Open the Google Sheet -> Extensions -> Apps Script.
2. Replace editor contents with `google-apps-script/Code.gs`.
3. Project Settings -> Script properties, add:
   - `GHA_SPREADSHEET_ID`: spreadsheet ID from the URL between `/d/` and `/edit`.
   - `GHA_SHARED_SECRET`: long random secret (keep private).
   - `GHA_SHEET_TAB`: `Assessments` (create/rename tab to this).
4. Run `setupSheet` once and approve permissions.
5. Deploy -> New deployment -> Web app; Execute as: Me. Choose access according to hospital IT policy. If using Anyone, protect with the shared secret and obtain explicit approval.
6. Copy deployment URL ending `/exec`.

## Backend
Copy `backend/.env.example` to `backend/.env` and set Apps Script URL and the same shared secret.
Keep `.env` private; never put secrets in frontend files.

## Frontend
Copy `frontend/.env.example` to `frontend/.env`. Keep `VITE_DEV_PREVIEW=false` for actual saving.

## Run locally
Terminal 1: `npm run dev:backend`
Terminal 2: `npm run dev`
Open http://localhost:5173. API health: http://localhost:4000/api/health.
Use dummy data only until hospital approves live patient-data handling.

The backend recalculates scores from `shared/assessment.config.js`. Apps Script checks assessment IDs to avoid duplicate rows on retry. This lightweight Sheets integration requires hospital IT/privacy approval, restricted spreadsheet access, and an agreed retention/backup policy before production.
