import type { CatalogueQuery, Locale, Product } from "@/server/catalogue/types";

export function normalizeSearch(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase();
}

function nameFor(product: Product, locale: Locale): string {
  return product.name[locale];
}

function matchesSearch(product: Product, search: string): boolean {
  const query = normalizeSearch(search);
  if (!query) return true;

  return [product.name.en, product.name.ta].some((name) =>
    normalizeSearch(name).includes(query),
  );
}

function compareNames(left: Product, right: Product, locale: Locale): number {
  return nameFor(left, locale).localeCompare(nameFor(right, locale), locale);
}

export function queryProducts(products: Product[], query: CatalogueQuery): Product[] {
  const filtered = products.filter((product) => {
    if (query.categorySlug && product.categorySlug !== query.categorySlug) {
      return false;
    }

    if (
      query.availability &&
      query.availability !== "all" &&
      product.availability !== query.availability
    ) {
      return false;
    }

    return matchesSearch(product, query.search ?? "");
  });

  const sort = query.sort ?? "featured";

  return filtered.sort((left, right) => {
    if (sort === "price-asc") return left.pricePaise - right.pricePaise;
    if (sort === "price-desc") return right.pricePaise - left.pricePaise;
    if (sort === "name") return compareNames(left, right, query.locale);

    if (left.featured !== right.featured) return left.featured ? -1 : 1;
    const leftOrder = left.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return compareNames(left, right, query.locale);
  });
}

export function listFeatured(products: Product[]): Product[] {
  return queryProducts(products, { locale: "en", sort: "featured" }).filter(
    (product) => product.featured,
  );
}
