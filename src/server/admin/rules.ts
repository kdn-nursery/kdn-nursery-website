import type { Availability } from "@/server/catalogue/types";

export const LOGIN_FAILURE = "Invalid username or password.";
export const LOGIN_LIMITED = "Try again later.";
export const MAX_LOGIN_ATTEMPTS = 8;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const whatsappPattern = /^[1-9]\d{7,14}$/;
const pincodePattern = /^[1-9][0-9]{5}$/;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function passwordProblems(password: string, username: string): string[] {
  const problems: string[] = [];
  if (password.length < 12) problems.push("Use at least 12 characters.");
  if (password.length > 128) problems.push("Use at most 128 characters.");
  if (password.trim().toLowerCase() === username.trim().toLowerCase()) {
    problems.push("Do not use the username as the password.");
  }
  return problems;
}

export function isValidSlug(slug: string): boolean {
  return slugPattern.test(slug);
}

export function rupeesToPaise(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  const paise = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(paise) || paise < 0) return null;
  return paise;
}

export function validateComparePrice(pricePaise: number, compareAtPaise: number | null): string | null {
  if (compareAtPaise === null) return null;
  if (compareAtPaise <= pricePaise) return "The comparison price must be higher than the selling price.";
  return null;
}

export function reconcileStock(
  stockQuantity: number,
  availability: Availability,
): { ok: true; stockQuantity: number; availability: Availability } | { ok: false; message: string } {
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return { ok: false, message: "Stock cannot be negative." };
  }
  if (availability === "out_of_stock") {
    return { ok: true, stockQuantity: 0, availability: "out_of_stock" };
  }
  if (stockQuantity < 1) {
    return { ok: false, message: "An available plant needs a stock quantity above zero." };
  }
  return { ok: true, stockQuantity, availability: "available" };
}

export type BulkTierInput = { minQuantity: number; pricePaise: number };

export function validateBulkTiers(pricePaise: number, tiers: BulkTierInput[]): string | null {
  const seen = new Set<number>();
  for (const tier of tiers) {
    if (!Number.isInteger(tier.minQuantity) || tier.minQuantity < 2) {
      return "Bulk tiers start at a quantity of 2.";
    }
    if (!Number.isInteger(tier.pricePaise) || tier.pricePaise < 0) {
      return "A bulk price cannot be negative.";
    }
    if (tier.pricePaise >= pricePaise) {
      return "A bulk price must be lower than the single-plant price.";
    }
    if (seen.has(tier.minQuantity)) return "Each bulk quantity can be used once.";
    seen.add(tier.minQuantity);
  }
  return null;
}

const fulfilmentTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["DISPATCHED", "READY_FOR_PICKUP"],
  DISPATCHED: ["DELIVERED"],
  READY_FOR_PICKUP: ["PICKED_UP"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
};

export function canChangeFulfilment(current: string, next: string): boolean {
  return fulfilmentTransitions[current]?.includes(next) ?? false;
}

export function adminPaymentChangeAllowed(next: string): boolean {
  return next !== "PAID" && next !== "REFUNDED";
}

export function productDeleteDecision(orderReferenceCount: number): "archive" | "delete" {
  return orderReferenceCount > 0 ? "archive" : "delete";
}

export function isStaleEdit(submittedVersion: number, currentVersion: number): boolean {
  return submittedVersion !== currentVersion;
}

export function isLoginLimited(attemptCount: number, now: number, newestAttemptAt: number | null): boolean {
  if (attemptCount < MAX_LOGIN_ATTEMPTS) return false;
  if (newestAttemptAt === null) return false;
  return now - newestAttemptAt < LOGIN_WINDOW_MS;
}

export function safeInternalOrHttpsUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function plainText(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function isValidWhatsapp(value: string): boolean {
  return value === "" || whatsappPattern.test(value);
}

export function isValidPincode(value: string): boolean {
  return pincodePattern.test(value);
}

export function publishedCatalogueFilter() {
  return {
    status: "PUBLISHED" as const,
    category: { isPublished: true, archivedAt: null },
  };
}

export function detectImageType(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}
