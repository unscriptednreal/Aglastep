-- AglaStep user-owned practice snapshot (Supabase SQL editor)
-- Run in an owned Supabase project before enabling login.
create table if not exists public.learner_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint progress_is_object check (jsonb_typeof(progress) = 'object'),
  constraint progress_size_limit check (octet_length(progress::text) <= 250000)
);
alter table public.learner_progress enable row level security;
revoke all on public.learner_progress from anon;
grant select,insert,update,delete on public.learner_progress to authenticated;
create policy "read own progress" on public.learner_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "create own progress" on public.learner_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "update own progress" on public.learner_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "delete own progress" on public.learner_progress for delete to authenticated using ((select auth.uid())=user_id);
-- No public or cross-user read access. Sitewide reports require a separate trusted service
-- with aggregate-only authorization, consent policy, and privacy review.
