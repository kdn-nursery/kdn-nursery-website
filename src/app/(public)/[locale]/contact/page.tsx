import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { assertLocale } from "@/i18n/locale";
import { whatsappEnquiryHref } from "@/lib/whatsapp";
import { getPublicContact, listPublicFaqs } from "@/server/content/site-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("contactTitle") };
}

export default async function ContactPage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("Contact");
  const contact = await getPublicContact(locale);
  const faqs = await listPublicFaqs();
  const number = contact.whatsapp;
  const href = whatsappEnquiryHref("Hello KDN Nursery. I have a question about plants.", number);

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
          <dd>{contact.email || t("emailMissing")}</dd>
        </div>
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm text-muted-foreground">{t("instagram")}</dt>
          <dd>
            {contact.instagram ? (
              <a className="underline" href={contact.instagram}>
                {contact.instagram}
              </a>
            ) : (
              t("instagramMissing")
            )}
          </dd>
        </div>
        {contact.address ? (
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted-foreground">{t("place")}</dt>
            <dd>{contact.address}</dd>
          </div>
        ) : null}
        {contact.openingHours ? (
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted-foreground">{locale === "ta" ? "நேரம்" : "Hours"}</dt>
            <dd>{contact.openingHours}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">{t("domain")}</p>
      <section className="mt-8">
        <h2 className="font-display text-3xl text-forest">{t("visit")}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{contact.pickup || t("visitBody")}</p>
      </section>
      {faqs.length > 0 ? (
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-3xl text-forest">{locale === "ta" ? "கேள்விகள்" : "Questions"}</h2>
          {faqs.map((faq) => (
            <article key={faq.id} className="rounded-[1.4rem] border border-border bg-card p-5">
              <h3 className="font-display text-2xl text-forest">{locale === "ta" ? faq.questionTa : faq.questionEn}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{locale === "ta" ? faq.answerTa : faq.answerEn}</p>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
