import { demoCatalogueRepository, type CatalogueRepository } from "@/server/catalogue/demo-repository";
import { resolveCatalogueMode } from "@/server/catalogue/mode";

export async function getCatalogueRepository(): Promise<CatalogueRepository> {
  const mode = resolveCatalogueMode();
  if (mode === "demo") return demoCatalogueRepository;

  const { createPrismaCatalogueRepository } = await import(
    "@/server/catalogue/prisma-repository"
  );
  return createPrismaCatalogueRepository();
}
