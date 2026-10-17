# Admin guide

The admin panel manages the nursery catalogue and the public website copy. It is separate from the customer site. Visitors do not see admin links.

## Required configuration

The panel works only when the site is using the database catalogue. Demo mode shows setup instructions and refuses every change.

1. Create a development PostgreSQL database. Do not point this at a production database.
2. In `.env`, set:
   - `CATALOGUE_DATA_SOURCE=database`
   - `DATABASE_URL` to that development database
   - `AUTH_SECRET` to a long random value
3. Apply the reviewed migrations:

```bash
npx prisma migrate deploy
```

4. Optional, for a development catalogue only:

```bash
npm run db:seed
```

The seed loads sample prices, stock and unverified Tamil. It marks those plants published on first insert and does not force them back to published if you later unpublish them.

5. For photographs, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. Until those exist, the media page explains the gap and uploads are refused.

Checkout and Razorpay are not part of this panel. Leave the Razorpay variables empty.

## Create the initial admin

There is no default password and no public registration page.

Set the username and password only for the command below. Use at least 12 characters, and do not reuse the username as the password.

```bash
ADMIN_USERNAME="your-admin-name" ADMIN_PASSWORD="a-long-private-password" npm run admin:create
```

On Windows PowerShell:

```powershell
$env:ADMIN_USERNAME="your-admin-name"; $env:ADMIN_PASSWORD="a-long-private-password"; npm run admin:create
```

Running it again for the same username changes the password and signs out existing sessions. The command does not print the password.

## Sign in

Open `/admin/login`.

A wrong username or password shows “Invalid username or password.” Too many attempts show “Try again later.” Sessions last eight hours. Use Log out in the admin menu to end the current session.

Password changes are under `/admin/account`. Saving a new password signs out every session.

## Add or edit a plant

Open Plants, then Add a plant, or open an existing row.

Enter the English and Tamil names, a lowercase hyphenated slug, a category, descriptions, care, sunlight, watering, handling notes, price in rupees, stock and status. New plants start as drafts. A draft does not appear in the public shop.

The comparison price, when used, must be higher than the selling price. Bulk tiers use one line per tier, such as `5=359`, and must be cheaper than the single price. Stock cannot be negative. Choosing out of stock stores a quantity of zero.

Save shows a confirmation or the validation message. If someone else saved the same plant first, reload and enter the change again. Leaving a changed form asks the browser to confirm before closing.

## Photographs

On a plant’s edit page, choose a JPEG, PNG or WebP file of 8 MB or less. The page shows a preview before upload. Set the cover, drag photographs into order, or use Move up and Move down. Save photograph order stores that sequence. Edit the English and Tamil alt text on each photograph. Remove asks for confirmation.

Uploaded files go to Cloudinary. A licensed `local:` photograph already in the site is not deleted from the project when it is removed from one plant. A Cloudinary file is deleted only when nothing else still uses it.

## Prices and stock

Edit the price and stock on the plant form. Money is stored in paise and shown in rupees. The dashboard shortcut “Update stock” filters out-of-stock plants.

## Publish or archive

Set the status to Published, Draft or Archived and save.

Archive or delete asks for confirmation. If an order still references the plant, it is archived and the order keeps its own item snapshot. A plant with no orders can be deleted.

## Categories

Add or edit English and Tamil names, descriptions, image key, display order and published state.

Archiving a category hides it and leaves its plants in place. Deleting is allowed only after the category has no plants. Move plants to another category first. Plants are never deleted just because their category was removed.

## Website content and settings

Website content edits the homepage hero, about page, policy text, banners, questions and plant-care articles in English and Tamil. Saved text is what the public site shows. Blank fields keep the existing translation.

Business settings store the nursery name, WhatsApp number, email, Instagram, address, pickup notes, opening hours, dispatch days, delivery estimate, serviceable pincodes and delivery charge tiers. Leave charges empty until the owner confirms them. The panel does not show database, Auth.js, Cloudinary or Razorpay secrets.

## Orders

The orders page is empty until checkout exists. It does not create sample orders. Payment status is shown separately from fulfilment. This panel cannot mark an order as Razorpay paid or refunded. Cancellation of a paid order stays unavailable until a real refund workflow exists. Receipt printing is not available yet.

## Known limits

- No PostgreSQL database is configured in the current local preview, so sign-in, saving and uploads have not been exercised against a database.
- Cloudinary uploads need the three server credentials. They are not stored in the repository.
- Customer accounts, public registration and paid checkout are not included.
- Tamil copy and sample prices remain owner-review items.
- `origin/dev` does not exist yet, so a pull request cannot target `dev`.
