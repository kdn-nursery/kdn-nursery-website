# 🌿 KDN Nursery — Kaviyadevan Nursery Garden

> A bilingual (English and Tamil) online plant shop and nursery management platform for Kaviyadevan Nursery Garden, Dharmapuri, Tamil Nadu, India.

![Project Status](https://img.shields.io/badge/status-in%20development-orange)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/license-private-lightgrey)

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Business Overview](#-business-overview)
- [Product Catalogue](#-product-catalogue)
- [Planned Features](#-planned-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database and Prisma](#-database-and-prisma)
- [Business Rules and Operating Policies](#-business-rules-and-operating-policies)
- [Order Lifecycle](#-order-lifecycle)
- [Design Principles](#-design-principles)
- [Development Roadmap](#-development-roadmap)
- [Testing and Launch Checklist](#-testing-and-launch-checklist)
- [SEO, Analytics and Monitoring](#-seo-analytics-and-monitoring)
- [Git Development Workflow](#-git-development-workflow)
- [Commit Message Convention](#-commit-message-convention)
- [Decisions to Confirm Before Launch](#-decisions-to-confirm-before-launch)
- [Contact](#-contact)

---

## 📖 About the Project

**KDN Nursery (Kaviyadevan Nursery Garden)** is being developed as an online platform that helps customers discover, select and purchase plants conveniently. Customers will be able to browse plants by category, explore product photographs and availability, learn how to care for plants, and contact the nursery through WhatsApp.

The platform will also include a secure, mobile-friendly admin dashboard that enables the owner to manage products, categories, prices, stock availability, orders, offers, banners, plant-care guides and selected website content.

### Vision

Build a trusted local nursery brand in Dharmapuri and nearby areas, increase online and bulk sales, and gradually expand delivery coverage across Tamil Nadu.

### Project Objectives

- Establish a professional online presence for Kaviyadevan Nursery Garden.
- Make plant discovery and purchasing convenient for local customers.
- Provide product information in both English and Tamil.
- Simplify product, price, inventory and order management.
- Support online payments and transparent order tracking.
- Encourage repeat purchases through useful plant-care information.
- Build a scalable foundation for future digital services.

### Project Status

The project is **in development**. Features documented as planned or future enhancements may not yet be implemented. Update this README as implementation progresses so that the documentation accurately reflects the application.

### Current implementation

Milestone 1 is implemented. The admin panel is implemented on `feature/admin-panel` and stays closed until PostgreSQL, `AUTH_SECRET` and an admin account are configured. Online ordering and payments are not available yet.

| Area | State |
|---|---|
| Home, shop, category, product, plant-care, about, contact, wishlist, cart and draft policy pages | Implemented in English and Tamil |
| Search by English or Tamil product name, category filter and stock limits | Implemented |
| Wishlist and cart saved on the device | Implemented. Checkout is not open |
| Prices, stock and Tamil product copy | Demo data, marked for owner review |
| Plant photographs | Licensed species photos for verified plants. Four plants still say “Photo coming soon”. Sources are in `docs/IMAGE_SOURCES.md`. These are not the nursery’s own photos |
| PostgreSQL catalogue | Prepared with Prisma. Not connected in the sample preview |
| WhatsApp enquiry | Shown only after `NEXT_PUBLIC_WHATSAPP_NUMBER` is set |
| Admin panel | Implemented. Sign-in, plants, categories, photographs, website content, settings and an empty orders view. It does not open in demo mode. See `docs/ADMIN_GUIDE.md` |
| Checkout, Razorpay, order tracking and Plant Finder | Planned |
| `dev` branch | Blocked. The remote currently has `main` only |

Windows setup is in `docs/SETUP.md`. Progress is in `docs/PROGRESS.md`. Open decisions are in `docs/OWNER_DECISIONS.md`.

The public shop reads an explicit data source:

- `CATALOGUE_DATA_SOURCE=demo` uses the labelled sample catalogue. Production refuses this unless `ALLOW_DEMO_CATALOGUE=true` is set for a non-public preview.
- `CATALOGUE_DATA_SOURCE=database` requires `DATABASE_URL`. A database failure does not switch to sample data.

Demo mode does not write orders, stock or payments.

## 🏡 Business Overview

| Detail | Information |
|---|---|
| Business name | Kaviyadevan Nursery Garden (KDN Nursery) |
| Owner | Kaviya Devendhiran |
| Location | Dharmapuri, Tamil Nadu, India |
| Initial service areas | Dharmapuri Town, Vallampalli, Palacode and Harur |
| Planned expansion | Wider delivery coverage across Tamil Nadu |
| Languages | English and Tamil |
| Planned domain | `kdnnursery.in` |
| Primary enquiry channel | WhatsApp |
| Additional channels | Instagram, email and store visits |
| Project status | In development |

The domain, contact details, service areas and operating policies must be confirmed before public launch.

## 🌱 Product Catalogue

The initial catalogue is planned to contain approximately **30–50 products** across three major categories. The final selection will depend on the products, photographs, prices and seasonal availability confirmed by the nursery.

### 1. Herbal Plants

- Tulasi varieties
- Mint
- Rosemary
- Lemongrass
- Henna
- Hibiscus

### 2. Flowering Plants

- Champa (Senbagam)
- Hybrid hibiscus
- December flower
- Other flowering varieties confirmed by the nursery

### 3. Fruit Plants

- Guava
- Water apple
- Jackfruit
- Pomegranate
- Orange
- Mosambi
- Pomelo
- Sapota
- Avocado
- Rambutan
- Fig
- Jamun
- Amla
- Mango
- Dragon fruit

### Product Information Requirements

Each product should support the relevant information below:

- Product name in English and Tamil
- Product category and plant variety
- Product photographs
- Short and detailed descriptions
- Price and optional bulk pricing
- Availability or out-of-stock status
- Plant-care instructions
- Relevant delivery or handling information
- Searchable product name and readable URL
- Appropriate image alt text

Product details and stock status must be verified before publication. Seasonal availability may change, and the catalogue should be updated accordingly.

## ✨ Planned Features

### 1. Customer Website

#### Product Discovery

- Browse plants by category.
- Search by English or Tamil product name.
- Filter and sort products.
- View product photographs, prices and availability.
- Read detailed descriptions and plant-care instructions.
- Explore dedicated plant-care guides.
- Discover suitable plants through the Plant Finder quiz.

#### Shopping and Checkout

- Add products to a shopping cart.
- Complete checkout without creating a customer account.
- Choose eligible delivery or nursery pickup.
- View the order total and applicable delivery charges.
- Pay online through Razorpay using supported payment methods.
- Receive order confirmation and a simple order receipt.
- Check order status using an order number and phone number.
- Save a wishlist locally on the device without signing in.

#### Customer Communication

- Enquire about products through WhatsApp.
- Submit bulk-order enquiries.
- View nursery contact information.
- Switch between English and Tamil.
- Review delivery, cancellation, refund, privacy and terms policies before ordering.

### 2. Admin Dashboard

The admin dashboard is planned to work on both mobile and desktop devices.

#### Product and Inventory Management

- Add, edit and remove products.
- Manage product categories and photographs.
- Update product descriptions and prices.
- Update stock availability.
- Manage bulk prices.
- Mark featured products.

#### Website Content Management

- Manage banners and promotional offers.
- Manage testimonials.
- Edit plant-care guides.
- Update delivery settings and selected website content.

#### Order Management

- View new and existing orders.
- Review order and payment statuses.
- Update fulfilment status.
- Record courier and shipment details.
- Review unavailable products and popular products.
- View basic sales and visitor reports.

All admin routes and actions must require appropriate authentication and authorisation. Sensitive operations must be validated and executed on the server.

### 3. Future Enhancements

These features are intended for later stages and should not delay the initial shopping journey:

- Customer reviews with photographs
- Coupons and loyalty points
- WhatsApp order updates
- Plant-care reminders
- AI-powered plant assistant
- Photo-based plant identification
- Installable Progressive Web App (PWA)

> **Important:** Features listed in this section are planned, not necessarily implemented.

## 🧰 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js App Router | Website pages and application functionality |
| Language | TypeScript | Type-safe application development |
| Styling | Tailwind CSS | Responsive layouts and styling |
| UI components | shadcn/ui | Reusable interface components |
| Database | PostgreSQL | Products, categories, orders and payment-related records |
| ORM | Prisma | Database access, schema management and migrations |
| Admin authentication | Auth.js | Admin sign-in and session management |
| Validation | Zod | Input and data validation |
| Image management | Cloudinary | Product photographs and media |
| Payments | Razorpay | Online payment processing |
| Internationalisation | next-intl | English and Tamil language support |
| Analytics | Google Analytics 4 and/or Vercel Analytics | Traffic and conversion measurement |
| Error monitoring | Sentry | Application error monitoring |
| Hosting | Vercel | Application deployment and hosting |

### Database Hosting

PostgreSQL may be hosted using a provider such as Neon or Supabase. The final provider, connection configuration and production environment must be confirmed before deployment.

### Architecture Guidelines

- Use server-side logic for pricing, delivery charges, stock validation and payment verification.
- Keep database access and sensitive business operations on the server.
- Use reusable UI components to maintain a consistent design.
- Validate user input before processing or storing it.
- Use Prisma migrations to manage database schema changes.
- Keep secrets in environment variables, never in client-side code.
- Separate payment status from order fulfilment status.

## 🗂️ Project Structure

The following is the proposed project structure. Actual folders and files may differ as development progresses.

Milestone 1 nests category and product pages under `shop`, and adds `wishlist`:

```text
src/app/[locale]/shop/page.tsx
src/app/[locale]/shop/[category]/page.tsx
src/app/[locale]/shop/[category]/[product]/page.tsx
src/app/[locale]/wishlist/page.tsx
src/app/[locale]/policies/[slug]/page.tsx
```

Checkout, order status, plant finder and admin routes are not created until those features are real.

```text
kdn-nursery-website/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── images/
├── messages/
│   ├── en.json
│   └── ta.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── shop/
│   │   │   ├── [category]/
│   │   │   │   └── [product]/
│   │   │   ├── plant-finder/
│   │   │   ├── plant-care/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── order-status/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── policies/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── shop/
│   │   └── admin/
│   ├── lib/
│   ├── server/
│   └── types/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Folder Responsibilities

- `prisma/` — Database schema, migrations and seed data.
- `public/` — Public static assets.
- `messages/` — English and Tamil translation messages.
- `src/app/` — Application routes and pages.
- `src/components/ui/` — Reusable interface components.
- `src/components/shop/` — Shopping and catalogue components.
- `src/components/admin/` — Admin-specific components.
- `src/lib/` — Shared utilities and integrations.
- `src/server/` — Server-side business logic and database operations.
- `src/types/` — Shared TypeScript types.

Keep secrets and private configuration out of `public/` and client-side components.

## 🚀 Getting Started

### Prerequisites

Ensure that the following are installed or available:

- Node.js 20 or newer
- npm
- Git
- Access to the project repository
- A PostgreSQL database, local or hosted
- Credentials for external services required by the features being developed

### 1. Clone the Repository

Use the repository URL configured for your Git account:

```bash
git clone <repository-url>
cd kdn-nursery-website
```

If your SSH alias is configured, the repository URL may be:

```bash
git clone git@github-kdn:kdn-nursery/kdn-nursery-website.git
cd kdn-nursery-website
```

### 2. Create a Task Branch

Always start from the latest `dev` branch. Do not develop directly on `main` or `dev`.

```bash
git switch dev
git pull origin dev
git switch -c feature/short-feature-name
```

If `dev` is not yet available as a local branch after cloning, fetch remote branches and set up its tracking branch once:

```bash
git fetch origin
git switch --track origin/dev
```

After setting up the local tracking branch, create a fresh feature branch for your task.

Refer to the [Git Development Workflow](#-git-development-workflow) section for the complete process.

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Copy the example environment file if it exists.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

For a local preview without PostgreSQL, set `CATALOGUE_DATA_SOURCE=demo`. Set `ALLOW_DEMO_CATALOGUE=true` only when you intentionally build that preview. See `docs/SETUP.md`.

Add the required development values to `.env`. If `.env.example` has not yet been created, create it using the variable names listed in the Environment Variables section.

Never commit `.env` or any file containing secrets.

### 5. Configure the Database

Confirm that `DATABASE_URL` points to your development database. Verify that the Prisma schema and migrations exist before running database commands.

See [Database and Prisma](#-database-and-prisma) for setup details.

### 6. Start the Development Server

```bash
npm run dev
```

Open the application at:

[http://localhost:3000](http://localhost:3000)

### Available Scripts and Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run configured lint checks |
| `npx prisma studio` | Browse database records |
| `npx prisma migrate dev --name <migration-name>` | Create and apply a development migration |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db seed` | Run the configured seed script |
| `npm run admin:create` | Create or rotate the initial admin. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` only for that command |

A command will work only if the corresponding package, script or configuration exists. Check `package.json` and the Prisma configuration before relying on it.

## 🔐 Environment Variables

Create a local `.env` file and keep it out of version control. Maintain `.env.example` with variable names and blank or safe placeholder values.

```dotenv
# Database
DATABASE_URL=

# Admin authentication
AUTH_SECRET=

# Cloudinary image management
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Public website and contact configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=
```

### Environment Variable Security

- Use Razorpay test credentials during development.
- Never expose database credentials, authentication secrets, Cloudinary API secrets, Razorpay secret keys or webhook secrets in client-side code.
- Only values intentionally designed to be public should use the `NEXT_PUBLIC_` prefix.
- Store production secrets in the hosting provider's environment-variable settings.
- Rotate any credential that is accidentally committed or exposed.
- Do not paste real credentials into issues, pull requests, logs or documentation.

## 🗄️ Database and Prisma

PostgreSQL is the planned relational database. Prisma will be used for database access, schema management and migrations.

### Initial Database Setup

After configuring `DATABASE_URL` and confirming that the Prisma schema and migrations are present, run the commands appropriate to the current project state.

For an existing migration history:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

For a project creating its initial migration, the first migration may instead be created with:

```bash
npx prisma migrate dev --name init
```

Do not run both initial migration alternatives blindly. Use the command that matches the repository's current migration history. If migrations or the seed script have not been created, implement those first.

### Database Best Practices

- Use a separate development database.
- Do not experiment against production data.
- Record schema changes through migrations.
- Review generated migrations before applying them to shared environments.
- Seed only safe development data.
- Validate data at application boundaries.
- Use appropriate database constraints.
- Back up the database and test restoration before launch.
- Restrict database credentials to the permissions required by the application.
- Never treat a browser redirect as proof of payment.

## 🛒 Business Rules and Operating Policies

The following rules reflect the current business requirements and must be confirmed with the owner before public launch.

| Area | Planned rule |
|---|---|
| Pricing | Display product prices clearly. Online prices may differ from in-store prices. Bulk pricing may apply. |
| Availability | Show Available or Out of stock. Seasonal availability may change. |
| Initial delivery areas | Dharmapuri Town, Vallampalli, Palacode and Harur |
| Delivery expansion | Wider delivery across Tamil Nadu is planned, subject to confirmed coverage and operational feasibility. |
| Dispatch days | Monday, Tuesday and Wednesday are currently planned dispatch days. |
| Estimated delivery | An estimated 1–3 days is currently planned. Confirm the estimate and eligible pincodes before launch. |
| Delivery charges | Calculate using an owner-approved order-value table. Free delivery is not currently planned. |
| Pickup | Nursery/store pickup is a planned option. Confirm pickup instructions and timings. |
| Payment | Online payment through Razorpay is planned. Cash on delivery is not planned. |
| Checkout | Guest checkout; customer accounts are not required for the initial release. |
| Payment confirmation | Mark an order as paid only after server-side payment verification and verified server-side confirmation. |
| Duplicate payment events | Process repeated webhook events safely so duplicate events do not create duplicate orders or fulfilment actions. |
| Cancellation and refunds | The current business requirement says no cancellation after payment and no refund or replacement. Review these terms for legal compliance before publication. |
| Receipts and invoices | Provide a simple order receipt. Confirm GST registration status and applicable invoicing obligations with a qualified adviser. |
| Customer contact | WhatsApp is the primary channel. Instagram, email and store visits are additional planned channels. |
| Bulk orders | Support bulk enquiries through WhatsApp. Confirm minimum quantities and price tiers. |

> **Policy and compliance note:** Plant health, damaged-in-transit, cancellation, refund and replacement terms should be reviewed for legal compliance and clearly displayed before checkout. Do not publish an absolute no-refund/no-replacement promise without confirming applicable consumer-protection requirements. This README is not legal or tax advice.

### Pricing and Inventory Safeguards

- Recalculate product prices, discounts, delivery charges and order totals on the server.
- Never trust prices or totals submitted by the browser.
- Prevent purchases of out-of-stock products.
- Validate stock again when an order is placed to reduce overselling.
- Define when stock is reserved, released after failed payments and deducted after confirmed payment.
- Track payment status separately from fulfilment status.
- Record important order and payment transitions for troubleshooting and auditability.

## 🔄 Order Lifecycle

### Customer Journey

```text
Browse Plants / Make an Enquiry
             ↓
Check Product Availability and Price
             ↓
Add Products to Cart
             ↓
Enter Customer and Delivery/Pickup Details
             ↓
Calculate Total and Delivery Charges on Server
             ↓
Complete Online Payment
             ↓
Verify Payment on Server
             ↓
Select and Quality-Check Plants
             ↓
Pack → Dispatch → Track → Deliver
```

### Planned Order Statuses

```text
New → Paid → Preparing → Packed → Shipped → Delivered
```

The final implementation should also define appropriate handling for failed, pending, cancelled or refunded payment states where applicable.

**Important:** Payment status and fulfilment status must be tracked separately. An order must not be marked as paid solely because the customer returns to the website after attempting payment.

## 🎨 Design Principles

- **Premium and natural:** Use authentic plant photography, earthy greens and warm neutral colours.
- **Mobile-first:** Make the shopping experience and admin dashboard comfortable to use on phones.
- **Bilingual by design:** Support English and Tamil across navigation, product content, forms and policies.
- **Accessible:** Use readable typography, sufficient contrast, keyboard support, descriptive labels and clear form errors.
- **Trustworthy:** Make prices, stock availability, delivery estimates, payment status and policies transparent.
- **Performance-conscious:** Optimise images, avoid unnecessary client-side JavaScript and keep pages fast on mobile networks.
- **Consistent:** Use reusable components and consistent spacing, typography, colours and interaction patterns.
- **Clear feedback:** Provide useful loading, empty, success and error states for catalogue, checkout and admin actions.

## 🗺️ Development Roadmap

Build and test the core purchase journey before adding advanced features.

| Phase | Focus | Expected outcome |
|---|---|---|
| 1. Foundation | Next.js setup, code quality, design system, database and deployment foundation | Stable project ready for development |
| 2. Catalogue | Product data, photographs, categories, search, filters and product pages | Customers can find and understand products |
| 3. Admin | Secure login, product/category management, price and availability updates | Owner can manage the catalogue |
| 4. Checkout | Cart, delivery rules, guest checkout and Razorpay integration | Secure online purchases |
| 5. Operations | Order management, tracking, receipts and owner notifications | Orders can be handled end to end |
| 6. Plant experience | Plant Finder, care guides, English/Tamil interface and wishlist | Better discovery and customer support |
| 7. Launch readiness | SEO, analytics, security, backups and testing | Website ready for public launch |
| 8. Growth | Reviews, coupons, loyalty features and automated updates | Encourage repeat purchases |
| 9. Advanced | AI plant assistant, photo identification and PWA | Expanded digital experience |

Maintain a separate feature-by-feature development plan or progress tracker. Mark work complete only after implementation and relevant testing.

## 🧪 Testing and Launch Checklist

Use the following checklist before public launch. Add automated tests as the application develops.

### Catalogue and Checkout

- [ ] Product names and descriptions are correct in English and Tamil.
- [ ] Prices, discounts, stock and delivery charges are validated on the server.
- [ ] Out-of-stock products cannot be purchased.
- [ ] Stock is checked safely during checkout to reduce overselling.
- [ ] Guest checkout works without requiring a customer account.
- [ ] Delivery and pickup options follow confirmed business rules.
- [ ] Order totals are correct for different cart sizes and delivery ranges.
- [ ] Form validation and error messages work correctly.

### Payments and Orders

- [ ] Razorpay payment signatures are verified server-side.
- [ ] Webhook signatures are verified.
- [ ] Duplicate webhook events do not create duplicate orders or fulfilment actions.
- [ ] Failed, pending, retried and successful payments show the correct state.
- [ ] Orders are not marked paid based only on a browser redirect.
- [ ] Payment and fulfilment statuses are tracked separately.
- [ ] A complete test purchase is performed before enabling live payments.

### Security and Operations

- [ ] Admin routes and actions require valid authentication and authorisation.
- [ ] Inputs are validated on the server.
- [ ] Sensitive values remain server-side and are not committed to Git.
- [ ] Errors are logged without exposing secrets or private customer information.
- [ ] Database backups are configured.
- [ ] Database restoration has been tested.
- [ ] Production environment variables are configured securely.

### Experience and Launch Readiness

- [ ] English and Tamil pages are tested on mobile and desktop.
- [ ] Images have suitable dimensions and descriptive alt text.
- [ ] Loading, empty, success and error states are understandable.
- [ ] Privacy, delivery, cancellation, refund and terms policies are published and reviewed.
- [ ] Delivery coverage, charges, dispatch days and estimates are confirmed.
- [ ] Contact details and social links are correct.
- [ ] SEO metadata, sitemap and robots rules are checked.
- [ ] The production build completes successfully.

## 🌐 SEO, Analytics and Monitoring

### Search Engine Optimisation

Planned launch work includes:

- Unique page titles and descriptions for products, categories and plant-care guides.
- Clean and readable product and category URLs.
- Appropriate product structured data where applicable.
- A validated `sitemap.xml`.
- A suitable `robots.txt`.
- Descriptive image alt text, including Tamil where appropriate.
- Google Business Profile setup.
- Google Search Console setup.
- Correct canonical URLs for the production domain.

### Analytics

Use Google Analytics 4 and/or Vercel Analytics, depending on the final implementation.

Useful events may include:

- Product views
- Category views
- Searches
- Add-to-cart actions
- Checkout starts
- Successful purchases
- WhatsApp clicks
- Plant Finder completions

Track only the data needed for useful measurement. Configure privacy disclosures and consent practices where required.

### Monitoring and Reporting

- Use Sentry or an equivalent service for application errors.
- Review failed payment and checkout events.
- Prepare a weekly summary of sales, popular products and visitor sources.
- Avoid sending payment credentials or unnecessary personal information to analytics and error-monitoring services.

## 🔀 Git Development Workflow

> **Golden rule: Always start from the latest `dev` branch. Create a new branch for every feature, bug fix or independent task. Push changes to that task branch and submit a Pull Request targeting `dev` only. Never work on, push to or merge into `main`. Never commit directly to `dev` either.**

### Branch Strategy

| Branch | Purpose | Rule |
|---|---|---|
| `main` | Reserved and out of bounds for this workflow | Never work on, push to or merge into it |
| `dev` | Shared development and integration branch | Pull from it; never commit directly to it |
| `feature/<name>` | New feature | Create a fresh branch for each feature |
| `fix/<name>` | Bug fix | Create a fresh branch for each independent fix |
| `docs/<name>` | Documentation change | Create a fresh branch for each documentation task |
| `release/<version>` | Optional release preparation | Use only if the team explicitly agrees; never use it to modify `main` |

### 1. Start Every Task from the Latest `dev`

```bash
# Switch to dev
git switch dev

# Get the latest integrated code
git pull origin dev

# Create a new task branch
git switch -c feature/short-feature-name
```

Choose a meaningful branch name, for example:

```text
feature/product-search
feature/checkout
fix/delivery-charge-calculation
docs/readme-update
```

Use `feature/`, `fix/` or `docs/` as appropriate.

If `dev` is not available locally after cloning, fetch remote branches and set up the tracking branch once:

```bash
git fetch origin
git switch --track origin/dev
```

Then create a fresh task branch from the updated `dev`.

### 2. Verify Your Branch and Review Changes

Before editing or committing, confirm your current branch:

```bash
git branch --show-current
git status
```

After making changes, inspect the files and differences:

```bash
git status
git diff
```

Stage and commit the files relevant to your task:

```bash
git add .
git commit -m "feat: add product search"
```

For more control, stage individual files instead of using `git add .`.

### 3. Push Your Task Branch

For the first push:

```bash
git push -u origin feature/short-feature-name
```

For subsequent pushes:

```bash
git push
```

Push only your task branch. Never push commits directly to `dev` or `main`.

### 4. Create a Pull Request into `dev`

On GitHub:

1. Open the repository.
2. Create a Pull Request from your task branch.
3. Set the **base branch to `dev`**.
4. Select your feature, fix or documentation branch as the compare branch.
5. Describe the change and include testing details.
6. Review the changes and resolve conflicts.
7. Wait for required checks and reviews.
8. Merge the Pull Request into `dev` only.

**Always verify the base branch before creating or merging a PR. It must be `dev`, never `main`.**

### 5. Bring Latest `dev` Changes into Your Task Branch

If other work is merged into `dev` while your task is in progress:

```bash
# Fetch the latest remote references
git fetch origin

# Switch to your existing task branch
git switch feature/short-feature-name

# Merge the latest dev changes into your task branch
git merge origin/dev

# Resolve conflicts, test, then push
git push
```

Resolve conflicts carefully and run relevant tests before pushing. This updates your task branch with the latest `dev`; it does not merge your task into `dev`.

### 6. After the Pull Request Is Merged into `dev`

Update your local `dev` branch:

```bash
git switch dev
git pull origin dev
```

Delete the completed local task branch only after confirming it has been merged and is no longer needed:

```bash
git branch -d feature/short-feature-name
```

If the remote task branch has not already been deleted and is no longer needed:

```bash
git push origin --delete feature/short-feature-name
```

Replace the example branch name with your actual branch. Never run these deletion commands against `dev` or `main`.

### 7. Start the Next Task

Repeat the process for every new feature, bug fix or independent task:

```bash
git switch dev
git pull origin dev
git switch -c feature/next-feature-name
```

Never reuse an old feature branch for an unrelated task.

### Git Team Rules

- Always start from the latest `dev`.
- Create a new branch for every feature, bug fix or independent task.
- Never work directly on `dev` or `main`.
- Push changes to your task branch, not directly to `dev`.
- Create Pull Requests targeting `dev` only.
- Never push, merge or make changes to `main`.
- Review and test changes before merging into `dev`.
- Keep commits focused and meaningful.
- Never commit `.env` files, API keys, passwords, database credentials or private customer data.
- Update the README and development tracker when relevant implementation details change.

## 📝 Commit Message Convention

Use short, descriptive commit messages with a consistent prefix.

| Prefix | Purpose | Example |
|---|---|---|
| `feat:` | New feature | `feat: add plant finder quiz` |
| `fix:` | Bug fix | `fix: correct delivery charge calculation` |
| `style:` | UI or styling improvement | `style: improve product card spacing` |
| `refactor:` | Code restructuring without intended behaviour change | `refactor: move price logic to server` |
| `docs:` | Documentation | `docs: update README roadmap` |
| `test:` | Tests | `test: add checkout tests` |
| `chore:` | Maintenance | `chore: upgrade dependencies` |

Examples:

```text
feat: add plant finder quiz
fix: correct delivery charge calculation
style: improve product card spacing
refactor: move price logic to server
docs: update README roadmap
test: add checkout tests
chore: upgrade dependencies
```

## ❓ Decisions to Confirm Before Launch

Confirm and document the following with the owner before accepting public orders.

### Delivery and Fulfilment

- Delivery partners and serviceable pincodes
- Final delivery coverage in Dharmapuri Town, Vallampalli, Palacode and Harur
- Whether and when to expand delivery across Tamil Nadu
- Exact delivery charges for each order-value range
- Confirmed dispatch days and the meaning of the estimated 1–3 day delivery window
- Store pickup address, hours and instructions
- Courier details and order-tracking process

### Products and Pricing

- Final catalogue and initial 30–50 product selection
- English and Tamil product names and descriptions
- Final photographs and plant-care information
- Seasonal availability and stock-update process
- Online prices compared with in-store prices
- Bulk-price tiers and minimum quantities
- Whether coupons are needed at launch or can be introduced later

### Administration and Customer Communication

- Whether admin access is owner-only or includes staff roles
- Whether WhatsApp shipment updates are required at launch
- Final WhatsApp number, Instagram profile and email address
- Owner notification process for new orders and payment issues
- Final website domain and production URL

### Payments, Policies and Compliance

- Razorpay onboarding requirements and business bank details
- Payment failure, retry and reconciliation process
- Cancellation, refund, replacement and damaged-plant policies
- Privacy policy, terms and delivery policy
- GST registration status and applicable invoicing obligations
- Legal review required before publishing customer-facing policies

## 📬 Contact

**Kaviyadevan Nursery Garden (KDN Nursery)**

Dharmapuri, Tamil Nadu, India

- **Website:** `kdnnursery.in` (planned)
- **WhatsApp:** To be added
- **Instagram:** To be added
- **Email:** To be added

---

<sub>Private project · © Kaviyadevan Nursery Garden · Dharmapuri, Tamil Nadu, India</sub>
