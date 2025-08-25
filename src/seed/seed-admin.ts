import {PrismaClient, Role} from "../../generated/prisma";
import {env} from "../utils/env-config.utils";
import {logger} from "../utils/logger.utils";
import {hashPassword} from "../utils/validation.utils";

const prisma = new PrismaClient();

const ADMIN_EMAIL = env.SEED_ADMIN_EMAIL ?? "admin@minicredit.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "pass12345";
const ADMIN_FIRST = process.env.SEED_ADMIN_FIRST_NAME ?? "Holy";
const ADMIN_LAST = process.env.SEED_ADMIN_LAST_NAME ?? "Spirit";

async function main() {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: {email: ADMIN_EMAIL},
    update: {
      firstName: ADMIN_FIRST,
      lastName: ADMIN_LAST,
      password: passwordHash,
      isActive: true,
      isVerified: true,
      isDeleted: false,
      role: Role.ADMIN,
    },
    create: {
      email: ADMIN_EMAIL,
      firstName: ADMIN_FIRST,
      lastName: ADMIN_LAST,
      password: passwordHash,
      isActive: true,
      isVerified: true,
      isDeleted: false,
      role: Role.ADMIN,
    },
  });

  logger.info(`✅ Seeded admin user: ${admin.email}`);
}

main()
  .catch((err) => {
    logger.error("❌ Admin seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
