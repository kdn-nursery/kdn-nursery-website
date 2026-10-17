import { ActionForm } from "@/components/admin/action-form";
import { saveBusinessSettings } from "@/server/admin/mutations";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";

function rupees(paise: number): string {
  return (paise / 100).toFixed(2).replace(/\.00$/, "");
}

export default async function SettingsPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const [profile, pincodes, tiers] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { id: "default" } }),
    prisma.deliveryPincode.findMany({ orderBy: { pincode: "asc" } }),
    prisma.deliveryChargeTier.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="grid gap-4">
      <h2 className="font-display text-3xl text-forest">Business settings</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Leave delivery charges empty until the owner confirms them. Secrets such as database, Auth.js, Cloudinary and Razorpay keys stay in the server environment and are not shown here.
      </p>
      <ActionForm action={saveBusinessSettings} className="grid gap-3">
        <input type="hidden" name="version" value={profile?.version ?? 0} />
        <input name="businessName" defaultValue={profile?.businessName ?? "Kaviyadevan Nursery Garden"} aria-label="Business name" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="whatsappNumber" defaultValue={profile?.whatsappNumber ?? ""} aria-label="WhatsApp number" placeholder="WhatsApp with country code" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="email" defaultValue={profile?.email ?? ""} aria-label="Email" placeholder="Email" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="instagramUrl" defaultValue={profile?.instagramUrl ?? ""} aria-label="Instagram URL" placeholder="https://instagram.com/..." className="min-h-11 rounded-xl border border-border px-3" />
        <textarea name="addressEn" defaultValue={profile?.addressEn ?? ""} aria-label="English address" placeholder="Address, English" className="rounded-xl border border-border px-3 py-2" />
        <textarea name="addressTa" defaultValue={profile?.addressTa ?? ""} aria-label="Tamil address" placeholder="Address, Tamil" className="rounded-xl border border-border px-3 py-2" />
        <textarea name="pickupEn" defaultValue={profile?.pickupEn ?? ""} aria-label="English pickup instructions" placeholder="Pickup instructions, English" className="rounded-xl border border-border px-3 py-2" />
        <textarea name="pickupTa" defaultValue={profile?.pickupTa ?? ""} aria-label="Tamil pickup instructions" placeholder="Pickup instructions, Tamil" className="rounded-xl border border-border px-3 py-2" />
        <input name="openingHoursEn" defaultValue={profile?.openingHoursEn ?? ""} aria-label="English opening hours" placeholder="Opening hours, English" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="openingHoursTa" defaultValue={profile?.openingHoursTa ?? ""} aria-label="Tamil opening hours" placeholder="Opening hours, Tamil" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="dispatchDays" defaultValue={profile?.dispatchDays ?? ""} aria-label="Dispatch days" placeholder="Dispatch days" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="deliveryEstimateEn" defaultValue={profile?.deliveryEstimateEn ?? ""} aria-label="English delivery estimate" placeholder="Delivery estimate, English" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="deliveryEstimateTa" defaultValue={profile?.deliveryEstimateTa ?? ""} aria-label="Tamil delivery estimate" placeholder="Delivery estimate, Tamil" className="min-h-11 rounded-xl border border-border px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pickupAvailable" defaultChecked={profile?.pickupAvailable ?? false} /> Pickup is available
        </label>
        <textarea name="pincodes" defaultValue={pincodes.map((row) => row.pincode).join("\n")} aria-label="Serviceable pincodes" placeholder="One pincode per line" className="rounded-xl border border-border px-3 py-2" />
        <textarea
          name="tiers"
          defaultValue={tiers.map((tier) => `${rupees(tier.minOrderPaise)},${tier.maxOrderPaise === null ? "" : rupees(tier.maxOrderPaise)},${rupees(tier.chargePaise)}`).join("\n")}
          aria-label="Delivery charge tiers"
          placeholder="min rupees, max rupees, charge rupees"
          className="rounded-xl border border-border px-3 py-2"
        />
        <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Save settings</button>
      </ActionForm>
    </div>
  );
}
