import { ActionForm } from "@/components/admin/action-form";
import {
  archiveCategory,
  deleteEmptyCategory,
  reassignCategoryProducts,
  saveCategory,
} from "@/server/admin/mutations";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";
import { ConfirmButton } from "@/components/admin/confirm-submit";

export default async function CategoriesPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="grid gap-6">
      <h2 className="font-display text-3xl text-forest">Categories</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Removing a category never deletes its plants. Move the plants first, or archive the category and leave them in place.
      </p>
      <ActionForm action={saveCategory} className="grid gap-3 rounded-[1.4rem] border border-border bg-card p-4 md:grid-cols-2">
        <h3 className="font-display text-2xl text-forest md:col-span-2">Add a category</h3>
        <input name="slug" placeholder="Slug" aria-label="Slug" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="sortOrder" placeholder="Display order" aria-label="Display order" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="nameEn" placeholder="English name" aria-label="English name" className="min-h-11 rounded-xl border border-border px-3" />
        <input name="nameTa" placeholder="Tamil name" aria-label="Tamil name" className="min-h-11 rounded-xl border border-border px-3" />
        <textarea name="descriptionEn" placeholder="English description" aria-label="English description" className="rounded-xl border border-border px-3 py-2" />
        <textarea name="descriptionTa" placeholder="Tamil description" aria-label="Tamil description" className="rounded-xl border border-border px-3 py-2" />
        <input name="imageStorageKey" placeholder="Image key, local: or cloudinary:" aria-label="Image key" className="min-h-11 rounded-xl border border-border px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground md:col-span-2">Save category</button>
      </ActionForm>
      {categories.length === 0 ? <p>No categories yet.</p> : null}
      {categories.map((category) => (
        <article key={category.id} className="grid gap-3 rounded-[1.4rem] border border-border p-4">
          <ActionForm action={saveCategory} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="version" value={category.version} />
            <input name="slug" defaultValue={category.slug} aria-label="Slug" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="sortOrder" defaultValue={category.sortOrder} aria-label="Display order" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="nameEn" defaultValue={category.nameEn} aria-label="English name" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="nameTa" defaultValue={category.nameTa} aria-label="Tamil name" className="min-h-11 rounded-xl border border-border px-3" />
            <textarea name="descriptionEn" defaultValue={category.descriptionEn} aria-label="English description" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="descriptionTa" defaultValue={category.descriptionTa} aria-label="Tamil description" className="rounded-xl border border-border px-3 py-2" />
            <input name="imageStorageKey" defaultValue={category.imageStorageKey ?? ""} aria-label="Image key" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="imageAltEn" defaultValue={category.imageAltEn} aria-label="English image alt text" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="imageAltTa" defaultValue={category.imageAltTa} aria-label="Tamil image alt text" className="min-h-11 rounded-xl border border-border px-3" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={category.isPublished} /> Published
            </label>
            <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Save changes</button>
          </ActionForm>
          <p className="text-sm text-muted-foreground">
            {category._count.products} plants. {category.archivedAt ? "Archived." : "Active."}
          </p>
          <ActionForm action={reassignCategoryProducts} className="flex flex-wrap gap-2">
            <input type="hidden" name="id" value={category.id} />
            <select name="targetId" aria-label="Move plants to" className="min-h-11 rounded-xl border border-border px-3">
              {categories.filter((item) => item.id !== category.id).map((item) => (
                <option key={item.id} value={item.id}>{item.nameEn}</option>
              ))}
            </select>
            <button className="min-h-11 rounded-full border border-border px-4">Move plants</button>
          </ActionForm>
          <ActionForm action={archiveCategory}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="version" value={category.version} />
            <ConfirmButton label="Archive category" message="Archive this category without deleting its plants?" />
          </ActionForm>
          <ActionForm action={deleteEmptyCategory}>
            <input type="hidden" name="id" value={category.id} />
            <ConfirmButton label="Delete if empty" message="Delete this category only if it has no plants?" />
          </ActionForm>
        </article>
      ))}
    </div>
  );
}
