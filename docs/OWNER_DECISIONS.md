# Owner decisions

These items are required before public ordering. Values are not invented here. Each stays open until Kaviya Devendhiran confirms it.

| Decision | Status | Notes |
|---|---|---|
| WhatsApp number | Open | Primary enquiry channel. The cart shows an enquiry only after this is set. |
| Email address | Open | Contact page placeholder. |
| Instagram profile | Open | Contact page placeholder. |
| Full street address | Open | Only "Dharmapuri, Tamil Nadu" is published. |
| Map location | Open | No map pin is shown. |
| Pickup hours and instructions | Open | Pickup is planned, not scheduled. |
| Actual product photos | Open | Licensed species photographs stand in for verified plants. Nursery-owned photos still need to be uploaded through the admin panel once Cloudinary is configured. |
| Actual prices and stock | Open | About 17 sample plants are loaded for development. The target catalogue is 30–50. |
| Tamil product names and descriptions | Open | Sample translations are marked unverified. |
| Delivery pincodes | Open | Dharmapuri Town, Vallampalli, Palacode and Harur are discussion areas, not a coverage promise. |
| Delivery charge table | Open | Charges will follow an approved order-value table. Free delivery is not assumed. |
| Dispatch days and delivery estimate | Open | Monday–Wednesday and 1–3 days are plans, not commitments. |
| Admin login method and authorised users | Partly decided | The panel uses a username and password for one full-access admin. No account is created until `npm run admin:create` is run with a private password. Who may have that account is still the owner’s choice. |
| Database provider and credentials | Open | PostgreSQL is the planned database. Demo mode is running locally without it. |
| Cloudinary, Razorpay and Auth.js credentials | Open | Names are in `.env.example`. No live keys are stored. |
| Legally reviewed policies | Open | Delivery, privacy, terms and cancellation pages are drafts. |
| Invoicing and GST treatment | Open | Needs a qualified adviser before receipts claim tax treatment. |
| Cancellation, refund and replacement wording | Open | Do not publish an absolute no-refund or no-replacement promise. |

When a decision is confirmed, record the value in the private configuration or catalogue, not in a public chat log if it is a secret.
