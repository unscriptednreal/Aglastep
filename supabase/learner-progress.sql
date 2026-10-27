-- AglaStep: private, user-owned practice snapshots.
-- Run in the Supabase SQL editor. Review existing data before adding constraints.
create table if not exists public.learner_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"sessions":[],"visits":[],"events":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Rerunnable migrations. A malformed existing row will cause validation to fail:
-- repair that row deliberately instead of silently deleting learner data.
alter table public.learner_progress alter column progress set default '{"sessions":[],"visits":[],"events":[]}'::jsonb;
alter table public.learner_progress
  drop constraint if exists progress_is_object,
  drop constraint if exists progress_size_limit,
  drop constraint if exists progress_shape_valid;
alter table public.learner_progress
  add constraint progress_is_object check (jsonb_typeof(progress) = 'object'),
  add constraint progress_size_limit check (octet_length(progress::text) <= 250000),
  add constraint progress_shape_valid check (
    jsonb_typeof(progress->'sessions') = 'array'
    and jsonb_typeof(progress->'visits') = 'array'
    and jsonb_typeof(progress->'events') = 'array'
    and jsonb_array_length(progress->'sessions') <= 350
    and jsonb_array_length(progress->'visits') <= 365
    and jsonb_array_length(progress->'events') <= 350
  );

alter table public.learner_progress enable row level security;
alter table public.learner_progress force row level security;

revoke all on public.learner_progress from public, anon, authenticated;
grant select, insert, update, delete on public.learner_progress to authenticated;

drop policy if exists "read own progress" on public.learner_progress;
drop policy if exists "create own progress" on public.learner_progress;
drop policy if exists "update own progress" on public.learner_progress;
drop policy if exists "delete own progress" on public.learner_progress;
create policy "read own progress" on public.learner_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "create own progress" on public.learner_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.learner_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own progress" on public.learner_progress for delete to authenticated using ((select auth.uid()) = user_id);

-- Server timestamp, not a client-controlled date.
create or replace function public.aglastep_set_progress_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.aglastep_set_progress_updated_at() from public, anon, authenticated;
drop trigger if exists aglastep_progress_updated_at on public.learner_progress;
create trigger aglastep_progress_updated_at
before insert or update on public.learner_progress
for each row execute function public.aglastep_set_progress_updated_at();

-- Test cross-user isolation with two real authenticated test accounts.
-- Never expose service_role or secret keys in static browser code.
