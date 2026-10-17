import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PlantMedia } from "@/components/brand/plant-media";
import { PurchasePanel } from "@/components/shop/purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { formatInr } from "@/lib/money";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";

type Props = {
  params: Promise<{ locale: string; category: string; product: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, product: productSlug } = await params;
  const catalogue = await getCatalogueRepository();
  const product = await catalogue.getProduct(category, productSlug);
  const t = await getTranslations({ locale, namespace: "Meta" });
  if (!product) return { title: t("shopTitle") };
  return {
    title: textFor(product.name, assertLocale(locale)),
    description: textFor(product.summary, assertLocale(locale)),
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productSlug } = await params;
  const locale = assertLocale((await params).locale);
  const catalogue = await getCatalogueRepository();
  const product = await catalogue.getProduct(category, productSlug);
  if (!product) notFound();

  const t = await getTranslations("Product");
  const shop = await getTranslations("Shop");
  const image = product.images[0];
  const otherLocale = locale === "en" ? "ta" : "en";

  return (
    <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-6">
      <div>
        <PlantMedia
          image={image}
          locale={locale}
          sizes="(min-width: 768px) 40vw, 100vw"
          priority
          speciesNote={product.categorySlug === "fruit-plants"}
        />
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={product.availability === "available" ? "available" : "stock"}>
            {product.availability === "available" ? shop("available") : shop("outOfStock")}
          </Badge>
          {product.dataOrigin === "development" ? <Badge tone="sample">{shop("samplePrice")}</Badge> : null}
          {product.translationStatus === "unverified" ? <Badge tone="draft">{t("translationNote")}</Badge> : null}
        </div>
        <h1 className="mt-4 font-display text-5xl text-forest">{textFor(product.name, locale)}</h1>
        <p className="mt-2 text-lg text-muted-foreground" lang={otherLocale}>
          {textFor(product.name, otherLocale)}
        </p>
        <p className="mt-6 font-display text-3xl">{formatInr(product.pricePaise, locale)}</p>
        <p className="mt-2 text-sm text-muted-foreground">{shop("sampleStock", { count: product.stockQuantity })}</p>
        <p className="mt-6 leading-7">{textFor(product.description, locale)}</p>
        <div className="mt-6">
          <PurchasePanel product={product} />
        </div>
        <section className="mt-8">
          <h2 className="font-display text-2xl text-forest">{t("careTitle")}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{textFor(product.care, locale)}</p>
        </section>
        {product.bulkPriceTiers.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-2xl text-forest">{t("bulkTitle")}</h2>
            <ul className="mt-3 space-y-2">
              {product.bulkPriceTiers.map((tier) => (
                <li key={tier.minQuantity}>
                  {t("bulkLine", {
                    count: tier.minQuantity,
                    price: formatInr(tier.pricePaise, locale),
                  })}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">{t("bulkNote")}</p>
          </section>
        ) : null}
        <Link href="/plant-care" className="mt-8 inline-flex min-h-11 items-center text-forest underline">
          {t("relatedCare")}
        </Link>
      </div>
    </article>
  );
}
