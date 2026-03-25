# Project Memory Pool — Admin_Dashboard-Template

**Purpose**: a single, versioned, repo-local source of truth the AI + humans read first to understand this project's architecture, conventions, and current state.

**Last updated**: 2026-03-25

## What this repo is
- **App type**: Beauty Service Admin Panel (Vite SPA)
- **Primary implemented features**: Dashboard, Orders (pending/assigned/completed + detail), Service catalog (categories + services), Professional management, Wallet management (Super Admin), Admins management, Login

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
- `/` → `Layout`, redirects to `/dashboard`
- `/dashboard` → Dashboard (stats cards + recent orders)
- `/orders/pending` → Pending Orders table (inline actions: request payment, verify, assign)
- `/orders/assigned` → Assigned Orders table
- `/orders/completed` → Completed Orders table
- `/orders/:id` → Order Detail page (full info + contextual workflow actions)
- `/services` → Service Management (split: category list + service table)
- `/professionals` → Professionals CRUD + detail panel
- `/admins` → Admins CRUD + detail panel
- `/wallet` → Wallet Management (Super Admin gated)
- `/login` → Login page (outside `Layout`)

## Layout + navigation
- **Shell layout**: `src/layout/Layout.tsx`
  - `AppSidebar` + `Navbar` + `<Outlet />`
- **Sidebar links**: `src/layout/sidebar/data/nav-links.tsx`
  - Dashboard (`/dashboard`)
  - Orders (collapsible: Pending / Assigned / Completed)
  - Services (`/services`)
  - Professionals (`/professionals`)
  - Admins (`/admins`)
  - Wallet (`/wallet`)
- **Navbar**: `src/layout/navbar/Navbar.tsx`
  - Search input placeholder: "Search..."
  - User dropdown uses `useLogout()`

## Theme
- **Green/cream palette** matching the mobile app design; modernized in a UI-only skin pass (2026-03-25).
- Light mode only. Dark mode has been fully removed.
- CSS variables in `:root` (`src/index.css`): deep green primary (`#1B4332`), subtle cream background, white cards (`--card: 0 0% 100%`), softer green-tinted borders (`150 18% 88%`).
- **Design radius**: base `--radius: 0.75rem`; cards & dialogs use `rounded-xl`, tables/inputs use `rounded-lg`, badges use `rounded-md`.
- Sidebar: white background, border-top footer, branded "H2" logo pill; active nav items use accent bg + primary text; icons use `text-muted-foreground` (green on hover/active).
- Navbar: frosted glass effect (`bg-background/80 backdrop-blur-md`), ghost search input that gains border on focus.
- All buttons/toasts use `bg-primary` / `hover:bg-primary/80` — no hardcoded hex colors; buttons have `shadow-sm` and `transition-all`.
- Table headers: `bg-muted/40`, uppercase `text-xs font-semibold` tracking.
- Page containers: `rounded-xl border bg-card shadow-sm` (replaced old `border-dashed`).
- Page headings: `text-xl font-bold tracking-tight`.
- Login page: split layout with green left panel (includes frosted H2 badge) + white card right (`shadow-lg`).
- `darkMode` is not set in `tailwind.config.js`.
- `ThemeProvider` and `ModeToggle` components have been deleted.

## Data + API conventions
- **Base URL**: `import.meta.env.VITE_BASE_URL`
- **HTTP**: direct `fetch()` calls in `src/services/*`
- **Auth/session**: stored in `sessionStorage`
  - Stored keys: `token`, `id`, `userName`, `userRole`, `phoneNumber`
  - Session helper: `src/services/session.ts`
- **Endpoints by service file**:
  - `adminServices.ts`: `POST /admin/login`, `GET/POST /admin`, `GET/PATCH /admin/:id`
  - `categoryServices.ts`: `GET/POST /categories`, `GET/PATCH/DELETE /categories/:id`
  - `serviceServices.ts`: `GET/POST /services`, `GET /services/category/:categoryId`, `GET/PATCH/DELETE /services/:id` (FormData for image upload)
  - `professionalServices.ts`: `GET/POST /professional`, `GET/PATCH /professional/:id`
  - `orderServices.ts`: `GET /order`, `GET /order/:id`, `PATCH /order/:id/request-payment`, `PATCH /order/:id/verify-payment`, `PATCH /order/:id/adjust-schedule`, `PATCH /order/:id/assign`, `PATCH /order/:id/complete`
  - `walletServices.ts`: `GET /wallet`, `GET /wallet/:id/transactions`, `POST /wallet/:id/deduct`

