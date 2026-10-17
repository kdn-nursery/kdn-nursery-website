"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { recordAudit } from "@/server/admin/audit";
import { requireAdminAction } from "@/server/admin/guard";
import { destroyCloudinary, uploadImage } from "@/server/admin/media-store";
import { revalidatePublicSite } from "@/server/admin/revalidate-public";
import {
  canChangeFulfilment,
  isStaleEdit,
  isValidPincode,
  isValidSlug,
  isValidWhatsapp,
  plainText,
  productDeleteDecision,
  reconcileStock,
  rupeesToPaise,
  safeInternalOrHttpsUrl,
  validateBulkTiers,
  validateComparePrice,
} from "@/server/admin/rules";
import { getPrismaClient } from "@/server/db";

export type ActionResult = { ok: true; message: string; id?: string } | { ok: false; message: string };

const STALE = "This record changed in another session. Reload and try again.";

function text(formData: FormData, key: string): string {
  return plainText(String(formData.get(key) ?? ""));
}

function versionOf(formData: FormData): number {
  const value = Number(formData.get("version"));
  return Number.isInteger(value) ? value : -1;
}

async function gate() {
  return requireAdminAction();
}

function parseTiers(raw: string, pricePaise: number): { ok: true; tiers: { minQuantity: number; pricePaise: number }[] } | { ok: false; message: string } {
  const tiers = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [quantity, price] = line.split("=");
      return {
        minQuantity: Number(quantity),
        pricePaise: rupeesToPaise(price ?? "") ?? -1,
      };
    });
  const problem = validateBulkTiers(pricePaise, tiers);
  if (problem) return { ok: false, message: problem };
  return { ok: true, tiers };
}

