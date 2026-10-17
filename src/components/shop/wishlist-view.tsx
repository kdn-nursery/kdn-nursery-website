"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { toggleWishlist } from "@/lib/cart";
import { setWishlistIds, useHasMounted, useWishlistIds } from "@/lib/browser-store";
import { formatInr } from "@/lib/money";
import { textFor, type Product } from "@/server/catalogue/types";

export function WishlistView({
  locale,
  products,
}: {
  locale: AppLocale;
  products: Product[];
}) {
  const t = useTranslations("Wishlist");
  const shop = useTranslations("Shop");
  const states = useTranslations("States");
  const ids = useWishlistIds();
  const ready = useHasMounted();
  const saved = products.filter((product) => ids.includes(product.id));

  if (!ready) {
    return <p className="text-muted-foreground">{states("loading")}</p>;
  }

  if (ids.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-border bg-card px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-forest">{t("emptyTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("emptyBody")}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground"
        >
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4">
      {saved.map((product) => (
        <li
          key={product.id}
          className="flex flex-col justify-between gap-4 rounded-[1.4rem] border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div>
            <Link
              href={`/shop/${product.categorySlug}/${product.slug}`}
              className="font-display text-2xl text-forest"
            >
              {textFor(product.name, locale)}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {shop("samplePrice")} · {formatInr(product.pricePaise, locale)}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-4"
            onClick={() => setWishlistIds(toggleWishlist(ids, product.id))}
          >
            {t("remove")}
          </button>
        </li>
      ))}
    </ul>
  );
}
