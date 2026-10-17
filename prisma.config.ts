import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI needs a URL to load its config. When DATABASE_URL is absent,
// this placeholder lets `prisma generate` and migration diffs run without
// connecting. The application never uses this placeholder, and migrations
// must not be applied to it.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/kdn_nursery_dev";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