export async function saveProduct(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;

  const slug = text(formData, "slug");
  const pricePaise = rupeesToPaise(text(formData, "price"));
  const compareRaw = text(formData, "compareAt");
  const compareAtPaise = compareRaw ? rupeesToPaise(compareRaw) : null;
  const stock = Number(text(formData, "stock"));
  const availability = text(formData, "availability") === "out_of_stock" ? "out_of_stock" : "available";
  const status = text(formData, "status");
  if (!isValidSlug(slug)) return { ok: false, message: "Use a lowercase slug with hyphens." };
  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) return { ok: false, message: "Choose a valid status." };
  if (pricePaise === null || compareAtPaise === undefined) return { ok: false, message: "Enter a valid price in rupees." };
  const compareProblem = validateComparePrice(pricePaise, compareAtPaise);
  if (compareProblem) return { ok: false, message: compareProblem };
  const stockResult = reconcileStock(stock, availability);
  if (!stockResult.ok) return stockResult;
  const tiers = parseTiers(String(formData.get("tiers") ?? ""), pricePaise);
  if (!tiers.ok) return tiers;
  if (!text(formData, "nameEn") || !text(formData, "nameTa")) {
    return { ok: false, message: "Enter the English and Tamil names." };
  }

  const data = {
    slug,
    categoryId: text(formData, "categoryId"),
    nameEn: text(formData, "nameEn"),
    nameTa: text(formData, "nameTa"),
    botanicalName: text(formData, "botanicalName"),
    varietyName: text(formData, "varietyName"),
    summaryEn: text(formData, "summaryEn"),
    summaryTa: text(formData, "summaryTa"),
    descriptionEn: text(formData, "descriptionEn"),
    descriptionTa: text(formData, "descriptionTa"),
    careEn: text(formData, "careEn"),
    careTa: text(formData, "careTa"),
    sunlightEn: text(formData, "sunlightEn"),
    sunlightTa: text(formData, "sunlightTa"),
    wateringEn: text(formData, "wateringEn"),
    wateringTa: text(formData, "wateringTa"),
    handlingEn: text(formData, "handlingEn"),
    handlingTa: text(formData, "handlingTa"),
    potSize: text(formData, "potSize"),
    seoTitleEn: text(formData, "seoTitleEn"),
    seoTitleTa: text(formData, "seoTitleTa"),
    seoDescriptionEn: text(formData, "seoDescriptionEn"),
    seoDescriptionTa: text(formData, "seoDescriptionTa"),
    pricePaise,
    compareAtPaise,
    stockQuantity: stockResult.stockQuantity,
    availability: stockResult.availability === "available" ? "AVAILABLE" as const : "OUT_OF_STOCK" as const,
    status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: formData.get("featured") === "on",
    featuredOrder: text(formData, "featuredOrder") ? Number(text(formData, "featuredOrder")) : null,
    displayOrder: Number(text(formData, "displayOrder") || "0"),
  };

  if (!z.string().min(1).safeParse(data.categoryId).success || !Number.isInteger(data.displayOrder)) {
    return { ok: false, message: "Choose a category and a display order." };
  }

  const prisma = getPrismaClient();
  const id = text(formData, "id");
  try {
    if (!id) {
      const created = await prisma.product.create({ data: { ...data, dataOrigin: "DEVELOPMENT" } });
      await prisma.bulkPriceTier.createMany({
        data: tiers.tiers.map((tier) => ({ ...tier, productId: created.id })),
      });
      await recordAudit({
        adminId: access.admin.id,
        action: "product.create",
        entityType: "Product",
        entityId: created.id,
        summary: `Created ${created.slug}.`,
      });
      revalidatePublicSite();
      return { ok: true, message: "Plant saved as a draft until you publish it.", id: created.id };
    }

    const updated = await prisma.product.updateMany({
      where: { id, version: versionOf(formData) },
      data: { ...data, version: { increment: 1 } },
    });
    if (updated.count !== 1) return { ok: false, message: STALE };
    await prisma.$transaction([
      prisma.bulkPriceTier.deleteMany({ where: { productId: id } }),
      prisma.bulkPriceTier.createMany({ data: tiers.tiers.map((tier) => ({ ...tier, productId: id })) }),
    ]);
    await recordAudit({
      adminId: access.admin.id,
      action: "product.update",
      entityType: "Product",
      entityId: id,
      summary: `Updated ${slug}.`,
    });
    revalidatePublicSite();
    return { ok: true, message: "Plant saved.", id };
  } catch {
    return { ok: false, message: "The slug is already used, or the plant could not be saved." };
  }
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const access = await gate();
  if (!access.ok) return;
  const id = text(formData, "id");
  const prisma = getPrismaClient();
  const references = await prisma.orderItem.count({ where: { productId: id } });
  if (productDeleteDecision(references) === "archive") {
    await prisma.product.updateMany({
      where: { id, version: versionOf(formData) },
      data: { status: "ARCHIVED", version: { increment: 1 } },
    });
    await recordAudit({
      adminId: access.admin.id,
      action: "product.archive",
      entityType: "Product",
      entityId: id,
      summary: "Archived a plant that is referenced by an order.",
    });
  } else {
    const images = await prisma.productImage.findMany({ where: { productId: id }, include: { media: true } });
    await prisma.product.delete({ where: { id } });
    for (const image of images) {
      if (!image.mediaId || !image.media) continue;
      const remaining = await prisma.productImage.count({ where: { mediaId: image.mediaId } });
      if (remaining === 0) {
        await destroyCloudinary(image.media.publicId);
        await prisma.mediaAsset.delete({ where: { id: image.mediaId } }).catch(() => undefined);
      }
    }
    await recordAudit({
      adminId: access.admin.id,
      action: "product.delete",
      entityType: "Product",
      entityId: id,
      summary: "Deleted a plant that had no orders.",
    });
  }
  revalidatePublicSite();
  redirect("/admin/products");
}

export async function uploadProductPhoto(formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const productId = text(formData, "productId");
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, message: "Choose an image file." };
  const uploaded = await uploadImage(new Uint8Array(await file.arrayBuffer()));
  if (!uploaded.ok) return uploaded;

  const prisma = getPrismaClient();
  const count = await prisma.productImage.count({ where: { productId } });
  const media = await prisma.mediaAsset.create({
    data: {
      publicId: uploaded.publicId,
      secureUrl: uploaded.secureUrl,
      format: uploaded.format,
      bytes: uploaded.bytes,
      width: uploaded.width,
      height: uploaded.height,
      altEn: text(formData, "altEn"),
      altTa: text(formData, "altTa"),
      createdById: access.admin.id,
    },
  });
  await prisma.productImage.create({
    data: {
      productId,
      mediaId: media.id,
      altEn: text(formData, "altEn") || "Plant photograph",
      altTa: text(formData, "altTa") || "தாவரப் புகைப்படம்",
      sortOrder: count,
      isCover: count === 0,
      storageKey: `cloudinary:${uploaded.publicId}`,
    },
  });
  await recordAudit({
    adminId: access.admin.id,
    action: "media.upload",
    entityType: "Product",
    entityId: productId,
    summary: "Uploaded a plant photograph.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Photograph uploaded." };
}

