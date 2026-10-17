import { revalidatePath } from "next/cache";

export function revalidatePublicSite(): void {
  for (const locale of ["en", "ta"]) {
    revalidatePath(`/${locale}`, "layout");
  }
}
