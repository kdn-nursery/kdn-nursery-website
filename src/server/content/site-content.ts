import { configuredWhatsappNumber } from "@/lib/whatsapp";
import type { AppLocale } from "@/i18n/routing";
import { resolveCatalogueMode } from "@/server/catalogue/mode";
import { getPrismaClient } from "@/server/db";

export type PublicContact = {
  businessName: string;
  whatsapp: string | null;
  email: string;
  instagram: string;
  address: string;
  pickup: string;
  openingHours: string;
  dispatchDays: string;
  deliveryEstimate: string;
  pickupAvailable: boolean;
  pincodes: string[];
  tiers: Array<{ minOrderPaise: number; maxOrderPaise: number | null; chargePaise: number }>;
};

function emptyContact(whatsapp: string | null): PublicContact {
  return {
    businessName: "Kaviyadevan Nursery Garden",
    whatsapp,
    email: "",
    instagram: "",
    address: "",
    pickup: "",
    openingHours: "",
    dispatchDays: "",
    deliveryEstimate: "",
    pickupAvailable: false,
    pincodes: [],
    tiers: [],
  };
}

export async function getPublicContact(locale: AppLocale): Promise<PublicContact> {
  if (resolveCatalogueMode() !== "database") return emptyContact(configuredWhatsappNumber());
  const prisma = getPrismaClient();
  const [profile, pincodes, tiers] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { id: "default" } }),
    prisma.deliveryPincode.findMany({ orderBy: { pincode: "asc" } }),
    prisma.deliveryChargeTier.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!profile) return emptyContact(configuredWhatsappNumber());
  return {
    businessName: profile.businessName,
    whatsapp: configuredWhatsappNumber(profile.whatsappNumber),
    email: profile.email,
    instagram: profile.instagramUrl,
    address: locale === "ta" ? profile.addressTa : profile.addressEn,
    pickup: locale === "ta" ? profile.pickupTa : profile.pickupEn,
    openingHours: locale === "ta" ? profile.openingHoursTa : profile.openingHoursEn,
    dispatchDays: profile.dispatchDays,
    deliveryEstimate: locale === "ta" ? profile.deliveryEstimateTa : profile.deliveryEstimateEn,
    pickupAvailable: profile.pickupAvailable,
    pincodes: pincodes.map((row) => row.pincode),
    tiers: tiers.map((tier) => ({
      minOrderPaise: tier.minOrderPaise,
      maxOrderPaise: tier.maxOrderPaise,
      chargePaise: tier.chargePaise,
    })),
  };
}

export async function getContentDocument(key: string): Promise<Record<string, string> | null> {
  if (resolveCatalogueMode() !== "database") return null;
  const row = await getPrismaClient().contentDocument.findUnique({ where: { key } });
  if (!row || typeof row.body !== "object" || row.body === null || Array.isArray(row.body)) return null;
  return Object.fromEntries(
    Object.entries(row.body).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

export function localized(body: Record<string, string> | null, locale: AppLocale, field: string): string | null {
  if (!body) return null;
  const value = body[`${field}${locale === "ta" ? "Ta" : "En"}`]?.trim();
  return value || null;
}

export async function listPublicFaqs() {
  if (resolveCatalogueMode() !== "database") return [];
  return getPrismaClient().faq.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listPublicBanners() {
  if (resolveCatalogueMode() !== "database") return [];
  return getPrismaClient().banner.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}
