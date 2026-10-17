import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { assertLocale } from "@/i18n/locale";
import { configuredWhatsappNumber, whatsappEnquiryHref } from "@/lib/whatsapp";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("contactTitle") };
}

export default async function ContactPage({ params }: Props) {
  assertLocale((await params).locale);
  const t = await getTranslations("Contact");
  const number = configuredWhatsappNumber();
  const href = whatsappEnquiryHref("Hello KDN Nursery. I have a question about plants.");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{t("title")}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{t("lede")}</p>
      <p className="mt-8 font-display text-2xl text-forest">{t("place")}</p>
      <dl className="mt-6 divide-y divide-border rounded-[1.6rem] border border-border bg-card">
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm text-muted-foreground">{t("whatsapp")}</dt>
          <dd>
            {href && number ? (
              <a className="underline" href={href}>
                +{number}
              </a>
            ) : (
              t("whatsappMissing")
            )}
          </dd>
        </div>
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm text-muted-foreground">{t("email")}</dt>
          <dd>{t("emailMissing")}</dd>
        </div>
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm text-muted-foreground">{t("instagram")}</dt>
          <dd>{t("instagramMissing")}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">{t("domain")}</p>
      <section className="mt-8">
        <h2 className="font-display text-3xl text-forest">{t("visit")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{t("visitBody")}</p>
      </section>
    </div>
  );
}