## Shared types (`src/types/`)
- `service.ts`: `ICategory`, `IService` (optional `description`)
- `professional.ts`: `IProfessional`, `IWalletTransaction`, `IWalletBalance`
- `order.ts`: `IOrder`, `OrderStatus` enum, `IOrderedService`, `ICustomerInfo`, status grouping constants (`PENDING_STATUSES`, `ASSIGNED_STATUSES`, `COMPLETED_STATUSES`)
- `index.ts`: barrel re-exports

## Feature modules (current)

### Dashboard (`src/pages/dashboard/Dashboard.tsx`)
- Stats cards: pending/assigned/completed order counts, total professionals, total services
- Recent orders table (5 latest) with eye icon → detail page
- React Query keys: `["orders"]`, `["professionals"]`, `["services"]`
- Refactored into smaller units:
  - `hooks/useDashboardData.ts` (queries + memoized counts/stats/recent orders + combined error)
  - `components/DashboardStatsGrid.tsx` (keyboard-accessible stat navigation via links)
  - `components/RecentOrdersTable.tsx` (date/service formatting helpers, link-based row action)

### Orders (`src/pages/orders/`)
- **Pending** (`pending/PendingOrders.tsx`): filters orders by `PENDING_STATUSES`; inline actions per status (Request Payment / Verify / Assign Professional)
- **Assigned** (`assigned/AssignedOrders.tsx`): filters by `ASSIGNED_STATUSES`
- **Completed** (`completed/CompletedOrders.tsx`): filters by `COMPLETED_STATUSES`; receipt preview
- **Detail** (`detail/OrderDetail.tsx`): full order info cards + contextual action buttons (adjust schedule, confirm completion, etc.)
- Shared: `components/order-data-table.tsx`, dialog components in `pending/components/`
- React Query key: `["orders"]`, `["order", id]`

### Services (`src/pages/services/`)
- Split-view: CategoryList (left) + ServiceTable (right, filtered by selected category)
- Category CRUD inline (add/edit dialog, delete alert)
- Service CRUD with image upload via FormData
- React Query keys: `["categories"]`, `["services", categoryId]`

### Professionals (`src/pages/professionals/`)
- Same pattern as Admins: table + row-click detail panel + add/edit dialogs + status toggle
- React Query keys: `["professionals"]`, `["professional", id]`

### Wallet (`src/pages/wallet/`)
- Super Admin gated (session role check)
- Table: professional name, phone, balance, actions
- TransactionHistoryDialog per professional
- RecordPayoutDialog (deduction)
- React Query keys: `["walletBalances"]`, `["walletTransactions", professionalId]`

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
- **`StatusBadge`** (`src/components/status-badge.tsx`): maps `OrderStatus` enum → colored badge (label + Tailwind classes).
- **`ImagePreviewDialog`** (`src/components/image-preview-dialog.tsx`): generic trigger-based dialog that shows a full-size image preview.

## "How we extend the app" (convention)
- **Add a page**: `src/pages/<feature>/<Feature>.tsx`
- **Export**: from `src/pages/index.ts`
- **Add route**: in `src/routes/AllRoutes.tsx`
- **Add nav link** (if needed): `src/layout/sidebar/data/nav-links.tsx`
- **Remote data**: prefer TanStack React Query + services in `src/services/*`

## Cursor rules
- `.cursor/rules/project-memory-pool.mdc` — always-on rule that reads + updates this file per completed task.
- `.cursor/rules/frontend-conventions.mdc` — TS/React/UI coding standards (activates for `src/**/*.{ts,tsx}`).

## Mock data layer (active)
- **All service files** (`src/services/*.ts`) currently use in-memory mock data from `src/services/mock/data.ts` instead of real API calls.
- Mutations modify the arrays in place (state persists within the browser session only).
- Mock login accepts any admin's phone/email with any password.
- A 300ms delay simulates network latency.
- **To switch to real API**: replace each service file's contents with the real `fetch()` implementations (the real implementations were the original code before the mock swap — use the endpoint patterns documented above).

## Known gaps / tech debt (keep short, high-signal)
- **Route protection**: auth guard is currently commented out in `src/App.tsx` (routes are effectively public).
- **Type coupling**: `adminServices.ts` still imports `IAdmin` from `pages/admins`. Other modules use `src/types/*`.
- **Session parsing**: `getSession()` uses `JSON.parse(... || "{}")`, which can yield `{}` instead of the declared string-ish types.
- **Wallet sidebar visibility**: Wallet nav link is always visible; consider hiding for non-Super-Admin roles.
- **Mock data active**: All services use in-memory mock — swap back to fetch when backend is ready.

