import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
});

export const prisma = new PrismaClient({
  adapter,

  transactionOptions: {
    maxWait: 15000,
    timeout: 30000,
  },
});