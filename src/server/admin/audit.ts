import { getPrismaClient } from "@/server/db";

export async function recordAudit(input: {
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
}): Promise<void> {
  await getPrismaClient().auditEvent.create({ data: input });
}
