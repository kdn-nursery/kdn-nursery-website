import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { assertLocale } from "@/i18n/locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("aboutTitle") };
}

export default async function AboutPage({ params }: Props) {
  assertLocale((await params).locale);
  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{t("title")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{t("lede")}</p>
      <p className="mt-8 leading-8">{t("story")}</p>
      <section className="mt-10">
        <h2 className="font-display text-3xl text-forest">{t("localTitle")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{t("localBody")}</p>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-3xl text-forest">{t("paymentTitle")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{t("paymentBody")}</p>
      </section>
    </div>
  );
}
