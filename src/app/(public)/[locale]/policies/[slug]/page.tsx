import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { assertLocale, isPolicySlug } from "@/i18n/locale";
import { formatInr } from "@/lib/money";
import { getContentDocument, getPublicContact } from "@/server/content/site-content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Policies" });
  if (!isPolicySlug(slug)) return { title: t("indexTitle") };
  return { title: t(`${slug}.title`) };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const locale = assertLocale((await params).locale);
  if (!isPolicySlug(slug)) notFound();

  const t = await getTranslations("Policies");
  const saved = await getContentDocument(`policy:${slug}`);
  const savedBody = saved?.[locale === "ta" ? "bodyTa" : "bodyEn"]?.trim();
  const paragraphs = savedBody
    ? savedBody.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : (t.raw(`${slug}.paragraphs`) as string[]);
  const title = saved?.[locale === "ta" ? "titleTa" : "titleEn"]?.trim() || t(`${slug}.title`);
  const contact = slug === "delivery" ? await getPublicContact(locale) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Badge tone="draft">{t("draft")}</Badge>
      <h1 className="mt-4 font-display text-5xl text-forest">{title}</h1>
      <div className="mt-8 space-y-5 leading-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {contact && (contact.deliveryEstimate || contact.dispatchDays || contact.pincodes.length > 0) ? (
        <section className="mt-8 space-y-3 leading-7">
          {contact.dispatchDays ? <p>{contact.dispatchDays}</p> : null}
          {contact.deliveryEstimate ? <p>{contact.deliveryEstimate}</p> : null}
          {contact.pincodes.length > 0 ? <p>{contact.pincodes.join(", ")}</p> : null}
          {contact.tiers.map((tier) => (
            <p key={`${tier.minOrderPaise}-${tier.chargePaise}`}>
              {formatInr(tier.minOrderPaise, locale)} – {formatInr(tier.chargePaise, locale)}
            </p>
          ))}
        </section>
      ) : null}
    </article>
  );
}
