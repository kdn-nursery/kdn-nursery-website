import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { assertLocale, isPolicySlug } from "@/i18n/locale";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Policies" });
  if (!isPolicySlug(slug)) return { title: t("indexTitle") };
  return { title: t(`${slug}.title`) };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  assertLocale((await params).locale);
  if (!isPolicySlug(slug)) notFound();

  const t = await getTranslations("Policies");
  const paragraphs = t.raw(`${slug}.paragraphs`) as string[];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Badge tone="draft">{t("draft")}</Badge>
      <h1 className="mt-4 font-display text-5xl text-forest">{t(`${slug}.title`)}</h1>
      <div className="mt-8 space-y-5 leading-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
