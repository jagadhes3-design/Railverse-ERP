# Railverse ERP Mobile PWA MVP

Responsive Chrome-installable web app for Android and desktop.

## Features in this MVP
- Dashboard and mobile navigation
- Project/site records
- Employee register
- Attendance entry with GPS capture and selfie capture/selection
- Material received, utilised and balance tracking
- Expense register
- JSON backup/restore and CSV export
- IndexedDB storage and cached app shell for offline launch

## Run for local testing
From this folder run `python3 -m http.server 8080`, then open `http://localhost:8080`.
For Android installation, deploy these files to an HTTPS web server, open the URL in Chrome, then Chrome menu > Install app / Add to Home screen.

## Important limitations
This MVP stores data in the current browser/device only. It is NOT connected to the central PostgreSQL server and does not yet include multi-user login, roles, server synchronisation, supervisor approval, secure selfie upload, audit logs or tamper-resistant attendance. GPS coordinates are device-provided and not proof of presence. Do not use as the official company record system until the server backend and security controls are implemented and tested.
