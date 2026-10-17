export function DatabaseSetup() {
  return (
    <p className="rounded-[1.4rem] border border-border bg-card p-5 text-sm leading-6">
      Set CATALOGUE_DATA_SOURCE=database, add DATABASE_URL, apply the Prisma migrations, then create an admin account.
    </p>
  );
}
