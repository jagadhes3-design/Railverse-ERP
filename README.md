# Rail Verse Signalling Works ERP

Mobile-first attendance, labour allocation, employee profiles, cashbook and payroll PWA.

## Current implementation
- Official circular RVS logo on login, header and app icons.
- Supabase email/password login for authorised boss/manager accounts.
- Cloud record storage through `public.rv_records`; records are scoped by authenticated user using Row Level Security.
- Site list with expandable site cards and assigned labour details.
- Daily site-wise attendance with one-tap Present, Half Day, Absent, OFF and Leave controls.
- One attendance record per employee per date; quick marking updates an existing entry rather than duplicating it.
- Employee register with monthly salary or daily-wage pay basis and site allocation.
- Employee monthly attendance calendar and history.
- Salary statement generation, extra pay, deductions, advance recovery and paid/unpaid status.
- Employee cashbook entries stored in the same secured cloud table.
- Settings option to migrate older records from this phone's IndexedDB into Supabase without overwriting cloud rows with matching IDs.
- Attendance, staff and salary reports with PDF/Excel export.

## Required one-time Supabase setup
1. Open the Supabase project used by this app.
2. Open **SQL Editor** and create a new query.
3. Copy and run the complete SQL from `supabase/schema.sql`.
4. In **Authentication > Users**, create the authorised boss/manager login account(s).
5. Keep public sign-up disabled. Do not expose a service-role key in the browser.
6. Reload the deployed app and sign in.

The SQL creates `public.rv_records` and enables Row Level Security. Each signed-in account can only access records where `owner_id = auth.uid()`. If two managers must share one company's data, they must use the same authorised Supabase user account for now; separate manager accounts need a company-membership/roles table and policies before they can share a workspace.

## Payroll review notes
- Present = 1 payable day; Half Day = 0.5; Absent, Leave and OFF are not counted as payable days.
- Daily wages use payable days × daily rate.
- Monthly salary is currently prorated by payable days divided by calendar days in the selected month.
- Review the company's actual salary policy, weekly-off rules, statutory deductions and OT rates before approving payroll. Generated statements are drafts until checked and marked paid.

## Important deployment and test status
The source changes are committed to the GitHub repository. GitHub Pages deployment may take a few minutes after commits. The database will not work until the SQL in `supabase/schema.sql` has been run in the linked Supabase project. A live end-to-end test (login, cloud insert/read/update/delete, second-device sync and payroll) still has to be completed against the deployed site and configured Supabase project.

## Deploy
GitHub Pages: repository **Settings > Pages**, deploy from the required branch and root folder. Use HTTPS. After changing the PWA icons, close and reinstall/refresh the installed app to update cached branding.
