"use client";

import { useTranslations } from "next-intl";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("States");

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center md:px-6">
      <h1 className="font-display text-4xl text-forest">{t("errorTitle")}</h1>
      <p className="mt-4 text-muted-foreground">{t("errorBody")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground"
      >
        {t("retry")}
      </button>
    </div>
  );
}
