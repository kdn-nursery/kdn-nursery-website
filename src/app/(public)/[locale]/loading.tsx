import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("States");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" aria-live="polite">
      <p className="text-sm text-muted-foreground">{t("loading")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[1.6rem] bg-muted" />
        ))}
      </div>
    </div>
  );
}
