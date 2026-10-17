import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { policySlugs } from "@/i18n/locale";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const policies = await getTranslations("Policies");

  return (
    <footer className="mt-auto border-t border-border bg-forest-deep text-ivory">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:px-6">
        <div>
          <p className="font-display text-2xl">{t("name")}</p>
          <p className="mt-2 text-ivory/80">{t("place")}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-ivory/75">{t("translation")}</p>
          <p className="mt-4 text-sm text-ivory/75">{t("ordering")}</p>
        </div>
        <div>
          <p className="text-sm tracking-[0.16em] text-ivory/60 uppercase">{t("policies")}</p>
          <ul className="mt-3 space-y-2">
            {policySlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/policies/${slug}`} className="text-sm hover:underline">
                  {policies(`${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-ivory/60 md:px-6">
        {t("rights")}
      </div>
    </footer>
  );
}
