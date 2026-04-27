import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password1 = await bcrypt.hash("admin1234", 12);
  const password2 = await bcrypt.hash("editor1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lookeast.com" },
    update: {},
    create: { email: "admin@lookeast.com", password: password1, name: "Admin" },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@lookeast.com" },
    update: {},
    create: { email: "editor@lookeast.com", password: password2, name: "Editor" },
  });

  const categories = [
    { name: "Politics", slug: "politics" },
    { name: "Economy", slug: "economy" },
    { name: "Society", slug: "society" },
    { name: "Culture", slug: "culture" },
    { name: "Environment", slug: "environment" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seeded users:");
  console.log(`  ${admin.email}  /  admin1234`);
  console.log(`  ${editor.email}  /  editor1234`);
  console.log("Seeded 5 categories.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
