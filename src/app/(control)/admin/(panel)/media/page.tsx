import { DatabaseSetup } from "@/components/admin/database-setup";
import { adminPrisma } from "@/server/admin/guard";
import { cloudinaryConfigured, cloudinaryDeliveryUrl } from "@/server/admin/media-store";

export default async function MediaPage() {
  const prisma = adminPrisma();
  if (!prisma) return <DatabaseSetup />;
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { include: { product: true } } },
  });

  return (
    <div className="grid gap-4">
      <h2 className="font-display text-3xl text-forest">Media library</h2>
      {cloudinaryConfigured() ? (
        <p className="text-sm text-muted-foreground">Photographs are stored in Cloudinary. Upload them from a plant page.</p>
      ) : (
        <p className="rounded-[1.4rem] border border-border bg-card p-4 text-sm leading-6">
          Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET before uploading. Uploads are refused until then.
        </p>
      )}
      {assets.length === 0 ? <p>No uploaded photographs yet.</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => {
          const src = cloudinaryDeliveryUrl(asset.publicId) ?? asset.secureUrl;
          return (
            <li key={asset.id} className="rounded-[1.4rem] border border-border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={asset.altEn || "Uploaded photograph"} className="aspect-[4/5] w-full rounded-xl object-cover" />
              <p className="mt-2 text-sm">
                Used by {asset.images.length === 0 ? "nothing" : asset.images.map((image) => image.product.nameEn).join(", ")}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
