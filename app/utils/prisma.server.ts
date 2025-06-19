// app/utils/prisma.server.ts
import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  global.__db ??= new PrismaClient();
  prisma = global.__db;
}

export { prisma };