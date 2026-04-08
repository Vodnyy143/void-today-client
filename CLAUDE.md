# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Vite HMR)
pnpm build        # Type-check with tsc, then build for production
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

No test runner is configured yet.

## Architecture

**Stack:** React 19, TypeScript, Vite, Redux Toolkit, React Router v7, Axios.

**State management** follows the Redux Toolkit feature-slice pattern:
- `src/app/store.ts` — configures the store with two slices: `auth` and `tasks`
- `src/app/hooks.ts` — exports typed `useAppDispatch` / `useAppSelector` hooks; always use these instead of raw `useDispatch`/`useSelector`
- `src/app/api.ts` — a single Axios instance (`baseURL: http://localhost:5000/api`, `withCredentials: true`) shared across all slices

**Feature slices** live in `src/features/<feature>/`:
- `authSlice.ts` — manages `{ user, loading, error }`; async thunks: `signUp`, `signIn`, `fetchMe`, `logout`
- `tasksSlice.ts` — manages `{ items, chaos, loading, error }`; async thunks: `fetchTasks`, `fetchChaos`, `createTask`, `updateTask`, `deleteTask`, `toggleCheckpoint`

**Routing** is handled in `src/App.tsx` via `<BrowserRouter>` + `<Routes>` (currently no routes defined).

**Entry point:** `src/main.tsx` wraps the app in Redux `<Provider>` and React `<StrictMode>`.

## Domain model

- **Task** has `type: 'MICRO' | 'MACRO'`, `status: 'TODO' | 'DONE' | 'ARCHIVED'`, `priority: 'HIGH' | 'MEDIUM' | 'LOW'`, `repeat: 'DAILY' | 'WEEKLY' | 'NONE'`, and optional `checkpoints[]`.
- **Chaos task** (`tasks.chaos`) is a single randomly-surfaced task fetched from `GET /tasks/chaos`.

## Adding new features

1. Create `src/features/<feature>/<feature>Slice.ts` using `createSlice` + `createAsyncThunk`, importing `api` from `../../app/api`.
2. Register the reducer in `src/app/store.ts`.
3. Add routes in `src/App.tsx`.