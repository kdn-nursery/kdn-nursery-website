"use client";

import { useActionState, useEffect, useState } from "react";
import { saveProduct, type ActionResult } from "@/server/admin/mutations";
import { Button } from "@/components/ui/button";

type CategoryOption = { id: string; nameEn: string };
type ProductValues = {
  id?: string;
  version?: number;
  slug: string;
  categoryId: string;
  nameEn: string;
  nameTa: string;
  botanicalName: string;
  varietyName: string;
  summaryEn: string;
  summaryTa: string;
  descriptionEn: string;
  descriptionTa: string;
  careEn: string;
  careTa: string;
  sunlightEn: string;
  sunlightTa: string;
  wateringEn: string;
  wateringTa: string;
  handlingEn: string;
  handlingTa: string;
  potSize: string;
  seoTitleEn: string;
  seoTitleTa: string;
  seoDescriptionEn: string;
  seoDescriptionTa: string;
  price: string;
  compareAt: string;
  tiers: string;
  stock: string;
  availability: string;
  status: string;
  featured: boolean;
  featuredOrder: string;
  displayOrder: string;
};

const fields: Array<[keyof ProductValues, string, "input" | "textarea"]> = [
  ["nameEn", "English name", "input"],
  ["nameTa", "Tamil name", "input"],
  ["slug", "URL slug", "input"],
  ["botanicalName", "Botanical name", "input"],
  ["varietyName", "Variety", "input"],
  ["potSize", "Plant or pot size", "input"],
  ["summaryEn", "Short description, English", "textarea"],
  ["summaryTa", "Short description, Tamil", "textarea"],
  ["descriptionEn", "Full description, English", "textarea"],
  ["descriptionTa", "Full description, Tamil", "textarea"],
  ["careEn", "Care instructions, English", "textarea"],
  ["careTa", "Care instructions, Tamil", "textarea"],
  ["sunlightEn", "Sunlight, English", "input"],
  ["sunlightTa", "Sunlight, Tamil", "input"],
  ["wateringEn", "Watering, English", "input"],
  ["wateringTa", "Watering, Tamil", "input"],
  ["handlingEn", "Delivery and handling notes, English", "textarea"],
  ["handlingTa", "Delivery and handling notes, Tamil", "textarea"],
  ["seoTitleEn", "SEO title, English", "input"],
  ["seoTitleTa", "SEO title, Tamil", "input"],
  ["seoDescriptionEn", "SEO description, English", "textarea"],
  ["seoDescriptionTa", "SEO description, Tamil", "textarea"],
];

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product: ProductValues;
}) {
  const [state, action, pending] = useActionState(saveProduct, null as ActionResult | null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <form action={action} className="grid gap-4" onChange={() => setDirty(true)}>
      {product.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="version" value={product.version ?? 0} />
      <label className="grid gap-1 text-sm">
        Category
        <select name="categoryId" defaultValue={product.categoryId} className="min-h-11 rounded-xl border border-border bg-card px-3">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameEn}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([name, label, kind]) => (
          <label key={name} className="grid gap-1 text-sm">
            {label}
            {kind === "textarea" ? (
              <textarea name={name} defaultValue={String(product[name] ?? "")} rows={4} className="rounded-xl border border-border bg-card px-3 py-2" />
            ) : (
              <input name={name} defaultValue={String(product[name] ?? "")} className="min-h-11 rounded-xl border border-border bg-card px-3" />
            )}
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm">
          Price, INR
          <input name="price" defaultValue={product.price} inputMode="decimal" className="min-h-11 rounded-xl border border-border bg-card px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Comparison price, INR
          <input name="compareAt" defaultValue={product.compareAt} inputMode="decimal" className="min-h-11 rounded-xl border border-border bg-card px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Stock quantity
          <input name="stock" defaultValue={product.stock} inputMode="numeric" className="min-h-11 rounded-xl border border-border bg-card px-3" />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        Bulk tiers, one per line as quantity=rupees
        <textarea name="tiers" defaultValue={product.tiers} rows={3} className="rounded-xl border border-border bg-card px-3 py-2" />
      </label>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-1 text-sm">
          Availability
          <select name="availability" defaultValue={product.availability} className="min-h-11 rounded-xl border border-border bg-card px-3">
            <option value="available">Available</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Status
          <select name="status" defaultValue={product.status} className="min-h-11 rounded-xl border border-border bg-card px-3">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Display order
          <input name="displayOrder" defaultValue={product.displayOrder} className="min-h-11 rounded-xl border border-border bg-card px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Featured order
          <input name="featuredOrder" defaultValue={product.featuredOrder} className="min-h-11 rounded-xl border border-border bg-card px-3" />
        </label>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product.featured} />
        Featured on the homepage
      </label>
      {state ? (
        <p role="status" className={state.ok ? "text-sm text-forest" : "text-sm text-clay"}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save plant"}
      </Button>
    </form>
  );
}