## Change log
- 2026-03-25: UI modernization (presentation-only skin pass) — refined CSS tokens (`index.css`: softer borders, white cards, `--radius: 0.75rem`, antialiased body); updated 12 `src/components/ui/*` primitives (button: `rounded-lg` + shadow + gap; card: `rounded-xl`; input/select: hover-border + ring polish; table: muted header bg + uppercase `text-xs` heads; badge: `rounded-md`; dialog/alert-dialog/toast: `rounded-xl` + `shadow-xl`; dropdown: `rounded-xl` + `p-1.5`; tooltip: `rounded-lg`; skeleton: `rounded-lg`); modernized sidebar (white bg, branded H2 pill logo, border-top footer, `text-muted-foreground` icons); navbar frosted glass effect (`backdrop-blur-md`, ghost search input); unified all page containers from `border-dashed` → `rounded-xl border bg-card`; standardized headings to `text-xl font-bold tracking-tight`; elevated login card (`shadow-lg` + frosted H2 badge on green panel); softened error-display layout; added `cursor-pointer` to admins data-table clickable rows. No logic, hooks, services, routes, or component tree changes.
- 2026-03-23: Refactored Dashboard for maintainability and resilience — split `src/pages/dashboard/Dashboard.tsx` into orchestration + extracted `hooks/useDashboardData.ts`, `components/DashboardStatsGrid.tsx`, and `components/RecentOrdersTable.tsx`; added combined query error state, memoized dashboard derivations, and replaced click-only navigation with accessible links.
- 2026-03-17: Removed dark mode — deleted `theme-provider.tsx` + `mood-toggle.tsx`; removed `ThemeProvider` from `main.tsx`; removed `.dark` CSS vars block; removed `darkMode` from tailwind config; stripped `dark:` classes from Navbar, Sidebar, Login, Admins, Input.
- 2026-03-17: Pre-feature cleanup — deleted broken `productServices.ts`; refactored sidebar nav (fixed nested-interactive elements + `null` className bug via `cn()`); fixed `use-toast` listener leak; deleted unused `useQuery`/`useScreenSize` hooks; made `SelectInput` reusable (no `any`, no hardcoded field); removed debug logs; fixed AddAdmin toast copy; merged duplicate Prettier configs into single `.prettierrc.json`; added `.cursor/rules/frontend-conventions.mdc`.
- 2026-03-17: Created initial memory pool from repo scan (routing, layout, Admins, Login, services, providers).
- 2026-03-17: Full feature build — implemented all admin panel features per functional requirements: shared types (`src/types/`), 6 API service files, Dashboard with stats + recent orders, Service Management (2-level: categories + services with image upload), Professional Management (CRUD + status toggle + detail panel), Order Management (3 sub-pages: pending/assigned/completed with inline status badges + action dialogs + detail page with full workflow), Wallet Management (Super Admin gated: balances + transaction history + payout recording). Updated routing to 10 routes, sidebar to 6 nav items (Orders collapsible with 3 sub-links). Added `StatusBadge` and `ImagePreviewDialog` shared components.
- 2026-03-17: Added mock data layer — replaced all service files with in-memory mock implementations (`src/services/mock/data.ts`). Covers admins (3), categories (4), services (10), professionals (4), orders (10 across all statuses), wallet balances + transactions. Mock login accepts any existing admin. Mutations modify arrays in place with 300ms simulated latency.
- 2026-03-17: Applied mobile app green/cream theme — updated all CSS variables in `index.css` (deep green primary, cream backgrounds, green sidebar); replaced 18 files' hardcoded hex colors (`#16432d`, `#276145`, `#378b63`) with `bg-primary`/`hover:bg-primary` tokens; updated sidebar navMain active-state classes for dark-green sidebar; restyled login page with green split layout; changed navbar search placeholder; fixed error-display text color.
- 2026-03-17: Cream sidebar with green accents — changed `--sidebar-*` CSS vars from dark green bg to warm cream (`47 75% 98%`); icons use `text-primary` (deep green); active nav items use light green bg (`--sidebar-accent: 133 47% 90%`) with deep green text; header "Home2Salon" styled in `text-primary font-semibold`.
- 2026-03-17: Refined theme to match reference design — sidebar active state: light green bg (`147 40% 85%`) + dark green text/icons; hover: very light green (`accent`); borders/inputs: clearly green-tinted (`147 40% 78%`); sidebar header: green box-shadow; icons: muted green (`primary/50`) normal → dark green on hover/active.
