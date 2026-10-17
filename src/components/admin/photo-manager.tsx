"use client";

import { useState } from "react";
import { ActionForm } from "@/components/admin/action-form";
import {
  removePhoto,
  savePhotoOrder,
  setCoverPhoto,
  updatePhotoAlt,
  uploadProductPhoto,
} from "@/server/admin/mutations";
import { Button } from "@/components/ui/button";

type Photo = {
  id: string;
  src: string;
  altEn: string;
  altTa: string;
  isCover: boolean;
};

export function PhotoManager({ productId, photos }: { productId: string; photos: Photo[] }) {
  const [items, setItems] = useState(photos);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  function move(id: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= items.length) return;
    const copy = [...items];
    const [row] = copy.splice(index, 1);
    if (!row) return;
    copy.splice(next, 0, row);
    setItems(copy);
  }

  return (
    <section className="mt-10 grid gap-4">
      <h2 className="font-display text-3xl text-forest">Photographs</h2>
      <form
        action={async (formData) => {
          const result = await uploadProductPhoto(formData);
          setMessage(result.message);
          if (result.ok) window.location.reload();
        }}
        className="grid gap-3 rounded-[1.4rem] border border-border bg-card p-4"
      >
        <input type="hidden" name="productId" value={productId} />
        <label className="grid gap-1 text-sm">
          Upload photographs
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </label>
        {preview ? (
          // Local preview of a file that has not been uploaded yet.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Selected photograph preview" className="h-40 w-32 rounded-xl object-cover" />
        ) : null}
        <label className="grid gap-1 text-sm">
          English alt text
          <input name="altEn" className="min-h-11 rounded-xl border border-border px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Tamil alt text
          <input name="altTa" className="min-h-11 rounded-xl border border-border px-3" />
        </label>
        <Button type="submit">Upload photograph</Button>
      </form>
      <ul className="grid gap-3">
        {items.map((photo, index) => (
          <li
            key={photo.id}
            draggable
            onDragStart={() => setDragId(photo.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!dragId || dragId === photo.id) return;
              const from = items.findIndex((item) => item.id === dragId);
              const copy = [...items];
              const [row] = copy.splice(from, 1);
              if (!row) return;
              copy.splice(index, 0, row);
              setItems(copy);
              setDragId(null);
            }}
            className="grid gap-3 rounded-[1.4rem] border border-border bg-card p-4 md:grid-cols-[6rem_1fr]"
          >
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.src} alt="" className="h-24 w-20 rounded-xl object-cover" />
            ) : (
              <div className="h-24 w-20 rounded-xl bg-secondary" />
            )}
            <div className="grid gap-2">
              <p className="text-sm">{photo.isCover ? "Cover photograph" : `Photograph ${index + 1}`}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="min-h-11 rounded-full border border-border px-3" onClick={() => move(photo.id, -1)}>
                  Move up
                </button>
                <button type="button" className="min-h-11 rounded-full border border-border px-3" onClick={() => move(photo.id, 1)}>
                  Move down
                </button>
                <ActionForm action={setCoverPhoto}>
                  <input type="hidden" name="productId" value={productId} />
                  <input type="hidden" name="imageId" value={photo.id} />
                  <button type="submit" className="min-h-11 rounded-full border border-border px-3">
                    Set as cover
                  </button>
                </ActionForm>
                <ActionForm action={removePhoto} confirm="Remove this photograph?">
                  <input type="hidden" name="imageId" value={photo.id} />
                  <button type="submit" className="min-h-11 rounded-full border border-border px-3">
                    Remove
                  </button>
                </ActionForm>
              </div>
              <ActionForm action={updatePhotoAlt} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="imageId" value={photo.id} />
                <input name="altEn" defaultValue={photo.altEn} aria-label="English alt text" className="min-h-11 rounded-xl border border-border px-3" />
                <input name="altTa" defaultValue={photo.altTa} aria-label="Tamil alt text" className="min-h-11 rounded-xl border border-border px-3" />
                <Button type="submit" variant="secondary">
                  Save alt text
                </Button>
              </ActionForm>
            </div>
          </li>
        ))}
      </ul>
      <ActionForm action={savePhotoOrder}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="order" value={items.map((item) => item.id).join(",")} />
        <Button type="submit" variant="secondary">
          Save photograph order
        </Button>
      </ActionForm>
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}
