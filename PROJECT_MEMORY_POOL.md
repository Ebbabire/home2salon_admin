# Project Memory Pool — Admin_Dashboard-Template

**Purpose**: a single, versioned, repo-local source of truth the AI + humans read first to understand this project's architecture, conventions, and current state.

**Last updated**: 2026-03-17

## What this repo is
- **App type**: Admin dashboard UI (Vite SPA)
- **Primary implemented feature**: Admins management (list/table + detail panel + add/edit + status toggle) + Login

## Tech stack (actual)
- **Build**: Vite + React 18 + TypeScript (strict)
- **Routing**: React Router v6
- **Server state**: TanStack React Query
- **Tables**: TanStack React Table
- **Forms/validation**: react-hook-form + Zod
- **UI**: Tailwind + shadcn/Radix primitives under `src/components/ui/*`
- **Icons**: lucide-react + react-icons
- **Dates**: moment

## Repo entry points
- **App bootstrap**: `src/main.tsx`
  - Providers order: `SidebarProvider` → `QueryClientProvider` → `BrowserRouter`
  - `Toaster` is mounted alongside the app under the router.
- **Routes**: `src/routes/AllRoutes.tsx`
- **App root**: `src/App.tsx` (currently only renders `AllRoutes`; auth guard is commented out)

## Path aliases
- `@/*` maps to `src/*`
  - Config: `vite.config.ts` + `tsconfig.json` paths

## Routing map (current)
- `/` → `Layout` and redirects to `/admins`
- `/admins` → Admins page
- `/dashboard` → Dashboard placeholder page
- `/login` → Login page (outside `Layout`)

## Layout + navigation
- **Shell layout**: `src/layout/Layout.tsx`
  - `AppSidebar` + `Navbar` + `<Outlet />`
- **Sidebar links**: `src/layout/sidebar/data/nav-links.tsx`
  - Dashboard (`/dashboard`)
  - Admins (`/admins`)
- **Navbar**: `src/layout/navbar/Navbar.tsx`
  - Search input is present (currently placeholder: "Search products...")
  - User dropdown uses `useLogout()`

## Theme
- Light mode only. Dark mode has been fully removed.
- CSS variables are defined in `:root` only (`src/index.css`); no `.dark` block.
- `darkMode` is not set in `tailwind.config.js`.
- `ThemeProvider` and `ModeToggle` components have been deleted.

## Data + API conventions
- **Base URL**: `import.meta.env.VITE_BASE_URL`
- **HTTP**: direct `fetch()` calls in `src/services/*`
- **Auth/session**: stored in `sessionStorage`
  - Stored keys: `token`, `id`, `userName`, `userRole`, `phoneNumber`
  - Session helper: `src/services/session.ts`
- **Admin endpoints used** (from `src/services/adminServices.ts`):
  - `POST /admin/login`
  - `GET /admin`
  - `GET /admin/:id`
  - `POST /admin`
  - `PATCH /admin/:id` (used for update + status changes)

## Feature modules (current)

### Admins (`src/pages/admins/*`)
- `Admins.tsx`
  - React Query: `useQuery({ queryKey: ["admins"], queryFn: getAdmins })`
  - Shows `AddAdmin` when list is loaded
- `data-table.tsx`
  - TanStack Table + a local `Filter` component
  - Clicking a row opens a right-side detail panel (`AdminDetail`)
- `component/detaile-page.tsx`
  - React Query: `queryKey: ["admin", userId]`
  - Edit/status actions are gated by session role (`Super Admin` rules)
- Mutations invalidate:
  - `["admins"]`
  - `["admin", id]`

### Login (`src/pages/login/Login.tsx`)
- Calls `login()` service
- Navigates to `/` on success (which redirects into the app shell)

## Reusable shared components
- **`SelectInput`** (`src/components/select-input.tsx`): generic `value` + `onValueChange` select; no RHF dependency.
- **`FormComp`** (`src/components/form/form-comp.tsx`): data-driven form builder (react-hook-form + Zod); supports text/email/tel/password/file/select field types.
- **`Filter`** (`src/components/filter/Filter.tsx`): column-based filter for TanStack Table instances.
- **`Loading`** (`src/components/loader.tsx`): SVG spinner controlled by `isLoading` prop.
- **`Error`** (`src/components/error-display.tsx`): error state display with retry (reloads page).

## "How we extend the app" (convention)
- **Add a page**: `src/pages/<feature>/<Feature>.tsx`
- **Export**: from `src/pages/index.ts`
- **Add route**: in `src/routes/AllRoutes.tsx`
- **Add nav link** (if needed): `src/layout/sidebar/data/nav-links.tsx`
- **Remote data**: prefer TanStack React Query + services in `src/services/*`

## Cursor rules
- `.cursor/rules/project-memory-pool.mdc` — always-on rule that reads + updates this file per completed task.
- `.cursor/rules/frontend-conventions.mdc` — TS/React/UI coding standards (activates for `src/**/*.{ts,tsx}`).

## Known gaps / tech debt (keep short, high-signal)
- **Route protection**: auth guard is currently commented out in `src/App.tsx` (routes are effectively public).
- **Type coupling**: `adminServices.ts` still imports `IAdmin` from `pages`. Consider moving shared types to `src/types/*`.
- **Session parsing**: `getSession()` uses `JSON.parse(... || "{}")`, which can yield `{}` instead of the declared string-ish types.

## Change log
- 2026-03-17: Removed dark mode — deleted `theme-provider.tsx` + `mood-toggle.tsx`; removed `ThemeProvider` from `main.tsx`; removed `.dark` CSS vars block; removed `darkMode` from tailwind config; stripped `dark:` classes from Navbar, Sidebar, Login, Admins, Input.
- 2026-03-17: Pre-feature cleanup — deleted broken `productServices.ts`; refactored sidebar nav (fixed nested-interactive elements + `null` className bug via `cn()`); fixed `use-toast` listener leak; deleted unused `useQuery`/`useScreenSize` hooks; made `SelectInput` reusable (no `any`, no hardcoded field); removed debug logs; fixed AddAdmin toast copy; merged duplicate Prettier configs into single `.prettierrc.json`; added `.cursor/rules/frontend-conventions.mdc`.
- 2026-03-17: Created initial memory pool from repo scan (routing, layout, Admins, Login, services, providers).
