# Supabase authentication, backup and privacy audit

## Changes in this PR
- Re-runnable SQL policies that explicitly limit SELECT, INSERT, UPDATE and DELETE to `auth.uid() = user_id`, with RLS enabled and forced.
- Enforced JSON snapshot structure, length and payload-size limits; a server-maintained update timestamp.
- Cloud status checks request timestamp metadata only, not the full practice history.
- Account UI avoids displaying raw Supabase error messages and discloses that device-local history remains after sign-out.
- Added automated static checks to catch accidental weakening of these protections.

## Required manual steps (not performed by this PR)
1. **Back up the database.** Inspect `learner_progress` for legacy `{}` or malformed snapshots; repair those deliberately before running the SQL migration. Constraints will reject invalid existing rows.
2. Run `supabase/learner-progress.sql` in the **correct Supabase project**. GitHub Pages deployment does not apply SQL.
3. In the Supabase dashboard, verify Google OAuth redirect allowlist, email OTP rate limits, account/session settings, and that no service-role key is exposed.
4. Test with **two separate real accounts**: A can CRUD only A's row; B can CRUD only B's row; anonymous users cannot read or write; cross-user requests must fail.
5. Test logout, OAuth callback, network interruption, backup restore validation, and shared-browser privacy behavior.
6. Publish a privacy policy covering browser storage, Supabase hosting, retention, account deletion request process, and support contact before inviting public users.
7. Review whether authentication account deletion requires a trusted backend or support workflow; deleting the progress row does **not** delete the authentication account.

## Threat model and limitations
The Supabase publishable key is intentionally public and is **not** an administrator secret. Actual isolation depends on the deployed database RLS configuration. Static tests cannot establish that the migration ran or that Supabase's configured project is secure. This is a static GitHub Pages frontend, so no privileged account deletion or administrator API should be implemented in browser code.

This branch is based on functional-fix PR #2. Merge PR #2 first, then review and merge this branch; otherwise GitHub may include those earlier commits in this PR.
