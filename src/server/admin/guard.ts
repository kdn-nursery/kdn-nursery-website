import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { resolveCatalogueMode } from "@/server/catalogue/mode";
import { getPrismaClient } from "@/server/db";

export const ADMIN_LOGIN_PATH = "/admin/login";

export type AdminActor = { id: string; username: string };

export async function assertSameOrigin(): Promise<void> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!origin || !host) throw new Error("This request was rejected.");
  if (new URL(origin).host !== host) throw new Error("This request was rejected.");
}

function databaseReady(): boolean {
  try {
    return Boolean(process.env.AUTH_SECRET) && resolveCatalogueMode() === "database";
  } catch {
    return false;
  }
}

export function adminPrisma() {
  if (!adminDatabaseReady()) return null;
  return getPrismaClient();
}

export function adminDatabaseReady(): boolean {
  try {
    return resolveCatalogueMode() === "database";
  } catch {
    return false;
  }
}

export async function currentAdmin(): Promise<AdminActor | null> {
  if (!databaseReady()) return null;
  const session = await auth();
  const adminId = session?.user?.id;
  const changedAt = session?.user?.passwordChangedAt;
  if (!adminId || !changedAt) return null;

  const user = await getPrismaClient().adminUser.findUnique({ where: { id: adminId } });
  if (!user || user.passwordChangedAt.toISOString() !== changedAt) return null;
  return { id: user.id, username: user.username };
}

export async function requireAdmin(): Promise<AdminActor> {
  const admin = await currentAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}

export async function requireAdminAction(): Promise<
  { ok: true; admin: AdminActor } | { ok: false; message: string }
> {
  await assertSameOrigin();
  if (!adminDatabaseReady()) {
    return { ok: false, message: "The admin panel needs the database catalogue." };
  }
  const admin = await currentAdmin();
  if (!admin) return { ok: false, message: "You need to sign in." };
  return { ok: true, admin };
}
