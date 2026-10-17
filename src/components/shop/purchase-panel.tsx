"use client";

import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { addToCart, setCartQuantity, toggleWishlist } from "@/lib/cart";
import { setCartLines, setWishlistIds, useCartLines, useWishlistIds } from "@/lib/browser-store";
import type { Product } from "@/server/catalogue/types";

export function PurchasePanel({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const lines = useCartLines();
  const saved = useWishlistIds();
  const [notice, setNotice] = useState<string | null>(null);
  const current = lines.find((line) => line.productId === product.id)?.quantity ?? 1;
  const inCart = lines.some((line) => line.productId === product.id);
  const wished = saved.includes(product.id);
  const unavailable = product.availability !== "available" || product.stockQuantity < 1;

  function change(quantity: number) {
    const result = inCart
      ? setCartQuantity(lines, product, quantity)
      : quantity < 1
        ? { ok: true as const, lines }
        : addToCart(
            lines.filter((line) => line.productId !== product.id),
            product,
            quantity,
          );

    if (!result.ok) {
      setNotice(result.reason === "exceeds_stock" ? t("exceeds") : t("unavailable"));
      return;
    }
    setNotice(null);
    if (inCart || quantity > 0) setCartLines(result.lines);
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{t("quantity")}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border"
            aria-label={t("decrease")}
            onClick={() => change((inCart ? current : Math.max(current, 1)) - 1)}
            disabled={unavailable || (inCart ? current <= 1 : false)}
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-lg" aria-live="polite">
            {inCart ? current : unavailable ? 0 : 1}
          </span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border"
            aria-label={t("increase")}
            onClick={() => change((inCart ? current : 0) + 1)}
            disabled={unavailable || (inCart && current >= product.stockQuantity)}
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {unavailable ? t("unavailable") : t("stockLeft", { count: product.stockQuantity })}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-primary px-5 text-primary-foreground disabled:opacity-50"
          disabled={unavailable}
          onClick={() => {
            const result = addToCart(lines, product, inCart ? 1 : 1);
            if (!result.ok) {
              setNotice(result.reason === "exceeds_stock" ? t("exceeds") : t("unavailable"));
              return;
            }
            setCartLines(result.lines);
            setNotice(null);
          }}
        >
          {inCart ? t("added") : t("add")}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-5"
          aria-pressed={wished}
          onClick={() => setWishlistIds(toggleWishlist(saved, product.id))}
        >
          <Heart className="size-4" aria-hidden={true} fill={wished ? "currentColor" : "none"} />
          {wished ? t("saved") : t("save")}
        </button>
      </div>
      <p className="min-h-5 text-sm text-clay" aria-live="polite">
        {notice}
      </p>
    </div>
  );
}
