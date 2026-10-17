import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/shop/cart-view";
import { assertLocale } from "@/i18n/locale";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { getPublicContact } from "@/server/content/site-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("cartTitle") };
}

export default async function CartPage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("Cart");
  const products = await (await getCatalogueRepository()).listProducts({
    locale,
    availability: "all",
    sort: "name",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{t("title")}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{t("lede")}</p>
      <div className="mt-10">
        <CartView
          locale={locale}
          products={products}
          whatsappNumber={(await getPublicContact(locale)).whatsapp}
        />
      </div>
    </div>
  );
}
