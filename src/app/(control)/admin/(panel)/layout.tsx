import { connection } from "next/server";

export const instant = false;
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AdminFrame } from "@/components/admin/admin-frame";
import { requireAdmin } from "@/server/admin/guard";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  let username: string | null = null;
  try {
    username = (await requireAdmin()).username;
  } catch (error) {
    if (isRedirectError(error)) throw error;
  }
  if (!username) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-4xl text-forest">Database unavailable</h1>
        <p className="mt-4 leading-7">The admin panel could not read PostgreSQL. Check DATABASE_URL and apply the migrations before trying again.</p>
      </main>
    );
  }
  return (
    <AdminFrame username={username} title="Nursery admin">
      {children}
    </AdminFrame>
  );
}
