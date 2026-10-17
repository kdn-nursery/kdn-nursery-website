# Progress

Branch: `feature/admin-panel`, taken from `feature/plant-photos` because `origin/dev` is still missing.

Base: commit `ff90dc8` on `main`, because `origin/dev` does not exist. No commits were made on `main`. A pull request cannot target `dev` until that branch exists.

## Milestone status

| Milestone | Status |
|---|---|
| 1. Foundation and public catalogue | Implemented |
| 2. Authentication and catalogue administration | Implemented. Database sign-in and persistence are blocked until PostgreSQL is configured |
| 3. Cart, delivery rules and guest checkout | Not started |
| 4. Razorpay, inventory reservations and payment reconciliation | Not started |
| 5. Order operations, tracking and receipts | Not started |
| 6. Plant Finder, care guides and wishlist | Not started. Local wishlist and draft care pages shipped with Milestone 1 |
| 7. Launch checks and deployment preparation | Not started |

## Milestone 1 checks

| Check | Status | Evidence |
|---|---|---|
| Dependency install | Verified | `npm install` with the lockfile |
| Typecheck | Verified | `npx tsc --noEmit` |
| Lint | Verified | `npx eslint .` |
| Unit tests | Verified | 21 tests across the catalogue and admin rule files |
| Production build | Verified | `npm run build` with demo mode explicitly allowed |
| English and Tamil navigation | Verified | Browser: `/en` and `/ta`, including keeping `?q=mint` |
| Search and category filter | Verified | Browser: `mint`, `புதினா`, and `/en/shop/herbal-plants` (7 plants) |
| Product routes | Verified | Browser: rosemary and water apple |
| Wishlist persistence | Verified | Saved water apple, reloaded `/en/wishlist` |
| Cart quantities and persistence | Verified | Rosemary stopped at sample stock 2; `/en/cart` showed ₹358 after a fresh load |
| Out-of-stock controls | Verified | Water apple add and quantity buttons were disabled |
| Desktop and mobile layout | Verified | Desktop nav at a wide viewport; mobile menu at a phone-width viewport |
| Keyboard | Verified | Language switcher activated with Enter. Skip link is the first control |
| Demo mode | Verified | Banner visible. No database is connected |
| Missing catalogue configuration | Verified by unit test | Browser session was not repeated with the variable removed |
| PostgreSQL migration apply and seed | Not run | No development database was configured. The SQL migration is reviewed and unapplied |

## Licensed plant photographs

Thirteen products use a verified Wikimedia Commons photograph. Hybrid hibiscus, December flower, fig and water apple stay on “Photo coming soon”. Details are in `docs/IMAGE_SOURCES.md`.

Checked after the change: typecheck, lint, 12 unit tests and production build passed. In the browser, the homepage, senbagam page and shop loaded the photographs on a phone-width layout, and the four uncertain plants showed “Photo coming soon”.

## Admin panel checks

| Check | Status | Evidence |
|---|---|---|
| Typecheck | Verified | `npx tsc --noEmit` |
| Lint | Verified | `npx eslint .` |
| Admin rule tests | Verified | Password hashing, login limit, prices, stock, stale versions, draft filter, fulfilment transitions, image signatures |
| Production build | Verified | `npx next build` in demo mode. Admin routes are dynamic and do not query PostgreSQL during the build |
| Unauthenticated admin URL | Verified | Browser and HTTP: `/admin` and `/admin/products` redirect to `/admin/login`. The login page explains the missing database and Auth.js secret. `/robots.txt` disallows `/admin`. The sitemap has no admin URL. The public homepage still shows the customer navigation |
| Login, persistence, uploads and order writes | Blocked | No `DATABASE_URL`, `AUTH_SECRET` or Cloudinary credentials are configured. Demo mode refuses writes |

## Blocked

`origin/dev` is missing. GitHub currently has `main` only. Do not open a pull request into `main`.

Create `dev` from `ff90dc8` (the README-only history), then open a draft pull request from `feature/kdn-foundation` into `dev`.
