import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/server/admin/password";
import { normalizeUsername, passwordProblems } from "../src/server/admin/rules";

const databaseUrl = process.env.DATABASE_URL?.trim();
const username = normalizeUsername(process.env.ADMIN_USERNAME ?? "");
const password = process.env.ADMIN_PASSWORD ?? "";

if (!databaseUrl || !username || !password) {
  console.error("Set DATABASE_URL, ADMIN_USERNAME and ADMIN_PASSWORD for this command only.");
  process.exit(1);
}

const problems = passwordProblems(password, username);
if (problems.length > 0) {
  console.error(problems.join(" "));
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

try {
  const passwordHash = await hashPassword(password);
  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: { passwordHash, passwordChangedAt: new Date() },
    });
    console.log(`Updated the admin account "${username}" and signed out existing sessions.`);
  } else {
    await prisma.adminUser.create({
      data: { username, passwordHash, role: "ADMIN" },
    });
    console.log(`Created the admin account "${username}".`);
  }
} finally {
  await prisma.$disconnect();
}
