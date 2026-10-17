import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/lib/money";
import { cloudinaryDeliveryUrl } from "@/server/admin/media-store";
import type { Prisma } from "@/generated/prisma/client";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";

function thumb(storageKey: string | undefined): string | null {
  if (!storageKey) return null;
  if (storageKey.startsWith("local:")) return storageKey.slice("local:".length);
  if (storageKey.startsWith("cloudinary:")) return cloudinaryDeliveryUrl(storageKey.slice("cloudinary:".length));
  return null;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; availability?: string; page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const q = query.q?.trim() ?? "";
  const status = query.status === "DRAFT" || query.status === "PUBLISHED" || query.status === "ARCHIVED" ? query.status : undefined;
  const availability = query.availability === "AVAILABLE" || query.availability === "OUT_OF_STOCK" ? query.availability : undefined;
  const where: Prisma.ProductWhereInput = {
    ...(status ? { status } : {}),
    ...(availability ? { availability } : {}),
    ...(q
      ? {
          OR: [
            { nameEn: { contains: q, mode: "insensitive" as const } },
            { nameTa: { contains: q } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, category: true },
      orderBy: [{ displayOrder: "asc" }, { nameEn: "asc" }],
      skip: (page - 1) * 12,
      take: 12,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl text-forest">Plants</h2>
        <Link href="/admin/products/new" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground">
          Add a plant
        </Link>
      </div>
      <form className="grid gap-3 md:grid-cols-4">
        <input name="q" defaultValue={q} placeholder="Search plants" aria-label="Search plants" className="min-h-11 rounded-xl border border-border bg-card px-3" />
        <select name="status" defaultValue={status ?? ""} aria-label="Status" className="min-h-11 rounded-xl border border-border bg-card px-3">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select name="availability" defaultValue={availability ?? ""} aria-label="Availability" className="min-h-11 rounded-xl border border-border bg-card px-3">
          <option value="">All stock</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
        <button className="min-h-11 rounded-full border border-border px-4">Filter</button>
      </form>
      {products.length === 0 ? (
        <p className="rounded-[1.4rem] border border-dashed border-border p-6 text-sm">No plants match this view.</p>
      ) : (
        <div className="overflow-x-auto rounded-[1.4rem] border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-card">
              <tr>
                <th className="p-3">Plant</th>
                <th className="p-3">Status</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const src = thumb(product.images[0]?.storageKey);
                return (
                  <tr key={product.id} className="border-t border-border">
                    <td className="p-3">
                      <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt="" className="h-14 w-12 rounded-lg object-cover" />
                        ) : (
                          <span className="h-14 w-12 rounded-lg bg-secondary" />
                        )}
                        <span>
                          <span className="block font-medium">{product.nameEn}</span>
                          <span className="block text-muted-foreground">{product.nameTa}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="p-3">
                      <Badge tone={product.status === "PUBLISHED" ? "available" : "draft"}>{product.status}</Badge>
                    </td>
                    <td className="p-3">{formatInr(product.pricePaise, "en")}</td>
                    <td className="p-3">{product.stockQuantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {pages}.{" "}
        {page > 1 ? <Link href={`/admin/products?page=${page - 1}`}>Previous</Link> : null}{" "}
        {page < pages ? <Link href={`/admin/products?page=${page + 1}`}>Next</Link> : null}
      </p>
    </div>
  );
}
