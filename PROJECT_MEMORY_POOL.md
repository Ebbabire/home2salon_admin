# Project Memory Pool — Admin_Dashboard-Template

**Purpose**: a single, versioned, repo-local source of truth the AI + humans read first to understand this project's architecture, conventions, and current state.

**Last updated**: 2026-03-27

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
- **HTTP**: shared `apiFetch()` wrapper in `src/services/api.ts` (fetch + JSON parsing + typed `ApiError`)
- **Auth/session**: stored in `sessionStorage`
  - Stored keys: `token`, `id`, `userName`, `userRole`, `phoneNumber`
  - Session helper: `src/services/session.ts` (`getSession()` + `clearSession()`)
- **Auth behavior**: `apiFetch()` injects `Authorization: Bearer <token>` by default; set `{ auth: false }` for public endpoints (login). On `401` for auth requests, session is cleared and browser redirects to `/login`.
- **Endpoints by service file**:
  - `adminServices.ts`: `POST /admins/login` (current), plus admin CRUD endpoints (see backend)
  - `categoryServices.ts`: `GET/POST /categories`, `GET/PATCH/DELETE /categories/:id`
  - `serviceServices.ts`: `GET/POST /services`, `GET /services/category/:categoryId`, `GET/PATCH/DELETE /services/:id` (FormData for image upload)
  - `professionalServices.ts`: `GET/POST /professional`, `GET/PATCH /professional/:id`
  - `orderServices.ts`: `GET /order`, `GET /order/:id`, `PATCH /order/:id/request-payment`, `PATCH /order/:id/verify-payment`, `PATCH /order/:id/adjust-schedule`, `PATCH /order/:id/assign`, `PATCH /order/:id/complete`
  - `walletServices.ts`: `GET /wallet`, `GET /wallet/:id/transactions`, `POST /wallet/:id/deduct`

## Shared types (`src/types/`)
- `service.ts`: `ICategory`, `IService` use snake_case backend keys for timestamps (`created_at`, `updated_at`)
- `professional.ts`: `IProfessional`, `IWalletTransaction`, `IWalletBalance` use snake_case backend keys (`full_name`, `phone_number`, `assigned_orders`, `created_at`, `updated_at`)
- `order.ts`: `IOrder`, `OrderStatus` enum, `IOrderedService`, `ICustomerInfo` use snake_case backend keys (`full_name`, `phone_number`, `total_price`, `scheduled_date`, `scheduled_time`, `advance_payment_*`, `created_at`, `updated_at`) + status grouping constants (`PENDING_STATUSES`, `ASSIGNED_STATUSES`, `COMPLETED_STATUSES`)
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

## Mock data layer (status)
- **Previously active**: services used in-memory mock data (`src/services/mock/data.ts`) with simulated delay.
- **Current**: service layer has been migrated back to real HTTP via `apiFetch()` (`src/services/api.ts`) across `src/services/*` (including login).

## Known gaps / tech debt (keep short, high-signal)
- **Route protection**: auth guard is currently commented out in `src/App.tsx` (routes are effectively public).
- **Type coupling**: `adminServices.ts` still imports `IAdmin` from `pages/admins`. Other modules use `src/types/*`.
- **Session parsing**: `getSession()` uses `JSON.parse(... || "{}")`, which can yield `{}` instead of the declared string-ish types.
- **Wallet sidebar visibility**: Wallet nav link is always visible; consider hiding for non-Super-Admin roles.
- **Mock data active**: All services use in-memory mock — swap back to fetch when backend is ready.

