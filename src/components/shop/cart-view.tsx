"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { indicativeLineTotal, removeFromCart, setCartQuantity } from "@/lib/cart";
import { setCartLines, useCartLines, useHasMounted } from "@/lib/browser-store";
import { formatInr } from "@/lib/money";
import { whatsappEnquiryHref } from "@/lib/whatsapp";
import { textFor, type Product } from "@/server/catalogue/types";

export function CartView({
  locale,
  products,
  whatsappNumber,
}: {
  locale: AppLocale;
  products: Product[];
  whatsappNumber: string | null;
}) {
  const t = useTranslations("Cart");
  const productText = useTranslations("Product");
  const states = useTranslations("States");
  const lines = useCartLines();
  const ready = useHasMounted();

  if (!ready) {
    return <p className="text-muted-foreground">{states("loading")}</p>;
  }

  if (lines.length === 0) {
    return (
      <Empty
        title={t("emptyTitle")}
        body={t("emptyBody")}
        action={t("browse")}
        href="/shop"
      />
    );
  }

  const detailed = lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ line, product }] : [];
  });

  const total = detailed.reduce((sum, item) => {
    return sum + (indicativeLineTotal(item.product, item.line.quantity) ?? 0);
  }, 0);

  const enquiryItems = detailed
    .map((item) => `${textFor(item.product.name, locale)} × ${item.line.quantity}`)
    .join(", ");
  const enquiryHref = whatsappEnquiryHref(
    t("whatsappDraft", { items: enquiryItems }),
    whatsappNumber,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <ul className="space-y-4">
        {detailed.map(({ line, product }) => {
          const unavailable = product.availability !== "available";
          return (
            <li key={product.id} className="rounded-[1.4rem] border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/shop/${product.categorySlug}/${product.slug}`}
                    className="font-display text-2xl text-forest"
                  >
                    {textFor(product.name, locale)}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatInr(product.pricePaise, locale)}
                  </p>
                  {unavailable ? <p className="mt-2 text-sm text-clay">{t("unavailable")}</p> : null}
                </div>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border"
                  aria-label={t("remove")}
                  onClick={() => setCartLines(removeFromCart(lines, product.id))}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border"
                  aria-label={productText("decrease")}
                  disabled={unavailable}
                  onClick={() => {
                    const result = setCartQuantity(lines, product, line.quantity - 1);
                    if (result.ok) setCartLines(result.lines);
                  }}
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="min-w-8 text-center">{line.quantity}</span>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border"
                  aria-label={productText("increase")}
                  disabled={unavailable || line.quantity >= product.stockQuantity}
                  onClick={() => {
                    const result = setCartQuantity(lines, product, line.quantity + 1);
                    if (result.ok) setCartLines(result.lines);
                  }}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="h-fit rounded-[1.5rem] bg-forest-deep p-5 text-ivory">
        <p className="text-sm text-ivory/70">{t("subtotal")}</p>
        <p className="mt-2 font-display text-4xl">{formatInr(total, locale)}</p>
        <p className="mt-4 text-sm leading-6 text-ivory/80">{t("subtotalNote")}</p>
        {enquiryHref ? (
          <a
            href={enquiryHref}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ivory px-4 text-forest"
          >
            {t("whatsapp")}
          </a>
        ) : (
          <p className="mt-6 text-sm leading-6 text-ivory/80">{t("whatsappMissing")}</p>
        )}
      </aside>
    </div>
  );
}

function Empty({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action: string;
  href: "/shop";
}) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-border bg-card px-6 py-16 text-center">
      <h2 className="font-display text-3xl text-forest">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground"
      >
        {action}
      </Link>
    </div>
  );
}
