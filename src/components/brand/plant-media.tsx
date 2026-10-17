import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cloudinaryDeliveryUrl } from "@/server/admin/media-store";
import { imageCreditFor, isLocalPhoto } from "@/server/catalogue/image-credits";
import { textFor, type ProductImage } from "@/server/catalogue/types";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export async function PhotoCredit({
  storageKey,
  speciesNote = false,
}: {
  storageKey: string | undefined;
  speciesNote?: boolean;
}) {
  const credit = storageKey ? imageCreditFor(storageKey) : null;
  if (!credit) return null;
  const t = await getTranslations("Product");

  return (
    <p className="text-xs leading-5 text-muted-foreground">
      <a href={credit.sourceUrl} className="underline">
        {t("photoCredit", { photographer: credit.photographer })}
      </a>
      {credit.licenseUrl ? (
        <>
          {" · "}
          <a href={credit.licenseUrl} rel="license" className="underline">
            {credit.license}
          </a>
        </>
      ) : (
        <span>{` · ${credit.license}`}</span>
      )}
      {speciesNote ? <span className="mt-1 block">{t("speciesNote")}</span> : null}
    </p>
  );
}

export async function PlantMedia({
  image,
  locale,
  className,
  sizes,
  priority = false,
  speciesNote = false,
  showCredit = true,
  fit = "contain",
}: {
  image: ProductImage | undefined;
  locale: AppLocale;
  className?: string;
  sizes: string;
  priority?: boolean;
  speciesNote?: boolean;
  showCredit?: boolean;
  fit?: "contain" | "cover";
}) {
  const cloudinarySrc = image?.storageKey.startsWith("cloudinary:")
    ? cloudinaryDeliveryUrl(image.storageKey.slice("cloudinary:".length))
    : null;

  if (!image || (!isLocalPhoto(image.storageKey) && !cloudinarySrc)) {
    const t = await getTranslations("Product");
    return (
      <div
        role="img"
        aria-label={t("photoComingSoon")}
        className={cn(
          "flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-[1.4rem] border border-dashed border-border bg-card px-6 text-center",
          className,
        )}
      >
        <p className="font-display text-2xl text-forest">{t("photoComingSoon")}</p>
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">{t("photoComingSoonBody")}</p>
      </div>
    );
  }

  const src = cloudinarySrc ?? image.storageKey.slice("local:".length);

  return (
    <figure className="min-w-0">
      <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#f3eee4]", className)}>
        <Image
          src={src}
          alt={textFor(image.alt, locale)}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      </div>
      {showCredit ? (
        <figcaption className="mt-2">
          <PhotoCredit storageKey={image.storageKey} speciesNote={speciesNote} />
        </figcaption>
      ) : null}
    </figure>
  );
}
