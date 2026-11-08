# Railverse ERP Mobile PWA – v0.3 Staff & Payroll MVP

## Added in v0.3
- Employee pay basis: monthly salary or daily wages
- Monthly salary and daily wage rate fields in employee register
- Payroll generation using attendance: Present = 1 day, Half Day = 0.5 day; Absent and Leave are not counted as payable days
- Monthly salary pro-rated by calendar days in the selected month; daily wages calculated from payable days
- Extra pay, deductions and advance recovery inputs
- Salary register and monthly attendance/salary/staff CSV reports
- IndexedDB schema upgraded to version 2; existing browser records are retained during normal upgrade

## Important limitations
This remains a local-device prototype. Data is not shared between staff phones, there is no login/role security, no central server sync, and no protected payroll access. Do not enter real employee salary or bank details or use this as an official payroll system until central authentication, server database, access controls, audit trail, HTTPS and backups are deployed.

GPS is device-reported and is not proof of attendance. Attendance and salary calculations must be reviewed and approved by an authorized person before payment.

## Deploy
Upload the contents of this folder (including the `assets` folder) to the root of your GitHub Pages branch. Enable GitHub Pages from `main` / root. Use HTTPS.