export async function savePhotoOrder(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const productId = text(formData, "productId");
  const ids = String(formData.get("order") ?? "").split(",").map((id) => id.trim()).filter(Boolean);
  const prisma = getPrismaClient();
  const images = await prisma.productImage.findMany({ where: { productId } });
  if (images.length !== ids.length || images.some((image) => !ids.includes(image.id))) {
    return { ok: false, message: "The photograph list is out of date. Reload and try again." };
  }
  await prisma.$transaction(
    ids.map((id, index) => prisma.productImage.update({ where: { id }, data: { sortOrder: index } })),
  );
  revalidatePublicSite();
  return { ok: true, message: "Photograph order saved." };
}

export async function setCoverPhoto(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const productId = text(formData, "productId");
  const imageId = text(formData, "imageId");
  const prisma = getPrismaClient();
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isCover: false } }),
    prisma.productImage.updateMany({ where: { id: imageId, productId }, data: { isCover: true } }),
  ]);
  revalidatePublicSite();
  return { ok: true, message: "Cover photograph updated." };
}

export async function updatePhotoAlt(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  await getPrismaClient().productImage.update({
    where: { id: text(formData, "imageId") },
    data: { altEn: text(formData, "altEn"), altTa: text(formData, "altTa") },
  });
  revalidatePublicSite();
  return { ok: true, message: "Alt text saved." };
}

export async function removePhoto(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const imageId = text(formData, "imageId");
  const prisma = getPrismaClient();
  const image = await prisma.productImage.findUnique({ where: { id: imageId }, include: { media: true } });
  if (!image) return { ok: false, message: "That photograph is already gone." };
  await prisma.productImage.delete({ where: { id: imageId } });
  if (image.mediaId && image.media) {
    const remaining = await prisma.productImage.count({ where: { mediaId: image.mediaId } });
    const sharedCategory = await prisma.category.count({ where: { imageStorageKey: image.storageKey } });
    if (remaining === 0 && sharedCategory === 0) {
      await destroyCloudinary(image.media.publicId);
      await prisma.mediaAsset.delete({ where: { id: image.mediaId } }).catch(() => undefined);
    }
  }
  await recordAudit({
    adminId: access.admin.id,
    action: "media.remove",
    entityType: "ProductImage",
    entityId: imageId,
    summary: "Removed a plant photograph.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Photograph removed." };
}

export async function saveCategory(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const slug = text(formData, "slug");
  if (!isValidSlug(slug) || !text(formData, "nameEn") || !text(formData, "nameTa")) {
    return { ok: false, message: "Enter a slug and both language names." };
  }
  const href = text(formData, "imageStorageKey");
  const data = {
    slug,
    nameEn: text(formData, "nameEn"),
    nameTa: text(formData, "nameTa"),
    descriptionEn: text(formData, "descriptionEn"),
    descriptionTa: text(formData, "descriptionTa"),
    imageStorageKey: href,
    imageAltEn: text(formData, "imageAltEn"),
    imageAltTa: text(formData, "imageAltTa"),
    sortOrder: Number(text(formData, "sortOrder") || "0"),
    isPublished: formData.get("published") === "on",
  };
  const prisma = getPrismaClient();
  const id = text(formData, "id");
  try {
    if (!id) {
      const created = await prisma.category.create({ data });
      await recordAudit({
        adminId: access.admin.id,
        action: "category.create",
        entityType: "Category",
        entityId: created.id,
        summary: `Created category ${slug}.`,
      });
      revalidatePublicSite();
      return { ok: true, message: "Category saved.", id: created.id };
    }
    const updated = await prisma.category.updateMany({
      where: { id, version: versionOf(formData) },
      data: { ...data, version: { increment: 1 } },
    });
    if (updated.count !== 1) return { ok: false, message: STALE };
    await recordAudit({
      adminId: access.admin.id,
      action: "category.update",
      entityType: "Category",
      entityId: id,
      summary: `Updated category ${slug}.`,
    });
    revalidatePublicSite();
    return { ok: true, message: "Category saved.", id };
  } catch {
    return { ok: false, message: "That category slug is already used." };
  }
}

export async function archiveCategory(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const id = text(formData, "id");
  const updated = await getPrismaClient().category.updateMany({
    where: { id, version: versionOf(formData) },
    data: { archivedAt: new Date(), isPublished: false, version: { increment: 1 } },
  });
  if (updated.count !== 1) return { ok: false, message: STALE };
  await recordAudit({
    adminId: access.admin.id,
    action: "category.archive",
    entityType: "Category",
    entityId: id,
    summary: "Archived a category and left its plants in place.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Category archived. Its plants were not deleted." };
}

export async function reassignCategoryProducts(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const id = text(formData, "id");
  const targetId = text(formData, "targetId");
  if (!targetId || targetId === id) return { ok: false, message: "Choose a different category." };
  const prisma = getPrismaClient();
  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: targetId } });
  await recordAudit({
    adminId: access.admin.id,
    action: "category.reassign",
    entityType: "Category",
    entityId: id,
    summary: "Moved plants to another category.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Plants moved. You can delete the empty category." };
}

