import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { CatalogueQuery, Category } from "@/server/catalogue/types";
import { textFor } from "@/server/catalogue/types";

export async function ShopFilters({
  locale,
  categories,
  query,
  categorySlug,
}: {
  locale: AppLocale;
  categories: Category[];
  query: CatalogueQuery;
  categorySlug?: string;
}) {
  const t = await getTranslations("Shop");
  const action = `/${locale}/shop${categorySlug ? `/${categorySlug}` : ""}`;

  return (
    <div className="space-y-5">
      <nav aria-label={t("categoriesLabel")} className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/shop"
          aria-current={categorySlug ? undefined : "page"}
          className={`shrink-0 rounded-full px-4 py-2 min-h-11 inline-flex items-center ${
            categorySlug ? "bg-card border border-border" : "bg-primary text-primary-foreground"
          }`}
        >
          {t("allPlants")}
        </Link>
        {categories.map((category) => {
          const current = category.slug === categorySlug;
          return (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              aria-current={current ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 min-h-11 inline-flex items-center ${
                current ? "bg-primary text-primary-foreground" : "border border-border bg-card"
              }`}
            >
              {textFor(category.name, locale)}
            </Link>
          );
        })}
      </nav>
      <form action={action} className="grid gap-3 rounded-[1.4rem] border border-border bg-card p-3 md:grid-cols-[1fr_12rem_12rem_auto]">
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">{t("searchLabel")}</span>
          <input
            name="q"
            defaultValue={query.search ?? ""}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-full border border-border bg-background px-4"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">{t("sortLabel")}</span>
          <select
            name="sort"
            defaultValue={query.sort ?? "featured"}
            className="h-11 w-full rounded-full border border-border bg-background px-3"
          >
            <option value="featured">{t("sortFeatured")}</option>
            <option value="name">{t("sortName")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">{t("availabilityLabel")}</span>
          <select
            name="availability"
            defaultValue={query.availability ?? "all"}
            className="h-11 w-full rounded-full border border-border bg-background px-3"
          >
            <option value="all">{t("availabilityAll")}</option>
            <option value="available">{t("available")}</option>
            <option value="out_of_stock">{t("outOfStock")}</option>
          </select>
        </label>
        <button
          type="submit"
          className="h-11 self-end rounded-full bg-forest px-5 text-sm text-ivory"
        >
          {t("apply")}
        </button>
      </form>
    </div>
  );
}
