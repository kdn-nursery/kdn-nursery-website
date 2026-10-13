# 🌿 KDN Nursery — Kaviyadevan Nursery Garden

> A bilingual online plant shop and nursery management platform for Kaviyadevan Nursery Garden, Dharmapuri, Tamil Nadu.

![Project Status](https://img.shields.io/badge/status-in%20development-orange)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/license-private-lightgrey)

---

## 📖 About

**KDN Nursery** is being developed to help customers discover, select and purchase plants online, learn how to care for them, and contact the nursery through WhatsApp. A mobile-friendly admin dashboard will let the owner manage products, prices, availability, orders, offers and website content.

**Vision:** Build a trusted local nursery brand in Dharmapuri and nearby areas, grow online and bulk sales, and gradually expand delivery across Tamil Nadu.

| Detail | Information |
|---|---|
| Business | Kaviyadevan Nursery Garden (KDN Nursery) |
| Owner | Kaviya Devendhiran |
| Location | Dharmapuri, Tamil Nadu, India |
| Initial service areas | Dharmapuri Town, Vallampalli, Palacode and Harur |
| Planned expansion | Across Tamil Nadu |
| Languages | English and Tamil |
| Domain | `kdnnursery.in` — planned |
| Project status | In development |

## 🌱 Product categories

The initial catalogue is planned to include **30–50 products** across three categories:

- **Herbal plants:** Tulasi varieties, mint, rosemary, lemongrass, henna and hibiscus.
- **Flowering plants:** Champa (Senbagam), hybrid hibiscus, December flower and other varieties.
- **Fruit plants:** Guava, water apple, jackfruit, pomegranate, orange, mosambi, pomelo, sapota, avocado, rambutan, fig, jamun, amla, mango and dragon fruit.

The catalogue will grow as product details, availability and photographs are confirmed.

## ✨ Planned features

### Customer website

- Browse plants by category, search by English or Tamil name, and filter or sort products.
- View product photos, pricing, availability, descriptions and plant-care guidance.
- Add products to a cart and check out without creating an account.
- Choose delivery or nursery pickup.
- Pay online through Razorpay using supported payment methods.
- Check order status using an order number and phone number.
- Save a wishlist on the device without signing in.
- Use the **Plant Finder** quiz to discover suitable plants.
- Read plant-care guides and view care details on product pages.
- Enquire about products and bulk orders through WhatsApp.
- Switch between English and Tamil.
- View delivery, cancellation, refund, privacy and terms policies before ordering.

### Admin dashboard

- View order and sales summaries, popular products and unavailable items.
- Add, edit and remove products, photos, categories and prices.
- Update product availability quickly from a phone or computer.
- Manage bulk prices, featured products, banners, offers and testimonials.
- Edit plant-care guides and delivery settings.
- Track orders, update fulfilment status and record courier details.
- Review basic sales and visitor reports.

### Future enhancements

- Customer reviews with photos, coupons and loyalty points.
- WhatsApp order updates and plant-care reminders.
- An AI plant assistant and photo-based plant identification.
- An installable Progressive Web App (PWA).

These are planned features; their presence in this README does not mean they are already implemented.

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling and UI | Tailwind CSS, shadcn/ui |
| Database | PostgreSQL (Neon or Supabase) |
| ORM | Prisma |
| Admin authentication | Auth.js |
| Validation | Zod |
| Image management | Cloudinary |
| Payments | Razorpay |
| Internationalisation | next-intl |
| Analytics | Google Analytics 4 and/or Vercel Analytics |
| Error monitoring | Sentry |
| Hosting | Vercel |

## 🗂️ Project structure

The following is the planned structure. Adjust it as implementation evolves.

```text
kdn-nursery-website/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── messages/
│   ├── en.json
│   └── ta.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── shop/
│   │   │   ├── [category]/[product]/
│   │   │   ├── plant-finder/
│   │   │   ├── plant-care/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── order-status/
│   │   │   └── about/ contact/ policies/
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
└── README.md
```

## 🚀 Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database (local, Neon or Supabase)
- Access to the project repository

### 1. Clone the repository

Use the repository URL configured for your Git account:

```bash
git clone <repository-url>
cd kdn-nursery-website
```

If your Git SSH alias is configured, the project URL may be:

```bash
git clone git@github-kdn:kdn-nursery/kdn-nursery-website.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the required values in `.env`. Do not commit this file.

### 4. Set up the database

After confirming the Prisma schema and database connection are configured:

```bash
npx prisma migrate dev
npx prisma db seed
```

If the seed script or migrations have not yet been created, complete those setup tasks first.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run lint checks |
| `npx prisma studio` | Browse database records |
| `npx prisma migrate dev --name <migration-name>` | Create a database migration |

A command will work only after the corresponding script or configuration has been added to the project.

## 🔐 Environment variables

Create a local `.env` file and keep it out of version control. Keep `.env.example` updated with variable names and blank values only.

```dotenv
# Database
DATABASE_URL=

# Admin authentication
AUTH_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Public site/contact configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=
```

Use test credentials during development. Never expose database credentials, authentication secrets, Cloudinary secrets, Razorpay secret keys or webhook secrets in client-side code or source control. Only values intentionally designed to be public should use the `NEXT_PUBLIC_` prefix.

## 🛒 Business rules

| Area | Planned rule |
|---|---|
| Pricing | Display prices for products; online prices may differ from in-store prices. Bulk pricing may apply. |
| Availability | Show **Available** or **Out of stock**; seasonal availability may change. |
| Delivery | Tamil Nadu delivery is planned, with dispatch on Monday, Tuesday and Wednesday and an estimated 1–3 days. Confirm coverage and estimates before launch. |
| Delivery charges | Calculated from an owner-approved order-value table. No free delivery is currently planned. |
| Pickup | Store pickup is available as a planned option. |
| Payment | Online payment through Razorpay; cash on delivery is not planned. |
| Checkout | Guest checkout; customer accounts are not required for the initial release. |
| Order confirmation | Mark an order as paid only after server-side payment verification and a verified Razorpay webhook. Handle duplicate webhook events safely. |
| Cancellation and refunds | The current business requirement says no cancellation after payment and no refund or replacement. Publish clear, legally reviewed terms before accepting orders. |
| Receipts | Provide a simple order receipt; GST registration status and applicable invoicing obligations should be confirmed with a qualified adviser. |
| Contact | WhatsApp is the primary channel; Instagram, email and store visits are additional planned channels. |

> **Important:** Plant health, damaged-in-transit, cancellation and refund terms should be reviewed for legal compliance and stated clearly before checkout. Do not publish an absolute no-refund/no-replacement promise without confirming applicable consumer-protection requirements.

## 🔄 Order lifecycle

```text
Browse / Enquire
      ↓
Check availability and price
      ↓
Enter customer and delivery details
      ↓
Complete online payment
      ↓
Verify payment on the server
      ↓
Select and quality-check plants
      ↓
Pack → Dispatch → Track → Deliver
```

Planned order statuses:

```text
New → Paid → Preparing → Packed → Shipped → Delivered
```

Payment status and fulfilment status should be tracked separately so an order cannot be treated as paid based only on a browser redirect.

## 🗺️ Development roadmap

Build and test the purchase journey before adding advanced features.

| Phase | Focus | Main outcome |
|---|---|---|
| 1. Foundation | Next.js setup, code quality, design system, database and deployment | A stable project ready for development |
| 2. Catalogue | Product data, photos, categories, search, filters and product pages | Customers can find and understand products |
| 3. Admin | Secure login, product and category management, price and availability updates | Owner can manage the catalogue |
| 4. Checkout | Cart, delivery rules, guest checkout and Razorpay | Secure online purchases |
| 5. Operations | Order management, tracking, receipts and owner notifications | Orders can be handled end to end |
| 6. Plant experience | Plant Finder, care guides, English/Tamil interface and wishlist | Better discovery and customer support |
| 7. Launch readiness | SEO, analytics, security, backups and testing | Site is ready for public launch |
| 8. Growth | Reviews, coupons, loyalty features and automated updates | Encourage repeat purchases |
| 9. Advanced | AI plant assistant, photo identification and PWA | Expand the digital experience |

For the detailed feature-by-feature checklist, use the project's development plan and keep the progress tracker updated as tasks are completed.

## 🌿 Design principles

- **Premium and natural:** real plant photography, earthy greens and warm neutral colours.
- **Mobile-first:** the shopping journey and owner dashboard should work comfortably on phones.
- **Bilingual by design:** support English and Tamil across navigation, product content and policies.
- **Accessible:** readable type, sufficient contrast, keyboard support and clear form errors.
- **Trustworthy:** transparent prices, availability, delivery estimates, payment status and policies.
- **Performance-conscious:** optimise images and keep pages fast on mobile networks.

## 🧪 Testing and launch checklist

Before launching, verify at least the following:

- [ ] Product prices, availability and delivery charges are calculated on the server.
- [ ] Out-of-stock products cannot be purchased.
- [ ] Razorpay payment signatures and webhook signatures are verified.
- [ ] Duplicate webhooks do not create duplicate orders.
- [ ] Failed, pending, retried and successful payments show the correct state.
- [ ] Stock is reserved and updated safely during checkout.
- [ ] Admin routes and actions require valid authentication and authorisation.
- [ ] Inputs are validated and sensitive values remain server-side.
- [ ] English and Tamil pages are checked on mobile and desktop.
- [ ] Privacy, delivery, cancellation and refund policies are published.
- [ ] Database backups are configured and a restore has been tested.
- [ ] A complete test purchase is performed before switching to live payments.

## 🌐 SEO and analytics

Planned launch work includes:

- Unique page titles and descriptions for products, categories and care guides.
- Clean URLs, product structured data, `sitemap.xml` and `robots.txt`.
- Descriptive image alt text in English and Tamil where appropriate.
- Google Business Profile and Google Search Console setup.
- Analytics for product views, add-to-cart actions, checkout, purchases and WhatsApp clicks.
- A weekly report for sales, popular products and visitor sources.

## 🔀 Development workflow

### Branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `dev` | Integration and testing |
| `feature/<name>` | A focused feature or task |
| `release/<version>` | Optional release preparation |

### Start a feature

```bash
git checkout dev
git pull origin dev
git checkout -b feature/short-feature-name
```

After implementing and testing the feature:

```bash
git add .
git commit -m "feat: add plant finder quiz"
git push -u origin feature/short-feature-name
```

Open a pull request into `dev`, review the changes, and merge only after relevant checks pass. Promote tested changes to `main` for production releases.

### Commit message examples

```text
feat: add plant finder quiz
fix: correct delivery charge calculation
style: improve product card spacing
refactor: move price logic to server
docs: update README roadmap
chore: upgrade dependencies
```

### Team conventions

- Work on one feature branch at a time.
- Never commit `.env`, credentials or private customer data.
- Validate all inputs and calculate prices on the server.
- Test responsive layouts and key purchase flows before merging.
- Update the roadmap and progress tracker when work is completed.

## ❓ Decisions to confirm before launch

- Delivery partners and coverage by pincode.
- Exact delivery charges for each order-value range.
- Whether coupons are needed at launch or later.
- Whether admin access is owner-only or includes staff roles.
- Whether customers should receive WhatsApp shipment updates.
- Razorpay onboarding requirements and business bank details.
- Minimum quantity for bulk pricing.
- Final product list, bilingual descriptions, care information and photographs.
- Store address, hours, contact details and social links.
- Final wording of cancellation, refund, replacement and plant-damage policies.

## 📬 Contact

**Kaviyadevan Nursery Garden (KDN Nursery)**  
Dharmapuri, Tamil Nadu, India

- Website: `kdnnursery.in` (planned)
- WhatsApp: To be added
- Instagram: To be added
- Email: To be added

---

<sub>Private project · © Kaviyadevan Nursery Garden · Dharmapuri, Tamil Nadu</sub>
