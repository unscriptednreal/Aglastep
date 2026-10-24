# AglaStep — Optional learner accounts setup

This is an **inactive scaffold**, not a live login service. GitHub Pages cannot securely store administrator credentials or run an administrator reporting service.

1. Create an owned Supabase project and review its pricing, location, retention, and privacy terms.
2. In its SQL editor, run `supabase/learner-progress.sql`. Verify row-level security policies and audit access before inviting users.
3. Enable email magic-link sign-in. In Authentication → URL Configuration, set the Site URL to `https://aglastep.in` and allowed redirect URL to `https://aglastep.in/**`. Configure custom email delivery and abuse/rate-limit protections if launching publicly.
4. Copy **only the project URL and public publishable key** into `auth-config.js`. Never put a secret/service_role key into the GitHub repository, the HTML, or client JavaScript.
5. Validate sign-in, logout, save, deletion, expiration, and isolation between two different test accounts before enabling sign-in publicly.
6. Practice snapshots are uploaded **only when a signed-in learner ticks the consent checkbox and clicks Sync my progress now**. The site does **not** automatically upload future changes or download/merge remote history. The device data remains untouched if sign-out or cloud deletion is requested.
7. Learner data is not available for a public operator dashboard. Set up a separate privileged server with limited aggregate reporting and a published privacy policy before collecting or analyzing sitewide learner data. Avoid sharing user-level performance scores with employers without explicit, informed permission.

For now, the default config leaves accounts disabled and keeps practice working anonymously.

## Google Sign-In (free path)

1. In Google Cloud Console create an OAuth web client for AglaStep. Add an authorized redirect URI `https://torroumusjjxvpykhzqr.supabase.co/auth/v1/callback`.
2. In Supabase Dashboard → Authentication → Providers → Google, enable Google and enter the OAuth client ID and client secret directly in Supabase (never commit the secret).
3. Supabase Authentication → URL Configuration: set Site URL `https://aglastep.in` and allow `https://aglastep.in/**`.
4. Test Google sign-in with two distinct accounts and confirm that one user cannot read or modify the other user's `learner_progress` row.
5. Account actions use explicit opt-in and buttons for uploading or restoring a snapshot; they **do not** continuously sync or merge changes across devices.
6. Sitewide administrator reporting is deliberately not live until account and access-control testing succeeds. Do not expose service-role keys in static pages.
