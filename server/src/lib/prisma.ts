import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

// Cấu hình Pool với SSL (cần thiết cho các DB online như Supabase, Neon)
const pool = new pg.Pool({
  connectionString,
  ssl: connectionString?.includes("localhost") ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

// Sử dụng Singleton pattern để tránh tạo quá nhiều kết nối trong môi trường Serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