export async function deleteEmptyCategory(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const id = text(formData, "id");
  const prisma = getPrismaClient();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return { ok: false, message: "Move or archive this category before removing it. Plants were not deleted." };
  }
  await prisma.category.delete({ where: { id } });
  await recordAudit({
    adminId: access.admin.id,
    action: "category.delete",
    entityType: "Category",
    entityId: id,
    summary: "Deleted an empty category.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Empty category deleted." };
}

const documentSchema = z.record(z.string(), z.string().max(8000));

export async function saveContentDocument(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const key = text(formData, "key");
  if (!/^[a-z0-9:-]{2,40}$/.test(key)) return { ok: false, message: "Unknown content record." };
  const body: Record<string, string> = {};
  for (const [field, value] of formData.entries()) {
    if (field === "key" || field === "version" || typeof value !== "string") continue;
    if (field.endsWith("Href") && value && !safeInternalOrHttpsUrl(value)) {
      return { ok: false, message: "Links must start with / or https://." };
    }
    body[field] = plainText(value);
  }
  if (!documentSchema.safeParse(body).success) return { ok: false, message: "That content is too long." };
  const prisma = getPrismaClient();
  const existing = await prisma.contentDocument.findUnique({ where: { key } });
  if (existing && isStaleEdit(versionOf(formData), existing.version)) return { ok: false, message: STALE };
  await prisma.contentDocument.upsert({
    where: { key },
    create: { key, body, updatedById: access.admin.id },
    update: { body, version: { increment: 1 }, updatedById: access.admin.id },
  });
  await recordAudit({
    adminId: access.admin.id,
    action: "content.update",
    entityType: "ContentDocument",
    entityId: key,
    summary: `Updated ${key}.`,
  });
  revalidatePublicSite();
  return { ok: true, message: "Website content saved." };
}

export async function saveFaq(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const data = {
    questionEn: text(formData, "questionEn"),
    questionTa: text(formData, "questionTa"),
    answerEn: text(formData, "answerEn"),
    answerTa: text(formData, "answerTa"),
    sortOrder: Number(text(formData, "sortOrder") || "0"),
    isPublished: formData.get("published") === "on",
  };
  if (!data.questionEn || !data.answerEn) return { ok: false, message: "Enter a question and answer." };
  const prisma = getPrismaClient();
  const id = text(formData, "id");
  if (!id) {
    const created = await prisma.faq.create({ data });
    revalidatePublicSite();
    return { ok: true, message: "Question saved.", id: created.id };
  }
  const updated = await prisma.faq.updateMany({
    where: { id, version: versionOf(formData) },
    data: { ...data, version: { increment: 1 } },
  });
  if (updated.count !== 1) return { ok: false, message: STALE };
  revalidatePublicSite();
  return { ok: true, message: "Question saved.", id };
}

