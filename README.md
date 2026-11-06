# Personal Trainer

Single-user gym log that replaces an Excel spreadsheet. Desktop-first, phone as a second screen, kilograms, English, $0 stack.

Log date, program day, exercise, sets, reps, and weight. Import history from Excel. Charts show volume, load, and estimated 1RM.

## Status

The UI is a **Vite + React** SPA. GitHub login goes through **Supabase Auth** (allowlisted to `witoldmetel`). Programs, sessions, and sets live in **Supabase Postgres**.

Destination app shell is [TanStack Start](https://tanstack.com/start).

Product and stack decisions: [docs/prd.md](./docs/prd.md), [docs/tech-stack.md](./docs/tech-stack.md).

## Stack

| Layer | Choice |
|---|---|
| App | Vite, React 19, TypeScript |
| Package manager | pnpm 11 |
| UI | [shadcn/ui](https://ui.shadcn.com/) + Tailwind + lucide |
| Tables / forms / charts | TanStack Table, Form, Charts |
| Lint | Biome |
| Excel | SheetJS (`xlsx`) |
| Data | Supabase Postgres + Auth + RLS |
| Host | Cloudflare Workers (`wrangler.jsonc`) |

## Local

Needs Node 22 and [pnpm](https://pnpm.io) 11.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) (or 5174 if 5173 is taken). **Continue with GitHub** uses Supabase OAuth. Add `http://localhost:5173/**` and `http://localhost:5174/**` under Supabase → Authentication → URL configuration.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=
VITE_ALLOWED_GITHUB_USERNAME=witoldmetel
```

Never commit `.env`. Use the **anon / publishable** key only — not `service_role`.

Apply [`supabase/migrations/20261106_init.sql`](supabase/migrations/20261106_init.sql) in the Supabase **SQL Editor** (Table Editor is not enough). Run the whole file, confirm it succeeds, then sign in again. If login says `public.profiles` is missing from the schema cache, the API has not seen the tables yet — re-run the file (it is safe to repeat; it reloads the cache).

| Script | What |
|---|---|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Typecheck + production bundle |
| `pnpm preview` | Serve `dist` |
| `pnpm lint` / `pnpm format` | Biome |

Do not use npm or yarn. Lockfile is `pnpm-lock.yaml`.

## App

| Route | Page |
|---|---|
| `/dashboard` | Home: 90-day stats, volume, movers |
| `/today` | Log today’s session |
| `/programs` | Split days and lifts |
| `/history` | Past sessions (delete a day) |
| `/charts` | Filters: range, program day, exercise |
| `/import` | Excel / CSV |

## Deploy

Push to `main` runs `.github/workflows/pipeline.yml`: typecheck → build → `wrangler deploy`. Pull requests skip deploy.

Repo secrets (Settings → Secrets and variables → Actions):

| Secret | From |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → API Tokens → Edit Cloudflare Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard sidebar |
| `VITE_SUPABASE_URL` | Same as `.env` |
| `VITE_SUPABASE_ANON_KEY` | Same as `.env` |

Production URL: `https://personal-trainer.<subdomain>.workers.dev`.

Do **not** use Cloudflare Workers Builds for this repo (Git integration in the Cloudflare dashboard). Pause it: Workers & Pages → personal-trainer → Settings → Builds → Pause. If a check still fails with “build token has been deleted or rolled”, that token lives only in Cloudflare — GitHub Actions secrets cannot fix it. Pause builds or paste a new API token in Workers Builds settings.
