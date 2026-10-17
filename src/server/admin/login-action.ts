"use server";

import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { adminDatabaseReady, assertSameOrigin, requireAdminAction } from "@/server/admin/guard";
import { recordAudit } from "@/server/admin/audit";
import { hashPassword, verifyPassword } from "@/server/admin/password";
import {
  isLoginLimited,
  LOGIN_FAILURE,
  LOGIN_LIMITED,
  LOGIN_WINDOW_MS,
  MAX_LOGIN_ATTEMPTS,
  normalizeUsername,
  passwordProblems,
} from "@/server/admin/rules";
import { getPrismaClient } from "@/server/db";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

export async function loginAction(
  _previous: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success || !adminDatabaseReady()) return { error: LOGIN_FAILURE };

  const username = normalizeUsername(parsed.data.username);
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${ip}:${username}`;
  const prisma = getPrismaClient();
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const attempts = await prisma.loginAttempt.findMany({
    where: { key, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: MAX_LOGIN_ATTEMPTS,
  });
  if (isLoginLimited(attempts.length, Date.now(), attempts[0] ? attempts[0].createdAt.getTime() : null)) {
    return { error: LOGIN_LIMITED };
  }

  try {
    await signIn("credentials", {
      username,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    await prisma.loginAttempt.create({ data: { key } });
    return { error: LOGIN_FAILURE };
  }

  return { error: LOGIN_FAILURE };
}

export async function logoutAction(): Promise<void> {
  await assertSameOrigin();
  await signOut({ redirectTo: "/admin/login" });
}

export async function changePasswordAction(
  _previous: { ok: false; message: string } | null,
  formData: FormData,
): Promise<{ ok: false; message: string }> {
  const gate = await requireAdminAction();
  if (!gate.ok) return gate;
  const next = String(formData.get("next") ?? "");
  const problems = passwordProblems(next, gate.admin.username);
  if (problems[0]) return { ok: false, message: problems[0] };

  const user = await getPrismaClient().adminUser.findUnique({ where: { id: gate.admin.id } });
  const current = String(formData.get("current") ?? "");
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return { ok: false, message: "The current password is not correct." };
  }

  await getPrismaClient().adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next), passwordChangedAt: new Date() },
  });
  await recordAudit({
    adminId: user.id,
    action: "password.change",
    entityType: "AdminUser",
    entityId: user.id,
    summary: "Changed the admin password.",
  });
  await signOut({ redirectTo: "/admin/login" });
  return { ok: false, message: "Sign in again with the new password." };
}
