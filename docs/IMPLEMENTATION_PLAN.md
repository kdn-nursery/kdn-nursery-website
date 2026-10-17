# Implementation plan

KDN Nursery follows `README.md`. This plan splits that roadmap into reviewable milestones. Status lives in `docs/PROGRESS.md`.

Route adjustment from the README sketch: category and product pages are nested under the shop so they do not collide with other top-level pages.

```text
/[locale]
/[locale]/shop
/[locale]/shop/[category]
/[locale]/shop/[category]/[product]
/[locale]/plant-care
/[locale]/plant-care/[slug]
/[locale]/wishlist
/[locale]/cart
/[locale]/about
/[locale]/contact
/[locale]/policies/[slug]
```

Checkout, order status, plant finder and admin routes are intentionally absent until those milestones.

## Milestone 1 — Foundation and public catalogue

- Scope: Next.js app, design system, English/Tamil UI, sample catalogue, search, filters, product and care pages, local wishlist and cart, policy drafts, demo data adapter, Prisma schema and reviewed migration.
- Dependencies: none. PostgreSQL is optional because demo mode is explicit.
- Acceptance: the pages above render in both languages, search matches English and Tamil names, out-of-stock plants cannot be added, cart and wishlist survive a reload, and the production build passes.
- Verification: install, typecheck, lint, unit tests, production build, and browser checks on desktop and mobile.
- Status: see `docs/PROGRESS.md`.

## Milestone 2 — Authentication and catalogue administration

- Scope: Auth.js admin sign-in, authorised product and category editing, price and stock updates, featured flags, care-guide editing.
- Dependencies: Milestone 1 schema, a confirmed admin sign-in method, and a development database.
- Acceptance: every admin page and mutation requires a signed-in authorised user. No shared password in source.
- Verification: unauthenticated access is rejected; an authorised user can change a sample product and see it on the shop.
- Status: Not started.

## Milestone 3 — Cart, delivery rules and guest checkout

- Scope: server-priced checkout, guest details, delivery versus pickup, and the owner-approved charge table.
- Dependencies: confirmed pincodes, charge table, pickup address and hours. No cash on delivery. No assumed free delivery.
- Acceptance: totals are recalculated on the server. Unknown pincodes cannot choose delivery. Checkout stays closed until those settings exist.
- Verification: fixture orders for each charge band, plus a rejected out-of-area pincode.
- Status: Not started.

## Milestone 4 — Razorpay, inventory reservations and payment reconciliation

- Scope: Razorpay order creation, signature checks, webhook processing, reservation expiry, and separate payment state.
- Dependencies: Milestone 3 and Razorpay test credentials.
- Acceptance: payment is marked captured only after server confirmation of signature, amount, currency and order. Duplicate webhooks do not double-sell stock. A browser return URL is not proof of payment.
- Verification: test-mode success, failure, retry and duplicate webhook fixtures.
- Status: Not started.

## Milestone 5 — Order operations, tracking and receipts

- Scope: admin order list, fulfilment updates, shipment notes, guest tracking and a simple receipt.
- Dependencies: Milestones 2 and 4. Tracking must resist order-number guessing and be rate-limited.
- Acceptance: payment status and fulfilment status change independently. Receipts do not claim GST treatment before that is confirmed.
- Verification: a test order moves through fulfilment without marking an unpaid order as paid.
- Status: Not started.

## Milestone 6 — Plant Finder, care guides and wishlist

- Scope: Plant Finder quiz, richer care content, and any wishlist behaviour that should sync later. Local wishlist already exists from Milestone 1.
- Dependencies: owner-written care content and plant-matching rules.
- Acceptance: the quiz recommends only real catalogue plants and works in English and Tamil.
- Verification: each quiz result links to a real product; empty results have a clear state.
- Status: Not started. Care-guide pages and the local wishlist are already in Milestone 1 as drafts.

## Milestone 7 — Launch checks and deployment preparation

- Scope: SEO, analytics, error monitoring, backups, policy publication, production environment and a launch checklist from the README.
- Dependencies: confirmed domain, database host, and the decisions in `docs/OWNER_DECISIONS.md`.
- Acceptance: production uses the database adapter, demo mode is off, and a test purchase has been completed in Razorpay test mode before live keys are enabled.
- Verification: production build, backup restore drill, and the README launch checklist.
- Status: Not started.

## Planned data model after Milestone 1

Milestone 1 creates categories, products, product images, bulk price tiers and care guides. Money is integer paise. Stock and availability are constrained together.

Later milestones add:

- `Order` and `OrderItem`, with immutable name, price, quantity and address snapshots.
- Separate payment status and fulfilment status.
- `PaymentAttempt` with a unique provider payment id.
- `PaymentEvent` processed idempotently by provider event id.
- `InventoryReservation` with an expiry time.
- `DeliverySetting` and serviceable pincodes. No free-delivery default.
- `User`, `Account`, `Session` and `VerificationToken` for Auth.js, plus an allow-list of admin users.
- `AuditEvent` for admin catalogue and order changes.
- Optional `SiteContent` for banners and selected page copy once the owner wants to edit it.

Do not apply the Milestone 1 migration to an unknown or production database. Review `prisma/migrations/20261017123000_init_catalogue/migration.sql` first, then run it against a development database with `npx prisma migrate dev`.

## Security requirements carried into later milestones

- Authorise every admin route and server mutation.
- No hardcoded admin credentials and no production authentication bypass.
- Recalculate prices, delivery and totals on the server.
- Validate stock transactionally. Define when a reservation expires and how failed payments release it.
- Verify Razorpay signatures on the server, including webhook signatures over the raw body.
- Confirm captured status, expected amount, currency and order association before marking paid.
- Process duplicate and out-of-order payment events without repeating fulfilment.
- Never treat a browser redirect as payment proof.
- Protect guest tracking from enumeration and apply rate limits.
- Validate media uploads and allow privileged uploads only for authorised admins.
- Never log secrets, payment credentials or unnecessary customer information.