export async function saveBanner(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const href = text(formData, "href");
  if (!safeInternalOrHttpsUrl(href)) return { ok: false, message: "The banner link must start with / or https://." };
  const data = {
    storageKey: text(formData, "storageKey"),
    altEn: text(formData, "altEn"),
    altTa: text(formData, "altTa"),
    href,
    sortOrder: Number(text(formData, "sortOrder") || "0"),
    isPublished: formData.get("published") === "on",
  };
  if (!data.storageKey.startsWith("cloudinary:") && !data.storageKey.startsWith("local:")) {
    return { ok: false, message: "Upload a banner photograph or use an existing local: image key." };
  }
  const id = text(formData, "id");
  const prisma = getPrismaClient();
  if (!id) {
    await prisma.banner.create({ data });
  } else {
    const updated = await prisma.banner.updateMany({
      where: { id, version: versionOf(formData) },
      data: { ...data, version: { increment: 1 } },
    });
    if (updated.count !== 1) return { ok: false, message: STALE };
  }
  revalidatePublicSite();
  return { ok: true, message: "Banner saved." };
}

export async function saveCareGuide(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const slug = text(formData, "slug");
  if (!isValidSlug(slug)) return { ok: false, message: "Use a lowercase slug." };
  const data = {
    slug,
    titleEn: text(formData, "titleEn"),
    titleTa: text(formData, "titleTa"),
    summaryEn: text(formData, "summaryEn"),
    summaryTa: text(formData, "summaryTa"),
    bodyEn: text(formData, "bodyEn"),
    bodyTa: text(formData, "bodyTa"),
    sortOrder: Number(text(formData, "sortOrder") || "0"),
    isPublished: formData.get("published") === "on",
  };
  const prisma = getPrismaClient();
  const id = text(formData, "id");
  try {
    if (!id) {
      const created = await prisma.careGuide.create({ data });
      revalidatePublicSite();
      return { ok: true, message: "Care article saved.", id: created.id };
    }
    const updated = await prisma.careGuide.updateMany({
      where: { id, version: versionOf(formData) },
      data: { ...data, version: { increment: 1 } },
    });
    if (updated.count !== 1) return { ok: false, message: STALE };
    revalidatePublicSite();
    return { ok: true, message: "Care article saved.", id };
  } catch {
    return { ok: false, message: "That article slug is already used." };
  }
}

