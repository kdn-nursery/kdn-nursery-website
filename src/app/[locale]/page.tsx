import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlantArt } from "@/components/brand/plant-art";
import { ProductCard } from "@/components/shop/product-card";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("homeTitle") };
}

export default async function HomePage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("Home");
  const catalogue = await getCatalogueRepository();
  const [categories, featured, guides] = await Promise.all([
    catalogue.listCategories(),
    catalogue.listFeatured(),
    catalogue.listCareGuides(),
  ]);
  const hero = featured[0];

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-20">
        <div className="rise">
          <p className="text-sm tracking-[0.18em] text-clay uppercase">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-forest md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{t("lede")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground">
              {t("shopCta")}
            </Link>
            <Link href="/plant-care" className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-5">
              {t("careCta")}
            </Link>
          </div>
        </div>
        {hero ? (
          <div className="rise">
            <PlantArt
              art={hero.images[0]?.art ?? "herb"}
              label={textFor(hero.images[0]?.alt ?? hero.name, locale)}
              className="aspect-[4/5] shadow-[0_30px_80px_rgb(16_40_30_/_0.12)]"
            />
            <p className="mt-3 text-sm text-muted-foreground">{t("photoNote")}</p>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <h2 className="font-display text-3xl text-forest">{t("categoriesTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("categoriesLede")}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="rounded-[1.6rem] border border-border bg-card p-6 hover:border-forest"
            >
              <h3 className="font-display text-3xl text-forest">{textFor(category.name, locale)}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {textFor(category.description, locale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <h2 className="font-display text-3xl text-forest">{t("featuredTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("featuredLede")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[0.8fr_1.2fr] md:px-6">
        <div>
          <h2 className="font-display text-3xl text-forest">{t("careTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("careLede")}</p>
          <Link href="/plant-care" className="mt-5 inline-flex min-h-11 items-center text-forest underline">
            {t("careLink")}
          </Link>
        </div>
        <ul className="space-y-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/plant-care/${guide.slug}`} className="block rounded-[1.4rem] bg-card p-5 border border-border">
                <h3 className="font-display text-2xl text-forest">{textFor(guide.title, locale)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{textFor(guide.summary, locale)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3 md:px-6">
          <article>
            <h2 className="font-display text-3xl">{t("storyTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-ivory/80">{t("storyBody")}</p>
          </article>
          <article>
            <h2 className="font-display text-3xl">{t("areasTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-ivory/80">{t("areasBody")}</p>
          </article>
          <article>
            <h2 className="font-display text-3xl">{t("dispatchTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-ivory/80">{t("dispatchBody")}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-[1.8rem] border border-border bg-card px-6 py-10 md:px-10">
          <h2 className="font-display text-4xl text-forest">{t("enquiryTitle")}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{t("enquiryBody")}</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground">
            {t("enquiryTitle")}
          </Link>
        </div>
      </section>
    </div>
  );
}
