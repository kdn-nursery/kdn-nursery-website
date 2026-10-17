import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = await (await getCatalogueRepository()).getCareGuide(slug);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: guide ? textFor(guide.title, assertLocale(locale)) : t("careTitle") };
}

export default async function CareGuidePage({ params }: Props) {
  const { slug } = await params;
  const locale = assertLocale((await params).locale);
  const guide = await (await getCatalogueRepository()).getCareGuide(slug);
  if (!guide) notFound();
  const t = await getTranslations("Care");
  const paragraphs = textFor(guide.body, locale).split("\n\n");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link href="/plant-care" className="text-sm text-forest underline">
        {t("back")}
      </Link>
      <div className="mt-6">
        <Badge tone="draft">{t("draft")}</Badge>
      </div>
      <h1 className="mt-4 font-display text-5xl text-forest">{textFor(guide.title, locale)}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{textFor(guide.summary, locale)}</p>
      <div className="mt-8 space-y-5 text-lg leading-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
