import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { assertLocale } from "@/i18n/locale";
import { getContentDocument, localized } from "@/server/content/site-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("aboutTitle") };
}

export default async function AboutPage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("About");
  const about = await getContentDocument("about");
  const title = localized(about, locale, "title") ?? t("title");
  const lede = localized(about, locale, "lede") ?? t("lede");
  const story = localized(about, locale, "story") ?? t("story");
  const localTitle = localized(about, locale, "localTitle") ?? t("localTitle");
  const localBody = localized(about, locale, "localBody") ?? t("localBody");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{lede}</p>
      <p className="mt-8 leading-8">{story}</p>
      <section className="mt-10">
        <h2 className="font-display text-3xl text-forest">{localTitle}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{localBody}</p>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-3xl text-forest">{t("paymentTitle")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{t("paymentBody")}</p>
      </section>
    </div>
  );
}