## Change log
- 2026-03-27: Improved scalability of service-level professional assignment UI — updated `src/pages/orders/pending/components/assign-professional-dialog.tsx` to use searchable per-service select inputs (name/phone filter) instead of rendering large clickable lists; pre-fills existing service assignments when present, shows per-service required state, and keeps submit guarded until every service has a selected professional.
- 2026-03-27: Switched order professional assignment to service-level payloads — updated `src/services/orderServices.ts` `assignProfessional()` to send backend-required `services: [{ service_id, professionals[] }]` payload; refactored `src/pages/orders/pending/components/assign-professional-dialog.tsx` to assign one professional per order service (service-grouped selector UI + per-service local state + submit guard requiring all services assigned); updated callsite in `src/pages/orders/pending/Columns.tsx` to pass `order.services` into assignment dialog.
- 2026-03-27: Fixed image-preview loading collapse in modal — updated `src/components/image-preview-dialog.tsx` to reserve a stable image viewport (`aspect-[4/3]` with muted background) so `SmartImage` shimmer is visible immediately and the dialog no longer appears as an empty strip while image bytes are loading.
- 2026-03-27: Completed SmartImage rollout for service form previews — updated `src/pages/services/components/service-form.tsx` to use `SmartImage` (skeleton/fade/error+retry), and fixed preview URL construction to avoid invalid image requests when no existing image is present.
- 2026-03-27: Improved image-loading UX with reusable smart image primitive — added `src/components/smart-image.tsx` (skeleton placeholder, fade-in on load, graceful fallback, optional retry, lazy/eager modes); integrated into `src/components/image-preview-dialog.tsx`, order payment verification dialog (`src/pages/orders/pending/components/verify-payment-dialog.tsx`), service table thumbnails (`src/pages/services/Columns.tsx`), and category previews/list thumbnails (`src/pages/services/components/category-list.tsx`) to reduce perceived latency and avoid abrupt image pop-in.
- 2026-03-27: Fixed global pagination "bounce-back" race across all paginated pages — updated clamp logic in `src/pages/{orders/pending/PendingOrders.tsx,orders/assigned/AssignedOrders.tsx,orders/completed/CompletedOrders.tsx,admins/Admins.tsx,professionals/Professionals.tsx,wallet/Wallet.tsx,services/components/service-table.tsx}` to clamp only after the current response exists (prevents fallback `totalPages` from forcing page back to 1 during fetch transitions); in services table, replaced unconditional category reset effect with previous-category tracking to reset `servicePage` only on actual category changes; normalized wallet paginated typing/consumption in `src/services/walletServices.ts` and `src/pages/wallet/Wallet.tsx` to keep table data array stable.
- 2026-03-27: Fixed Orders pagination rendering and response contract usage — kept paginated list parsing aligned to backend contract `data: { orders: [...] }` via `response.data.orders` while using `PaginatedResponse<IOrder[]>` typing in `src/services/orderServices.ts`; updated `src/pages/orders/{pending/PendingOrders.tsx,assigned/AssignedOrders.tsx,completed/CompletedOrders.tsx}` to always render `OrderDataTable` after successful fetch (even when row list is empty) so pagination controls remain visible and page navigation does not disappear on empty pages.
- 2026-03-27: Redefined Orders domain types to backend-native strict shape (no unions) — updated `src/types/order.ts` to camelCase API statuses (`pendingReview`, `professionalAssigned`, etc.), nested location object, `user_id`, populated `services[].service_id`, `assigned_professionals`, `advance_payment_id`, and `createdAt`/`updatedAt`; updated exports in `src/types/index.ts`; aligned order consumers in `src/pages/orders/{pending/Columns.tsx,assigned/Columns.tsx,completed/Columns.tsx,detail/OrderDetail.tsx}` plus dashboard recent orders (`src/pages/dashboard/components/RecentOrdersTable.tsx`) and removed legacy status usage in `src/components/status-badge.tsx` (plus mock enum cleanup in `src/services/mock/data.ts`).
- 2026-03-27: Refactored Orders lists to server-side status pagination with unique cache keys — added `getOrdersPaginated()` and shared `ORDER_PAGE_STATUSES` in `src/services/orderServices.ts` (query sends repeated `status` params with `page`/`limit`); wired `src/pages/orders/{pending/ PendingOrders.tsx,assigned/AssignedOrders.tsx,completed/CompletedOrders.tsx}` to `usePageParam("page")` + server metadata; updated `src/pages/orders/components/order-data-table.tsx` to server-driven pagination controls (removed local row-model pagination); replaced generic `["orders"]` list keys/invalidation with page-specific keys (`["pendingOrders"]`, `["assignedOrders"]`, `["completedOrders"]`) and dashboard key (`["dashboardOrders"]`) across order mutation dialogs and `src/pages/dashboard/hooks/useDashboardData.ts`.
- 2026-03-27: Normalized professional skills for mixed API shapes — updated `src/types/professional.ts` so `IProfessional.skills` accepts populated service objects or IDs (`Array<string | IService>`); updated edit defaults in `src/pages/professionals/components/professional-form.tsx` to normalize populated skills into ID array before submit; updated `src/pages/professionals/components/detail-page.tsx` to derive skill labels directly from populated skills without requiring additional service lookup.
- 2026-03-27: Added professional skills field — added `skills?: string[]` to `IProfessional` in `src/types/professional.ts`; created `src/pages/professionals/components/skills-picker.tsx` (category-grouped multi-select using Checkbox + Collapsible, fetches all categories/services and groups client-side); refactored `src/pages/professionals/components/professional-form.tsx` from data-driven `FormComp` to manual react-hook-form fields to integrate `SkillsPicker`; updated `src/pages/professionals/components/detail-page.tsx` to display skill badges by resolving service names from IDs.
- 2026-03-26: Refactored pagination URL-sync into reusable hook — added `src/components/hooks/use-page-param.ts` (`usePageParam`) using router location/navigation; replaced ad-hoc search-param pagination logic in `src/pages/{admins/Admins.tsx,professionals/Professionals.tsx,wallet/Wallet.tsx,services/components/service-table.tsx}` with the hook; preserved clamp-to-total-pages behavior and kept `servicePage` reset-to-1 on category change.
- 2026-03-26: Persisted table pagination via URL search params — wired `page` query param sync (init, back/forward sync, clamp to total pages) in `src/pages/{admins/Admins.tsx,professionals/Professionals.tsx,wallet/Wallet.tsx}`; wired `servicePage` query param sync in `src/pages/services/components/service-table.tsx` and reset `servicePage` to `1` whenever `categoryId` changes.
- 2026-03-26: Admins detail panel now opens first row by default — `src/pages/admins/data-table.tsx` initializes the right-side `AdminDetail` panel from the first admin whenever table data loads/changes (and closes when empty), while preserving click-to-open behavior for row selection.
- 2026-03-26: Fixed category submit UX during image uploads — `src/pages/services/components/category-list.tsx` now tracks upload-in-progress state, disables form inputs/submit button while uploading or mutating, and shows loading spinner for both upload and API submit phases to prevent duplicate submissions.
- 2026-03-26: Switched Services/Categories image flow to upload-first key-based payloads — added `src/services/uploadServices.ts` to upload image files and return `data[0].key`; updated service create/edit (`src/pages/services/components/{add-service,edit-service}.tsx`) to upload selected image first and send resulting key as `image_url`; updated category create/edit in `src/pages/services/components/category-list.tsx` to do the same; changed `src/services/{serviceServices,categoryServices}.ts` create/update methods to send JSON payloads with `image_url` instead of multipart image blobs.
- 2026-03-26: Added image thumbnails in Services UI lists — `src/pages/services/Columns.tsx` now resolves and displays service images with safe URL handling/fallback; `src/pages/services/components/category-list.tsx` now renders category thumbnails in the list and uses the same safe image URL resolution for row items and edit-preview fallback.
- 2026-03-26: Added image upload/preview flow for Services and Categories — `src/services/categoryServices.ts` now sends `FormData` for category create/update (supports image); `src/pages/services/components/category-list.tsx` now includes image file input with preview (existing `image_url` shown on edit until replaced); `src/pages/services/components/service-form.tsx` now previews selected image and falls back to existing `image_url` in edit mode; `src/pages/services/components/edit-service.tsx` passes current image URL to the form.
- 2026-03-26: Added server-side pagination support across list APIs and key tables — `src/services/api.ts` now supports `PaginatedResponse<T>` with optional `unwrapData`; added paginated service methods in `src/services/{admin,professional,wallet,service,category}Services.ts`; wired page + limit React Query keys in `src/pages/{admins,professionals,wallet,services}/*.tsx`; added previous/next pagination controls and server page summaries in `src/pages/{admins,professionals,wallet}/data-table.tsx`, `src/pages/services/components/{service-data-table,category-list}.tsx`; removed local row-model pagination in affected tables to avoid double pagination.
- 2026-03-25: Began Option-B snake_case domain migration (backend-aligned keys) — updated shared types in `src/types/{order,professional,service}.ts` and migrated usages in dashboard/order/professional/wallet/admin pages plus `adminServices` login request mapping (`phone_number`) to align request/response object keys with backend schema.
- 2026-03-25: Migrated services from in-memory mocks to real HTTP — updated `src/services/{category,service,professional,order,wallet}.ts` and `src/services/dashboardServices.ts` to use `apiFetch()`; enhanced `apiFetch()` to support `FormData` (service image upload) without forcing JSON content-type.
- 2026-03-25: Wired real admin login via shared API client — added `src/services/api.ts` (`ApiError`, `apiFetch`, 401 handling); hardened `src/services/session.ts` (null-safe parsing + `clearSession()`); updated `src/services/adminServices.ts` `login()` to `POST /admins/login`; updated `src/pages/login/Login.tsx` to navigate on success. Kept feature logic and component tree intact.
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
