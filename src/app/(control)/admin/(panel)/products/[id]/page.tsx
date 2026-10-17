import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-submit";
import { PhotoManager } from "@/components/admin/photo-manager";
import { ProductForm } from "@/components/admin/product-form";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";
import { cloudinaryDeliveryUrl } from "@/server/admin/media-store";
import { deleteProduct } from "@/server/admin/mutations";

function rupees(paise: number | null): string {
  if (paise === null) return "";
  return (paise / 100).toFixed(2).replace(/\.00$/, "");
}

function srcFor(storageKey: string): string {
  if (storageKey.startsWith("local:")) return storageKey.slice("local:".length);
  if (storageKey.startsWith("cloudinary:")) return cloudinaryDeliveryUrl(storageKey.slice("cloudinary:".length)) ?? "";
  return "";
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } }, bulkPriceTiers: true, category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        <Link href="/admin/products">Plants</Link> / {product.nameEn}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl text-forest">Edit {product.nameEn}</h2>
        {product.status === "PUBLISHED" ? (
          <Link href={`/en/shop/${product.category.slug}/${product.slug}`} className="underline">
            Preview product
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">Drafts are hidden from the public catalogue.</p>
        )}
      </div>
      <div className="mt-6">
        <ProductForm
          categories={categories.map((category) => ({ id: category.id, nameEn: category.nameEn }))}
          product={{
            id: product.id,
            version: product.version,
            slug: product.slug,
            categoryId: product.categoryId,
            nameEn: product.nameEn,
            nameTa: product.nameTa,
            botanicalName: product.botanicalName,
            varietyName: product.varietyName,
            summaryEn: product.summaryEn,
            summaryTa: product.summaryTa,
            descriptionEn: product.descriptionEn,
            descriptionTa: product.descriptionTa,
            careEn: product.careEn,
            careTa: product.careTa,
            sunlightEn: product.sunlightEn,
            sunlightTa: product.sunlightTa,
            wateringEn: product.wateringEn,
            wateringTa: product.wateringTa,
            handlingEn: product.handlingEn,
            handlingTa: product.handlingTa,
            potSize: product.potSize,
            seoTitleEn: product.seoTitleEn,
            seoTitleTa: product.seoTitleTa,
            seoDescriptionEn: product.seoDescriptionEn,
            seoDescriptionTa: product.seoDescriptionTa,
            price: rupees(product.pricePaise),
            compareAt: rupees(product.compareAtPaise),
            tiers: product.bulkPriceTiers.map((tier) => `${tier.minQuantity}=${rupees(tier.pricePaise)}`).join("\n"),
            stock: String(product.stockQuantity),
            availability: product.availability === "AVAILABLE" ? "available" : "out_of_stock",
            status: product.status,
            featured: product.isFeatured,
            featuredOrder: product.featuredOrder ? String(product.featuredOrder) : "",
            displayOrder: String(product.displayOrder),
          }}
        />
      </div>
      <PhotoManager
        productId={product.id}
        photos={product.images.map((image) => ({
          id: image.id,
          src: srcFor(image.storageKey),
          altEn: image.altEn,
          altTa: image.altTa,
          isCover: image.isCover,
        }))}
      />
      <form action={deleteProduct} className="mt-8">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="version" value={product.version} />
        <ConfirmButton label="Archive or delete" message="Archive this plant if it has orders, or delete it if it has none?" />
        <p className="mt-2 text-sm text-muted-foreground">
          Plants referenced by an order are archived. Plants with no orders can be deleted.
        </p>
      </form>
    </div>
  );
}
