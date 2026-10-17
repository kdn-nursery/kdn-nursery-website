import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PlantMedia } from "@/components/brand/plant-media";
import { ProductCard } from "@/components/shop/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { parseShopQuery } from "@/lib/shop-query";
import { categoryCoverSlug } from "@/server/catalogue/image-credits";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";

type Props = {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const catalogue = await getCatalogueRepository();
  const categories = await catalogue.listCategories();
  const match = categories.find((item) => item.slug === category);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: match ? textFor(match.name, assertLocale(locale)) : t("shopTitle") };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const locale = assertLocale((await params).locale);
  const catalogue = await getCatalogueRepository();
  const categories = await catalogue.listCategories();
  const match = categories.find((item) => item.slug === category);
  if (!match) notFound();

  const t = await getTranslations("Shop");
  const query = parseShopQuery(locale, await searchParams, category);
  const products = await catalogue.listProducts(query);
  const coverSlug =
    category === "herbal-plants" || category === "flowering-plants" || category === "fruit-plants"
      ? categoryCoverSlug[category]
      : undefined;
  const cover = coverSlug ? await catalogue.getProduct(category, coverSlug) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="grid items-end gap-8 md:grid-cols-[1fr_16rem]">
        <div>
          <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl text-forest">{textFor(match.name, locale)}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            {textFor(match.description, locale)}
          </p>
        </div>
        {cover ? (
          <PlantMedia
            image={cover.images[0]}
            locale={locale}
            sizes="16rem"
            fit="cover"
            speciesNote={category === "fruit-plants"}
          />
        ) : null}
      </div>
      <div className="mt-8">
        <ShopFilters locale={locale} categories={categories} query={query} categorySlug={category} />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">{t("results", { count: products.length })}</p>
      {products.length === 0 ? (
        <div className="mt-6 rounded-[1.6rem] border border-dashed border-border px-6 py-14 text-center">
          <h2 className="font-display text-3xl text-forest">{t("emptyTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("emptyBody")}</p>
          <Link href={`/shop/${category}`} className="mt-5 inline-flex min-h-11 items-center text-forest underline">
            {t("clear")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
