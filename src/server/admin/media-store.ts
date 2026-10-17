import { v2 as cloudinary } from "cloudinary";
import { detectImageType, MAX_UPLOAD_BYTES } from "@/server/admin/rules";

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function cloudinaryDeliveryUrl(publicId: string): string | null {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloud) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_limit,w_1600/${publicId}`;
}

export async function uploadImage(bytes: Uint8Array): Promise<
  | { ok: true; publicId: string; secureUrl: string; format: string; bytes: number; width: number; height: number }
  | { ok: false; message: string }
> {
  if (bytes.byteLength === 0) return { ok: false, message: "Choose an image file." };
  if (bytes.byteLength > MAX_UPLOAD_BYTES) return { ok: false, message: "Images must be 8 MB or smaller." };
  const kind = detectImageType(bytes);
  if (!kind) return { ok: false, message: "Use a JPEG, PNG or WebP photograph." };
  if (!cloudinaryConfigured()) {
    return {
      ok: false,
      message:
        "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const uploaded = await new Promise<{
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "kdn-nursery", resource_type: "image" },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed."));
        else resolve(result);
      },
    );
    stream.end(Buffer.from(bytes));
  }).catch(() => null);

  if (!uploaded) return { ok: false, message: "The photograph could not be uploaded. Try again." };
  return {
    ok: true,
    publicId: uploaded.public_id,
    secureUrl: uploaded.secure_url,
    format: uploaded.format,
    bytes: uploaded.bytes,
    width: uploaded.width,
    height: uploaded.height,
  };
}

export async function destroyCloudinary(publicId: string): Promise<void> {
  if (!cloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" }).catch(() => undefined);
}
