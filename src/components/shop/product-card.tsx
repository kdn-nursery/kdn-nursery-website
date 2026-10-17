import { getTranslations } from "next-intl/server";
import { PhotoCredit, PlantMedia } from "@/components/brand/plant-media";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatInr } from "@/lib/money";
import { textFor, type Product } from "@/server/catalogue/types";

export async function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: AppLocale;
}) {
  const t = await getTranslations("Shop");
  const name = textFor(product.name, locale);
  const other = textFor(product.name, locale === "en" ? "ta" : "en");
  const image = product.images[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card">
      <Link href={`/shop/${product.categorySlug}/${product.slug}`} className="block">
        <PlantMedia
          image={image}
          locale={locale}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          showCredit={false}
          fit="cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <PhotoCredit
          storageKey={image?.storageKey}
          speciesNote={product.categorySlug === "fruit-plants"}
        />
        <div className="flex flex-wrap gap-2">
          <Badge tone={product.availability === "available" ? "available" : "stock"}>
            {product.availability === "available" ? t("available") : t("outOfStock")}
          </Badge>
          {product.dataOrigin === "development" ? <Badge tone="sample">{t("samplePrice")}</Badge> : null}
        </div>
        <div>
          <h2 className="font-display text-2xl leading-tight text-forest">
            <Link href={`/shop/${product.categorySlug}/${product.slug}`}>{name}</Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground" lang={locale === "en" ? "ta" : "en"}>
            {other}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{textFor(product.summary, locale)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="font-display text-xl">{formatInr(product.pricePaise, locale)}</p>
          <Link
            href={`/shop/${product.categorySlug}/${product.slug}`}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground"
          >
            {t("view")}
          </Link>
        </div>
      </div>
    </article>
  );
}
