import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlantMedia } from "@/components/brand/plant-media";
import { ProductCard } from "@/components/shop/product-card";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { categoryCoverSlug } from "@/server/catalogue/image-credits";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";
import { getContentDocument, listPublicBanners, localized } from "@/server/content/site-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("homeTitle") };
}

export default async function HomePage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("Home");
  const homepage = await getContentDocument("homepage");
  const banners = await listPublicBanners();
  const eyebrow = localized(homepage, locale, "eyebrow") ?? t("eyebrow");
  const title = localized(homepage, locale, "title") ?? t("title");
  const lede = localized(homepage, locale, "lede") ?? t("lede");
  const shopLabel = localized(homepage, locale, "primaryLabel") ?? t("shopCta");
  const careLabel = localized(homepage, locale, "secondaryLabel") ?? t("careCta");
  const shopHref = homepage?.primaryHref || "/shop";
  const careHref = homepage?.secondaryHref || "/plant-care";
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
          <p className="text-sm tracking-[0.18em] text-clay uppercase">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-forest md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={shopHref.startsWith("/") ? shopHref : "/shop"} className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground">
              {shopLabel}
            </Link>
            <Link href={careHref.startsWith("/") ? careHref : "/plant-care"} className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-5">
              {careLabel}
            </Link>
          </div>
        </div>
        {hero ? (
          <div className="rise">
            <PlantMedia
              image={hero.images[0]}
              locale={locale}
              sizes="(min-width: 768px) 40vw, 100vw"
              priority
              fit="cover"
              className="shadow-[0_30px_80px_rgb(16_40_30_/_0.12)]"
            />
            <p className="mt-3 text-sm text-muted-foreground">{t("photoNote")}</p>
          </div>
        ) : null}
      </section>

      {banners.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2 md:px-6">
          {banners.map((banner) => (
            <Link key={banner.id} href={banner.href.startsWith("/") ? banner.href : "/shop"} className="block">
              <PlantMedia
                image={{
                  id: banner.id,
                  alt: { en: banner.altEn, ta: banner.altTa },
                  sortOrder: banner.sortOrder,
                  storageKey: banner.storageKey,
                  art: "herb",
                }}
                locale={locale}
                sizes="(min-width: 768px) 45vw, 100vw"
                showCredit={false}
                fit="cover"
              />
            </Link>
          ))}
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <h2 className="font-display text-3xl text-forest">{t("categoriesTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("categoriesLede")}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((category) => {
            const coverSlug =
              category.slug === "herbal-plants" ||
              category.slug === "flowering-plants" ||
              category.slug === "fruit-plants"
                ? categoryCoverSlug[category.slug]
                : undefined;
            const cover = featured.find((product) => product.slug === coverSlug) ?? null;
            return (
              <article
                key={category.slug}
                className="overflow-hidden rounded-[1.6rem] border border-border bg-card"
              >
                {cover ? (
                  <Link href={`/shop/${category.slug}`} className="block">
                    <PlantMedia
                      image={cover.images[0]}
                      locale={locale}
                      sizes="(min-width: 768px) 30vw, 100vw"
                      showCredit={false}
                      fit="cover"
                    />
                  </Link>
                ) : null}
                <div className="p-6">
                  <h3 className="font-display text-3xl text-forest">
                    <Link href={`/shop/${category.slug}`} className="hover:underline">
                      {textFor(category.name, locale)}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {textFor(category.description, locale)}
                  </p>
                </div>
              </article>
            );
          })}
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
