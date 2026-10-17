import { connection } from "next/server";

export const instant = false;
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { adminDatabaseReady, currentAdmin } from "@/server/admin/guard";

export default async function AdminLoginPage() {
  await connection();
  const admin = await currentAdmin().catch(() => null);
  if (admin) redirect("/admin");
  const ready = adminDatabaseReady() && Boolean(process.env.AUTH_SECRET);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <p className="text-sm tracking-[0.16em] text-clay uppercase">Kaviyadevan Nursery Garden</p>
      <h1 className="mt-3 font-display text-4xl text-forest">Admin sign in</h1>
      {ready ? (
        <div className="mt-8">
          <LoginForm />
        </div>
      ) : (
        <div className="mt-8 rounded-[1.4rem] border border-border bg-card p-5 text-sm leading-6">
          <p>The admin panel needs a PostgreSQL database and an Auth.js secret before anyone can sign in.</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Set CATALOGUE_DATA_SOURCE=database and DATABASE_URL.</li>
            <li>Set AUTH_SECRET to a long random value.</li>
            <li>Apply the Prisma migrations to that development database.</li>
            <li>Run npm run admin:create with ADMIN_USERNAME and ADMIN_PASSWORD set for that command only.</li>
          </ol>
        </div>
      )}
    </main>
  );
}
