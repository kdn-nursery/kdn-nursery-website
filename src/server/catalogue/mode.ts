export type CatalogueMode = "demo" | "database";

export class CatalogueConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogueConfigError";
  }
}

export class DemoWriteError extends Error {
  constructor(action: string) {
    super(
      `Refusing to ${action}. Demo catalogue mode does not run transactions or writes.`,
    );
    this.name = "DemoWriteError";
  }
}

export function resolveCatalogueMode(
  env: NodeJS.ProcessEnv = process.env,
): CatalogueMode {
  const source = env.CATALOGUE_DATA_SOURCE?.trim();

  if (source === "demo") {
    if (env.NODE_ENV === "production" && env.ALLOW_DEMO_CATALOGUE !== "true") {
      throw new CatalogueConfigError(
        "Demo catalogue mode is blocked in production. Set ALLOW_DEMO_CATALOGUE=true only for an explicit non-public preview.",
      );
    }
    return "demo";
  }

  if (source === "database") {
    if (!env.DATABASE_URL?.trim()) {
      throw new CatalogueConfigError(
        "CATALOGUE_DATA_SOURCE=database requires DATABASE_URL. Sample data is not used as a fallback.",
      );
    }
    return "database";
  }

  throw new CatalogueConfigError(
    "Set CATALOGUE_DATA_SOURCE to demo or database. The site does not choose sample data automatically.",
  );
}

export function assertCatalogueWritesAllowed(
  env: NodeJS.ProcessEnv = process.env,
): void {
  const mode = resolveCatalogueMode(env);
  if (mode === "demo") {
    throw new DemoWriteError("write catalogue or order data");
  }
}

export function refuseDemoWrite(action: string): never {
  throw new DemoWriteError(action);
}
