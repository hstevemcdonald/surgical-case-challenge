import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  console.log("\n===> Seeding data...");

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "User",
    },
  });
  console.log(`Created user: ${user.email}`);

  console.log("===> Done!\n");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
