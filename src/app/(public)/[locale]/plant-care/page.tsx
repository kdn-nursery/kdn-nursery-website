import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { assertLocale } from "@/i18n/locale";
import { getCatalogueRepository } from "@/server/catalogue/get-catalogue";
import { textFor } from "@/server/catalogue/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("careTitle") };
}

export default async function PlantCarePage({ params }: Props) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations("Care");
  const guides = await (await getCatalogueRepository()).listCareGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl text-forest">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{t("lede")}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/plant-care/${guide.slug}`} className="block h-full rounded-[1.5rem] border border-border bg-card p-5">
              <Badge tone="draft">{t("draft")}</Badge>
              <h2 className="mt-4 font-display text-3xl text-forest">{textFor(guide.title, locale)}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{textFor(guide.summary, locale)}</p>
              <span className="mt-5 inline-flex min-h-11 items-center text-sm text-forest">{t("read")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
