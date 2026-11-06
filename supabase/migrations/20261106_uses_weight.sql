alter table public.program_exercises
  add column if not exists uses_weight boolean not null default true;

notify pgrst, 'reload schema';
