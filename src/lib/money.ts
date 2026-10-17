import type { Locale } from "@/server/catalogue/types";

export function formatInr(pricePaise: number, locale: Locale): string {
  const rupees = pricePaise / 100;
  return new Intl.NumberFormat(locale === "ta" ? "ta-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
