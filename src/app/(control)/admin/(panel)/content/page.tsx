import { ActionForm } from "@/components/admin/action-form";
import { saveBanner, saveCareGuide, saveContentDocument, saveFaq } from "@/server/admin/mutations";
import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";

const documents = [
  ["homepage", ["eyebrow", "title", "lede", "primaryLabel", "secondaryLabel"], ["primaryHref", "secondaryHref"]],
  ["about", ["eyebrow", "title", "lede", "story", "localTitle", "localBody"], []],
  ["policy:delivery", ["title", "body"], []],
  ["policy:privacy", ["title", "body"], []],
  ["policy:terms", ["title", "body"], []],
  ["policy:cancellation", ["title", "body"], []],
] as const;

export default async function ContentPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const [stored, faqs, banners, guides] = await Promise.all([
    prisma.contentDocument.findMany(),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.banner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.careGuide.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const byKey = new Map(stored.map((row) => [row.key, row]));

  return (
    <div className="grid gap-8">
      <h2 className="font-display text-3xl text-forest">Website content</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Saved English and Tamil text replaces the built-in copy on the public site. Leave a field blank to keep the current translation.
      </p>
      {documents.map(([key, bilingual, links]) => {
        const body = (byKey.get(key)?.body ?? {}) as Record<string, string>;
        return (
          <ActionForm key={key} action={saveContentDocument} className="grid gap-3 rounded-[1.4rem] border border-border p-4">
            <h3 className="font-display text-2xl text-forest">{key}</h3>
            <input type="hidden" name="key" value={key} />
            <input type="hidden" name="version" value={byKey.get(key)?.version ?? 0} />
            {bilingual.map((field) => (
              <div key={field} className="grid gap-2 md:grid-cols-2">
                <textarea name={`${field}En`} defaultValue={body[`${field}En`] ?? ""} aria-label={`${field} English`} placeholder={`${field} English`} className="rounded-xl border border-border px-3 py-2" />
                <textarea name={`${field}Ta`} defaultValue={body[`${field}Ta`] ?? ""} aria-label={`${field} Tamil`} placeholder={`${field} Tamil`} className="rounded-xl border border-border px-3 py-2" />
              </div>
            ))}
            {links.map((field) => (
              <input key={field} name={field} defaultValue={body[field] ?? ""} aria-label={field} placeholder={field} className="min-h-11 rounded-xl border border-border px-3" />
            ))}
            <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Save {key}</button>
          </ActionForm>
        );
      })}

      <section className="grid gap-4">
        <h3 className="font-display text-2xl text-forest">Banners</h3>
        <ActionForm action={saveBanner} className="grid gap-2 md:grid-cols-2">
          <input name="storageKey" aria-label="Image key" placeholder="local:/plants/example.webp" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="href" aria-label="Link" placeholder="/shop" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="altEn" aria-label="English alt text" placeholder="English alt text" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="altTa" aria-label="Tamil alt text" placeholder="Tamil alt text" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="sortOrder" aria-label="Order" placeholder="0" className="min-h-11 rounded-xl border border-border px-3" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
          <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Add banner</button>
        </ActionForm>
        {banners.map((banner) => (
          <ActionForm key={banner.id} action={saveBanner} className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-2">
            <input type="hidden" name="id" value={banner.id} />
            <input type="hidden" name="version" value={banner.version} />
            <input name="storageKey" defaultValue={banner.storageKey} aria-label="Image key" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="href" defaultValue={banner.href} aria-label="Link" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="altEn" defaultValue={banner.altEn} aria-label="English alt text" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="altTa" defaultValue={banner.altTa} aria-label="Tamil alt text" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="sortOrder" defaultValue={banner.sortOrder} aria-label="Order" className="min-h-11 rounded-xl border border-border px-3" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={banner.isPublished} /> Published</label>
            <button className="min-h-11 rounded-full border border-border">Save banner</button>
          </ActionForm>
        ))}
      </section>

      <section className="grid gap-4">
        <h3 className="font-display text-2xl text-forest">Questions</h3>
        <ActionForm action={saveFaq} className="grid gap-2">
          <input name="questionEn" aria-label="English question" placeholder="English question" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="questionTa" aria-label="Tamil question" placeholder="Tamil question" className="min-h-11 rounded-xl border border-border px-3" />
          <textarea name="answerEn" aria-label="English answer" placeholder="English answer" className="rounded-xl border border-border px-3 py-2" />
          <textarea name="answerTa" aria-label="Tamil answer" placeholder="Tamil answer" className="rounded-xl border border-border px-3 py-2" />
          <input name="sortOrder" aria-label="Order" placeholder="0" className="min-h-11 rounded-xl border border-border px-3" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
          <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Save question</button>
        </ActionForm>
        {faqs.map((faq) => (
          <ActionForm key={faq.id} action={saveFaq} className="grid gap-2 rounded-xl border border-border p-3">
            <input type="hidden" name="id" value={faq.id} />
            <input type="hidden" name="version" value={faq.version} />
            <input name="questionEn" defaultValue={faq.questionEn} aria-label="English question" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="questionTa" defaultValue={faq.questionTa} aria-label="Tamil question" className="min-h-11 rounded-xl border border-border px-3" />
            <textarea name="answerEn" defaultValue={faq.answerEn} aria-label="English answer" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="answerTa" defaultValue={faq.answerTa} aria-label="Tamil answer" className="rounded-xl border border-border px-3 py-2" />
            <input name="sortOrder" defaultValue={faq.sortOrder} aria-label="Order" className="min-h-11 rounded-xl border border-border px-3" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={faq.isPublished} /> Published</label>
            <button className="min-h-11 rounded-full border border-border">Save question</button>
          </ActionForm>
        ))}
      </section>

      <section className="grid gap-4">
        <h3 className="font-display text-2xl text-forest">Plant-care articles</h3>
        <ActionForm action={saveCareGuide} className="grid gap-2">
          <input name="slug" aria-label="Slug" placeholder="Slug" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="titleEn" aria-label="English title" placeholder="English title" className="min-h-11 rounded-xl border border-border px-3" />
          <input name="titleTa" aria-label="Tamil title" placeholder="Tamil title" className="min-h-11 rounded-xl border border-border px-3" />
          <textarea name="summaryEn" aria-label="English summary" placeholder="English summary" className="rounded-xl border border-border px-3 py-2" />
          <textarea name="summaryTa" aria-label="Tamil summary" placeholder="Tamil summary" className="rounded-xl border border-border px-3 py-2" />
          <textarea name="bodyEn" aria-label="English article" placeholder="English article" className="rounded-xl border border-border px-3 py-2" />
          <textarea name="bodyTa" aria-label="Tamil article" placeholder="Tamil article" className="rounded-xl border border-border px-3 py-2" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
          <button className="min-h-11 rounded-full bg-primary px-5 text-primary-foreground">Save article</button>
        </ActionForm>
        {guides.map((guide) => (
          <ActionForm key={guide.id} action={saveCareGuide} className="grid gap-2 rounded-xl border border-border p-3">
            <input type="hidden" name="id" value={guide.id} />
            <input type="hidden" name="version" value={guide.version} />
            <input name="slug" defaultValue={guide.slug} aria-label="Slug" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="titleEn" defaultValue={guide.titleEn} aria-label="English title" className="min-h-11 rounded-xl border border-border px-3" />
            <input name="titleTa" defaultValue={guide.titleTa} aria-label="Tamil title" className="min-h-11 rounded-xl border border-border px-3" />
            <textarea name="summaryEn" defaultValue={guide.summaryEn} aria-label="English summary" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="summaryTa" defaultValue={guide.summaryTa} aria-label="Tamil summary" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="bodyEn" defaultValue={guide.bodyEn} aria-label="English article" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="bodyTa" defaultValue={guide.bodyTa} aria-label="Tamil article" className="rounded-xl border border-border px-3 py-2" />
            <input name="sortOrder" defaultValue={guide.sortOrder} aria-label="Order" className="min-h-11 rounded-xl border border-border px-3" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={guide.isPublished} /> Published</label>
            <button className="min-h-11 rounded-full border border-border">Save article</button>
          </ActionForm>
        ))}
      </section>
    </div>
  );
}
