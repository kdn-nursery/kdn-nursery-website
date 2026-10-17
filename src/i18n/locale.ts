import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function assertLocale(locale: string): AppLocale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export const policySlugs = ["delivery", "privacy", "terms", "cancellation"] as const;

export type PolicySlug = (typeof policySlugs)[number];

export function isPolicySlug(value: string): value is PolicySlug {
  return policySlugs.some((slug) => slug === value);
}
