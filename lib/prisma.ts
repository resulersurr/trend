import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function normalizeDatabaseUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return rawUrl;

  const hasLegacySslMode = /sslmode=(prefer|require|verify-ca)/i.test(rawUrl);
  if (!hasLegacySslMode) return rawUrl;

  // pg v8 currently treats these modes as verify-full; normalize now to remove warnings.
  return rawUrl.replace(/sslmode=(prefer|require|verify-ca)/i, "sslmode=verify-full");
}

const normalizedDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: normalizedDatabaseUrl,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;