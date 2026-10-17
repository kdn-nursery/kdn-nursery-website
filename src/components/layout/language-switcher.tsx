"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";

const options = [
  { locale: "en", label: "English", languageName: "English" },
  { locale: "ta", label: "தமிழ்", languageName: "Tamil" },
] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("Language");
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <nav aria-label={t("label")} className="flex rounded-full border border-border bg-card p-1">
      {options.map((option) => {
        const current = locale === option.locale;
        return (
          <Link
            key={option.locale}
            href={href}
            locale={option.locale}
            hrefLang={option.locale}
            lang={option.locale}
            aria-current={current ? "true" : undefined}
            aria-label={t("switchTo", { language: option.languageName })}
            className={`rounded-full px-3 py-2 text-sm min-h-10 inline-flex items-center ${
              current ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
