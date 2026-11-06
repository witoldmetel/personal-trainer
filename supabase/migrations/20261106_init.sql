create table public.allowed_users (
  github_username text primary key
);

insert into public.allowed_users (github_username) values ('witoldmetel');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  github_username text not null,
  created_at timestamptz not null default now()
);

create table public.programs (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null
);

create table public.program_days (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_id text not null references public.programs (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

create table public.exercises (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  muscle_group text
);

create table public.program_exercises (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_day_id text not null references public.program_days (id) on delete cascade,
  exercise_id text not null references public.exercises (id) on delete restrict,
  sort_order integer not null default 0,
  target_sets integer not null,
  target_reps integer not null
);

create table public.sessions (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_day_id text references public.program_days (id) on delete set null,
  performed_on date not null,
  status text not null check (status in ('in_progress', 'done'))
);

create table public.session_sets (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_id text not null references public.sessions (id) on delete cascade,
  exercise_id text not null references public.exercises (id) on delete restrict,
  set_number integer not null,
  reps integer,
  weight_kg numeric,
  note text
);

create index programs_user_id_idx on public.programs (user_id);
create index program_days_user_id_idx on public.program_days (user_id);
create index exercises_user_id_idx on public.exercises (user_id);
create index program_exercises_user_id_idx on public.program_exercises (user_id);
create index sessions_user_id_idx on public.sessions (user_id);
create index session_sets_user_id_idx on public.session_sets (user_id);
create index session_sets_session_id_idx on public.session_sets (session_id);

create or replace function public.is_allowlisted(uname text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.allowed_users
    where lower(github_username) = lower(uname)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
begin
  uname := lower(coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    ''
  ));
  if public.is_allowlisted(uname) then
    insert into public.profiles (id, github_username)
    values (new.id, uname)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.allowed_users enable row level security;
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.program_days enable row level security;
alter table public.program_exercises enable row level security;
alter table public.exercises enable row level security;
alter table public.sessions enable row level security;
alter table public.session_sets enable row level security;

revoke all on public.allowed_users from anon, authenticated;

create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (
    id = auth.uid()
    and public.is_allowlisted(github_username)
  );

create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and public.is_allowlisted(github_username)
  );

create policy programs_all on public.programs
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy program_days_all on public.program_days
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy exercises_all on public.exercises
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy program_exercises_all on public.program_exercises
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy sessions_all on public.sessions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy session_sets_all on public.session_sets
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant usage on schema public to authenticated;
grant execute on function public.is_allowlisted(text) to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.programs to authenticated;
grant select, insert, update, delete on public.program_days to authenticated;
grant select, insert, update, delete on public.exercises to authenticated;
grant select, insert, update, delete on public.program_exercises to authenticated;
grant select, insert, update, delete on public.sessions to authenticated;
grant select, insert, update, delete on public.session_sets to authenticated;
