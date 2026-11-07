alter table public.program_days
  add column if not exists weekday smallint
  check (weekday is null or (weekday >= 1 and weekday <= 7));

notify pgrst, 'reload schema';
