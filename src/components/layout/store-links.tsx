"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cartCount } from "@/lib/cart";
import { useCartLines, useWishlistIds } from "@/lib/browser-store";

export function StoreLinks() {
  const t = useTranslations("Nav");
  const count = cartCount(useCartLines());
  const saved = useWishlistIds().length;

  return (
    <>
      <Link
        href="/wishlist"
        className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-secondary"
        aria-label={t("wishlist")}
      >
        <Heart className="size-5" aria-hidden="true" />
        <Count value={saved} />
      </Link>
      <Link
        href="/cart"
        className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-secondary"
        aria-label={t("cart")}
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        <Count value={count} />
      </Link>
    </>
  );
}

function Count({ value }: { value: number }) {
  if (value < 1) return null;
  return (
    <span className="absolute top-1 right-1 inline-flex min-w-5 justify-center rounded-full bg-clay px-1 text-[10px] leading-5 text-ivory">
      {value}
    </span>
  );
}
