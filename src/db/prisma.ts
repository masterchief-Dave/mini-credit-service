import {PrismaClient} from "../../generated/prisma";

export const prisma = new PrismaClient();
export async function dbHealthcheck() {
  await prisma.$queryRaw`SELECT 1`;
}
