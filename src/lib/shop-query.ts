import { z } from "zod";
import type { CatalogueQuery, Locale } from "@/server/catalogue/types";

const searchSchema = z.string().trim().max(80);
const sortSchema = z.enum(["featured", "name", "price-asc", "price-desc"]);
const availabilitySchema = z.enum(["all", "available", "out_of_stock"]);

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseShopQuery(
  locale: Locale,
  params: SearchParams,
  categorySlug?: string,
): CatalogueQuery {
  const search = searchSchema.safeParse(first(params.q) ?? "");
  const sort = sortSchema.safeParse(first(params.sort));
  const availability = availabilitySchema.safeParse(first(params.availability));

  return {
    locale,
    categorySlug,
    search: search.success && search.data ? search.data : undefined,
    sort: sort.success ? sort.data : "featured",
    availability: availability.success ? availability.data : "all",
  };
}