export async function saveBusinessSettings(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const whatsappNumber = text(formData, "whatsappNumber");
  const email = text(formData, "email");
  const instagramUrl = text(formData, "instagramUrl");
  if (!isValidWhatsapp(whatsappNumber)) return { ok: false, message: "Enter a country code and number, or leave WhatsApp empty." };
  if (email && !z.email().safeParse(email).success) return { ok: false, message: "Enter a valid email or leave it empty." };
  if (instagramUrl && !safeInternalOrHttpsUrl(instagramUrl)) return { ok: false, message: "The Instagram link must use https://." };
  const pincodes = text(formData, "pincodes").split(/\s+/).filter(Boolean);
  if (pincodes.some((pincode) => !isValidPincode(pincode))) {
    return { ok: false, message: "Serviceable pincodes must be six digits." };
  }
  const tierLines = String(formData.get("tiers") ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const tiers = [];
  for (const line of tierLines) {
    const [minRaw, maxRaw, chargeRaw] = line.split(",").map((part) => part.trim());
    const minOrderPaise = rupeesToPaise(minRaw ?? "");
    const chargePaise = rupeesToPaise(chargeRaw ?? "");
    const maxOrderPaise = maxRaw ? rupeesToPaise(maxRaw) : null;
    if (minOrderPaise === null || chargePaise === null || (maxRaw && maxOrderPaise === null)) {
      return { ok: false, message: "Each delivery tier needs minimum, optional maximum and charge in rupees." };
    }
    if (maxOrderPaise !== null && maxOrderPaise <= minOrderPaise) {
      return { ok: false, message: "A tier maximum must be above its minimum." };
    }
    tiers.push({ minOrderPaise, maxOrderPaise, chargePaise });
  }

  const prisma = getPrismaClient();
  const current = await prisma.businessProfile.findUnique({ where: { id: "default" } });
  if (current && isStaleEdit(versionOf(formData), current.version)) return { ok: false, message: STALE };
  await prisma.$transaction([
    prisma.businessProfile.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        businessName: text(formData, "businessName") || "Kaviyadevan Nursery Garden",
        whatsappNumber,
        email,
        instagramUrl,
        addressEn: text(formData, "addressEn"),
        addressTa: text(formData, "addressTa"),
        pickupEn: text(formData, "pickupEn"),
        pickupTa: text(formData, "pickupTa"),
        openingHoursEn: text(formData, "openingHoursEn"),
        openingHoursTa: text(formData, "openingHoursTa"),
        dispatchDays: text(formData, "dispatchDays"),
        deliveryEstimateEn: text(formData, "deliveryEstimateEn"),
        deliveryEstimateTa: text(formData, "deliveryEstimateTa"),
        pickupAvailable: formData.get("pickupAvailable") === "on",
      },
      update: {
        businessName: text(formData, "businessName") || "Kaviyadevan Nursery Garden",
        whatsappNumber,
        email,
        instagramUrl,
        addressEn: text(formData, "addressEn"),
        addressTa: text(formData, "addressTa"),
        pickupEn: text(formData, "pickupEn"),
        pickupTa: text(formData, "pickupTa"),
        openingHoursEn: text(formData, "openingHoursEn"),
        openingHoursTa: text(formData, "openingHoursTa"),
        dispatchDays: text(formData, "dispatchDays"),
        deliveryEstimateEn: text(formData, "deliveryEstimateEn"),
        deliveryEstimateTa: text(formData, "deliveryEstimateTa"),
        pickupAvailable: formData.get("pickupAvailable") === "on",
        version: { increment: 1 },
      },
    }),
    prisma.deliveryPincode.deleteMany(),
    prisma.deliveryPincode.createMany({ data: pincodes.map((pincode) => ({ pincode })) }),
    prisma.deliveryChargeTier.deleteMany(),
    prisma.deliveryChargeTier.createMany({
      data: tiers.map((tier, index) => ({ ...tier, sortOrder: index })),
    }),
  ]);
  await recordAudit({
    adminId: access.admin.id,
    action: "settings.update",
    entityType: "BusinessProfile",
    entityId: "default",
    summary: "Updated public business settings.",
  });
  revalidatePublicSite();
  return { ok: true, message: "Settings saved." };
}

export async function updateFulfilment(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const id = text(formData, "id");
  const next = text(formData, "fulfilment");
  const prisma = getPrismaClient();
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return { ok: false, message: "Order not found." };
  if (isStaleEdit(versionOf(formData), order.version)) return { ok: false, message: STALE };
  if (!canChangeFulfilment(order.fulfilmentStatus, next)) {
    return { ok: false, message: "That fulfilment change is not available." };
  }
  if (next === "CANCELLED" && order.paymentStatus === "PAID") {
    return { ok: false, message: "Cancellation is unavailable until a refund workflow exists." };
  }
  const trackingUrl = text(formData, "trackingUrl");
  if (trackingUrl && !safeInternalOrHttpsUrl(trackingUrl)) {
    return { ok: false, message: "The tracking link must use https://." };
  }
  const updated = await prisma.order.updateMany({
    where: { id, version: order.version },
    data: {
      fulfilmentStatus: next as typeof order.fulfilmentStatus,
      courierName: text(formData, "courierName"),
      trackingNumber: text(formData, "trackingNumber"),
      trackingUrl,
      version: { increment: 1 },
    },
  });
  if (updated.count !== 1) return { ok: false, message: STALE };
  await prisma.orderEvent.create({
    data: { orderId: id, kind: "fulfilment", summary: `Fulfilment changed to ${next}.` },
  });
  await recordAudit({
    adminId: access.admin.id,
    action: "order.fulfilment",
    entityType: "Order",
    entityId: id,
    summary: `Fulfilment changed to ${next}.`,
  });
  return { ok: true, message: "Fulfilment updated. Payment status was not changed." };
}

export async function addOrderNote(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const access = await gate();
  if (!access.ok) return access;
  const body = text(formData, "body");
  if (!body) return { ok: false, message: "Write a note first." };
  await getPrismaClient().orderNote.create({
    data: { orderId: text(formData, "id"), body, adminId: access.admin.id },
  });
  return { ok: true, message: "Note saved." };
}
