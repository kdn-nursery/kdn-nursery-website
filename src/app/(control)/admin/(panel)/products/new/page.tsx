import { DatabaseSetup } from "@/components/admin/database-setup";
import { ProductForm } from "@/components/admin/product-form";
import { adminPrisma } from "@/server/admin/guard";

export default async function NewProductPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h2 className="font-display text-3xl text-forest">Add a plant</h2>
      <p className="mt-2 text-sm text-muted-foreground">New plants stay unpublished until you choose Published.</p>
      <div className="mt-6">
        <ProductForm
          categories={categories.map((category) => ({ id: category.id, nameEn: category.nameEn }))}
          product={{
            slug: "",
            categoryId: categories[0]?.id ?? "",
            nameEn: "",
            nameTa: "",
            botanicalName: "",
            varietyName: "",
            summaryEn: "",
            summaryTa: "",
            descriptionEn: "",
            descriptionTa: "",
            careEn: "",
            careTa: "",
            sunlightEn: "",
            sunlightTa: "",
            wateringEn: "",
            wateringTa: "",
            handlingEn: "",
            handlingTa: "",
            potSize: "",
            seoTitleEn: "",
            seoTitleTa: "",
            seoDescriptionEn: "",
            seoDescriptionTa: "",
            price: "",
            compareAt: "",
            tiers: "",
            stock: "0",
            availability: "out_of_stock",
            status: "DRAFT",
            featured: false,
            featuredOrder: "",
            displayOrder: "0",
          }}
        />
      </div>
    </div>
  );
}
