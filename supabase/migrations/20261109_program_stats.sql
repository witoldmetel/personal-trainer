alter table public.programs
  add column if not exists is_active boolean not null default false;

alter table public.programs
  add column if not exists mover_pe_ids text[] not null default '{}';

alter table public.program_exercises
  add column if not exists same_as_id text references public.program_exercises (id) on delete set null;

notify pgrst, 'reload schema';
