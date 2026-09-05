<p align="center">
  <img src="docs/brand/nexus-logo-wide-white-text.png" alt="Nexus" width="420" />
</p>

<p align="center">
  Personal desktop tracker for todos, daily goals, and job applications.
</p>

Nexus is a solo productivity app. It runs as a Tauri desktop shell around a React UI, and stores data in your Neon project. Email flagging comes later.

## Stack

| Layer | Choice |
| --- | --- |
| Desktop | [Tauri](https://v2.tauri.app/) 2 |
| UI | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) |
| Auth | Neon Auth (Managed Better Auth) |
| Data | Neon Data API + Lakebase Postgres |
| Schema | Drizzle ORM (migrations only) |

The webview never holds a Postgres password. Queries go through the Data API with a Neon Auth JWT. Row-level security keeps each row scoped to `auth.user_id()`.

## Prerequisites

- Node 22+
- [pnpm](https://pnpm.io/)
- Rust (`brew install rust` or [rustup](https://rustup.rs/))
- Xcode Command Line Tools on macOS: `xcode-select --install`

## Setup

```bash
pnpm install
cp .env.example .env
```

Link the workspace to the Nexus Neon project and pull env:

```bash
npx neon@latest link
npx neon@latest env pull
```

`.env` should contain:

- `DATABASE_URL` — CLI / Drizzle only. Never prefix this with `VITE_`.
- `VITE_NEON_AUTH_URL` — public Auth URL
- `VITE_NEON_DATA_API_URL` — public Data API URL

Then start the desktop app:

```bash
pnpm tauri dev
```

Vite-only UI work (no native shell):

```bash
pnpm dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server on port 1420 |
| `pnpm tauri dev` | Desktop app + Vite |
| `pnpm tauri build` | Production installers |
| `pnpm db:generate` | Generate Drizzle SQL from `src/db/schema.ts` |
| `pnpm db:migrate` | Apply Drizzle migrations using `DATABASE_URL` |

## Architecture

```
UI (views / components)
  → lib/db repositories
    → neon-js Data API client
      → Neon (JWT + RLS)
```

- Sign-in happens before the app shell. Sessions use `rememberMe: true` and restore on launch via `getSession()`.
- Components import `@/lib/db/*`, `@/lib/auth`, and `@/types/*` only. They do not talk to SQL or Neon URLs directly.
- `src/db/schema.ts` is for migrations. The running app queries through the Data API.

## Project map

```
src/components/   UI primitives and feature components
src/views/        Todos (live), Goals / Job Tracker (stubs)
src/lib/db/       Typed repositories
src/lib/neon.ts   Auth + Data API client
src/types/        Shared domain models
src/db/           Drizzle schema (migrations only)
src/assets/brand/ In-app logos
docs/brand/       README wordmark
```

## Security

- Gitignore `.env` and `.env.local`. Never commit `DATABASE_URL`.
- Public `VITE_*` values are URLs only — no database role password.
- If a connection password was shared in chat or a screenshot, reset `neondb_owner` in the Neon console and re-pull env.
- Tauri CSP allows the webview to talk to Neon Auth and Data API hosts, not the open internet.

## Roadmap

- Daily Goals CRUD
- Job Tracker CRUD
- Local SQLite offline cache
- Flagged important emails
